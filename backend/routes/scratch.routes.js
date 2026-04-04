const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const Scratch = require("../models/Scratch.model");
const User = require("../models/User.model");

/// GET MY SCRATCH CARDS
router.get("/my", auth, async (req, res) => {
  const cards = await Scratch.find({
    userId: req.user.id,
    scratched: false
  });

  res.json(cards);
});

/// SCRATCH REVEAL (ADD 3 COINS)
router.post("/reveal/:id", auth, async (req, res) => {
  const card = await Scratch.findById(req.params.id);

  if (!card || card.scratched)
    return res.status(400).json("Already scratched");

  card.scratched = true;
  await card.save();

  await User.findByIdAndUpdate(req.user.id, {
    $inc: { coins: 3 }
  });

  res.json({ coins: 3 });
});

module.exports = router;
