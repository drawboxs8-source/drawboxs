const express = require("express");
const router = express.Router();

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

router.post("/submit", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const apiKey = process.env.BREVO_API_KEY;
    const contactReceiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "drawboxs8@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ||
      process.env.BREVO_SENDER_EMAIL ||
      "drawboxs8@gmail.com";

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    if (!apiKey) {
      console.log("Contact form email is not configured. Missing BREVO_API_KEY.");
      return res.status(500).json({
        message: "Brevo API is not configured on the server",
      });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = escapeHtml(subject || "No Subject");
    const safeMessage = escapeHtml(message);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: "Drawboxs Contact",
          email: fromEmail,
        },
        to: [{ email: contactReceiverEmail }],
        replyTo: {
          email,
          name,
        },
        subject: `New Contact Form Lead: ${subject || "No Subject"}`,
        textContent: `
You have a new message from the Drawboxs Contact Form!

Name: ${name}
Email: ${email}
Subject: ${subject || "No Subject"}

Message:
${message}
        `.trim(),
        htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
            <h2 style="margin-bottom: 16px;">New Contact Form Lead</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px;">
              ${safeMessage}
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.log("Error sending contact email:", errorBody);
      return res.status(500).json({
        message: "Failed to send message through Brevo",
      });
    }

    return res.json({ message: "Message sent successfully!" });
  } catch (error) {
    console.log("Error sending contact email:", error);
    return res.status(500).json({
      message: error?.message || "Failed to send contact message",
    });
  }
});

module.exports = router;
