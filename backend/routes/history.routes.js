const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const Bill = require("../models/Bill.model");
const Withdrawal = require("../models/Withdrawal.model");


router.get("/coins-history", auth, async (req, res) => {

  try {

    /// Scratch earnings
    const earnings =
      await Bill.find({
        userId: req.user.id,
        scratched: true,
        hiddenHistory: { $ne: true }
      });

    const earnTx =
      earnings.map(bill => ({
         id: bill._id,
        type: "earn",
        description: "Scratch Card Reward",
        coins: `+${bill.coinsRewarded}`,
        date:bill.createdAt,
        status: "Completed"
      }));


    /// Withdrawals
    const withdrawals =
      await Withdrawal.find({
        userId: req.user.id,
        hiddenHistory: { $ne: true }
      });

    const withdrawTx =
      withdrawals.map(w => ({
        id: w._id,
        type: "withdraw",
        description: "Withdrawal",
        coins: `-${w.coins}`,
        date: w.createdAt,
        status: w.status
      }));


    /// Merge + sort
    const history =
      [...earnTx, ...withdrawTx]
        .sort((a, b) =>
          new Date(b.date) -
          new Date(a.date)
        );

    res.json(history);

  } catch (err) {
    console.log(err);
    res.status(500).json("Error");
  }

});

router.delete("/coins-history/:type/:id", auth, async (req, res) => {
  try {
    const { type, id } = req.params;
    
    if (type === "earn") {
      await Bill.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { hiddenHistory: true }
      );
    } else if (type === "withdraw") {
      await Withdrawal.findOneAndUpdate(
        { _id: id, userId: req.user.id },
        { hiddenHistory: true }
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json("Error deleting history");
  }
});

module.exports = router;
