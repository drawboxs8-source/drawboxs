const Scratch = require("../models/Scratch.model");
const User = require("../models/User.model");

exports.reveal = async (req, res) => {
  const coins = 3;

  await Scratch.create({
    userId: req.user.id,
    coins,
    scratched: true
  });

  await User.findByIdAndUpdate(req.user.id, { $inc: { coins } });
  res.json({ coins });
};
