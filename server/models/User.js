const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, "Please add a name"],
         trim: true,
         maxlength: [50, "Name cannot be more than 50 characters"],
      },
      username: {
         type: String,
         required: [true, "Please add a username"],
         unique: true,
         trim: true,
         maxlength: [50, "Username cannot be more than 50 characters"],
      },
      email: {
         type: String,
         required: [true, "Please add an email"],
         unique: true,
         match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
      },
      password: {
         type: String,
         required: [true, "Please add a password"],
         minlength: [6, "Password must be at least 6 characters"],
         select: false,
      },
      otp: {
         type: String,
         select: false,
      },
      otpExpiry: {
         type: Date,
         select: false,
      },
      bio: {
         type: String,
         maxlength: [500, "Bio cannot be more than 500 characters"],
      },
      location: {
         type: String,
         maxlength: [100, "Location cannot be more than 100 characters"],
      },
      profileImage: {
         type: String,
         default: "default-profile.jpg",
      },
      coverImage: {
         type: String,
         default: "default-cover.jpg",
      },
      following: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      followers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      resetPasswordToken: String,
      resetPasswordExpire: Date,
   },
   {
      timestamps: true,
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);

// Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
      next();
   }

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
   });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
   return await bcrypt.compare(enteredPassword, this.password);
};

// Method to set OTP
UserSchema.methods.setOTP = async function (otp) {
   this.otp = otp;
   this.otpExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
   return await this.save();
};

// Method to verify OTP
UserSchema.methods.verifyOTP = async function (otp) {
   if (!this.otp || !this.otpExpiry) {
      return false;
   }

   const isValid = this.otp === otp && Date.now() < this.otpExpiry;

   if (isValid) {
      this.otp = undefined;
      this.otpExpiry = undefined;
      await this.save();
   }

   return isValid;
};

module.exports = mongoose.model("User", UserSchema);
