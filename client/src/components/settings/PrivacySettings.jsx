import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const PrivacySettings = () => {
   const { user, updateUserContext } = useAuth();

   const [privacySettings, setPrivacySettings] = useState({
      isProfilePublic: true,
      showLocation: true,
      allowTagging: true,
      allowDirectMessages: true,
      showOnlineStatus: true,
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   // Auto-dismiss success message after 5 seconds
   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => {
            setSuccess("");
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   useEffect(() => {
      // Load user's privacy settings if available
      if (user && user.privacySettings) {
         setPrivacySettings({
            isProfilePublic: user.privacySettings.isProfilePublic ?? true,
            showLocation: user.privacySettings.showLocation ?? true,
            allowTagging: user.privacySettings.allowTagging ?? true,
            allowDirectMessages: user.privacySettings.allowDirectMessages ?? true,
            showOnlineStatus: user.privacySettings.showOnlineStatus ?? true,
         });
      }
   }, [user]);

   const handleToggle = (setting) => {
      setPrivacySettings({
         ...privacySettings,
         [setting]: !privacySettings[setting],
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      try {
         // Update privacy settings
         const response = await axios.put(`/api/users/${user.id}/privacy`, {
            privacySettings,
         });

         // Update user context with new privacy settings
         updateUserContext({
            ...user,
            privacySettings: response.data.data.privacySettings,
         });

         setSuccess("Privacy settings updated successfully");
      } catch (err) {
         setError(err.response?.data?.error || "Failed to update privacy settings. Please try again.");
      } finally {
         setIsSubmitting(false);
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
                     d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                  />
               </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>Privacy Settings</h2>
         </div>

         <p className='text-gray-500 mb-6'>Control who can see your information and how your data is used across MapleConnect.</p>

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

         <div className='bg-white rounded-xl border border-gray-200 p-6 mb-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Privacy Controls</h3>
            <div className='space-y-6'>
               <div className='flex items-center justify-between'>
                  <div>
                     <div className='flex items-center'>
                        <div className='bg-maple-red/10 p-1.5 rounded-full mr-2'>
                           <svg className='w-4 h-4 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                           </svg>
                        </div>
                        <h3 className='text-base font-medium text-gray-900'>Public Profile</h3>
                     </div>
                     <p className='text-sm text-gray-500 mt-1 ml-7'>When disabled, only your connections can see your profile.</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("isProfilePublic")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        privacySettings.isProfilePublic ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle public profile</span>
                     <span
                        className={`${
                           privacySettings.isProfilePublic ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
                        <span
                           className={`${
                              privacySettings.isProfilePublic ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                              <path
                                 d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                 stroke='currentColor'
                                 strokeWidth={2}
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                              />
                           </svg>
                        </span>
                        <span
                           className={`${
                              privacySettings.isProfilePublic ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-maple-red' fill='currentColor' viewBox='0 0 12 12'>
                              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                           </svg>
                        </span>
                     </span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <div className='flex items-center'>
                        <div className='bg-maple-red/10 p-1.5 rounded-full mr-2'>
                           <svg className='w-4 h-4 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                        </div>
                        <h3 className='text-base font-medium text-gray-900'>Show Location</h3>
                     </div>
                     <p className='text-sm text-gray-500 mt-1 ml-7'>Allow others to see your location on your profile.</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("showLocation")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        privacySettings.showLocation ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle location visibility</span>
                     <span
                        className={`${
                           privacySettings.showLocation ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
                        <span
                           className={`${
                              privacySettings.showLocation ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                              <path
                                 d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                 stroke='currentColor'
                                 strokeWidth={2}
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                              />
                           </svg>
                        </span>
                        <span
                           className={`${
                              privacySettings.showLocation ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-maple-red' fill='currentColor' viewBox='0 0 12 12'>
                              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                           </svg>
                        </span>
                     </span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h3 className='text-base font-medium text-gray-900'>Allow Tagging</h3>
                     <p className='text-sm text-gray-500'>Allow others to tag you in posts and photos.</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("allowTagging")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        privacySettings.allowTagging ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle tagging</span>
                     <span
                        className={`${
                           privacySettings.allowTagging ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
                        <span
                           className={`${
                              privacySettings.allowTagging ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                              <path
                                 d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                 stroke='currentColor'
                                 strokeWidth={2}
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                              />
                           </svg>
                        </span>
                        <span
                           className={`${
                              privacySettings.allowTagging ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-maple-red' fill='currentColor' viewBox='0 0 12 12'>
                              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                           </svg>
                        </span>
                     </span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h3 className='text-base font-medium text-gray-900'>Allow Direct Messages</h3>
                     <p className='text-sm text-gray-500'>Allow others to send you direct messages.</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("allowDirectMessages")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        privacySettings.allowDirectMessages ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle direct messages</span>
                     <span
                        className={`${
                           privacySettings.allowDirectMessages ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
                        <span
                           className={`${
                              privacySettings.allowDirectMessages ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                              <path
                                 d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                 stroke='currentColor'
                                 strokeWidth={2}
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                              />
                           </svg>
                        </span>
                        <span
                           className={`${
                              privacySettings.allowDirectMessages ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-maple-red' fill='currentColor' viewBox='0 0 12 12'>
                              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                           </svg>
                        </span>
                     </span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h3 className='text-base font-medium text-gray-900'>Show Online Status</h3>
                     <p className='text-sm text-gray-500'>Allow others to see when you're online.</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("showOnlineStatus")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        privacySettings.showOnlineStatus ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle online status</span>
                     <span
                        className={`${
                           privacySettings.showOnlineStatus ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}>
                        <span
                           className={`${
                              privacySettings.showOnlineStatus ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-gray-400' fill='none' viewBox='0 0 12 12'>
                              <path
                                 d='M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2'
                                 stroke='currentColor'
                                 strokeWidth={2}
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                              />
                           </svg>
                        </span>
                        <span
                           className={`${
                              privacySettings.showOnlineStatus ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"
                           } absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
                           aria-hidden='true'>
                           <svg className='h-3 w-3 text-maple-red' fill='currentColor' viewBox='0 0 12 12'>
                              <path d='M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z' />
                           </svg>
                        </span>
                     </span>
                  </motion.button>
               </div>
            </div>
         </div>

         <form onSubmit={handleSubmit}>
            <div className='pt-5'>
               <div className='flex justify-end'>
                  <motion.button
                     type='submit'
                     disabled={isSubmitting}
                     whileHover={isSubmitting ? {} : { scale: 1.03 }}
                     whileTap={isSubmitting ? {} : { scale: 0.98 }}
                     className={`inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                        isSubmitting ? "bg-maple-red/60 cursor-not-allowed" : "bg-maple-red hover:bg-maple-red-dark transition-colors"
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
                           Saving...
                        </>
                     ) : (
                        <>
                           <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                           </svg>
                           Save Settings
                        </>
                     )}
                  </motion.button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default PrivacySettings;
