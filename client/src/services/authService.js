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

// Generate OTP for login
export const generateLoginOTP = async (email) => {
   try {
      console.log("Generating OTP for:", email);
      const response = await api.post("/auth/generate-login-otp", { email });
      return response.data;
   } catch (error) {
      console.error("Generate OTP error:", error);
      throw error;
   }
};

// Verify OTP and complete login
export const verifyLoginOTP = async (otpData) => {
   try {
      console.log("Verifying OTP for:", otpData.email);
      const response = await api.post("/auth/verify-login-otp", otpData);

      if (response.data && response.data.success) {
         console.log("OTP verification successful, saving user data");
         localStorage.setItem("user", JSON.stringify(response.data.user));
         localStorage.setItem("token", response.data.token);
      }

      return response.data;
   } catch (error) {
      console.error("OTP verification error:", error);
      throw error;
   }
};

// Resend OTP
export const resendLoginOTP = async (email, tempToken) => {
   try {
      console.log("Resending OTP for:", email);
      const response = await api.post("/auth/resend-login-otp", { email, tempToken });
      return response.data;
   } catch (error) {
      console.error("Resend OTP error:", error);
      throw error;
   }
};

// Login user (traditional password-based)
export const login = async (userData) => {
   try {
      console.log("Logging in user:", userData.email);
      const response = await api.post("/auth/login", userData);

      if (response.data && response.data.success) {
         console.log("Login successful, saving user data");
         localStorage.setItem("user", JSON.stringify(response.data.user));
         localStorage.setItem("token", response.data.token);
      } else {
         console.warn("Login response missing success flag or data");
      }

      return response.data;
   } catch (error) {
      console.error("Login service error:", error);
      throw error;
   }
};

// Logout user
export const logout = () => {
   console.log("Logging out user");
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
