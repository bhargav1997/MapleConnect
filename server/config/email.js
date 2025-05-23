require("dotenv").config();

const emailConfig = {
   host: process.env.SMTP_HOST || "smtp.gmail.com",
   port: process.env.SMTP_PORT || 587,
   secure: process.env.SMTP_PORT === "465",
   auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
   },
   from: {
      name: process.env.FROM_NAME || "MapleConnect",
      email: process.env.FROM_EMAIL,
   },
};

// Validate configuration
const validateConfig = () => {
   const required = ["SMTP_EMAIL", "SMTP_PASSWORD", "FROM_EMAIL"];
   const missing = required.filter((key) => !process.env[key]);

   if (missing.length > 0) {
      console.error("Missing required email configuration:", missing);
      return false;
   }
   return true;
};

module.exports = {
   emailConfig,
   validateConfig,
};
