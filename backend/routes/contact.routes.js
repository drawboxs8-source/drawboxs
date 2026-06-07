const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const contactReceiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "drawboxs8@gmail.com";
    const smtpHost = process.env.BREVO_SMTP_HOST || process.env.SMTP_HOST || "smtp-relay.brevo.com";
    const smtpPort = Number(process.env.BREVO_SMTP_PORT || process.env.SMTP_PORT || 587);
    const smtpUser = process.env.BREVO_SMTP_USER || process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.BREVO_SMTP_PASS || process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      process.env.BREVO_SENDER_EMAIL ||
      smtpUser ||
      contactReceiverEmail;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    if (!smtpUser || !smtpPass) {
      console.log("Contact form email is not configured. Missing SMTP credentials.");
      return res.status(500).json({
        message: "Contact email is not configured on the server",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: `"Drawboxs Contact" <${fromEmail}>`,
      to: contactReceiverEmail,
      replyTo: email,
      subject: `New Contact Form Lead: ${subject || "No Subject"}`,
      text: `
You have a new message from the Drawboxs Contact Form!

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `.trim(),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">New Contact Form Lead</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "No Subject"}</p>
          <p><strong>Message:</strong></p>
          <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
            ${message}
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.log("Error sending contact email:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
