import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoIcon from "../../assets/logo-icon.svg";

const AuthLayout = ({ children, title, subtitle, isLoginPage = false }) => {
   return (
      <div className='min-h-screen flex flex-col md:flex-row'>
         {/* Left side - Image */}
         <div className='hidden md:block md:w-1/2 relative overflow-hidden'>
            <div className='absolute inset-0 bg-gradient-to-r from-maple-red/90 to-maple-red/70'></div>

            <div className='absolute inset-0 flex flex-col justify-center items-center text-white p-12'>
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className='mb-8'>
                  <img src={logoIcon} alt='MapleConnect Logo' className='w-20 h-20' />
               </motion.div>

               <motion.h1
                  className='text-4xl font-bold mb-6 text-center'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}>
                  Welcome to MapleConnect
               </motion.h1>

               <motion.p
                  className='text-xl text-center max-w-md'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}>
                  Connect with your Canadian community through local events, neighborhood circles, and community exchanges.
               </motion.p>

               <motion.div
                  className='mt-12 space-y-4'
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}>
                  <div className='flex items-center mb-4'>
                     <div className='bg-white/20 p-2 rounded-full mr-4'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                     </div>
                     <div>
                        <h3 className='font-semibold'>Connect with Neighbors</h3>
                        <p className='text-sm text-white/80'>Build meaningful relationships in your community</p>
                     </div>
                  </div>

                  <div className='flex items-center mb-4'>
                     <div className='bg-white/20 p-2 rounded-full mr-4'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                           />
                        </svg>
                     </div>
                     <div>
                        <h3 className='font-semibold'>Discover Local Events</h3>
                        <p className='text-sm text-white/80'>Find and join events happening near you</p>
                     </div>
                  </div>

                  <div className='flex items-center'>
                     <div className='bg-white/20 p-2 rounded-full mr-4'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                           />
                        </svg>
                     </div>
                     <div>
                        <h3 className='font-semibold'>Community Marketplace</h3>
                        <p className='text-sm text-white/80'>Share resources and support local businesses</p>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>

         {/* Right side - Form */}
         <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 bg-gray-50'>
            <div className='w-full max-w-md'>
               <div className='mb-8 text-center'>
                  <Link to='/' className='inline-block mb-6 md:hidden'>
                     <img src={logoIcon} alt='MapleConnect Logo' className='w-12 h-12 mx-auto' />
                  </Link>

                  <h2 className='text-3xl font-bold text-gray-900 mb-2'>{title}</h2>
                  {subtitle && <p className='text-gray-600'>{subtitle}</p>}
               </div>

               <div className='bg-white rounded-xl shadow-sm p-8 border border-gray-100'>{children}</div>

               <div className='mt-6 text-center text-gray-600 text-sm'>
                  {isLoginPage ? (
                     <p>
                        Don't have an account?{" "}
                        <Link to='/register' className='text-maple-red font-medium hover:underline'>
                           Sign up
                        </Link>
                     </p>
                  ) : (
                     <p>
                        Already have an account?{" "}
                        <Link to='/login' className='text-maple-red font-medium hover:underline'>
                           Sign in
                        </Link>
                     </p>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default AuthLayout;
