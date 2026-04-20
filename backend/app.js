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
app.use("/api/contact", require("./routes/contact.routes"));

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
    
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const lastDate = user.lastUploadDate ? new Date(user.lastUploadDate) : null;

      if (!lastDate || (lastDate.setHours(0, 0, 0, 0) !== today.getTime())) {
        if (user.billsUploadedToday > 0 || user.coinsEarnedToday > 0) {
          user.billsUploadedToday = 0;
          user.coinsEarnedToday = 0;
          await User.updateOne(
            { _id: user._id },
            { $set: { billsUploadedToday: 0, coinsEarnedToday: 0 } }
          );
        }
      }
    }

    res.json(user);

  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to fetch user");
  }
});
app.get("/api/test", (req, res) => {
  res.json("Backend Connected");
});

app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: err.message, type: "MulterError" });
  }
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;
