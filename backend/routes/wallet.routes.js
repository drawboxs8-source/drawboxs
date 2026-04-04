const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const Wallet = require("../models/Wallet.model");
const User = require("../models/User.model");

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ coins: user.coins });
});

router.post("/add", auth, async (req, res) => {

  const { coins } = req.body;

  await User.findByIdAndUpdate(
    req.user.id,
    { $inc: { coins } }
  );

  res.json("Coins Added");
});

router.post("/withdraw", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.coins < 50000)
    return res.status(400).json({ message: "Minimum 50000 coins required" });

  user.coins -= 50000;
  await user.save();
  await Wallet.create({ userId: user._id, type: "withdraw", coins: 50000 });

  res.json({ message: "Withdrawal requested" });
});

module.exports = router;
