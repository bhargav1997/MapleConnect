import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
   getNotificationsStart,
   getNotificationsSuccess,
   getNotificationsFailure,
   markAllAsReadStart,
   markAllAsReadSuccess,
   markAllAsReadFailure,
   deleteAllNotificationsStart,
   deleteAllNotificationsSuccess,
   deleteAllNotificationsFailure,
} from "../../redux/slices/notificationSlice";
import { getNotifications, markAllAsRead, deleteAllNotifications } from "../../services/notificationService";
import NotificationItem from "./NotificationItem";
import { motion } from "framer-motion";

const NotificationDropdown = () => {
   const [isOpen, setIsOpen] = useState(false);
   const dropdownRef = useRef(null);
   const dispatch = useDispatch();

   const { notifications, unreadCount, isLoading, error } = useSelector((state) => state.notification);

   useEffect(() => {
      const fetchNotifications = async () => {
         try {
            dispatch(getNotificationsStart());
            const response = await getNotifications();
            dispatch(getNotificationsSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load notifications";
            dispatch(getNotificationsFailure(message));
         }
      };

      fetchNotifications();

      // Set up polling for new notifications (every 30 seconds)
      const interval = setInterval(fetchNotifications, 30000);

      return () => clearInterval(interval);
   }, [dispatch]);

   useEffect(() => {
      // Add event listener to close dropdown when clicking outside
      const handleClickOutside = (event) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   const handleMarkAllAsRead = async () => {
      try {
         dispatch(markAllAsReadStart());
         await markAllAsRead();
         dispatch(markAllAsReadSuccess());
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to mark all as read";
         dispatch(markAllAsReadFailure(message));
      }
   };

   const handleClearAll = async () => {
      try {
         dispatch(deleteAllNotificationsStart());
         await deleteAllNotifications();
         dispatch(deleteAllNotificationsSuccess());
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to clear notifications";
         dispatch(deleteAllNotificationsFailure(message));
      }
   };

   return (
      <div className='relative' ref={dropdownRef}>
         <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
               onClick={() => setIsOpen(!isOpen)}
               className={`relative p-2 rounded-full transition-colors shadow-sm ${
                  isOpen ? "text-maple-red bg-maple-red/10 shadow-inner" : "text-gray-500 hover:text-maple-red hover:bg-gray-100"
               }`}>
               <span className='sr-only'>View notifications</span>
               <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
               </svg>

               {unreadCount > 0 && (
                  <motion.span
                     initial={{ scale: 0.5, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className='absolute top-0 right-0 block h-3 w-3 rounded-full bg-maple-red ring-2 ring-white'
                  />
               )}
            </button>
         </motion.div>

         {isOpen && (
            <motion.div
               initial={{ opacity: 0, y: -10, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -10, scale: 0.95 }}
               transition={{ duration: 0.2 }}
               className='origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-lg bg-white border border-gray-100 focus:outline-none z-50 overflow-hidden'>
               <div className='py-1'>
                  <div className='px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-whisper-white to-white'>
                     <div className='flex justify-between items-center'>
                        <h3 className='text-sm font-medium text-charcoal-gray'>Notifications</h3>
                        <div className='flex space-x-3'>
                           {unreadCount > 0 && (
                              <motion.button
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={handleMarkAllAsRead}
                                 className='text-xs text-maple-red hover:text-maple-red-dark font-medium'>
                                 Mark all as read
                              </motion.button>
                           )}
                           {notifications.length > 0 && (
                              <motion.button
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={handleClearAll}
                                 className='text-xs text-gray-500 hover:text-gray-700 font-medium'>
                                 Clear all
                              </motion.button>
                           )}
                        </div>
                     </div>
                  </div>

                  <div className='max-h-96 overflow-y-auto'>
                     {isLoading && notifications.length === 0 ? (
                        <div className='px-4 py-6 text-center'>
                           <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maple-red mx-auto'></div>
                           <p className='mt-2 text-sm text-gray-500'>Loading notifications...</p>
                        </div>
                     ) : error ? (
                        <div className='px-4 py-6 text-center'>
                           <svg
                              className='mx-auto h-8 w-8 text-maple-red'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           <p className='mt-2 text-sm text-gray-500'>{error}</p>
                        </div>
                     ) : notifications.length === 0 ? (
                        <div className='px-4 py-8 text-center'>
                           <svg
                              className='mx-auto h-10 w-10 text-gray-300'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                              />
                           </svg>
                           <p className='mt-3 text-sm text-gray-500 font-medium'>No notifications yet</p>
                           <p className='text-xs text-gray-400 mt-1'>When you receive notifications, they'll appear here</p>
                        </div>
                     ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ staggerChildren: 0.05 }}>
                           {notifications.map((notification) => (
                              <motion.div key={notification._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                 <NotificationItem notification={notification} />
                              </motion.div>
                           ))}
                        </motion.div>
                     )}
                  </div>

                  <div className='border-t border-gray-100 px-4 py-3 bg-gradient-to-r from-whisper-white to-white'>
                     <Link
                        to='/notifications'
                        className='block text-center text-sm text-maple-red hover:text-maple-red-dark font-medium flex items-center justify-center'
                        onClick={() => setIsOpen(false)}>
                        <span>View all notifications</span>
                        <svg className='w-4 h-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                     </Link>
                  </div>
               </div>
            </motion.div>
         )}
      </div>
   );
};

export default NotificationDropdown;
