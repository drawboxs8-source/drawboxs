const router =
  require("express").Router();

const User =
  require("../models/User.model");
const Payment =
  require("../models/Payment.model");
const Withdrawal =
  require("../models/Withdrawal.model");
  const Bill =
  require("../models/Bill.model");

  
/// All Users
router.get(
  "/users",
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')  // Don't send passwords
        .sort({ createdAt: -1 });  // Latest first
      
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json("Failed to fetch users");
    }
  }
);

/// Approve User
router.put(
  "/approve-user/:id",
  async (req, res) => {
    await User.findByIdAndUpdate(
      req.params.id,
      { isApproved: true }
    );

    res.json("User Approved");
  }
);

/// Get all payments
/// Get all payments
router.get(
  "/payments",
  async (req, res) => {
    try {
      const payments =
  await Payment.find()
    .populate(
      "userId",
      "name email"
    )
    .sort({ createdAt: -1 });
      res.json(payments);
    } catch (err) {
      console.log(err);
      res.status(500).json("Failed to fetch payments");
    }
  }
);

router.put(
  "/toggle-upload/:id",
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      user.canUploadBills = !user.canUploadBills;
      await user.save();

      res.json({
        message: user.canUploadBills ? "Upload enabled" : "Upload disabled",
        canUploadBills: user.canUploadBills
      });

    } catch (err) {
      console.log(err);
      res.status(500).json("Toggle failed");
    }
  }
);


router.put(
  "/approve-payment/:id",
  async (req, res) => {

    try {

      const payment =
        await Payment.findById(
          req.params.id
        );

      if (!payment)
        return res.json(
          "Payment not found"
        );

      // 1️⃣ Update payment
      payment.status =
        "Approved";

      await payment.save();

      // 2️⃣ Expiry calculate
      const expiry =
        new Date();

      expiry.setMonth(
        expiry.getMonth() +
        (payment.planDuration || 1)
      );

      // 3️⃣ Activate user plan
      await User.findByIdAndUpdate(
        payment.userId,
        {
          planPurchased: true,
          canUploadBills: true,
          planName:
            payment.planName,
          planDuration:
            payment.planDuration,
          planExpiry:
            expiry,
          dailyLimit: 3
        }
      );

      res.json(
        "Payment approved & plan activated"
      );

    } catch (err) {
      console.log(err);
      res.status(500)
        .json("Approval failed");
    }
  }
);

router.put(
  "/reject-payment/:id",
  async (req, res) => {
    try {

      const payment =
        await Payment.findByIdAndUpdate(
          req.params.id,
          { status: "Rejected" },
          { new: true }
        );

      if (!payment)
        return res.json("Payment not found");

      res.json("Payment rejected");

    } catch (err) {
      console.log(err);
      res.status(500).json(
        "Reject failed"
      );
    }
  }
);

router.get(
  "/withdrawals",
  async (req, res) => {
    try {
      const withdrawals = await Withdrawal.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });

      res.json(withdrawals);
    } catch (err) {
      console.log(err);
      res.status(500).json("Failed to fetch withdrawals");
    }
  }
);
router.put(
  "/reject-withdrawal/:id",
  async (req, res) => {
    try {

      await Withdrawal.findByIdAndUpdate(
        req.params.id,
        { status: "Rejected" }
      );

      res.json(
        "Withdrawal rejected"
      );

    } catch (err) {
      console.log(err);
      res.status(500).json(
        "Reject failed"
      );
    }
  }
);

router.put(
  "/reject-user/:id",
  async (req, res) => {
    try {

      await User.findByIdAndDelete(
        req.params.id
      );

      res.json("User rejected & deleted");

    } catch (err) {
      console.log(err);
      res.status(500).json(
        "User reject failed"
      );
    }
  }
)
/// Approve Withdrawal
router.put(
  "/approve-withdrawal/:id",
  async (req, res) => {
    await Withdrawal.findByIdAndUpdate(
      req.params.id,
      { status: "Paid" }
    );

    res.json(
      "Withdrawal Paid"
    );
  }
);
router.get(
"/stats",
async (req, res) => {
try {


const totalUsers =
await User.countDocuments();


const approvedUsers =
await User.countDocuments({
isApproved: true
});


const totalBills =
await Bill.countDocuments();


const totalCoins =
await User.aggregate([
{
$group: {
_id: null,
coins: { $sum: "$coins" }
}
}
]);


const withdrawals =
await Withdrawal.countDocuments();


res.json({
totalUsers,
approvedUsers,
totalBills,
totalCoins:
totalCoins[0]?.coins || 0,
withdrawals
});


} catch (err) {
console.log(err);
res.status(500).json("Stats failed");
}
}
);

const Admin = require("../models/Admin.model");
const bcrypt = require("bcryptjs");

router.put(
  "/change-password",
  async (req, res) => {
    try {
      const { newPassword } = req.body;
      const hash = await bcrypt.hash(newPassword, 10);
      await Admin.findOneAndUpdate(
        { email: "admin@drawboxs.com" },
        { password: hash },
        { upsert: true }
      );
      res.json("Password updated successfully");
    } catch (err) {
      console.log(err);
      res.status(500).json("Failed to update password");
    }
  }
);

module.exports = router;
