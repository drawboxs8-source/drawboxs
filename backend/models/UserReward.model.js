const mongoose = require("mongoose");

const userRewardSchema =
 new mongoose.Schema({

  userId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "User"
  },

  scratchCardId: {
   type: mongoose.Schema.Types.ObjectId,
   ref: "ScratchCard"
  },

  isUsed: {
   type: Boolean,
   default: false
  },

  assignedAt: {
   type: Date,
   default: Date.now
  },

  expiresAt: Date

 });

module.exports =
 mongoose.model(
  "UserReward",
  userRewardSchema
 );
