import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import api from "../services/api";

const LoginOTPVerification = () => {
   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [countdown, setCountdown] = useState(60);
   const [resendDisabled, setResendDisabled] = useState(true);

   const inputRefs = useRef([]);
   const navigate = useNavigate();
   const location = useLocation();
   const { completeLogin } = useAuth();

   const { email, tempToken } = location.state || {};

   useEffect(() => {
      if (!email || !tempToken) {
         navigate("/login");
      }

      if (inputRefs.current[0]) {
         inputRefs.current[0].focus();
      }

      const timer = setInterval(() => {
         setCountdown((prev) => {
            if (prev <= 1) {
               clearInterval(timer);
               setResendDisabled(false);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(timer);
   }, [navigate, email, tempToken]);

   const handleChange = (index, e) => {
      const value = e.target.value;

      if (value && !/^\d+$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value.slice(0, 1);
      setOtp(newOtp);

      if (error) setError("");

      if (value && index < 5) {
         inputRefs.current[index + 1].focus();
      }
   };

   const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
         inputRefs.current[index - 1].focus();
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const otpValue = otp.join("");

      if (otpValue.length !== 6) {
         setError("Please enter a valid 6-digit OTP");
         return;
      }

      setIsLoading(true);
      setError("");

      try {
         console.log("Verifying OTP for:", email);
         const response = await api.post("/auth/verify-login-otp", {
            email,
            otp: otpValue,
            tempToken,
         });

         console.log("OTP verification response:", response.data);

         if (response.data && response.data.success) {
            console.log("OTP verification successful, completing login");
            await completeLogin(response.data);
            console.log("Login completed, navigating to dashboard");
            navigate("/home", { replace: true });
         } else {
            console.error("Invalid response from OTP verification:", response.data);
            setError("Invalid OTP. Please try again.");
         }
      } catch (err) {
         console.error("OTP verification error:", err);
         setError(err.response?.data?.error || "Invalid OTP. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   const handleResendOTP = async () => {
      setIsLoading(true);
      setError("");

      try {
         await api.post("/auth/resend-login-otp", { email, tempToken });
         setCountdown(60);
         setResendDisabled(true);

         const timer = setInterval(() => {
            setCountdown((prev) => {
               if (prev <= 1) {
                  clearInterval(timer);
                  setResendDisabled(false);
                  return 0;
               }
               return prev - 1;
            });
         }, 1000);
      } catch (err) {
         setError(err.response?.data?.error || "Failed to resend OTP");
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <AuthLayout title='Verify Your Identity' subtitle={`We've sent a security code to ${email}`}>
         <form onSubmit={handleSubmit}>
            {error && (
               <div className='mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded'>
                  <div className='flex'>
                     <div className='flex-shrink-0'>
                        <svg className='h-5 w-5 text-red-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <div className='ml-3'>
                        <p className='text-sm text-red-700'>{error}</p>
                     </div>
                  </div>
               </div>
            )}

            <div className='mb-6'>
               <label className='block text-sm font-medium text-gray-700 mb-2'>Enter security code</label>
               <div className='flex justify-between gap-2'>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                     <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type='text'
                        maxLength='1'
                        value={otp[index]}
                        onChange={(e) => handleChange(index, e)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className='w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'
                        disabled={isLoading}
                     />
                  ))}
               </div>
            </div>

            <button
               type='submit'
               disabled={isLoading}
               className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-maple-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
               }`}>
               {isLoading ? (
                  <div className='flex items-center justify-center'>
                     <svg
                        className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path
                           className='opacity-75'
                           fill='currentColor'
                           d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                     </svg>
                     Verifying...
                  </div>
               ) : (
                  "Continue"
               )}
            </button>

            <div className='mt-6 text-center'>
               <p className='text-sm text-gray-600'>
                  Didn't receive the code?{" "}
                  <button
                     type='button'
                     onClick={handleResendOTP}
                     disabled={resendDisabled || isLoading}
                     className={`text-maple-red font-medium ${
                        resendDisabled || isLoading ? "opacity-50 cursor-not-allowed" : "hover:underline"
                     }`}>
                     {resendDisabled ? `Resend in ${countdown}s` : "Resend code"}
                  </button>
               </p>
            </div>
         </form>
      </AuthLayout>
   );
};

export default LoginOTPVerification;
