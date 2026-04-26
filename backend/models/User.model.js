const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  referralCode: {
    type: String,
    unique: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  usedReferralCode: {
    type: String,
    default: ""
  },

  role: {
    type: String,
    default: "user"
  },

  isApproved: {
    type: Boolean,
    default: false
  },

  canUploadBills: {  // ✅ ADD THIS
    type: Boolean,
    default: false
  },

  planPurchased: {
    type: Boolean,
    default: false
  },

  planName: String,
  planDuration: Number,
  planExpiry: Date,

  coins: {
    type: Number,
    default: 0
  },

  coinsEarnedToday: {  // ✅ ADD THIS
    type: Number,
    default: 0
  },

  totalBillsUploaded: {
    type: Number,
    default: 0
  },

  billsUploadedToday: {
    type: Number,
    default: 0
  },

  dailyLimit: {  // ✅ ADD THIS
    type: Number,
    default: 3
  },

  lastUploadDate: Date
});

module.exports =
  mongoose.model("User", userSchema);
