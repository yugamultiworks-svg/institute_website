const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const INSTITUTE_EMAIL = process.env.INSTITUTE_EMAIL || 'yuga.multi.works@gmail.com';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files (index.html, style.css, app.js, images)
app.use(express.static(path.join(__dirname)));

/**
 * Constructs custom HTML email content created programmatically in Node.js
 */
function buildHtmlEmail({ name, phone, email, course, mode, message, formTitle, time }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #cbd5e1; font-size: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: #ffffff; padding: 24px; text-align: left; }
        .header h2 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.01em; }
        .header p { margin: 5px 0 0 0; font-size: 13px; opacity: 0.92; text-transform: uppercase; letter-spacing: 0.05em; }
        .content { padding: 24px; color: #1e293b; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; }
        .table td.lbl { font-weight: bold; color: #64748b; width: 35%; }
        .table td.val { color: #0f172a; }
        .highlight { color: #059669; font-weight: bold; }
        .footer { background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h2>🎓 WE GROW Academy</h2>
          <p>${formTitle} • Chennai Thiruvanmiyur</p>
        </div>
        <div class="content">
          <p style="margin-top: 0; color: #475569;">You have received a new ${formTitle} from the website:</p>
          <table class="table">
            <tr><td class="lbl">Student Name:</td><td class="val">${name}</td></tr>
            <tr><td class="lbl">Phone Number:</td><td class="val"><a href="tel:${phone}" style="color: #059669; font-weight: bold; text-decoration: none;">${phone}</a></td></tr>
            <tr><td class="lbl">Email Address:</td><td class="val">${email}</td></tr>
            <tr><td class="lbl">Selected Course:</td><td class="val highlight">${course}</td></tr>
            <tr><td class="lbl">Training Mode:</td><td class="val">${mode}</td></tr>
            <tr><td class="lbl">Message / Query:</td><td class="val">${message}</td></tr>
            <tr><td class="lbl">Submission Time:</td><td class="val" style="font-size: 13px; color: #64748b;">${time}</td></tr>
          </table>
        </div>
        <div class="footer">
          WE GROW FOR EDUCATIONAL PURPOSE • CAD & Engineering Software Training<br>
          Thiruvanmiyur, Chennai, Tamil Nadu • Contact: +91 7708282147
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends email via Nodemailer SMTP (Gmail / Custom SMTP)
 */
async function sendNodemailerEmail({ name, phone, email, course, mode, message, formTitle, time }) {
  const smtpUser = process.env.SMTP_USER || INSTITUTE_EMAIL;
  const smtpPass = process.env.SMTP_PASS || 'czva lvml gepn nasd';

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: smtpUser,
      pass: smtpPass
    },
    family: 4, // Force IPv4 to prevent IPv6 ETIMEDOUT (2404:6800:4000:1025::6c) on Vercel
    tls: {
      rejectUnauthorized: false
    }
  });

  const htmlContent = buildHtmlEmail({ name, phone, email, course, mode, message, formTitle, time });
  const subject = `[WE GROW] New ${formTitle}: ${course} - ${name}`;

  const mailOptions = {
    from: `"${name} via WE GROW" <${smtpUser}>`,
    to: INSTITUTE_EMAIL,
    replyTo: (email && email !== 'N/A' && email.includes('@')) ? email : undefined,
    subject: subject,
    html: htmlContent,
    text: `[WE GROW] ${formTitle}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCourse: ${course}\nMode: ${mode}\nMessage: ${message}\nTime: ${time}`
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[Node.js Nodemailer] Email sent successfully to ${INSTITUTE_EMAIL}! Message ID: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
}

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, phone, email, course, mode, message, formTitle } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and Phone number are required fields.'
      });
    }

    const studentName = name || 'N/A';
    const studentPhone = phone || 'N/A';
    const studentEmail = email || 'N/A';
    const selectedCourse = course || 'General Inquiry';
    const preferredMode = mode || 'Not Specified';
    const userMessage = message || 'None';
    const inquiryType = formTitle || 'Course Inquiry';
    const submissionTime = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log(`[Node.js Mailer] Processing ${inquiryType} for ${studentName} (${studentPhone})...`);

    const result = await sendNodemailerEmail({
      name: studentName,
      phone: studentPhone,
      email: studentEmail,
      course: selectedCourse,
      mode: preferredMode,
      message: userMessage,
      formTitle: inquiryType,
      time: submissionTime
    });

    return res.status(200).json({
      success: true,
      message: `Custom HTML email dispatched successfully to ${INSTITUTE_EMAIL}`,
      messageId: result.messageId
    });

  } catch (error) {
    console.error('[Node.js Nodemailer Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email via Node.js Nodemailer'
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🌱 WE GROW Institute Node.js Server Running!`);
  console.log(`   URL: http://localhost:${PORT}`);
  console.log(`   Email API Endpoint: http://localhost:${PORT}/api/send-email`);
  console.log(`   Recipient: ${INSTITUTE_EMAIL}`);
  console.log(`====================================================`);
});
