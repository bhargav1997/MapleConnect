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

// Login user
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
