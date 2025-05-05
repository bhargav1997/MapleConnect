import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import AuthLayout from "../components/auth/AuthLayout";
import AnimatedInput from "../components/auth/AnimatedInput";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";

const Login = () => {
   const [formData, setFormData] = useState({
      email: "",
      password: "",
   });
   const [formError, setFormError] = useState("");
   const [fieldErrors, setFieldErrors] = useState({});

   const { login, isLoading, error } = useAuth();

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });

      // Clear field-specific error when user types
      if (fieldErrors[e.target.name]) {
         setFieldErrors({
            ...fieldErrors,
            [e.target.name]: "",
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

      if (!formData.password) {
         errors.password = "Password is required";
         isValid = false;
      }

      setFieldErrors(errors);
      return isValid;
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");

      // Validate form
      if (!validateForm()) {
         return;
      }

      try {
         await login(formData);
      } catch (error) {
         // Error is handled by the auth context
      }
   };

   const handleSocialLogin = (provider) => {
      console.log(`Login with ${provider}`);
      // Implement social login functionality
   };

   return (
      <AuthLayout title='Sign in to your account' subtitle='Welcome back! Please enter your details.' isLoginPage={true}>
         <form onSubmit={handleSubmit}>
            {(formError || error) && (
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
                        <p className='text-sm text-red-700'>{formError || error}</p>
                     </div>
                  </div>
               </div>
            )}

            <AnimatedInput
               id='email'
               name='email'
               type='email'
               label='Email address'
               value={formData.email}
               onChange={handleChange}
               autoComplete='email'
               required
               error={fieldErrors.email}
               icon={
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                     <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                     <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>
               }
            />

            <AnimatedInput
               id='password'
               name='password'
               type='password'
               label='Password'
               value={formData.password}
               onChange={handleChange}
               autoComplete='current-password'
               required
               error={fieldErrors.password}
               icon={
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                     <path
                        fillRule='evenodd'
                        d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                        clipRule='evenodd'
                     />
                  </svg>
               }
            />

            <div className='flex items-center justify-between mt-6 mb-6'>
               <div className='flex items-center'>
                  <input
                     id='remember-me'
                     name='remember-me'
                     type='checkbox'
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                  />
                  <label htmlFor='remember-me' className='ml-2 block text-sm text-gray-700'>
                     Remember me
                  </label>
               </div>

               <div className='text-sm'>
                  <Link to='/forgot-password' className='font-medium text-maple-red hover:text-red-700 transition-colors'>
                     Forgot password?
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
                     Signing in...
                  </div>
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
