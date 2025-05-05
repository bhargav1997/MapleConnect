const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a test account if no SMTP settings are provided
  let testAccount;
  if (!process.env.SMTP_HOST) {
    testAccount = await nodemailer.createTestAccount();
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || testAccount.smtp.host,
    port: process.env.SMTP_PORT || testAccount.smtp.port,
    secure: process.env.SMTP_SECURE === 'true' || testAccount?.smtp.secure,
    auth: {
      user: process.env.SMTP_EMAIL || testAccount.user,
      pass: process.env.SMTP_PASSWORD || testAccount.pass
    }
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME || 'MapleConnect'} <${process.env.FROM_EMAIL || 'noreply@mapleconnect.ca'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  const info = await transporter.sendMail(mailOptions);

  // Log URL for ethereal email testing
  if (testAccount) {
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
};

module.exports = sendEmail;
