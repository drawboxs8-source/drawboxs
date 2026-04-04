const express = require("express");
const cors = require("cors");
const auth = require("./middleware/auth.middleware"); // ✅ ADD THIS LINE
const User = require("./models/User.model");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", require("./routes/payment.routes"));


app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/user", require("./routes/user.routes"));
app.use("/api/bill", require("./routes/bill.routes"));
app.use("/api/scratch", require("./routes/scratch.routes"));
app.use("/api/wallet", require("./routes/wallet.routes"));
app.use("/api/admin", require("./routes/admin.routes"));
app.use(
  "/api/history",
  require("./routes/history.routes")
);
app.use("/api/rewards", require("./routes/reward.routes"));
app.use("/api/admin/rewards", require("./routes/admin.rewards"));

app.get("/api/user/me", auth, async (req, res) => {
  try {
    if (req.isAdmin) {
      return res.json({
        role: "admin",
        name: "Admin",
        email: "admin@drawboxs.com"
      });
    }

    const user = await User.findById(req.user.id).select('-password');
    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch user");
  }
});
app.get("/api/test", (req, res) => {
  res.json("Backend Connected");
});



module.exports = app;
