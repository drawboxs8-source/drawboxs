const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const User = require("../models/User.model");

router.get("/me", auth, async (req, res) => {
  try {

    // ✅ ADMIN — DO NOT QUERY DB
    if (req.user.role === "admin") {
      return res.json({
        name: "Admin",
        email: "admin@drawboxs.com",
        role: "admin"
      });
    }

    // ✅ NORMAL USER
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user)
      return res.status(404).json("User not found");

    // ✅ DAILY RESET LOGIC
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastDate = user.lastUploadDate ? new Date(user.lastUploadDate) : null;
    let needsSave = false;

    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
      if (lastDate.getTime() !== today.getTime() && (user.billsUploadedToday > 0 || user.coinsEarnedToday > 0)) {
        user.billsUploadedToday = 0;
        user.coinsEarnedToday = 0;
        needsSave = true;
      }
    } else if (user.billsUploadedToday > 0 || user.coinsEarnedToday > 0) {
      user.billsUploadedToday = 0;
      user.coinsEarnedToday = 0;
      needsSave = true;
    }

    if (needsSave) {
      await user.save();
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch user");
  }
});
module.exports = router;
