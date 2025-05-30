import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import AccountSettings from "../components/settings/AccountSettings";
import PrivacySettings from "../components/settings/PrivacySettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import { getUserInitials } from "../utils/helpers";

const Settings = () => {
   const [activeTab, setActiveTab] = useState("account");
   const { user } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      // If user is not logged in, redirect to login
      if (!user) {
         navigate("/login");
      }
   }, [user, navigate]);

   const renderTabContent = () => {
      switch (activeTab) {
         case "account":
            return <AccountSettings />;
         case "privacy":
            return <PrivacySettings />;
         case "notifications":
            return <NotificationSettings />;
         default:
            return <ProfileSettings />;
      }
   };

   // Animation variants
   const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            duration: 0.3,
            when: "beforeChildren",
            staggerChildren: 0.1,
         },
      },
   };

   const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 },
   };

   return (
      <motion.div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' initial='hidden' animate='visible' variants={containerVariants}>
         {/* Breadcrumb */}
         <nav className='mb-5 text-sm'>
            <ol className='list-none p-0 inline-flex items-center text-gray-500'>
               <li className='flex items-center'>
                  <Link to='/' className='hover:text-maple-red transition-colors'>
                     Home
                  </Link>
                  <svg className='w-3 h-3 mx-2' fill='currentColor' viewBox='0 0 20 20'>
                     <path
                        fillRule='evenodd'
                        d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                        clipRule='evenodd'
                     />
                  </svg>
               </li>
               <li className='text-maple-red font-medium'>Settings</li>
            </ol>
         </nav>

         {/* Header */}
         <motion.div className='mb-8 flex items-center' variants={itemVariants}>
            <div className='bg-maple-red/10 p-3 rounded-full mr-4'>
               <svg className='w-8 h-8 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                  />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
               </svg>
            </div>
            <div>
               <h1 className='text-3xl font-bold text-gray-900'>Settings</h1>
               <p className='text-gray-500 mt-1'>Manage your account settings and preferences</p>
            </div>
         </motion.div>

         <div className='flex flex-col lg:flex-row gap-6'>
            {/* Sidebar */}
            <motion.div className='lg:w-1/4' variants={itemVariants}>
               <div className='bg-white shadow rounded-xl overflow-hidden sticky top-20'>
                  <div className='p-5 border-b border-gray-200 bg-gray-50'>
                     <h2 className='text-lg font-medium text-gray-900'>Settings Menu</h2>
                  </div>
                  <nav className='flex flex-col p-2'>
                     <motion.button
                        onClick={() => setActiveTab("account")}
                        className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                           activeTab === "account" ? "bg-maple-red/10 text-maple-red font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        whileHover={{ x: activeTab === "account" ? 0 : 5 }}
                        whileTap={{ scale: 0.98 }}>
                        <svg
                           className={`w-5 h-5 mr-3 ${activeTab === "account" ? "text-maple-red" : "text-gray-500"}`}
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                           />
                        </svg>
                        Account Settings
                     </motion.button>

                     <motion.button
                        onClick={() => setActiveTab("privacy")}
                        className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                           activeTab === "privacy" ? "bg-maple-red/10 text-maple-red font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        whileHover={{ x: activeTab === "privacy" ? 0 : 5 }}
                        whileTap={{ scale: 0.98 }}>
                        <svg
                           className={`w-5 h-5 mr-3 ${activeTab === "privacy" ? "text-maple-red" : "text-gray-500"}`}
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                           />
                        </svg>
                        Privacy
                     </motion.button>

                     <motion.button
                        onClick={() => setActiveTab("notifications")}
                        className={`flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                           activeTab === "notifications" ? "bg-maple-red/10 text-maple-red font-medium" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        whileHover={{ x: activeTab === "notifications" ? 0 : 5 }}
                        whileTap={{ scale: 0.98 }}>
                        <svg
                           className={`w-5 h-5 mr-3 ${activeTab === "notifications" ? "text-maple-red" : "text-gray-500"}`}
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
                        Notification Preferences
                     </motion.button>
                  </nav>

                  <div className='p-5 border-t border-gray-200'>
                     <div className='flex items-center'>
                        <div className='h-10 w-10 rounded-full bg-gray-200 overflow-hidden'>
                           {user?.profileImage ? (
                              <img src={`${user.profileImage}`} alt={user.name} className='h-full w-full object-cover' />
                           ) : (
                              <div className='h-full w-full flex items-center justify-center bg-maple-red text-white'>
                                 {getUserInitials(user?.name)}
                              </div>
                           )}
                        </div>
                        <div className='ml-3'>
                           <p className='text-sm font-medium text-gray-900'>{user?.name}</p>
                           <p className='text-xs text-gray-500 truncate'>{user?.email}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Main content */}
            <motion.div className='lg:w-3/4' variants={itemVariants}>
               <AnimatePresence mode='wait'>
                  <motion.div
                     key={activeTab}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.3 }}
                     className='bg-white shadow rounded-xl overflow-hidden'>
                     {renderTabContent()}
                  </motion.div>
               </AnimatePresence>
            </motion.div>
         </div>
      </motion.div>
   );
};

export default Settings;
