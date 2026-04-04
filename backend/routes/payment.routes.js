const router = require("express").Router();
const multer = require("multer");
const streamifier = require("streamifier");

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
