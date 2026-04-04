const mongoose = require("mongoose");

const paymentSchema =
  new mongoose.Schema({

    // 🔗 Link to logged user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    screenshot: String,

    planName: String,

    planDuration: Number,

    amount: Number,

    status: {
      type: String,
      default: "Pending"
    }

  },
  { timestamps: true }
);

module.exports =
  mongoose.model(
    "Payment",
    paymentSchema
  );
