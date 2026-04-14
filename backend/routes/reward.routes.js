const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const ScratchCard = require("../models/ScratchCard.model");
const UserReward = require("../models/UserReward.model");

// GET /api/rewards/my-cards - Returns user's cards
router.get("/my-cards", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all rewards for the user
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

// DELETE /api/rewards/:id - Deletes a user reward card
router.delete("/:id", auth, async (req, res) => {
  try {
    const rewardId = req.params.id;
    const reward = await UserReward.findOneAndDelete({ _id: rewardId, userId: req.user.id });

    if (!reward) return res.status(404).json({ message: "Reward not found" });

    res.json({ message: "Reward deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete reward" });
  }
});

module.exports = router;
