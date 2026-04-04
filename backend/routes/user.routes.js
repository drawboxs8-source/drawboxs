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

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch user");
  }
});
module.exports = router;
