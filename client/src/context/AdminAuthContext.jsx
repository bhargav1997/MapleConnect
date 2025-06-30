import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
   const context = useContext(AdminAuthContext);
   if (!context) {
      throw new Error("useAdminAuth must be used within an AdminAuthProvider");
   }
   return context;
};

export const AdminAuthProvider = ({ children }) => {
   const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
   const [adminEmail, setAdminEmail] = useState("");
   const [isWaitingForOTP, setIsWaitingForOTP] = useState(false);
   const [tempToken, setTempToken] = useState(null);
   const navigate = useNavigate();

   const adminLogin = async (email, password) => {
      try {
         // First verify credentials using regular login
         const loginResponse = await authService.login(email, password);

         if (loginResponse.success) {
            // Check if user has admin privileges
            if (loginResponse.user.isAdmin) {
               // Generate OTP for admin verification
               const otpResponse = await authService.generateLoginOTP(email);
               if (otpResponse.success) {
                  setAdminEmail(email);
                  setIsWaitingForOTP(true);
                  setTempToken(otpResponse.tempToken);
                  return true;
               }
            }
         }
         return false;
      } catch (error) {
         console.error("Admin login error:", error);
         return false;
      }
   };

   const verifyOTP = async (otp) => {
      try {
         const response = await authService.verifyLoginOTP(adminEmail, otp, tempToken);

         console.log("response", response);

         if (response.success && response.user.isAdmin) {
            setIsAdminAuthenticated(true);
            setIsWaitingForOTP(false);
            localStorage.setItem("adminAuth", "true");
            localStorage.setItem("adminEmail", adminEmail);
            localStorage.setItem("adminToken", response.token);
            navigate("/admin"); // Navigate to admin dashboard
            return true;
         }
         return false;
      } catch (error) {
         console.error("OTP verification error:", error);
         return false;
      }
   };

   const resendOTP = async () => {
      try {
         const response = await authService.resendLoginOTP(adminEmail, tempToken);
         if (response.success) {
            setTempToken(response.tempToken);
         }
         return response.success;
      } catch (error) {
         console.error("Resend OTP error:", error);
         return false;
      }
   };

   const adminLogout = () => {
      setIsAdminAuthenticated(false);
      setIsWaitingForOTP(false);
      setAdminEmail("");
      setTempToken(null);
      localStorage.removeItem("adminAuth");
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
   };

   // Check for existing admin auth on mount
   useState(() => {
      const adminAuth = localStorage.getItem("adminAuth");
      const storedEmail = localStorage.getItem("adminEmail");
      const adminToken = localStorage.getItem("adminToken");

      if (adminAuth === "true" && storedEmail && adminToken) {
         setIsAdminAuthenticated(true);
         setAdminEmail(storedEmail);
      }
   }, []);

   return (
      <AdminAuthContext.Provider
         value={{
            isAdminAuthenticated,
            isWaitingForOTP,
            adminEmail,
            adminLogin,
            verifyOTP,
            resendOTP,
            adminLogout,
         }}>
         {children}
      </AdminAuthContext.Provider>
   );
};
