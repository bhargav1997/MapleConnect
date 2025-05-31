import { useState } from "react";
import { sendBroadcast } from "../../services/adminService";
import { motion } from "framer-motion";

const Broadcast = () => {
   const [title, setTitle] = useState("");
   const [message, setMessage] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [success, setSuccess] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
         await sendBroadcast({ title, message });
         setSuccess(true);
         setTitle("");
         setMessage("");
      } catch (err) {
         setError(err.response?.data?.error || "Failed to send broadcast notification");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className='max-w-2xl mx-auto'>
         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white rounded-lg shadow-sm'>
            <div className='p-6'>
               <h2 className='text-lg font-medium text-gray-900 mb-4'>Send Broadcast Notification</h2>

               {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-4 mb-4 text-red-600 bg-red-50 rounded-lg'>
                     <p>{error}</p>
                  </motion.div>
               )}

               {success && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='p-4 mb-4 text-green-600 bg-green-50 rounded-lg'>
                     <p>Broadcast notification sent successfully!</p>
                  </motion.div>
               )}

               <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                     <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                        Title
                     </label>
                     <input
                        type='text'
                        id='title'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                        placeholder='Enter notification title'
                        required
                     />
                  </div>

                  <div>
                     <label htmlFor='message' className='block text-sm font-medium text-gray-700'>
                        Message
                     </label>
                     <textarea
                        id='message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                        placeholder='Enter notification message'
                        required
                     />
                  </div>

                  <div className='pt-4'>
                     <button
                        type='submit'
                        disabled={loading}
                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red ${
                           loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}>
                        {loading ? (
                           <>
                              <svg className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' fill='none' viewBox='0 0 24 24'>
                                 <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                 <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                 />
                              </svg>
                              Sending...
                           </>
                        ) : (
                           "Send Broadcast"
                        )}
                     </button>
                  </div>
               </form>

               <div className='mt-6 border-t border-gray-200 pt-4'>
                  <h3 className='text-sm font-medium text-gray-900'>Guidelines</h3>
                  <ul className='mt-2 text-sm text-gray-500 list-disc pl-5 space-y-1'>
                     <li>Keep titles concise and descriptive</li>
                     <li>Write clear and informative messages</li>
                     <li>Avoid sending multiple broadcasts in quick succession</li>
                     <li>Use broadcasts responsibly for important announcements only</li>
                  </ul>
               </div>
            </div>
         </motion.div>
      </div>
   );
};

export default Broadcast;
