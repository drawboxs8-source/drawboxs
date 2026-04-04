const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const multer = require("multer");
const streamifier = require("streamifier");

const Bill = require("../models/Bill.model");
const User = require("../models/User.model");
const Payment = require("../models/Payment.model");

const cloudinary = require("../config/cloudinary");

/// ✅ MEMORY STORAGE (FAST UPLOAD)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const ScratchCard =
 require("../models/ScratchCard.model");

const UserReward =
 require("../models/UserReward.model");


/// SCRATCH REWARD
router.put(
 "/scratch/:billId",
 auth,
 async (req, res) => {

  try {

   /// 1️⃣ ACTIVE WEEKLY CARDS
   const cards =
    await ScratchCard.find({

     isActive: true,

     startDate: {
      $lte: new Date()
     },

     expiryDate: {
      $gte: new Date()
     }

    });

   if (!cards.length)
    return res.json({
     message:
      "No rewards available"
    });

   /// 2️⃣ RANDOM CARD
   const card =
    cards[
     Math.floor(
      Math.random() *
      cards.length
     )
    ];

   /// 3️⃣ ADD COINS
   if (card.coins > 0) {

    await User.findByIdAndUpdate(
     req.user.id,
     {
      $inc: {
       coins: card.coins
      }
     }
    );

   }

   /// 4️⃣ SAVE USER REWARD
   await UserReward.create({

    userId: req.user.id,

    scratchCardId:
     card._id,

    title: card.title,
    image: card.image,

    coins: card.coins,

    couponCode:
     card.couponCode,

    couponLink:
     card.couponLink,

    expiryDate:
     card.expiryDate

   });

   res.json({
    coins: card.coins,
    card
   });

  } catch (err) {

   console.log(err);

   res.status(500).json(
    "Scratch failed"
   );
  }
 }
);

router.post(
  "/upload",
  auth,
  upload.single("bill"),
  async (req, res) => {
    try {

      if (!req.file)
        return res.json({ message: "No file uploaded" });

      const user = await User.findById(req.user.id);

      // ✅ CHECK IF USER CAN UPLOAD
      if (!user.canUploadBills)
        return res.json({ message: "You don't have permission to upload bills. Contact admin." });

      if (!user.planPurchased)
        return res.json({ message: "Buy plan first" });

      /// Daily reset FIX
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = user.lastUploadDate
        ? new Date(user.lastUploadDate)
        : null;

      if (!lastDate) {
        user.billsUploadedToday = 0;
        user.coinsEarnedToday = 0;  // ✅ RESET COINS TOO
      }
      else {
        lastDate.setHours(0, 0, 0, 0);

        if (lastDate.getTime() !== today.getTime()) {
          user.billsUploadedToday = 0;
          user.coinsEarnedToday = 0;  // ✅ RESET COINS TOO
        }
      }

      /// 🔥 STREAM UPLOAD TO CLOUDINARY
      const streamUpload = () => {
        return new Promise((resolve, reject) => {

          const stream =
            cloudinary.uploader.upload_stream(
              { folder: "billRewards" },
              (error, result) => {
                if (result) resolve(result);
                else reject(error);
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        });
      };

      const result = await streamUpload();

      /// ✅ FIXED REWARD: 3 COINS
      const coinsRewarded = 3;

      /// Save bill
      const bill = await Bill.create({
        userId: user._id,
        image: result.secure_url,
        scratched: true,  // ✅ AUTO-SCRATCHED
        coinsRewarded
      });

await User.findByIdAndUpdate(
  user._id,
  {
    $inc: {
      billsUploadedToday: 1,
      totalBillsUploaded: 1,
      coins: coinsRewarded,
      coinsEarnedToday: coinsRewarded
    },
    lastUploadDate: new Date()
  }
);

      res.json({
        msg: "Bill Uploaded",
        billId: bill._id,
        coinsRewarded,
        totalCoins: user.coins
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Upload Failed" });
    }
  }
);


/// ===============================
/// 💳 PAYMENT SCREENSHOT
/// ===============================
router.post(
  "/payment/:userId",
  upload.single("screenshot"),
  async (req, res) => {
    try {

      const { planName, amount, planDuration } = req.body;

      const result =
        await cloudinary.uploader.upload_stream(
          { folder: "payments" },
          async (error, uploaded) => {

            if (error)
              return res.json("Upload error");

            await Payment.create({
              userId: req.params.userId,
              screenshot: uploaded.secure_url,
              planName,
              planDuration,
              amount
            });

            res.json("Payment Submitted");
          }
        );

      streamifier
        .createReadStream(req.file.buffer)
        .pipe(result);

    } catch (err) {
      console.log(err);
      res.status(500).json("Payment Failed");
    }
  }
);

router.get(
"/history",
auth,
async (req, res) => {
try {
const bills = await Bill.find({
userId: req.user.id
}).sort({ createdAt: -1 });


res.json(bills);


} catch (err) {
console.log(err);
res.status(500).json("Failed to load history");
}
}
);

module.exports = router;
