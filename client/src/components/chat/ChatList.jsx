import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getConversations } from "../../services/chatService";
import { useSocket } from "../../context/SocketContext";
import UserAvatar from "../common/UserAvatar";
import { AnimatePresence, motion } from "framer-motion";

const ChatList = () => {
   const { userId } = useParams();
   const [conversations, setConversations] = useState([]);
   const [filteredConversations, setFilteredConversations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [searchQuery, setSearchQuery] = useState("");
   const { socket, markAsRead } = useSocket();
   const navigate = useNavigate();

   const fetchConversations = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getConversations();
         setConversations(response.data);
         setFilteredConversations(response.data);
      } catch (err) {
         console.error("Error fetching conversations:", err);
         setError(err.message || "Failed to load conversations");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchConversations();

      if (socket) {
         // Handle new messages
         socket.on("new message", (data) => {
            setConversations((prev) => {
               const updated = [...prev];
               const index = updated.findIndex(
                  (conv) => conv.user._id === data.message.sender._id || conv.user._id === data.message.receiver._id,
               );

               if (index !== -1) {
                  // Move conversation to top and update it
                  const conversation = updated[index];
                  updated.splice(index, 1);
                  updated.unshift({
                     ...conversation,
                     lastMessage: data.message,
                     unreadCount:
                        data.message.sender._id === conversation.user._id ? conversation.unreadCount + 1 : conversation.unreadCount,
                  });
               } else {
                  // Create new conversation at top
                  const otherUser = data.message.sender._id === socket.id ? data.message.receiver : data.message.sender;
                  updated.unshift({
                     user: otherUser,
                     lastMessage: data.message,
                     unreadCount: data.message.sender._id === otherUser._id ? 1 : 0,
                  });
               }
               return updated;
            });
         });

         // Handle messages being read
         socket.on("messages read", (data) => {
            setConversations((prev) => {
               return prev.map((conv) => {
                  if (conv.user._id === data.senderId) {
                     return {
                        ...conv,
                        unreadCount: 0,
                     };
                  }
                  return conv;
               });
            });
         });

         // Handle unread count updates
         socket.on("unread count updated", () => {
            const currentPath = window.location.pathname;
            const conversationId = currentPath.split("/messages/")[1];

            setConversations((prev) => {
               return prev.map((conv) => {
                  if (conv.user._id === conversationId) {
                     return {
                        ...conv,
                        unreadCount: 0,
                     };
                  }
                  return conv;
               });
            });
         });
      }

      return () => {
         if (socket) {
            socket.off("new message");
            socket.off("messages read");
            socket.off("unread count updated");
         }
      };
   }, [socket]);

   // Filter conversations based on search query
   useEffect(() => {
      if (!searchQuery.trim()) {
         setFilteredConversations(conversations);
      } else {
         const query = searchQuery.toLowerCase();
         const filtered = conversations.filter(
            (conv) =>
               conv.user.name.toLowerCase().includes(query) ||
               (conv.user.username && conv.user.username.toLowerCase().includes(query)) ||
               conv.lastMessage.content.toLowerCase().includes(query),
         );
         setFilteredConversations(filtered);
      }
   }, [searchQuery, conversations]);

   const handleChatClick = (conversation) => {
      // Mark all unread messages in this conversation as read
      if (conversation.unreadCount > 0 && socket) {
         markAsRead(conversation.user._id, []);
         setConversations((prev) => prev.map((conv) => (conv.user._id === conversation.user._id ? { ...conv, unreadCount: 0 } : conv)));
      }
      navigate(`/messages/${conversation.user._id}`);
   };

   if (loading) {
      return (
         <div className='space-y-4 p-4'>
            {[1, 2, 3].map((i) => (
               <div key={i} className='flex items-center space-x-3 p-4 bg-gray-50 rounded-lg animate-pulse'>
                  <div className='w-12 h-12 bg-gray-200 rounded-full'></div>
                  <div className='flex-1'>
                     <div className='h-4 bg-gray-200 rounded w-24 mb-2'></div>
                     <div className='h-3 bg-gray-200 rounded w-32'></div>
                  </div>
               </div>
            ))}
         </div>
      );
   }

   if (error) {
      return (
         <div className='text-center p-4'>
            <p className='text-red-500 mb-2'>{error}</p>
            <button onClick={fetchConversations} className='text-maple-red hover:text-maple-red-dark font-medium'>
               Try Again
            </button>
         </div>
      );
   }

   return (
      <div className='flex flex-col h-full'>
         {/* Search Bar */}
         <div className='p-4 border-b'>
            <div className='relative'>
               <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search conversations...'
                  className='w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red/50 focus:border-maple-red'
               />
               <svg
                  className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
               </svg>
            </div>
         </div>

         {/* Conversations List */}
         <div className='flex-1 overflow-y-auto'>
            {filteredConversations.length === 0 && !loading ? (
               <div className='text-center p-8'>
                  <div className='w-16 h-16 mx-auto mb-4 text-gray-400'>
                     <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={1.5}
                           d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                        />
                     </svg>
                  </div>
                  <p className='text-gray-600 text-lg font-medium mb-2'>
                     {searchQuery ? "No conversations found" : "No conversations yet"}
                  </p>
                  <p className='text-sm text-gray-500'>
                     {searchQuery ? "Try different search terms" : "Start chatting with your connections!"}
                  </p>
               </div>
            ) : (
               <div className='space-y-2 p-4'>
                  {filteredConversations.map((conversation) => (
                     <motion.div
                        key={conversation.user._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative ${conversation.user._id === userId ? "bg-maple-red/5" : ""}`}>
                        <div
                           onClick={() => handleChatClick(conversation)}
                           className={`flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-100 transition-colors border ${
                              conversation.user._id === userId ? "border-maple-red/20" : "border-gray-100"
                           } cursor-pointer`}>
                           <UserAvatar user={conversation.user} size='md' />
                           <div className='flex-1 min-w-0'>
                              <div className='flex items-center justify-between'>
                                 <h3 className='text-sm font-semibold text-charcoal-gray truncate'>{conversation.user.name}</h3>
                                 <span className='text-xs text-gray-500'>
                                    {new Date(conversation.lastMessage.createdAt).toLocaleTimeString([], {
                                       hour: "2-digit",
                                       minute: "2-digit",
                                    })}
                                 </span>
                              </div>
                              <div className='flex items-center gap-2'>
                                 {conversation.user.username && (
                                    <span className='text-xs text-gray-500'>@{conversation.user.username}</span>
                                 )}
                              </div>
                              <p className='text-sm text-gray-500 truncate mt-1'>{conversation.lastMessage.content}</p>
                           </div>
                           {conversation.unreadCount > 0 && (
                              <div className='absolute top-3 right-3 bg-maple-red text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center'>
                                 {conversation.unreadCount}
                              </div>
                           )}
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default ChatList;
