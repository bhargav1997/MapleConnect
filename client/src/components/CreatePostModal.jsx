import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { searchUsers } from "../services/userService";
import CreatePostForm from "./CreatePostForm";
import PrivacySelector from "./PrivacySelector";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
   const { user } = useAuth();
   const [visibility, setVisibility] = useState("public");
   const [showPrivacySelector, setShowPrivacySelector] = useState(false);

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
                           <div className='relative'>
                              <button
                                 type='button'
                                 onClick={() => setShowPrivacySelector(!showPrivacySelector)}
                                 className='flex items-center text-xs text-gray-500 hover:text-maple-red transition-colors py-1 px-1 rounded-md hover:bg-gray-50'>
                                 {visibility === "public" && (
                                    <>
                                       <svg className='w-3 h-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                          />
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                                          />
                                       </svg>
                                       Public
                                    </>
                                 )}

                                 {visibility === "friends" && (
                                    <>
                                       <svg className='w-3 h-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
                                          />
                                       </svg>
                                       Friends Only
                                    </>
                                 )}

                                 {visibility === "private" && (
                                    <>
                                       <svg className='w-3 h-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={2}
                                             d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                                          />
                                       </svg>
                                       Only Me
                                    </>
                                 )}

                                 <svg className='w-3 h-3 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                 </svg>
                              </button>

                              <AnimatePresence>
                                 {showPrivacySelector && (
                                    <PrivacySelector
                                       visibility={visibility}
                                       setVisibility={setVisibility}
                                       onClose={() => setShowPrivacySelector(false)}
                                    />
                                 )}
                              </AnimatePresence>
                           </div>
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
