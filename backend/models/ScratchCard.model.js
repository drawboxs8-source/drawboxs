const mongoose = require("mongoose");

const scratchCardSchema =
 new mongoose.Schema({

  title: String,

  description: String,

  rewardType: {
   type: String,
   enum: ["coins", "coupon"]
  },

  rewardValue: Number, // coins OR % discount

  couponCode: String,

  couponLink: String,

  brand: String, // Amazon, Zomato etc

  image: String,

  expiryDays: {
   type: Number,
   default: 7
  },

  isActive: {
   type: Boolean,
   default: true
  }

 },
 { timestamps: true }
);

module.exports =
 mongoose.model(
  "ScratchCard",
  scratchCardSchema
 );
