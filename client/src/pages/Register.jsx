import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";
import AnimatedInput from "../components/auth/AnimatedInput";
import SocialLoginButtons from "../components/auth/SocialLoginButtons";

const Register = () => {
   const [formData, setFormData] = useState({
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [formError, setFormError] = useState("");
   const [fieldErrors, setFieldErrors] = useState({});

   const { register, isLoading, error } = useAuth();

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

      if (!formData.name) {
         errors.name = "Name is required";
         isValid = false;
      }

      if (!formData.username) {
         errors.username = "Username is required";
         isValid = false;
      } else if (!/^[a-zA-Z0-9_.]+$/.test(formData.username)) {
         errors.username = "Username can only contain letters, numbers, underscores and dots";
         isValid = false;
      } else if (formData.username.length > 30) {
         errors.username = "Username cannot be more than 30 characters";
         isValid = false;
      }

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
      } else if (formData.password.length < 6) {
         errors.password = "Password must be at least 6 characters";
         isValid = false;
      }

      if (!formData.confirmPassword) {
         errors.confirmPassword = "Please confirm your password";
         isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
         errors.confirmPassword = "Passwords do not match";
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
         await register({
            name: formData.name,
            username: formData.username,
            email: formData.email,
            password: formData.password,
         });
      } catch (error) {
         // Error is handled by the auth context
      }
   };

   const handleSocialLogin = (provider) => {
      console.log(`Register with ${provider}`);
      // Implement social login functionality
   };

   return (
      <AuthLayout title='Create your account' subtitle='Join MapleConnect and connect with your community' isLoginPage={false}>
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
               id='name'
               name='name'
               type='text'
               label='Full Name'
               value={formData.name}
               onChange={handleChange}
               autoComplete='name'
               required
               error={fieldErrors.name}
               icon={
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                     <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                  </svg>
               }
            />

            <AnimatedInput
               id='username'
               name='username'
               type='text'
               label='Username'
               value={formData.username}
               onChange={handleChange}
               autoComplete='username'
               required
               error={fieldErrors.username}
               icon={
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                     <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.035-.691-.1-1.02A5 5 0 0010 11z'
                        clipRule='evenodd'
                     />
                  </svg>
               }
            />

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
               autoComplete='new-password'
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

            <AnimatedInput
               id='confirmPassword'
               name='confirmPassword'
               type='password'
               label='Confirm Password'
               value={formData.confirmPassword}
               onChange={handleChange}
               autoComplete='new-password'
               required
               error={fieldErrors.confirmPassword}
               icon={
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                     <path
                        fillRule='evenodd'
                        d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                     />
                  </svg>
               }
            />

            <div className='mt-6 mb-6'>
               <p className='text-sm text-gray-600'>
                  By creating an account, you agree to our{" "}
                  <Link to='#' className='text-maple-red hover:underline'>
                     Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to='#' className='text-maple-red hover:underline'>
                     Privacy Policy
                  </Link>
               </p>
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
                     Creating account...
                  </div>
               ) : (
                  "Create account"
               )}
            </button>

            <SocialLoginButtons onGoogleLogin={() => handleSocialLogin("google")} onFacebookLogin={() => handleSocialLogin("facebook")} />
         </form>
      </AuthLayout>
   );
};

export default Register;
