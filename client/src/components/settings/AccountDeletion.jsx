import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AccountDeletion = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [verificationText, setVerificationText] = useState("");
   const [error, setError] = useState("");
   const [isDeleting, setIsDeleting] = useState(false);

   const expectedText = `delete my account ${user?.email}`;

   const handleDeleteAccount = async () => {
      if (verificationText.toLowerCase() !== expectedText.toLowerCase()) {
         setError("Verification text doesn't match. Please try again.");
         return;
      }

      setIsDeleting(true);
      setError("");

      try {
         await api.delete(`/users/${user.id}`);
         // Log out the user after successful deletion
         logout();
         // Redirect to home page
         navigate("/");
      } catch (err) {
         setError(err.response?.data?.error || "Failed to delete account. Please try again.");
         setIsDeleting(false);
      }
   };

   return (
      <div className='bg-white rounded-lg shadow p-6 mt-6'>
         <div className='flex items-center mb-6'>
            <div className='bg-red-100 p-2 rounded-full mr-3'>
               <svg className='w-6 h-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
               </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900'>Delete Account</h3>
         </div>

         <div className='prose prose-sm max-w-none text-gray-500 mb-6'>
            <p>Once you delete your account, all of your data will be permanently removed. This includes:</p>
            <ul className='list-disc list-inside space-y-1 mt-2'>
               <li>Your profile information</li>
               <li>All your posts and comments</li>
               <li>Your messages and conversations</li>
               <li>Your connections and relationships</li>
               <li>Your settings and preferences</li>
            </ul>
            <p className='mt-4 text-red-600 font-medium'>This action cannot be undone.</p>
         </div>

         <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setIsModalOpen(true)}
            className='inline-flex items-center px-4 py-2 border border-red-600 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
            Delete My Account
         </motion.button>

         {/* Delete Account Modal */}
         <AnimatePresence>
            {isModalOpen && (
               <div className='fixed inset-0 z-50 overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 transition-opacity'
                        onClick={() => !isDeleting && setIsModalOpen(false)}>
                        <div className='absolute inset-0 bg-gray-900 opacity-50'></div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className='relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 z-[60]'>
                        <div>
                           <div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100'>
                              <svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                 />
                              </svg>
                           </div>
                           <div className='mt-3 text-center sm:mt-5'>
                              <h3 className='text-lg leading-6 font-medium text-gray-900'>Confirm Account Deletion</h3>
                              <div className='mt-2'>
                                 <p className='text-sm text-gray-500'>To confirm deletion, please type:</p>
                                 <p className='mt-1 text-sm font-mono bg-gray-50 p-2 rounded border border-gray-200'>{expectedText}</p>
                                 <div className='mt-3'>
                                    <input
                                       type='text'
                                       value={verificationText}
                                       onChange={(e) => setVerificationText(e.target.value)}
                                       placeholder='Type the verification text'
                                       className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 bg-white'
                                       disabled={isDeleting}
                                    />
                                 </div>
                                 {error && <p className='mt-2 text-sm text-red-600'>{error}</p>}
                              </div>
                           </div>
                        </div>
                        <div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense'>
                           <button
                              type='button'
                              onClick={handleDeleteAccount}
                              disabled={isDeleting}
                              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 disabled:opacity-50 disabled:cursor-not-allowed'>
                              {isDeleting ? "Deleting..." : "Delete Account"}
                           </button>
                           <button
                              type='button'
                              onClick={() => !isDeleting && setIsModalOpen(false)}
                              disabled={isDeleting}
                              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 disabled:opacity-50 disabled:cursor-not-allowed'>
                              Cancel
                           </button>
                        </div>
                     </motion.div>
                  </div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default AccountDeletion;
