const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const ScratchCard = require("../models/ScratchCard.model");
const UserReward = require("../models/UserReward.model");

// GET /api/rewards/my-cards - Auto-assigns new cards and returns user's cards
router.get("/my-cards", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch all currently active global ScratchCards
    const activeCards = await ScratchCard.find({ isActive: true });

    // 2. Auto-assign them to the user if they don't have them
    for (const card of activeCards) {
      const existing = await UserReward.findOne({ userId, scratchCardId: card._id });
      if (!existing) {
        // Create an assignment
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + (card.expiryDays || 7));

        await UserReward.create({
          userId,
          scratchCardId: card._id,
          isUsed: false,
          assignedAt: new Date(),
          expiresAt
        });
      }
    }

    // 3. Fetch all rewards for the user
    // We populate the scratchCard details so frontend can display them.
    const userRewards = await UserReward.find({ userId }).populate("scratchCardId").sort({ assignedAt: -1 });

    res.json(userRewards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch rewards" });
  }
});

// POST /api/rewards/reveal/:id - Marks a card as used
router.post("/reveal/:id", auth, async (req, res) => {
  try {
    const rewardId = req.params.id;
    const reward = await UserReward.findOne({ _id: rewardId, userId: req.user.id });

    if (!reward) return res.status(404).json({ message: "Reward not found" });

    // Ensure it hasn't expired
    if (new Date() > reward.expiresAt) {
      return res.status(400).json({ message: "Coupon Expired" });
    }

    reward.isUsed = true;
    await reward.save();

    res.json({ message: "Reward revealed successfully", reward });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reveal reward" });
  }
});

module.exports = router;
