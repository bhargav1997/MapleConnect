import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMessages, deleteMessage } from "../../services/chatService";
import { getUserById } from "../../services/userService";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import UserAvatar from "../common/UserAvatar";
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
      <div className='flex flex-col h-full'>
         {/* Header - Fixed at top */}
         <div className='sticky top-0 flex items-center gap-3 px-6 py-3 border-b bg-white shadow-sm z-10'>
            <button
               className='md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors mr-2'
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

         {/* Messages Container - Scrollable area */}
         <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0'>
            {messages.map((message) => (
               <div key={message._id} className={`flex ${isMyMessage(message) ? "justify-end" : "justify-start"} animate-fade-in`}>
                  <div
                     className={`flex items-start space-x-2 max-w-[75%] ${isMyMessage(message) ? "flex-row-reverse space-x-reverse" : ""}`}>
                     {!isMyMessage(message) && <UserAvatar user={message.sender} size='sm' />}
                     <div className='flex flex-col'>
                        <div
                           className={`relative group rounded-2xl px-4 py-2 ${
                              isMyMessage(message) ? "bg-maple-red text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
                           }`}>
                           <p className='text-sm whitespace-pre-wrap break-words'>{message.content}</p>
                           {isMyMessage(message) && (
                              <button
                                 onClick={() => handleDeleteMessage(message._id)}
                                 className='absolute -right-8 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white shadow-sm border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50'>
                                 <svg className='w-4 h-4 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                    />
                                 </svg>
                              </button>
                           )}
                        </div>
                        <span className='text-xs text-gray-500 mt-1 self-end'>
                           {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                           {message.readBy?.includes(userId) && (
                              <span className='ml-1 text-maple-red'>
                                 <svg className='w-3 h-3 inline' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                 </svg>
                              </span>
                           )}
                        </span>
                     </div>
                  </div>
               </div>
            ))}
            {isTyping && typingUser && (
               <div className='flex items-center space-x-2'>
                  <UserAvatar user={typingUser} size='sm' />
                  <div className='bg-gray-100 rounded-full px-4 py-2'>
                     <div className='flex space-x-1'>
                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "0ms" }} />
                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "150ms" }} />
                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: "300ms" }} />
                     </div>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Message Input - Fixed at bottom */}
         <div className='sticky bottom-0 border-t bg-white px-6 py-4 mt-auto'>
            <form onSubmit={handleSendMessage} className='flex items-center space-x-4'>
               <div className='flex-1 relative'>
                  <input
                     type='text'
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     onKeyDown={handleTyping}
                     placeholder='Type a message...'
                     className='w-full px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-maple-red/50 focus:border-maple-red pr-12'
                  />
                  <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'>
                     <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                     </svg>
                  </button>
               </div>
               <button
                  type='submit'
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full ${
                     newMessage.trim() ? "bg-maple-red text-white hover:bg-maple-red-dark" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  } transition-colors`}>
                  <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                  </svg>
               </button>
            </form>
         </div>
      </div>
   );
};

export default ChatWindow;
