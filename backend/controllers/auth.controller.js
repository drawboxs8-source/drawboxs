const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, phone, password, referralCode } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "User with this phone number already exists" });
    }

    const hash = await bcrypt.hash(password, 10);
    
    await User.create({ 
      name, 
      phone, 
      password: hash,
      referralCode,
      role: "user",
      isApproved: false
    });
    
    res.json({ message: "Registered. Waiting for admin approval." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(400).json("User not found");

    const ok = await bcrypt.compare(req.body.password, user.password);
    if (!ok) return res.status(400).json("Wrong password");

    if (!user.isApproved && user.role !== 'admin') {
      return res.status(403).json("Admin approval pending");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json("Server error during login");
  }
};
