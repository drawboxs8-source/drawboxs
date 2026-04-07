const mongoose = require("mongoose");

const billSchema =
  new mongoose.Schema({

    userId: String,

    image: String,

    coinsRewarded: {
      type: Number,
      default: 0
    },

    scratched: {
      type: Boolean,
      default: false
    },

    hiddenHistory: {
      type: Boolean,
      default: false
    }

  },
  {
    timestamps: true   // ⭐ IMPORTANT
  }
);

module.exports =
  mongoose.model(
    "Bill",
    billSchema
  );
