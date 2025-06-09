import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import AuthLayout from "../components/auth/AuthLayout";
import AnimatedInput from "../components/auth/AnimatedInput";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";
import * as authService from "../services/authService";
import { toast } from "react-hot-toast";

const Login = () => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });
   const [formError, setFormError] = useState("");
   const [fieldErrors, setFieldErrors] = useState({});
   const [isOtpSent, setIsOtpSent] = useState(false);
   const [tempToken, setTempToken] = useState(null);
   const [isLoading, setIsLoading] = useState(false);

   const { login } = useAuth();
   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, type, value, checked } = e.target;
      setFormData({
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      });

      // Clear field-specific error when user types
      if (fieldErrors[name]) {
         setFieldErrors({
            ...fieldErrors,
            [name]: "",
         });
      }
   };

   const validateForm = () => {
      const errors = {};
      let isValid = true;

      if (!formData.email) {
         errors.email = "Email is required";
         isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
         errors.email = "Email is invalid";
         isValid = false;
      }

      if (!isOtpSent && !formData.password) {
         errors.password = "Password is required";
         isValid = false;
      }

      setFieldErrors(errors);
      return isValid;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");
      setIsLoading(true);

      // Validate form
      if (!validateForm()) {
         setIsLoading(false);
         return;
      }

      try {
         // First attempt regular login
         if (!isOtpSent) {
            const response = await authService.generateLoginOTP(formData.email, formData.rememberMe);

            if (response.success) {
               if (response.skipOTP) {
                  // OTP verification is still valid, proceed with direct login
                  await login({
                     email: formData.email,
                     password: formData.password,
                  });
                  navigate("/home");
                  return;
               }

               // Need OTP verification
               setTempToken(response.tempToken);
               setIsOtpSent(true);
               toast.success("OTP sent successfully!");

               // Navigate to OTP verification with all necessary state
               navigate("/otp-verify", {
                  state: {
                     email: formData.email,
                     tempToken: response.tempToken,
                     rememberMe: formData.rememberMe,
                  },
               });
            }
         }
      } catch (error) {
         const errorMessage = error.response?.data?.error || "Failed to send OTP";
         setFormError(errorMessage);
         toast.error(errorMessage);
      } finally {
         setIsLoading(false);
      }
   };

   const handleSocialLogin = (provider) => {
      console.log(`Login with ${provider}`);
      // Implement social login functionality
   };

   return (
      <AuthLayout title='Welcome back' subtitle='Sign in to your account'>
         <form onSubmit={handleSubmit} className='space-y-6'>
            {formError && <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm'>{formError}</div>}

            <AnimatedInput
               label='Email'
               type='email'
               name='email'
               value={formData.email}
               onChange={handleChange}
               error={fieldErrors.email}
               required
            />

            {!isOtpSent && (
               <AnimatedInput
                  label='Password'
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  error={fieldErrors.password}
                  required
               />
            )}

            <div className='flex items-center justify-between'>
               <div className='flex items-center'>
                  <input
                     id='remember-me'
                     name='rememberMe'
                     type='checkbox'
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                     checked={formData.rememberMe}
                     onChange={handleChange}
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-900'>
                     Remember me
                  </label>
               </div>

               <div className='text-sm'>
                  <Link to='/forgot-password' className='font-medium text-maple-red hover:text-red-700'>
                     Forgot your password?
                  </Link>
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
                     {isOtpSent ? "Sending OTP..." : "Signing in..."}
                  </div>
               ) : isOtpSent ? (
                  "Resend OTP"
               ) : (
                  "Sign in"
               )}
            </button>

            <SocialLoginButtons onGoogleLogin={() => handleSocialLogin("google")} onFacebookLogin={() => handleSocialLogin("facebook")} />
         </form>
      </AuthLayout>
   );
};

export default Login;
