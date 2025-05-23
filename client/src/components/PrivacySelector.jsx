import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PrivacySelector = ({ selectedPrivacy, onSelect, onClose }) => {
   const privacyOptions = [
      {
         value: "public",
         label: "Public",
         description: "Anyone can see this post",
         icon: (
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
               <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
               />
            </svg>
         ),
      },
      {
         value: "friends",
         label: "Friends Only",
         description: "Only your friends can see this post",
         icon: (
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
               <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
               />
            </svg>
         ),
      },
      {
         value: "private",
         label: "Only Me",
         description: "Only you can see this post",
         icon: (
            <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
               <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={1.5}
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
               />
            </svg>
         ),
      },
   ];

   return (
      <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         className='absolute z-50 left-0 right-0 mt-3 p-4 bg-white rounded-xl shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto mx-auto max-w-[90%] w-[500px]'>
         <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center'>
               <div className='w-8 h-8 rounded-full bg-maple-red/15 flex items-center justify-center mr-2'>
                  <svg className='w-5 h-5 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                     />
                  </svg>
               </div>
               <h3 className='text-base font-medium text-gray-800'>Post Privacy</h3>
            </div>
            <button type='button' onClick={onClose} className='text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100'>
               <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
               </svg>
            </button>
         </div>

         <div className='space-y-2'>
            {privacyOptions.map((option) => (
               <motion.button
                  key={option.value}
                  type='button'
                  onClick={() => {
                     onSelect(option.value);
                     onClose();
                  }}
                  className={`w-full p-3 rounded-lg text-left flex items-start gap-3 ${
                     selectedPrivacy === option.value ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <div
                     className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedPrivacy === option.value ? "bg-maple-red/20" : "bg-gray-100"
                     }`}>
                     {option.icon}
                  </div>
                  <div>
                     <h4 className='font-medium'>{option.label}</h4>
                     <p className='text-sm text-gray-500'>{option.description}</p>
                  </div>
                  {selectedPrivacy === option.value && (
                     <div className='ml-auto'>
                        <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                        </svg>
                     </div>
                  )}
               </motion.button>
            ))}
         </div>
      </motion.div>
   );
};

export default PrivacySelector;
