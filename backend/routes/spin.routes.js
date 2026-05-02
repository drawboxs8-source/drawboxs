const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User.model");

const SPIN_COST = 3;

router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("coins planPurchased planName");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      coins: user.coins || 0,
      planPurchased: Boolean(user.planPurchased),
      planName: user.planName || "",
      spinCost: SPIN_COST,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load spin status" });
  }
});

router.post("/play", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.planPurchased) {
      return res.status(403).json({ message: "Buy a plan to use Spin & Earn" });
    }

    user.coins = (user.coins || 0) - SPIN_COST;
    await user.save();

    res.json({
      result: "Better luck next time",
      coins: user.coins,
      spinCost: SPIN_COST,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Spin failed" });
  }
});

module.exports = router;
