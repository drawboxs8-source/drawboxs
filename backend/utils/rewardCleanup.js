const ScratchCard = require("../models/ScratchCard.model");
const UserReward = require("../models/UserReward.model");

async function cleanupExpiredRewards() {
  const now = new Date();

  const expiredCards = await ScratchCard.find({
    $or: [
      { expiryDate: { $lt: now } },
      { isActive: false, expiryDate: { $exists: true, $lt: now } }
    ]
  }).select("_id");

  const expiredCardIds = expiredCards.map((card) => card._id);

  if (expiredCardIds.length > 0) {
    await UserReward.deleteMany({
      $or: [
        { scratchCardId: { $in: expiredCardIds } },
        { expiresAt: { $lt: now } }
      ]
    });

    await ScratchCard.deleteMany({ _id: { $in: expiredCardIds } });
  } else {
    await UserReward.deleteMany({ expiresAt: { $lt: now } });
  }
}

module.exports = { cleanupExpiredRewards };
