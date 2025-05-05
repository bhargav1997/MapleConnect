import React from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "./AnimatedBackground";
import CanadianLandscape from "./CanadianLandscape";

const AuthCard = ({ children, title, subtitle }) => {
   return (
      <div className='min-h-screen bg-gradient-to-br from-whisper-white to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden'>
         {/* Animated backgrounds - layered for depth */}
         <CanadianLandscape />
         <AnimatedBackground />

         {/* Logo */}
         <motion.div
            className='absolute top-8 left-1/2 transform -translate-x-1/2 z-10'
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className='flex items-center justify-center'>
               <motion.div
                  className='w-10 h-10 text-maple-red mr-2'
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
                  <svg viewBox='0 0 24 24' fill='currentColor'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </motion.div>
               <motion.span
                  className='text-2xl font-bold text-charcoal-gray'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}>
                  MapleConnect
               </motion.span>
            </div>
         </motion.div>

         <motion.div
            className='sm:mx-auto sm:w-full sm:max-w-md relative z-10'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <div className='text-center'>
               <motion.h2
                  className='mt-6 text-center text-3xl font-extrabold text-charcoal-gray'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}>
                  {title}
               </motion.h2>
               {subtitle && (
                  <motion.p
                     className='mt-2 text-center text-sm text-gray-600'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     transition={{ duration: 0.5, delay: 0.3 }}>
                     {subtitle}
                  </motion.p>
               )}
            </div>
         </motion.div>

         <motion.div
            className='mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <motion.div
               className='bg-white py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 transition-all duration-300 hover:shadow-xl backdrop-blur-sm bg-white/95 border border-gray-100'
               whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 0.2 }}>
               {children}
            </motion.div>
         </motion.div>
      </div>
   );
};

export default AuthCard;
