import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyLoginOTP } from "../services/authService";

const OTPVerification = () => {
   const navigate = useNavigate();
   const [email, setEmail] = useState("");
   const [otp, setOTP] = useState("");
   const [tempToken, setTempToken] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [user, setUser] = useState(null);

   const handleVerifyOTP = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         const response = await verifyLoginOTP(email, otp, tempToken);
         if (response.success) {
            setUser(response.user);
            navigate("/");
         }
      } catch (err) {
         setError(err.response?.data?.error || "Failed to verify OTP");
      } finally {
         setLoading(false);
      }
   };

   return <div>{/* Render your form here */}</div>;
};

export default OTPVerification;
