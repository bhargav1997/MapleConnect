import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const NotFound = () => {
   return (
      <div className='min-h-screen bg-whisper-white flex items-center justify-center px-4'>
         <div className='max-w-2xl w-full'>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className='text-center'>
               {/* Decorative maple leaf */}
               <div className='mb-8'>
                  <motion.div
                     initial={{ scale: 0, rotate: -180 }}
                     animate={{ scale: 1, rotate: 0 }}
                     transition={{ duration: 0.8, type: "spring" }}
                     className='w-24 h-24 mx-auto text-maple-red'>
                     <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                     </svg>
                  </motion.div>
               </div>

               {/* 404 Text */}
               <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='text-9xl font-bold text-maple-red mb-4'>
                  404
               </motion.h1>

               {/* Message */}
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className='mb-8'>
                  <h2 className='text-3xl font-semibold text-charcoal-gray mb-4'>Page Not Found</h2>
                  <p className='text-gray-600 max-w-md mx-auto'>
                     Oops! The page you're looking for seems to have fallen off the maple tree. Let's get you back to safety.
                  </p>
               </motion.div>

               {/* Action Buttons */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <Link to='/' className='px-6 py-3 bg-maple-red text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm'>
                     Return Home
                  </Link>
                  <button
                     onClick={() => window.history.back()}
                     className='px-6 py-3 bg-white text-maple-red border border-maple-red rounded-lg hover:bg-maple-red/5 transition-colors'>
                     Go Back
                  </button>
               </motion.div>

               {/* Decorative elements */}
               <div className='absolute top-10 left-[10%] w-20 h-20 opacity-10 animate-float-slow'>
                  <svg viewBox='0 0 24 24' fill='currentColor' className='text-maple-red'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </div>
               <div className='absolute bottom-10 right-[10%] w-32 h-32 opacity-10 animate-float'>
                  <svg viewBox='0 0 24 24' fill='currentColor' className='text-maple-red'>
                     <path d='M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2Z' />
                  </svg>
               </div>
            </motion.div>
         </div>
      </div>
   );
};

export default NotFound;
