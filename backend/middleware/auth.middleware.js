const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User.model");

module.exports = async (req, res, next) => {

  const header = req.headers.authorization;

  if (!header)
    return res.status(401).json("No token");

  // ✅ Support "Bearer token" or raw token
  const token = header.startsWith("Bearer ")
    ? header.split(" ")[1]
    : header;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =========================
    // ✅ ADMIN — SKIP DB QUERY
    // =========================
    if (decoded.role === "admin") {
      req.user = decoded;
      req.isAdmin = true;
      return next();
    }

    // =========================
    // ✅ VALIDATE OBJECTID
    // =========================
    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res.status(400).json("Invalid user ID");
    }

    // =========================
    // ✅ FETCH USER
    // =========================
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json("User not found");

    req.user = {
      id: user._id,
      role: "user"
    };

    req.isAdmin = false;

    next();

  } catch (err) {
    console.log(err);
    res.status(400).json("Invalid token");
  }
};
