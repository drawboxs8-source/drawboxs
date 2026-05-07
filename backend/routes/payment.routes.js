const router = require("express").Router();
const multer = require("multer");
const streamifier = require("streamifier");
const Razorpay = require("razorpay");

const cloudinary =
  require("../config/cloudinary");

const Payment =
  require("../models/Payment.model");

const auth =
  require("../middleware/auth.middleware");

/// Memory storage
const storage =
  multer.memoryStorage();

const upload =
  multer({ storage });

const planCatalog = {
  3: {
    name: "3 Months",
    amount: 99
  },
  6: {
    name: "6 Months",
    amount: 159
  },
  12: {
    name: "12 Months",
    amount: 199
  }
};

const razorpayKeyId =
  process.env.RAZORPAY_KEY_ID;

const razorpayKeySecret =
  process.env.RAZORPAY_KEY_SECRET;

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret
      })
    : null;

router.post(
  "/create-link",
  async (req, res) => {
    try {
      const duration =
        Number(req.body.planDuration);

      const plan =
        planCatalog[duration];

      if (!plan) {
        return res.status(400).json({
          message: "Invalid plan selected"
        });
      }

      if (!razorpay) {
        return res.status(500).json({
          message:
            "Razorpay is not configured on the server"
        });
      }

      const link =
        await razorpay.paymentLink.create({
          amount: plan.amount * 100,
          currency: "INR",
          accept_partial: false,
          description:
            `${plan.name} plan activation for Drawboxs`,
          reference_id:
            `drawboxs_${duration}_${Date.now()}`,
          reminder_enable: false,
          notes: {
            planName: plan.name,
            planDuration: String(duration)
          }
        });

      return res.json({
        paymentLink: link.short_url,
        amount: plan.amount,
        planName: plan.name
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to create payment link"
      });
    }
  }
);

/// Upload Screenshot
router.post(
  "/upload",
  auth,   // 🔒 LOGIN REQUIRED
  upload.single("screenshot"),

  async (req, res) => {

    try {

      if (!req.file)
        return res.json({
          message:
            "No file uploaded"
        });

      /// Cloudinary upload
      const streamUpload = () => {
        return new Promise(
          (resolve, reject) => {

            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "paymentScreenshots"
                },
                (error, result) => {
                  if (result)
                    resolve(result);
                  else
                    reject(error);
                }
              );

            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(stream);
          }
        );
      };

      const result =
        await streamUpload();

      /// Save payment
      await Payment.create({

        userId: req.user.id,   // ✅ LINK USER

        screenshot:
          result.secure_url,

        planName:
          req.body.planName,

        planDuration:
          req.body.planDuration,

        amount:
          req.body.amount,

        status: "Pending"
      });

      res.json({
        message:
          "Payment submitted"
      });

    } catch (err) {
      console.log(err);
      res.status(500)
        .json("Upload failed");
    }
  }
);

module.exports = router;
