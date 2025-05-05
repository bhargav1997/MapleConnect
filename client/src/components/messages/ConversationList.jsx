import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getConversations } from "../../services/messageService";
import { getConversationsStart, getConversationsSuccess, getConversationsFailure } from "../../redux/slices/messageSlice";

const ConversationList = ({ onSelectConversation, selectedUserId }) => {
   const dispatch = useDispatch();
   const { conversations, isLoading, error } = useSelector((state) => state.message);
   const [searchTerm, setSearchTerm] = useState("");

   useEffect(() => {
      const fetchConversations = async () => {
         try {
            dispatch(getConversationsStart());
            const response = await getConversations();
            dispatch(getConversationsSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load conversations";
            dispatch(getConversationsFailure(message));
         }
      };

      fetchConversations();

      // Refresh conversations every 30 seconds
      const intervalId = setInterval(fetchConversations, 30000);

      return () => clearInterval(intervalId);
   }, [dispatch]);

   // Filter conversations based on search term
   const filteredConversations = conversations.filter((conversation) =>
      conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
   );

   // Format date
   const formatDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
         // Today, show time
         return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (diffDays === 1) {
         // Yesterday
         return "Yesterday";
      } else if (diffDays < 7) {
         // This week, show day name
         return date.toLocaleDateString([], { weekday: "short" });
      } else {
         // Older, show date
         return date.toLocaleDateString([], { month: "short", day: "numeric" });
      }
   };

   // Get total unread count
   const totalUnreadCount = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0);

   return (
      <div className='bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col'>
         <div className='p-5 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
               <h2 className='text-xl font-semibold text-charcoal-gray'>Conversations</h2>
               {totalUnreadCount > 0 && (
                  <motion.div
                     initial={{ scale: 0.8, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     className='bg-maple-red text-white text-xs font-medium px-2.5 py-1 rounded-full'>
                     {totalUnreadCount} new
                  </motion.div>
               )}
            </div>
            <div className='mt-3 relative'>
               <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <svg
                     className='h-5 w-5 text-gray-400'
                     xmlns='http://www.w3.org/2000/svg'
                     viewBox='0 0 20 20'
                     fill='currentColor'
                     aria-hidden='true'>
                     <path
                        fillRule='evenodd'
                        d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                        clipRule='evenodd'
                     />
                  </svg>
               </div>
               <input
                  type='text'
                  className='focus:ring-maple-red focus:border-maple-red block w-full pl-10 py-2.5 text-sm border-gray-300 rounded-lg shadow-sm'
                  placeholder='Search conversations'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>

         <div className='flex-1 overflow-y-auto'>
            <AnimatePresence mode='wait'>
               {isLoading && conversations.length === 0 ? (
                  <motion.div
                     key='loading'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='p-8 text-center h-full flex flex-col items-center justify-center'>
                     <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-maple-red mb-4'></div>
                     <p className='text-sm text-gray-500'>Loading conversations...</p>
                  </motion.div>
               ) : error ? (
                  <motion.div
                     key='error'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='p-8 text-center h-full flex flex-col items-center justify-center'>
                     <div className='bg-red-100 text-red-500 p-3 rounded-full mb-4'>
                        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                           />
                        </svg>
                     </div>
                     <p className='text-sm text-red-500 mb-2'>{error}</p>
                     <button
                        onClick={() => window.location.reload()}
                        className='mt-2 text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                        Try again
                     </button>
                  </motion.div>
               ) : filteredConversations.length === 0 ? (
                  <motion.div
                     key='empty'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='p-8 text-center h-full flex flex-col items-center justify-center'>
                     <div className='bg-gray-100 text-gray-400 p-4 rounded-full mb-4'>
                        <svg className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                           />
                        </svg>
                     </div>
                     <h3 className='text-base font-medium text-gray-900 mb-1'>
                        {searchTerm ? "No results found" : "No conversations yet"}
                     </h3>
                     <p className='text-sm text-gray-500 max-w-xs'>
                        {searchTerm
                           ? `No conversations match "${searchTerm}". Try a different search term.`
                           : "Start a conversation by sending a message to someone in your community."}
                     </p>
                  </motion.div>
               ) : (
                  <motion.ul
                     key='conversations'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='divide-y divide-gray-100'>
                     {filteredConversations.map((conversation, index) => (
                        <motion.li
                           key={conversation.user._id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: index * 0.05 }}
                           className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                              selectedUserId === conversation.user._id ? "bg-maple-red/5 border-l-4 border-maple-red" : ""
                           }`}
                           onClick={() => onSelectConversation(conversation.user)}>
                           <div className='px-5 py-4 flex items-center'>
                              <div className='relative flex-shrink-0'>
                                 <img
                                    className='h-12 w-12 rounded-full object-cover border border-gray-200'
                                    src={
                                       conversation.user.profileImage
                                          ? `http://localhost:5000/uploads/${conversation.user.profileImage}`
                                          : "https://via.placeholder.com/150"
                                    }
                                    alt={conversation.user.name}
                                 />
                                 {conversation.unreadCount > 0 && (
                                    <motion.span
                                       initial={{ scale: 0 }}
                                       animate={{ scale: 1 }}
                                       className='absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full ring-2 ring-white bg-maple-red text-white text-xs font-bold'>
                                       {conversation.unreadCount}
                                    </motion.span>
                                 )}
                              </div>
                              <div className='ml-4 flex-1 min-w-0'>
                                 <div className='flex items-center justify-between mb-1'>
                                    <p
                                       className={`text-sm font-medium ${
                                          conversation.unreadCount > 0 ? "text-charcoal-gray" : "text-gray-700"
                                       }`}>
                                       {conversation.user.name}
                                    </p>
                                    <p
                                       className={`text-xs ${
                                          conversation.unreadCount > 0 ? "text-maple-red font-medium" : "text-gray-500"
                                       }`}>
                                       {formatDate(conversation.latestMessage.createdAt)}
                                    </p>
                                 </div>
                                 <p
                                    className={`text-sm truncate ${
                                       conversation.unreadCount > 0 ? "font-medium text-charcoal-gray" : "text-gray-500"
                                    }`}>
                                    {conversation.latestMessage.sender._id === conversation.user._id
                                       ? conversation.latestMessage.content
                                       : `You: ${conversation.latestMessage.content}`}
                                 </p>
                              </div>
                           </div>
                        </motion.li>
                     ))}
                  </motion.ul>
               )}
            </AnimatePresence>
         </div>
      </div>
   );
};

export default ConversationList;
