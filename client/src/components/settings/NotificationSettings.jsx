import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const NotificationSettings = () => {
   const { user, updateUserContext } = useAuth();

   const [notificationSettings, setNotificationSettings] = useState({
      newFollower: true,
      postLike: true,
      postComment: true,
      commentReply: true,
      groupInvite: true,
      groupJoin: true,
      eventInvite: true,
      eventUpdate: true,
      message: true,
      marketplaceInterest: true,
      emailNotifications: true,
      pushNotifications: false,
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
      // Load user's notification settings if available
      if (user && user.notificationSettings) {
         setNotificationSettings({
            ...notificationSettings,
            ...user.notificationSettings,
         });
      }
   }, [user]);

   const handleToggle = (setting) => {
      setNotificationSettings({
         ...notificationSettings,
         [setting]: !notificationSettings[setting],
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      try {
         // Update notification settings
         const response = await axios.put(`/api/users/${user.id}/notifications`, {
            notificationSettings,
         });

         // Update user context with new notification settings
         updateUserContext({
            ...user,
            notificationSettings: response.data.data.notificationSettings,
         });

         setSuccess("Notification settings updated successfully");
      } catch (err) {
         setError(err.response?.data?.error || "Failed to update notification settings. Please try again.");
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
                     d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
               </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>Notification Preferences</h2>
         </div>

         <p className='text-gray-500 mb-6'>Control which notifications you receive and how they are delivered to you.</p>

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
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Notification Types</h3>
            <div className='space-y-5'>
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
                        <h4 className='text-base font-medium text-gray-900'>New Followers</h4>
                     </div>
                     <p className='text-sm text-gray-500 mt-1 ml-7'>Notify me when someone follows me</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("newFollower")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.newFollower ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle new follower notifications</span>
                     <span
                        className={`${
                           notificationSettings.newFollower ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Post Likes</h4>
                     <p className='text-sm text-gray-500'>Notify me when someone likes my post</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("postLike")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.postLike ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle post like notifications</span>
                     <span
                        className={`${
                           notificationSettings.postLike ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Post Comments</h4>
                     <p className='text-sm text-gray-500'>Notify me when someone comments on my post</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("postComment")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.postComment ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle post comment notifications</span>
                     <span
                        className={`${
                           notificationSettings.postComment ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Comment Replies</h4>
                     <p className='text-sm text-gray-500'>Notify me when someone replies to my comment</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("commentReply")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.commentReply ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle comment reply notifications</span>
                     <span
                        className={`${
                           notificationSettings.commentReply ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Group Invites</h4>
                     <p className='text-sm text-gray-500'>Notify me when I'm invited to a group</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("groupInvite")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.groupInvite ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle group invite notifications</span>
                     <span
                        className={`${
                           notificationSettings.groupInvite ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Event Invites</h4>
                     <p className='text-sm text-gray-500'>Notify me when I'm invited to an event</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("eventInvite")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.eventInvite ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle event invite notifications</span>
                     <span
                        className={`${
                           notificationSettings.eventInvite ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Direct Messages</h4>
                     <p className='text-sm text-gray-500'>Notify me when I receive a direct message</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("message")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.message ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle message notifications</span>
                     <span
                        className={`${
                           notificationSettings.message ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>

               <div className='flex items-center justify-between'>
                  <div>
                     <h4 className='text-base font-medium text-gray-900'>Marketplace Interest</h4>
                     <p className='text-sm text-gray-500'>Notify me when someone is interested in my marketplace listing</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("marketplaceInterest")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.marketplaceInterest ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle marketplace interest notifications</span>
                     <span
                        className={`${
                           notificationSettings.marketplaceInterest ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
                  </motion.button>
               </div>
            </div>
         </div>

         <div className='bg-white rounded-xl border border-gray-200 p-6 mt-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Notification Channels</h3>
            <div className='space-y-5'>
               <div className='flex items-center justify-between'>
                  <div>
                     <div className='flex items-center'>
                        <div className='bg-maple-red/10 p-1.5 rounded-full mr-2'>
                           <svg className='w-4 h-4 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                              />
                           </svg>
                        </div>
                        <h4 className='text-base font-medium text-gray-900'>Email Notifications</h4>
                     </div>
                     <p className='text-sm text-gray-500 mt-1 ml-7'>Receive notifications via email</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("emailNotifications")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.emailNotifications ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle email notifications</span>
                     <span
                        className={`${
                           notificationSettings.emailNotifications ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
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
                                 d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                              />
                           </svg>
                        </div>
                        <h4 className='text-base font-medium text-gray-900'>Push Notifications</h4>
                     </div>
                     <p className='text-sm text-gray-500 mt-1 ml-7'>Receive push notifications on your device</p>
                  </div>
                  <motion.button
                     type='button'
                     onClick={() => handleToggle("pushNotifications")}
                     whileTap={{ scale: 0.95 }}
                     className={`${
                        notificationSettings.pushNotifications ? "bg-maple-red" : "bg-gray-200"
                     } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red`}>
                     <span className='sr-only'>Toggle push notifications</span>
                     <span
                        className={`${
                           notificationSettings.pushNotifications ? "translate-x-5" : "translate-x-0"
                        } pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}></span>
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

export default NotificationSettings;
