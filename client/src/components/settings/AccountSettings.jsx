import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../services/api';

const AccountSettings = () => {
   const { user } = useAuth();

   const [formData, setFormData] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [passwordStrength, setPasswordStrength] = useState(0);
   const [passwordFeedback, setPasswordFeedback] = useState("");

   // Auto-dismiss success message after 5 seconds
   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => {
            setSuccess("");
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });

      // Check password strength if the new password field is being updated
      if (e.target.name === "newPassword") {
         checkPasswordStrength(e.target.value);
      }
   };

   const checkPasswordStrength = (password) => {
      if (!password) {
         setPasswordStrength(0);
         setPasswordFeedback("");
         return;
      }

      let strength = 0;
      let feedback = [];

      // Length check
      if (password.length >= 8) {
         strength += 1;
      } else {
         feedback.push("Password should be at least 8 characters long");
      }

      // Uppercase check
      if (/[A-Z]/.test(password)) {
         strength += 1;
      } else {
         feedback.push("Add uppercase letters");
      }

      // Lowercase check
      if (/[a-z]/.test(password)) {
         strength += 1;
      } else {
         feedback.push("Add lowercase letters");
      }

      // Number check
      if (/[0-9]/.test(password)) {
         strength += 1;
      } else {
         feedback.push("Add numbers");
      }

      // Special character check
      if (/[^A-Za-z0-9]/.test(password)) {
         strength += 1;
      } else {
         feedback.push("Add special characters");
      }

      setPasswordStrength(strength);
      setPasswordFeedback(feedback.join(", "));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      // Validate passwords
      if (formData.newPassword !== formData.confirmPassword) {
         setError("New passwords do not match");
         return;
      }

      if (formData.newPassword.length < 6) {
         setError("Password must be at least 6 characters");
         return;
      }

      setIsSubmitting(true);

      try {
         // Update password
         await api.put(`/users/${user.id}/password`, {
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
         });

         setSuccess("Password updated successfully");

         // Reset form
         setFormData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
         });
      } catch (err) {
         setError(err.response?.data?.error || "Failed to update password. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   const handleDeleteAccount = async () => {
      if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
         try {
            await api.delete(`/users/${user.id}`);
            // Logout and redirect to home page
            window.location.href = "/";
         } catch (err) {
            setError(err.response?.data?.error || "Failed to delete account. Please try again.");
         }
      }
   };

   return (
      <div className='p-6'>
         <div className='flex items-center mb-6'>
            <div className='bg-maple-red/10 p-2 rounded-full mr-3'>
               <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                  />
               </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>Account Security</h2>
         </div>

         <p className='text-gray-500 mb-6'>
            Update your password to keep your account secure. We recommend using a strong, unique password.
         </p>

         <AnimatePresence>
            {error && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
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
                     <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-red-800'>{error}</p>
                     </div>
                     <button onClick={() => setError("")} className='text-red-500 hover:text-red-700'>
                        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {success && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                  <div className='flex'>
                     <div className='flex-shrink-0'>
                        <svg className='h-5 w-5 text-green-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-green-800'>{success}</p>
                     </div>
                     <button onClick={() => setSuccess("")} className='text-green-500 hover:text-green-700'>
                        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6'>
            <div className='flex'>
               <div className='flex-shrink-0'>
                  <svg className='h-5 w-5 text-yellow-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                     <path
                        fillRule='evenodd'
                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                     />
                  </svg>
               </div>
               <div className='ml-3'>
                  <p className='text-sm text-yellow-700'>Changing your password will log you out of all devices except this one.</p>
               </div>
            </div>
         </motion.div>

         <div className='bg-white rounded-xl border border-gray-200 p-6 mb-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Change Password</h3>
            <form onSubmit={handleSubmit} className='space-y-6'>
               <div>
                  <label htmlFor='currentPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                     Current Password
                  </label>
                  <div className='relative'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                           />
                        </svg>
                     </div>
                     <input
                        type='password'
                        name='currentPassword'
                        id='currentPassword'
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        placeholder='Enter your current password'
                        className='pl-10 shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg py-2.5'
                     />
                  </div>
               </div>

               <div>
                  <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                     New Password
                  </label>
                  <div className='relative'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                           />
                        </svg>
                     </div>
                     <input
                        type='password'
                        name='newPassword'
                        id='newPassword'
                        value={formData.newPassword}
                        onChange={handleChange}
                        required
                        placeholder='Create a new password'
                        className='pl-10 shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg py-2.5'
                     />
                  </div>

                  {formData.newPassword && (
                     <div className='mt-2'>
                        <div className='flex items-center mb-1'>
                           <div className='flex-1 h-2 bg-gray-200 rounded-full overflow-hidden'>
                              <div
                                 className={`h-full ${
                                    passwordStrength === 0
                                       ? "bg-gray-300"
                                       : passwordStrength === 1
                                       ? "bg-red-500"
                                       : passwordStrength === 2
                                       ? "bg-orange-500"
                                       : passwordStrength === 3
                                       ? "bg-yellow-500"
                                       : passwordStrength === 4
                                       ? "bg-green-500"
                                       : "bg-green-600"
                                 }`}
                                 style={{ width: `${passwordStrength * 20}%` }}></div>
                           </div>
                           <span className='ml-2 text-xs text-gray-500'>
                              {passwordStrength === 0
                                 ? "Very Weak"
                                 : passwordStrength === 1
                                 ? "Weak"
                                 : passwordStrength === 2
                                 ? "Fair"
                                 : passwordStrength === 3
                                 ? "Good"
                                 : passwordStrength === 4
                                 ? "Strong"
                                 : "Very Strong"}
                           </span>
                        </div>
                        {passwordFeedback && <p className='text-xs text-gray-500'>{passwordFeedback}</p>}
                     </div>
                  )}
               </div>

               <div>
                  <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
                     Confirm New Password
                  </label>
                  <div className='relative'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
                           />
                        </svg>
                     </div>
                     <input
                        type='password'
                        name='confirmPassword'
                        id='confirmPassword'
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder='Confirm your new password'
                        className={`pl-10 shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg py-2.5 ${
                           formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : ""
                        }`}
                     />
                  </div>
                  {formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                     <p className='mt-1 text-xs text-red-600'>Passwords do not match</p>
                  )}
               </div>

               <div className='pt-5'>
                  <div className='flex justify-end space-x-3'>
                     <motion.button
                        type='button'
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className='bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                        onClick={() => {
                           setFormData({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                           });
                           setPasswordStrength(0);
                           setPasswordFeedback("");
                        }}>
                        Reset Form
                     </motion.button>
                     <motion.button
                        type='submit'
                        disabled={
                           isSubmitting ||
                           (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
                        }
                        whileHover={isSubmitting ? {} : { scale: 1.03 }}
                        whileTap={isSubmitting ? {} : { scale: 0.98 }}
                        className={`inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                           isSubmitting ||
                           (formData.newPassword && formData.confirmPassword && formData.newPassword !== formData.confirmPassword)
                              ? "bg-maple-red/60 cursor-not-allowed"
                              : "bg-maple-red hover:bg-maple-red-dark transition-colors"
                        }`}>
                        {isSubmitting ? (
                           <>
                              <svg
                                 className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'>
                                 <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                 <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                              </svg>
                              Updating...
                           </>
                        ) : (
                           <>
                              <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z'
                                 />
                              </svg>
                              Update Password
                           </>
                        )}
                     </motion.button>
                  </div>
               </div>
            </form>
         </div>

         <div className='bg-white rounded-xl border border-gray-200 p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Account Information</h3>
            <div className='space-y-4'>
               <div>
                  <p className='text-sm font-medium text-gray-500'>Email Address</p>
                  <div className='mt-1 flex items-center'>
                     <p className='text-base text-gray-900'>{user?.email}</p>
                     <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                        Verified
                     </span>
                  </div>
               </div>

               <div>
                  <p className='text-sm font-medium text-gray-500'>Account Created</p>
                  <p className='mt-1 text-base text-gray-900'>
                     {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                             year: "numeric",
                             month: "long",
                             day: "numeric",
                          })
                        : "N/A"}
                  </p>
               </div>
            </div>
         </div>

         <div className='bg-white rounded-xl border border-red-200 p-6 mt-6'>
            <div className='flex items-center mb-4'>
               <div className='bg-red-100 p-2 rounded-full mr-3'>
                  <svg className='w-6 h-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                     />
                  </svg>
               </div>
               <h3 className='text-lg font-medium text-red-600'>Danger Zone</h3>
            </div>

            <div className='bg-red-50 rounded-lg p-4 border border-red-100'>
               <p className='text-sm text-gray-700 mb-4'>
                  Once you delete your account, there is no going back. All of your data will be permanently removed. This action cannot be
                  undone.
               </p>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-sm font-medium text-gray-900'>Delete your account</h4>
                     <p className='text-xs text-gray-500'>Permanently remove your account and all of your content.</p>
                  </div>

                  <motion.button
                     type='button'
                     onClick={handleDeleteAccount}
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.98 }}
                     className='inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors'>
                     <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                        />
                     </svg>
                     Delete Account
                  </motion.button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AccountSettings;
