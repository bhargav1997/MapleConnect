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
const storeOTPVerification = (email, remember = false) => {
   if (remember) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from now
      localStorage.setItem(
         "otpVerified",
         JSON.stringify({
            email,
            expiryDate: expiryDate.toISOString(),
         }),
      );
   }
};

// Check if OTP verification is still valid
const isOTPVerificationValid = (email) => {
   const otpVerified = localStorage.getItem("otpVerified");
   if (!otpVerified) return false;

   const { email: verifiedEmail, expiryDate } = JSON.parse(otpVerified);
   const now = new Date();
   const expiry = new Date(expiryDate);

   return email === verifiedEmail && now < expiry;
}; // Clear OTP verification
const clearOTPVerification = () => {
   localStorage.removeItem("otpVerified");
   localStorage.removeItem("otpRememberMe");
};

// Login with email and password
export const login = async (email, password) => {
   try {
      // Check if we have a stored OTP verification for this email
      if (isOTPVerificationValid(email)) {
         console.log("Using stored OTP verification for login");
      }

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
export const generateLoginOTP = async (email, remember = false) => {
   try {
      // Check if OTP verification is still valid
      if (isOTPVerificationValid(email)) {
         // Skip OTP only if it's a valid stored verification
         return { success: true, skipOTP: true };
      }

      const response = await api.post("/auth/generate-login-otp", { email, remember });
      console.log("response", response);
      return { ...response.data, skipOTP: false };
   } catch (error) {
      console.error("Generate OTP error:", error);
      throw error;
   }
};

// Verify OTP
export const verifyLoginOTP = async (email, otp, tempToken, remember = false) => {
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

         // Store OTP verification status if remember is true
         storeOTPVerification(email, remember);
      }

      return response.data;
   } catch (error) {
      console.error("Verify OTP error:", error);
      throw error;
   }
};

// Logout
export const logout = () => {
   clearOTPVerification();
   localStorage.removeItem("user");
   localStorage.removeItem("token");
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
