   import { useState, useRef, useEffect } from "react";
   import { useAuth } from "../context/AuthContext";
   import { motion, AnimatePresence } from "framer-motion";
   import CreatePostForm from "./CreatePostForm";

   const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
      const { user } = useAuth();
      const [visibility, setVisibility] = useState("public");

      // If the modal is clicked outside, close it
      const modalRef = useRef(null);

      useEffect(() => {
         const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
               onClose();
            }
         };

         if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            // Prevent scrolling when modal is open
            document.body.style.overflow = "hidden";
         }

         return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            // Re-enable scrolling when modal is closed
            document.body.style.overflow = "auto";
         };
      }, [isOpen, onClose]);

      // Handle successful post creation
      const handlePostCreated = () => {
         onPostCreated();
         onClose();
      };

      return (
         <AnimatePresence>
            {isOpen && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'>
                  <motion.div
                     ref={modalRef}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ type: "spring", damping: 25, stiffness: 300 }}
                     className='bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden'>
                     {/* Modal Header */}
                     <div className='relative border-b border-gray-200'>
                        <div className='px-6 py-4 text-center'>
                           <h2 className='text-xl font-bold text-charcoal-gray'>Create Post</h2>
                        </div>
                        <button
                           onClick={onClose}
                           className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>

                     {/* User Info */}
                     <div className='px-6 py-3 border-b border-gray-200'>
                        <div className='flex items-center'>
                           <div className='flex-shrink-0'>
                              {user?.profilePicture ? (
                                 <img
                                    className='h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm'
                                    src={user.profilePicture}
                                    alt={user?.name}
                                 />
                              ) : (
                                 <div className='h-10 w-10 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white font-bold shadow-sm'>
                                    {user?.name?.charAt(0).toUpperCase() || "M"}
                                 </div>
                              )}
                           </div>
                           <div className='ml-3'>
                              <p className='text-sm font-medium text-charcoal-gray'>{user?.name || "MapleConnect User"}</p>
                           </div>
                        </div>
                     </div>

                     {/* Post Form */}
                     <div className='p-6'>
                        <CreatePostForm onPostCreated={handlePostCreated} isInModal={true} initialVisibility={visibility} />
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      );
   };

   export default CreatePostModal;
