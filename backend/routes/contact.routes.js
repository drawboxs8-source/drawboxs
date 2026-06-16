const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "drawboxs8@gmail.com";

router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: CONTACT_EMAIL,
      replyTo: email,
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

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("No EMAIL_USER configured. Here is the contact message data:", mailOptions.text);
      return res.json({ message: "Message logged to console (Requires Email Configs)" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    transporter.sendMail(mailOptions, (error) => {
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
