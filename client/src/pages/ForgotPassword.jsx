import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import AuthLayout from "../components/auth/AuthLayout";
import AnimatedInput from "../components/auth/AnimatedInput";

const ForgotPassword = () => {
   const [email, setEmail] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [fieldError, setFieldError] = useState("");
   const [success, setSuccess] = useState(false);

   const validateEmail = () => {
      if (!email) {
         setFieldError("Email is required");
         return false;
      } else if (!/\S+@\S+\.\S+/.test(email)) {
         setFieldError("Email is invalid");
         return false;
      }
      return true;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setFieldError("");

      if (!validateEmail()) {
         return;
      }

      setIsSubmitting(true);

      try {
         await axios.post("/api/auth/forgot-password", { email });
         setSuccess(true);
      } catch (err) {
         setError(err.response?.data?.error || "Unable to process your request. Please try again later.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <AuthLayout title='Reset your password' subtitle="Enter your email address and we'll send you a link to reset your password">
         <AnimatePresence mode='wait'>
            {success ? (
               <motion.div
                  key='success'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className='rounded-md bg-green-50 p-6'>
                  <div className='flex'>
                     <div className='flex-shrink-0'>
                        <motion.svg
                           initial={{ scale: 0 }}
                           animate={{ scale: 1, rotate: 360 }}
                           transition={{ duration: 0.5, type: "spring" }}
                           className='h-6 w-6 text-green-400'
                           xmlns='http://www.w3.org/2000/svg'
                           viewBox='0 0 20 20'
                           fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                           />
                        </motion.svg>
                     </div>
                     <div className='ml-3'>
                        <h3 className='text-lg font-medium text-green-800'>Password reset email sent</h3>
                        <div className='mt-2 text-sm text-green-700'>
                           <p>
                              We've sent an email to <span className='font-semibold'>{email}</span> with instructions to reset your
                              password. Please check your inbox.
                           </p>
                        </div>
                        <div className='mt-6'>
                           <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                              <Link
                                 to='/login'
                                 className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors'>
                                 Return to login
                              </Link>
                           </motion.div>
                        </div>
                     </div>
                  </div>
               </motion.div>
            ) : (
               <motion.form
                  key='form'
                  className='space-y-6'
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}>
                  {error && (
                     <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className='bg-red-50 border-l-4 border-red-400 p-4 rounded'>
                        <div className='flex'>
                           <div className='flex-shrink-0'>
                              <svg
                                 className='h-5 w-5 text-red-400'
                                 xmlns='http://www.w3.org/2000/svg'
                                 viewBox='0 0 20 20'
                                 fill='currentColor'>
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
                     </motion.div>
                  )}

                  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.3 }}>
                     <AnimatedInput
                        id='email'
                        name='email'
                        type='email'
                        label='Email address'
                        value={email}
                        onChange={(e) => {
                           setEmail(e.target.value);
                           if (fieldError) setFieldError("");
                        }}
                        autoComplete='email'
                        required
                        error={fieldError}
                        icon={
                           <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                              <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                              <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                           </svg>
                        }
                     />
                  </motion.div>

                  <button
                     type='submit'
                     disabled={isSubmitting}
                     className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-maple-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors ${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                     }`}>
                     {isSubmitting ? (
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
                           Sending...
                        </div>
                     ) : (
                        "Send reset link"
                     )}
                  </button>

                  <motion.div
                     initial={{ y: 20, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.3, delay: 0.3 }}
                     className='flex items-center justify-between'>
                     <div className='text-sm'>
                        <Link to='/login' className='font-medium text-maple-red hover:text-red-700 transition-colors'>
                           Back to login
                        </Link>
                     </div>
                     <div className='text-sm'>
                        <Link to='/register' className='font-medium text-maple-red hover:text-red-700 transition-colors'>
                           Create an account
                        </Link>
                     </div>
                  </motion.div>
               </motion.form>
            )}
         </AnimatePresence>
      </AuthLayout>
   );
};

export default ForgotPassword;
