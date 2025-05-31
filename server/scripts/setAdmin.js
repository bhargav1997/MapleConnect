const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const setAdmin = async (email) => {
   try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      console.log("MongoDB Connected...");

      // Find user by email and update isAdmin
      const user = await User.findOneAndUpdate({ email }, { isAdmin: true }, { new: true });

      if (!user) {
         console.log("User not found");
         process.exit(1);
      }

      console.log(`User ${email} has been set as admin`);
      process.exit(0);
   } catch (err) {
      console.error("Error:", err);
      process.exit(1);
   }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
   console.log("Please provide an email address");
   process.exit(1);
}

setAdmin(email);
