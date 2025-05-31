import { useState, useEffect } from "react";
import { getReportedPosts, deletePost } from "../../services/adminService";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const ReportedPosts = () => {
   const [posts, setPosts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [deleteConfirm, setDeleteConfirm] = useState(null);

   useEffect(() => {
      fetchPosts();
   }, []);

   const fetchPosts = async () => {
      try {
         const response = await getReportedPosts();
         setPosts(response.data);
      } catch (err) {
         setError(err.response?.data?.error || "Failed to fetch reported posts");
      } finally {
         setLoading(false);
      }
   };

   const handleDeletePost = async (postId) => {
      try {
         await deletePost(postId);
         setPosts(posts.filter((post) => post._id !== postId));
         setDeleteConfirm(null);
      } catch (err) {
         setError(err.response?.data?.error || "Failed to delete post");
      }
   };

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

         {/* Posts Grid */}
         <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {posts.map((post) => (
               <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='bg-white rounded-lg shadow-sm overflow-hidden'>
                  {/* Post Header */}
                  <div className='p-4 border-b border-gray-200'>
                     <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                           <img src={post.user.profileImage} alt={post.user.name} className='w-10 h-10 rounded-full object-cover' />
                           <div className='ml-3'>
                              <p className='text-sm font-medium text-gray-900'>{post.user.name}</p>
                              <p className='text-xs text-gray-500'>@{post.user.username}</p>
                           </div>
                        </div>
                        <div className='text-xs text-gray-500'>{format(new Date(post.createdAt), "MMM d, yyyy")}</div>
                     </div>
                  </div>

                  {/* Post Content */}
                  <div className='p-4'>
                     <p className='text-sm text-gray-600'>{post.content}</p>
                     {post.image && <img src={post.image} alt='Post content' className='mt-3 rounded-lg w-full h-48 object-cover' />}
                  </div>

                  {/* Reports Section */}
                  <div className='p-4 bg-red-50'>
                     <h4 className='text-sm font-medium text-red-800 mb-2'>Reports ({post.reports.length})</h4>
                     <div className='space-y-2'>
                        {post.reports.map((report, index) => (
                           <div key={index} className='text-xs bg-white p-2 rounded-lg border border-red-100'>
                              <div className='flex items-center text-red-600 mb-1'>
                                 <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                                    />
                                 </svg>
                                 <span className='font-medium'>Reported by {report.user.name}</span>
                              </div>
                              <p className='text-gray-700 pl-5'>{report.reason}</p>
                              <div className='text-gray-400 text-[10px] pl-5 mt-1'>
                                 {format(new Date(report.createdAt), "MMM d, yyyy 'at' h:mm a")}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Actions */}
                  <div className='p-4 bg-gray-50'>
                     <button
                        onClick={() => setDeleteConfirm(post)}
                        className='w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'>
                        Delete Post
                     </button>
                  </div>
               </motion.div>
            ))}
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
                        className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity'
                     />

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
                              <h3 className='text-lg font-medium text-gray-900'>Delete Post</h3>
                              <div className='mt-2'>
                                 <p className='text-sm text-gray-500'>
                                    Are you sure you want to delete this post? This action cannot be undone.
                                 </p>
                              </div>
                           </div>
                        </div>
                        <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                           <button
                              type='button'
                              onClick={() => handleDeletePost(deleteConfirm._id)}
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

export default ReportedPosts;
