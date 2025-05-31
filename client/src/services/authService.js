import api from "./api";

// Register user
export const register = async (userData) => {
   try {
      console.log("Registering user:", userData.email);
      const response = await api.post("/auth/register", userData);

      if (response.data && response.data.success) {
         console.log("Registration successful, saving user data");
         localStorage.setItem("user", JSON.stringify(response.data.user));
         localStorage.setItem("token", response.data.token);
      } else {
         console.warn("Registration response missing success flag or data");
      }

      return response.data;
   } catch (error) {
      console.error("Registration service error:", error);
      throw error;
   }
};

// Store OTP verification status
const storeOTPVerification = (email) => {
   const expiryDate = new Date();
   expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from now
   localStorage.setItem(
      "otpVerified",
      JSON.stringify({
         email,
         expiryDate: expiryDate.toISOString(),
      }),
   );
};

// Check if OTP verification is still valid
const isOTPVerificationValid = (email) => {
   const otpVerified = localStorage.getItem("otpVerified");
   if (!otpVerified) return false;

   const { email: verifiedEmail, expiryDate } = JSON.parse(otpVerified);
   const now = new Date();
   const expiry = new Date(expiryDate);

   return email === verifiedEmail && now < expiry;
};

// Clear OTP verification
const clearOTPVerification = () => {
   localStorage.removeItem("otpVerified");
};

// Login with email and password
export const login = async (email, password) => {
   try {
      const response = await api.post("/auth/login", {
         email,
         password,
      });

      if (response.data && response.data.success) {
         // Store user data and token only after successful login
         localStorage.setItem("user", JSON.stringify(response.data.user));
         localStorage.setItem("token", response.data.token);
      }

      return response.data;
   } catch (error) {
      console.error("Login error:", error);
      throw error;
   }
};

// Generate OTP for login
export const generateLoginOTP = async (email) => {
   try {
      // Check if OTP verification is still valid
      if (isOTPVerificationValid(email)) {
         return { success: true, skipOTP: true };
      }

      const response = await api.post("/auth/generate-login-otp", { email });
      return response.data;
   } catch (error) {
      console.error("Generate OTP error:", error);
      throw error;
   }
};

// Verify OTP
export const verifyLoginOTP = async (email, otp, tempToken) => {
   try {
      const response = await api.post("/auth/verify-login-otp", {
         email,
         otp,
         tempToken,
      });

      if (response.data.success) {
         // Store user data and token after successful verification
         localStorage.setItem("user", JSON.stringify(response.data.user));
         localStorage.setItem("token", response.data.token);
         storeOTPVerification(email);
      }

      return response.data;
   } catch (error) {
      console.error("Verify OTP error:", error);
      throw error;
   }
};

// Resend OTP
export const resendLoginOTP = async (email, tempToken) => {
   const response = await api.post("/auth/resend-login-otp", { email, tempToken });
   return response.data;
};

// Logout
export const logout = () => {
   clearOTPVerification();
};

// Get current user
export const getCurrentUser = async () => {
   try {
      console.log("Fetching current user");
      const response = await api.get("/auth/me");
      return response.data;
   } catch (error) {
      console.error("Get current user error:", error);
      throw error;
   }
};
