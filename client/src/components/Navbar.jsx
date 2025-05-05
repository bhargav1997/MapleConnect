import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./search/SearchBar";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { motion } from "framer-motion";

const Navbar = () => {
   const { user, isAuthenticated, logout } = useAuth();
   const location = useLocation();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [scrolled, setScrolled] = useState(false);

   useEffect(() => {
      const handleScroll = () => {
         const isScrolled = window.scrollY > 10;
         if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
         }
      };

      window.addEventListener("scroll", handleScroll);
      return () => {
         window.removeEventListener("scroll", handleScroll);
      };
   }, [scrolled]);

   const isActive = (path) => {
      return location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
   };

   return (
      <motion.nav
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "bg-white shadow-md border-b border-gray-200" : "bg-white/95 backdrop-blur-md"
         }`}
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         transition={{ duration: 0.3, ease: "easeOut" }}>
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16'>
               <div className='flex'>
                  <div className='flex-shrink-0 flex items-center'>
                     <Link to='/' className='flex items-center group'>
                        <motion.div
                           whileHover={{ rotate: 10 }}
                           transition={{ type: "spring", stiffness: 400, damping: 10 }}
                           className='relative'>
                           <svg className='h-9 w-9 text-maple-red mr-2 drop-shadow-sm' viewBox='0 0 24 24' fill='currentColor'>
                              <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                           </svg>
                        </motion.div>
                        <div className='text-xl font-bold text-charcoal-gray group-hover:text-gray-800 transition-colors'>
                           <span className='text-maple-red group-hover:text-maple-red-dark transition-colors'>Maple</span>Connect
                        </div>
                     </Link>
                  </div>
                  {isAuthenticated && (
                     <>
                        <div className='hidden sm:ml-6 sm:flex sm:space-x-1'>
                           {[
                              {
                                 path: "/",
                                 label: "Home",
                                 icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                              },
                              {
                                 path: "/groups",
                                 label: "Circles",
                                 icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                              },
                              {
                                 path: "/events",
                                 label: "Events",
                                 icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                              },
                              {
                                 path: "/marketplace",
                                 label: "Exchange",
                                 icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                              },
                           ].map((item) => (
                              <Link
                                 key={item.path}
                                 to={item.path}
                                 className={`${
                                    isActive(item.path)
                                       ? "text-maple-red border-maple-red font-semibold"
                                       : "text-gray-600 border-transparent hover:text-maple-red hover:border-maple-red/30"
                                 } flex items-center px-3 py-2 text-sm font-medium border-b-2 transition-all duration-200`}>
                                 <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`${isActive(item.path) ? "text-maple-red" : "text-gray-500"}`}>
                                    <svg
                                       xmlns='http://www.w3.org/2000/svg'
                                       className='h-5 w-5 mr-1.5'
                                       fill='none'
                                       viewBox='0 0 24 24'
                                       stroke='currentColor'>
                                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={item.icon} />
                                    </svg>
                                 </motion.div>
                                 {item.label}
                              </Link>
                           ))}
                        </div>
                        <div className='hidden md:block md:ml-4 md:flex md:items-center'>
                           <SearchBar />
                        </div>
                     </>
                  )}
               </div>

               {/* Mobile menu button */}
               <div className='flex items-center sm:hidden'>
                  <button
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                     <span className='sr-only'>Open main menu</span>
                     {isMobileMenuOpen ? (
                        <svg
                           className='block h-6 w-6'
                           xmlns='http://www.w3.org/2000/svg'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'
                           aria-hidden='true'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     ) : (
                        <svg
                           className='block h-6 w-6'
                           xmlns='http://www.w3.org/2000/svg'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'
                           aria-hidden='true'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                        </svg>
                     )}
                  </button>
               </div>

               <div className='hidden sm:ml-6 sm:flex sm:items-center'>
                  {isAuthenticated ? (
                     <div className='flex items-center space-x-3'>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Link
                              to='/messages'
                              className={`p-2 rounded-full transition-colors shadow-sm ${
                                 isActive("/messages")
                                    ? "text-maple-red  shadow-inner"
                                    : "text-gray-500 hover:text-maple-red "
                              }`}>
                              <svg
                                 xmlns='http://www.w3.org/2000/svg'
                                 className='h-6 w-6'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                                 />
                              </svg>
                           </Link>
                        </motion.div>

                        <NotificationDropdown />

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <Link
                              to='/settings'
                              className={`p-2 rounded-full transition-colors shadow-sm ${
                                 isActive("/settings")
                                    ? "text-maple-red  shadow-inner"
                                    : "text-gray-500 hover:text-maple-red "
                              }`}>
                              <svg
                                 xmlns='http://www.w3.org/2000/svg'
                                 className='h-6 w-6'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
                                 />
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                 />
                              </svg>
                           </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='relative ml-2'>
                           <Link to={`/profile/${user?.id}`}>
                              <div
                                 className={`h-10 w-10 rounded-full overflow-hidden border-2 transition-all shadow-sm ${
                                    isActive(`/profile/${user?.id}`)
                                       ? "border-maple-red ring-2 ring-maple-red/20"
                                       : "border-transparent hover:border-maple-red/50"
                                 }`}>
                                 {user?.profilePicture ? (
                                    <img
                                       className='h-full w-full object-cover'
                                       src={user.profilePicture}
                                       alt={user?.name || "User profile"}
                                    />
                                 ) : (
                                    <div className='h-full w-full flex items-center justify-center bg-gradient-to-br from-maple-red/80 to-maple-red'>
                                       <span className='text-lg font-bold text-white'>{user?.name?.charAt(0).toUpperCase() || "M"}</span>
                                    </div>
                                 )}
                              </div>
                           </Link>
                        </motion.div>

                        <motion.button
                           whileHover={{ scale: 1.05, color: "#D32F2F" }}
                           whileTap={{ scale: 0.95 }}
                           onClick={logout}
                           className='ml-2 flex items-center text-sm font-medium text-gray-700 hover:text-maple-red transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-1'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                              />
                           </svg>
                           Logout
                        </motion.button>
                     </div>
                  ) : (
                     <div className='flex space-x-4'>
                        <Link
                           to='/login'
                           className='text-gray-700 hover:text-maple-red px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
                           Sign in
                        </Link>
                        <Link
                           to='/register'
                           className='bg-maple-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow'>
                           Join now
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Mobile menu */}
         {isMobileMenuOpen && (
            <motion.div
               className='sm:hidden bg-white shadow-lg rounded-b-xl overflow-hidden border-t border-gray-100'
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               exit={{ opacity: 0, height: 0 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}>
               {isAuthenticated ? (
                  <div className='pt-2 pb-3 space-y-0 divide-y divide-gray-100'>
                     {[
                        {
                           path: "/",
                           label: "Home",
                           icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                        },
                        {
                           path: "/groups",
                           label: "Neighbourhood Circles",
                           icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                        },
                        {
                           path: "/events",
                           label: "Local Gatherings",
                           icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
                        },
                        {
                           path: "/marketplace",
                           label: "Local Exchange",
                           icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
                        },
                        {
                           path: "/messages",
                           label: "Messages",
                           icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
                        },
                        {
                           path: "/notifications",
                           label: "Notifications",
                           icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
                        },
                        {
                           path: `/profile/${user?.id}`,
                           label: `Profile${user?.name ? ` (${user.name})` : ""}`,
                           icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                        },
                        {
                           path: "/settings",
                           label: "Settings",
                           icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
                        },
                     ].map((item) => (
                        <Link
                           key={item.path}
                           to={item.path}
                           className={`flex items-center px-4 py-3 ${
                              isActive(item.path)
                                 ? " text-maple-red font-medium"
                                 : "text-gray-700 hover:bg-gray-50 hover:text-maple-red"
                           } transition-colors duration-200`}
                           onClick={() => setIsMobileMenuOpen(false)}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-3'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d={item.icon} />
                           </svg>
                           <span className='font-medium'>{item.label}</span>
                        </Link>
                     ))}

                     <button
                        onClick={() => {
                           setIsMobileMenuOpen(false);
                           logout();
                        }}
                        className='flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-maple-red transition-colors duration-200'>
                        <svg
                           xmlns='http://www.w3.org/2000/svg'
                           className='h-5 w-5 mr-3'
                           fill='none'
                           viewBox='0 0 24 24'
                           stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
                           />
                        </svg>
                        <span className='font-medium'>Logout</span>
                     </button>
                  </div>
               ) : (
                  <div className='p-4 flex flex-col space-y-3'>
                     <Link
                        to='/login'
                        className='w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-maple-red bg-white hover:bg-gray-50 border-maple-red'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Sign in
                     </Link>
                     <Link
                        to='/register'
                        className='w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maple-red hover:bg-red-700'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Join now
                     </Link>
                     <Link
                        to='/support'
                        className='w-full text-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-maple-red'
                        onClick={() => setIsMobileMenuOpen(false)}>
                        Support
                     </Link>
                  </div>
               )}
            </motion.div>
         )}
      </motion.nav>
   );
};

export default Navbar;
