const express = require("express");
const { register, login, getMe, logout, generateLoginOTP, verifyLoginOTP, resendLoginOTP } = require("../controllers/auth");
const { forgotPassword, resetPassword } = require("../controllers/passwordReset");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/generate-login-otp", generateLoginOTP);
router.post("/verify-login-otp", verifyLoginOTP);
router.post("/resend-login-otp", resendLoginOTP);
router.get("/me", protect, getMe);
router.get("/logout", protect, logout);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resettoken", resetPassword);

module.exports = router;
