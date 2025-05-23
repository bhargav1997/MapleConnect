const checkEmailConfig = () => {
   const requiredEnvVars = ["SMTP_HOST", "SMTP_PORT", "SMTP_EMAIL", "SMTP_PASSWORD", "FROM_NAME", "FROM_EMAIL"];

   const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

   if (missingVars.length > 0) {
      console.error("Missing required environment variables:", missingVars);
      return false;
   }

   // Validate email format
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(process.env.SMTP_EMAIL) || !emailRegex.test(process.env.FROM_EMAIL)) {
      console.error("Invalid email format in environment variables");
      return false;
   }

   // Validate port number
   const port = parseInt(process.env.SMTP_PORT);
   if (isNaN(port) || port < 1 || port > 65535) {
      console.error("Invalid SMTP port number");
      return false;
   }

   return true;
};

module.exports = {
   checkEmailConfig,
};
