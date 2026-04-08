const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    default: "admin@drawboxs.com"
  },
  password: {
    type: String,
    required: true
  },
  defaultRewardPerBill: {
    type: Number,
    default: 3
  }
});

module.exports = mongoose.model("Admin", adminSchema);
