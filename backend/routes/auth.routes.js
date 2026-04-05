const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const nodemailer = require("nodemailer");

/// =========================
/// ✅ REGISTER
/// =========================
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, referralCode } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    let referredBy = null;
    let startingCoins = 0;

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id;
        await User.findByIdAndUpdate(referrer._id, { $inc: { coins: 100 } });
        startingCoins = 50;
      }
    }

    const user = await User.create({
      name,
      email,
      phone,
      password: hash,
      referralCode: newReferralCode,
      referredBy,
      coins: startingCoins
    });

    res.json("Registered");
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json("Failed");
  }
});

/// =========================
/// ✅ LOGIN
/// =========================
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Admin login
    if (phone === "admin@drawboxs.com" && password === "cool1234") {
      const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET);
      return res.json({
        token,
        user: { role: "admin", name: "Admin", email: "admin@drawboxs.com" }
      });
    }

    // User login
    const user = await User.findOne({ phone });
    if (!user) return res.json("User not found");
    if (!user.isApproved) return res.json("Admin approval pending");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json("Wrong password");

    const token = jwt.sign({ id: user._id, role: "user" }, process.env.JWT_SECRET);
    res.json({ token, user: { ...user.toObject(), role: "user" } });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json("Login Failed");
  }
});

/// =========================
/// ✅ FORGOT PASSWORD
/// =========================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "15m" });
    // In dev we just construct the localhost URL. In production it's the real domain.
    const link = `http://localhost:5173/reset-password/${user._id}/${token}`; 

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "test@gmail.com",
        pass: process.env.EMAIL_PASS || "TEST_PASSWORD",
      },
    });

    var mailOptions = {
      from: "Drawboxs Admin <no-reply@drawboxs.com>",
      to: email,
      subject: "Password Reset - Drawboxs",
      text: `Click this link to reset your password: ${link}`,
    };

    if (!process.env.EMAIL_USER) {
        console.log("No EMAIL_USER configured. Here is the reset link:", link);
        return res.json({ message: "Password reset link logged to console (Requires Email Configs)" });
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send email" });
      } else {
        return res.json({ message: "Email sent!" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

/// =========================
/// ✅ RESET PASSWORD
/// =========================
router.post("/reset-password/:id/:token", async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Invalid user" });
    }

    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
      const hash = await bcrypt.hash(password, 10);
      user.password = hash;
      await user.save();
      res.json({ message: "Password reset successfully!" });
    } catch (error) {
      console.log(error.message);
      res.status(400).json({ message: "Link expired or invalid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
