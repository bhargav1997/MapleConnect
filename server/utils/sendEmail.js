const nodemailer = require("nodemailer");
const { emailConfig, validateConfig } = require("../config/email");

const sendEmail = async (options) => {
   try {
      // Validate configuration first
      if (!validateConfig()) {
         throw new Error("Email configuration is incomplete");
      }

      // Log configuration (without sensitive data)
      console.log("Email Configuration:", {
         host: emailConfig.host,
         port: emailConfig.port,
         from: emailConfig.from.email,
      });

      // Create a transporter
      const transporter = nodemailer.createTransport({
         host: emailConfig.host,
         port: emailConfig.port,
         secure: emailConfig.secure,
         auth: emailConfig.auth,
      });

      // Verify transporter configuration
      await transporter.verify();
      console.log("SMTP connection verified successfully");

      // Define email options
      const message = {
         from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
         to: options.email,
         subject: options.subject,
         html: options.html,
      };

      // Send email
      const info = await transporter.sendMail(message);
      console.log("Message sent successfully:", info.messageId);
      return info;
   } catch (error) {
      console.error("Email sending failed:", {
         error: error.message,
         code: error.code,
         command: error.command,
      });
      throw new Error(`Email could not be sent: ${error.message}`);
   }
};

module.exports = sendEmail;
