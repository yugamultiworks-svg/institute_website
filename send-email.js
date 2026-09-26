const dns = require('dns');
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
const nodemailer = require('nodemailer');

const INSTITUTE_EMAIL = process.env.INSTITUTE_EMAIL || 'yuga.multi.works@gmail.com';
const SMTP_USER = process.env.SMTP_USER || 'yuga.multi.works@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'czva lvml gepn nasd';

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

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, email = 'N/A', course = 'General Inquiry', mode = 'N/A', message = 'N/A', formTitle = 'Course Inquiry' } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ success: false, error: 'Name and Phone Number are required.' });
    }

    const time = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

    // Transporter configured with family: 4 (IPv4) & port 465 (SSL) to prevent IPv6 ETIMEDOUT on Vercel
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      },
      family: 4, // Force IPv4 to prevent IPv6 ETIMEDOUT (2404:6800:4000:1025::6c) on Vercel
      tls: {
        rejectUnauthorized: false
      }
    });

    const htmlContent = buildHtmlEmail({ name, phone, email, course, mode, message, formTitle, time });

    const mailOptions = {
      from: `"${name} via WE GROW" <${SMTP_USER}>`,
      to: INSTITUTE_EMAIL,
      replyTo: (email && email !== 'N/A' && email.includes('@')) ? email : undefined,
      subject: `[WE GROW] New ${formTitle}: ${course} - ${name}`,
      html: htmlContent,
      text: `[WE GROW] ${formTitle}\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nCourse: ${course}\nMode: ${mode}\nMessage: ${message}\nTime: ${time}`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Vercel Serverless Nodemailer] Sent successfully! ID: ${info.messageId}`);

    return res.status(200).json({
      success: true,
      message: 'Reservation submitted successfully! Our team will call you back shortly.',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[Vercel Serverless Nodemailer Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to dispatch email'
    });
  }
};
