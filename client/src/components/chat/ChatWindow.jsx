import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessages, deleteMessage } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../common/UserAvatar";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-hot-toast";

const ChatWindow = () => {
   const { userId } = useParams();
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [newMessage, setNewMessage] = useState("");
   const [isTyping, setIsTyping] = useState(false);
   const [typingUser, setTypingUser] = useState(null);
   const [chatUser, setChatUser] = useState(null);
   const messagesEndRef = useRef(null);
   const typingTimeoutRef = useRef(null);
   const { socket, sendMessage, isUserOnline } = useSocket();
   const { user } = useAuth();
   const navigate = useNavigate();

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   };

   const fetchMessages = async () => {
      try {
         setLoading(true);
         setError("");
         const response = await getMessages(userId);
         setMessages(response.data);
         scrollToBottom();
      } catch (err) {
         console.error("Error fetching messages:", err);
         setError(err.message || "Failed to load messages");
      } finally {
         setLoading(false);
      }
   };

   // Fetch chat user info (for header)
   useEffect(() => {
      const fetchChatUser = async () => {
         if (userId && userId !== user._id) {
            try {
               const res = await getUserById(userId);
               setChatUser(res.data);
            } catch {
               setChatUser({ _id: userId }); // fallback if no info
            }
         }
      };
      fetchChatUser();
   }, [userId, user._id]);

   useEffect(() => {
      fetchMessages();

      if (socket) {
         socket.emit("join", userId);

         socket.on("new message", (data) => {
            if (data.message.sender._id === userId || data.message.receiver._id === userId) {
               setMessages((prev) => [...prev, data.message]);
               scrollToBottom();

               // Mark the message as read immediately if we're in the chat
               if (data.message.sender._id === userId) {
                  socket.emit("mark as read", {
                     senderId: userId,
                     receiverId: user._id,
                     messageIds: [data.message._id],
                  });
               }
            }
         });

         socket.on("typing", (data) => {
            if (data.senderId === userId) {
               setTypingUser(chatUser);
               setIsTyping(true);
               if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current);
               }
               typingTimeoutRef.current = setTimeout(() => {
                  setIsTyping(false);
                  setTypingUser(null);
               }, 3000);
            }
         });

         socket.on("messages read", (data) => {
            setMessages((prev) =>
               prev.map((msg) => {
                  if (data.messageIds.includes(msg._id)) {
                     return {
                        ...msg,
                        readBy: Array.from(new Set([...(msg.readBy || []), data.receiverId])),
                     };
                  }
                  return msg;
               }),
            );
         });

         socket.on("message deleted", (data) => {
            setMessages((prev) => prev.filter((msg) => msg._id !== data.messageId));
         });
      }

      return () => {
         if (socket) {
            socket.emit("leave", userId);
            socket.off("new message");
            socket.off("typing");
            socket.off("messages read");
            socket.off("message deleted");
         }
         if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
         }
      };
   }, [socket, userId]);

   // Mark messages as read when they are loaded or when new messages arrive
   useEffect(() => {
      if (socket && messages.length > 0 && userId) {
         const unreadMessages = messages.filter(
            (msg) =>
               // Only mark messages from the other user as read
               msg.sender._id === userId &&
               // Check if the message hasn't been read by current user
               !msg.readBy?.includes(user._id) &&
               // Make sure we have the correct user ID format
               msg.sender._id !== user._id,
         );

         if (unreadMessages.length > 0) {
            console.log(
               "Marking messages as read:",
               unreadMessages.map((msg) => msg._id),
            );
            socket.emit("mark as read", {
               senderId: userId,
               receiverId: user._id,
               messageIds: unreadMessages.map((msg) => msg._id),
            });
         }
      }
   }, [messages, socket, userId, user._id]);

   const handleSendMessage = (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      sendMessage(userId, newMessage.trim());
      setNewMessage("");
   };

   const handleTyping = () => {
      if (socket) {
         socket.emit("typing", { receiverId: userId });
      }
   };

   const handleDeleteMessage = async (messageId) => {
      try {
         await deleteMessage(messageId);
         setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
         toast.success("Message deleted");
      } catch (err) {
         console.error("Error deleting message:", err);
         toast.error(err.message || "Failed to delete message");
      }
   };

   // Helper to check if the message is sent by the current user
   const isMyMessage = (message) => {
      if (!message.sender) return false;
      if (typeof message.sender === "object") {
         return message.sender._id === user._id || message.sender._id === user.id;
      }
      return message.sender === user._id || message.sender === user.id;
   };

   // --- UI ---
   if (loading) {
      return (
         <div className='flex items-center justify-center h-full bg-gray-50'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red'></div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='flex flex-col items-center justify-center h-full bg-gray-50 p-8'>
            <div className='w-16 h-16 mb-4 text-red-500'>
               <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
               </svg>
            </div>
            <p className='text-red-500 text-lg font-medium mb-4'>{error}</p>
            <button
               onClick={fetchMessages}
               className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-colors'>
               Try Again
            </button>
         </div>
      );
   }

   return (
      <div className='flex flex-col h-full min-h-0 bg-white rounded-xl shadow-md overflow-hidden'>
         {/* Header */}
         <div className='flex items-center gap-3 px-6 py-3 border-b bg-white flex-shrink-0 shadow-sm'>
            <button
               className='lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors mr-2'
               onClick={() => navigate(-1)}
               aria-label='Back'>
               <svg className='w-6 h-6 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
               </svg>
            </button>
            <UserAvatar user={chatUser || { _id: userId }} size='md' className='bg-gray-200' />
            <div className='flex flex-col flex-1 min-w-0'>
               <span className='font-semibold text-charcoal-gray text-base truncate'>{chatUser?.name || "Chat"}</span>
               {chatUser?.username && <span className='text-xs text-gray-500 truncate'>@{chatUser.username}</span>}
               <span className={`text-xs flex items-center gap-1 ${isUserOnline(userId) ? "text-green-500" : "text-gray-400"}`}>
                  <span className={`h-2 w-2 rounded-full ${isUserOnline(userId) ? "bg-green-400" : "bg-gray-300"} inline-block`}></span>
                  {isUserOnline(userId) ? "Online" : "Offline"}
               </span>
            </div>
            <button className='p-2 rounded-full hover:bg-gray-100 transition-colors ml-2' aria-label='Options'>
               <svg className='w-5 h-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <circle cx='12' cy='6' r='1.5' />
                  <circle cx='12' cy='12' r='1.5' />
                  <circle cx='12' cy='18' r='1.5' />
               </svg>
            </button>
         </div>
         {/* Messages */}
         <div className='flex-1 min-h-0 overflow-y-auto px-4 py-6 bg-gray-50 space-y-4'>
            <AnimatePresence>
               {messages.map((message) => (
                  <motion.div
                     key={message._id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"}`}>
                     <div
                        className={`flex items-end space-x-2 max-w-[70%] ${
                           isMyMessage(message) ? "flex-row-reverse space-x-reverse" : ""
                        }`}>
                        <UserAvatar user={isMyMessage(message) ? user : chatUser || { _id: userId }} size='sm' />
                        <div className='relative group'>
                           <div
                              className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words ${
                                 isMyMessage(message)
                                    ? "bg-maple-red text-white rounded-br-none"
                                    : "bg-gray-200 text-charcoal-gray border border-gray-100 rounded-bl-none"
                              }`}>
                              <p>{message.content}</p>
                           </div>
                           {isMyMessage(message) && (
                              <button
                                 onClick={() => handleDeleteMessage(message._id)}
                                 className='absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50'>
                                 <svg
                                    className='w-4 h-4 text-gray-500 hover:text-red-500'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                 </svg>
                              </button>
                           )}
                           <div className='text-xs text-gray-400 mt-1'>
                              {message.readBy?.includes(userId) && isMyMessage(message) && (
                                 <span className='flex items-center gap-1'>
                                    <svg className='w-3 h-3' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                    </svg>
                                    Read
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                  </motion.div>
               ))}
            </AnimatePresence>
            {isTyping && typingUser && (
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='flex items-center space-x-2 text-sm text-gray-500 bg-white/50 rounded-full px-4 py-2 w-fit'>
                  <UserAvatar user={typingUser} size='xs' />
                  <span>{typingUser.name} is typing...</span>
                  <div className='flex space-x-1'>
                     <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "0ms" }}></div>
                     <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "150ms" }}></div>
                     <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "300ms" }}></div>
                  </div>
               </motion.div>
            )}
            <div ref={messagesEndRef} />
         </div>
         {/* Input */}
         <form onSubmit={handleSendMessage} className='p-4 border-t bg-white flex-shrink-0'>
            <div className='flex items-center space-x-3'>
               <input
                  type='text'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleTyping}
                  placeholder='Type a message...'
                  className='flex-1 rounded-full border-gray-200 focus:ring-maple-red focus:border-maple-red shadow-sm px-4 py-2.5 text-base bg-gray-50'
               />
               <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type='submit'
                  disabled={!newMessage.trim()}
                  className='p-3 rounded-full bg-maple-red text-white hover:bg-maple-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md flex items-center justify-center'>
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                  </svg>
               </motion.button>
            </div>
         </form>
      </div>
   );
};

export default ChatWindow;
