import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { motion } from "framer-motion";

const AdminOTPVerification = () => {
   const [otp, setOtp] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [resending, setResending] = useState(false);
   const { isWaitingForOTP, verifyOTP, resendOTP, adminEmail } = useAdminAuth();

   if (!isWaitingForOTP) {
      return <Navigate to='/admin/login' />;
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      try {
         const success = await verifyOTP(otp);
         if (!success) {
            setError("Invalid OTP code. Please try again.");
         }
      } catch (err) {
         setError("An error occurred. Please try again.");
      } finally {
         setLoading(false);
      }
   };

   const handleResendOTP = async () => {
      setResending(true);
      setError("");

      try {
         const success = await resendOTP();
         if (!success) {
            setError("Failed to resend OTP. Please try again.");
         }
      } catch (err) {
         setError("An error occurred while resending OTP.");
      } finally {
         setResending(false);
      }
   };

   const handleOTPChange = (e) => {
      const value = e.target.value;
      if (value.length <= 6 && /^\d*$/.test(value)) {
         setOtp(value);
      }
   };

   return (
      <div className='min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8'>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg'>
            <div>
               <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Verify OTP</h2>
               <p className='mt-2 text-center text-sm text-gray-600'>Enter the verification code sent to</p>
               <p className='text-center text-sm font-medium text-maple-red'>{adminEmail}</p>
            </div>

            {error && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-4 text-red-600 bg-red-50 rounded-lg text-sm'>
                  {error}
               </motion.div>
            )}

            <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
               <div>
                  <label htmlFor='otp' className='sr-only'>
                     OTP Code
                  </label>
                  <input
                     id='otp'
                     name='otp'
                     type='text'
                     required
                     value={otp}
                     onChange={handleOTPChange}
                     maxLength={6}
                     className='appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-maple-red focus:border-maple-red focus:z-10 text-2xl text-center tracking-widest'
                     placeholder='000000'
                     disabled={loading}
                  />
               </div>

               <div>
                  <button
                     type='submit'
                     disabled={otp.length !== 6 || loading}
                     className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red ${
                        otp.length !== 6 || loading ? "opacity-50 cursor-not-allowed" : ""
                     }`}>
                     {loading ? (
                        <>
                           <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                              <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                              <path
                                 className='opacity-75'
                                 fill='currentColor'
                                 d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                              />
                           </svg>
                           Verifying...
                        </>
                     ) : (
                        "Verify"
                     )}
                  </button>
               </div>
            </form>

            <div className='text-center'>
               <p className='text-sm text-gray-600'>
                  Didn't receive the code?{" "}
                  <button
                     onClick={handleResendOTP}
                     disabled={resending}
                     className={`text-maple-red hover:text-maple-red-dark font-medium ${resending ? "opacity-50 cursor-not-allowed" : ""}`}>
                     {resending ? "Resending..." : "Resend"}
                  </button>
               </p>
            </div>
         </motion.div>
      </div>
   );
};

export default AdminOTPVerification;
