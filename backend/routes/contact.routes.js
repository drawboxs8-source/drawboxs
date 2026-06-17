const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Admin receives the email
      subject: `New Contact Form Lead: ${subject || 'No Subject'}`,
      text: `
You have a new message from the Drawboxs Contact Form!

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    };

    if (!process.env.EMAIL_USER) {
      console.log("No EMAIL_USER configured. Here is the contact message data:", mailOptions.text);
      return res.json({ message: "Message logged to console (Requires Email Configs)" });
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending contact email:", error);
        return res.status(500).json({ message: "Failed to send message" });
      } else {
        return res.json({ message: "Message sent successfully!" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
