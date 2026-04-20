const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User.model");

const SPIN_COST = 3;

router.get("/status", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("coins planPurchased planName planExpiry");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      coins: user.coins,
      planPurchased: user.planPurchased,
      planName: user.planName,
      planExpiry: user.planExpiry,
      spinCost: SPIN_COST,
    });
  } catch (err) {
    console.log(err);
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
      return res.status(403).json({ message: "Please purchase a plan to use Spin & Earn" });
    }

    user.coins = (user.coins || 0) - SPIN_COST;
    await user.save();

    res.json({
      result: "Better luck next time",
      coins: user.coins,
      spinCost: SPIN_COST,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to complete spin" });
  }
});

module.exports = router;
