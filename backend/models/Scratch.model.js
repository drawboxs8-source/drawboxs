const mongoose = require("mongoose");

const ScratchSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  billId: mongoose.Schema.Types.ObjectId,
  coins: {
    type: Number,
    default: 3
  },
  scratched: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Scratch", ScratchSchema);
