const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Withdrawal = require("../models/Withdrawal.model");
const User = require("../models/User.model");

/// ✅ Get user's withdrawal history
router.get("/withdrawals", auth, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({
      userId: req.user.id
    }).sort({ date: -1 });

    res.json(withdrawals);
  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to load withdrawals");
  }
});

/// ✅ Request withdrawal
router.post("/request", auth, async (req, res) => {
  try {
    const { coins, bankName, accountNumber, ifscCode } = req.body;

    const user = await User.findById(req.user.id);

    // Check minimum coins (500 coins = ₹5)
    if (user.coins < 500) {
      return res.json({ message: "Minimum 500 coins required (₹5)" });
    }

    // Check if user has enough coins
    if (user.coins < coins) {
      return res.json({ message: "Insufficient coins" });
    }

    const rupees = coins / 100; // 100 coins = ₹1

    // Create withdrawal request
    const withdrawal = await Withdrawal.create({
      userId: user._id,
      coins,
      rupees,
      bankName,
      accountNumber,
      ifscCode,
      status: "Pending"
    });

    // Deduct coins from user
    user.coins -= coins;
    await user.save();

    res.json({
      message: "Withdrawal request submitted",
      withdrawal
    });

  } catch (err) {
    console.log(err);
    res.status(500).json("Withdrawal request failed");
  }
});

module.exports = router;