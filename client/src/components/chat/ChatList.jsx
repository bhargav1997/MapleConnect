import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getConversations } from "../../services/chatService";
import { useSocket } from "../../context/SocketContext";
import UserAvatar from "../common/UserAvatar";
import { motion } from "framer-motion";

const ChatList = () => {
   const [conversations, setConversations] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const { socket } = useSocket();
   const navigate = useNavigate();

   const fetchConversations = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getConversations();
         setConversations(response.data);
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
         socket.on("new message", (data) => {
            setConversations((prev) => {
               const updated = [...prev];
               const index = updated.findIndex((conv) => conv.user._id === data.senderId);
               if (index !== -1) {
                  updated[index] = {
                     ...updated[index],
                     lastMessage: data.message,
                     unreadCount: updated[index].unreadCount + 1,
                  };
               }
               return updated;
            });
         });
      }

      return () => {
         if (socket) {
            socket.off("new message");
         }
      };
   }, [socket]);

   if (loading) {
      return (
         <div className='space-y-4'>
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

   if (conversations.length === 0) {
      return (
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
            <p className='text-gray-600 text-lg font-medium mb-2'>No conversations yet</p>
            <p className='text-sm text-gray-500'>Start chatting with your connections!</p>
         </div>
      );
   }

   return (
      <div className='space-y-3'>
         {conversations.map((conversation) => (
            <motion.div
               key={conversation.user._id}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               whileHover={{ scale: 1.02 }}
               className='relative'>
               <Link
                  to={`/messages/${conversation.user._id}`}
                  className='flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100'>
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
                     <p className='text-sm text-gray-500 truncate mt-1'>{conversation.lastMessage.content}</p>
                  </div>
                  {conversation.unreadCount > 0 && (
                     <div className='absolute top-3 right-3 bg-maple-red text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center'>
                        {conversation.unreadCount}
                     </div>
                  )}
               </Link>
            </motion.div>
         ))}
      </div>
   );
};

export default ChatList;
