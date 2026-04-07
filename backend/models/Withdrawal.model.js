const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  coins: {
    type: Number,
    required: true
  },
  rupees: {
    type: Number,
    required: true
  },
  bankName: String,
  accountNumber: String,
  ifscCode: String,
  status: {
    type: String,
    default: "Pending" // Pending, Paid, Rejected
  },
  date: {
    type: Date,
    default: Date.now
  },
  hiddenHistory: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Withdrawal", withdrawalSchema);