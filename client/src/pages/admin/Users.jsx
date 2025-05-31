import { useState, useEffect } from "react";
import { getAllUsers, deleteUser } from "../../services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const Users = () => {
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [deleteConfirm, setDeleteConfirm] = useState(null);
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      try {
         const response = await getAllUsers();
         setUsers(response.data);
      } catch (err) {
         setError(err.response?.data?.error || "Failed to fetch users");
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteUser = async (userId) => {
      try {
         await deleteUser(userId);
         setUsers(users.filter((user) => user._id !== userId));
         setDeleteConfirm(null);
      } catch (err) {
         setError(err.response?.data?.error || "Failed to delete user");
      }
   };

   const filteredUsers = users.filter(
      (user) =>
         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         user.email.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   if (loading) {
      return (
         <div className='flex items-center justify-center h-96'>
            <div className='w-16 h-16 border-4 border-maple-red border-t-transparent rounded-full animate-spin'></div>
         </div>
      );
   }

   return (
      <div className='space-y-6'>
         {error && (
            <div className='p-4 text-red-600 bg-red-50 rounded-lg'>
               <p>{error}</p>
            </div>
         )}

         {/* Search Bar */}
         <div className='flex items-center space-x-4'>
            <div className='flex-1'>
               <input
                  type='text'
                  placeholder='Search users...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-maple-red focus:border-maple-red'
               />
            </div>
            <div className='text-sm text-gray-500'>{filteredUsers.length} users found</div>
         </div>

         {/* Users Table */}
         <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
            <table className='min-w-full divide-y divide-gray-200'>
               <thead className='bg-gray-50'>
                  <tr>
                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>User</th>
                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Joined</th>
                     <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                  </tr>
               </thead>
               <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredUsers.map((user) => (
                     <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td className='px-6 py-4 whitespace-nowrap'>
                           <div className='flex items-center'>
                              <div className='h-10 w-10 flex-shrink-0'>
                                 <img className='h-10 w-10 rounded-full object-cover' src={user.profileImage} alt={user.name} />
                              </div>
                              <div className='ml-4'>
                                 <div className='text-sm font-medium text-gray-900'>{user.name}</div>
                                 <div className='text-sm text-gray-500'>@{user.username}</div>
                              </div>
                           </div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                           <div className='text-sm text-gray-900'>{user.email}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap'>
                           <div className='text-sm text-gray-900'>{format(new Date(user.createdAt), "MMM d, yyyy")}</div>
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                           <button onClick={() => setDeleteConfirm(user)} className='text-red-600 hover:text-red-900'>
                              Delete
                           </button>
                        </td>
                     </motion.tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Delete Confirmation Modal */}
         <AnimatePresence>
            {deleteConfirm && (
               <div className='fixed inset-0 z-[100] overflow-y-auto'>
                  <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center'>
                     <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='fixed inset-0 transition-opacity'
                        onClick={() => setDeleteConfirm(null)}>
                        <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className='relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg z-[110]'>
                        <div className='sm:flex sm:items-start'>
                           <div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
                              <svg className='h-6 w-6 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                 />
                              </svg>
                           </div>
                           <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                              <h3 className='text-lg font-medium text-gray-900'>Delete User Account</h3>
                              <div className='mt-2'>
                                 <p className='text-sm text-gray-500'>
                                    Are you sure you want to delete {deleteConfirm.name}'s account? This action cannot be undone and will
                                    delete all associated data including:
                                 </p>
                                 <ul className='mt-2 text-sm text-gray-500 list-disc list-inside'>
                                    <li>User profile and settings</li>
                                    <li>All posts and comments</li>
                                    <li>Messages and conversations</li>
                                    <li>Notifications</li>
                                    <li>Group memberships</li>
                                    <li>Following/follower relationships</li>
                                 </ul>
                              </div>
                           </div>
                        </div>
                        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                           <button
                              type='button'
                              onClick={() => handleDeleteUser(deleteConfirm._id)}
                              className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm'>
                              Delete
                           </button>
                           <button
                              type='button'
                              onClick={() => setDeleteConfirm(null)}
                              className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red sm:mt-0 sm:w-auto sm:text-sm'>
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

export default Users;
