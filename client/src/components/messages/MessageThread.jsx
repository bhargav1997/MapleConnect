import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getConversation, sendMessage, markAsRead, deleteMessage } from "../../services/messageService";
import {
   getConversationStart,
   getConversationSuccess,
   getConversationFailure,
   sendMessageStart,
   sendMessageSuccess,
   sendMessageFailure,
   markAsReadStart,
   markAsReadSuccess,
   markAsReadFailure,
   deleteMessageStart,
   deleteMessageSuccess,
   deleteMessageFailure,
} from "../../redux/slices/messageSlice";
import { getUserInitials } from "../../utils/helpers";
import ThoughtsContainer from "../thoughts/ThoughtsContainer";
import defaultUserImage from "../../assets/default-user.png";

const MessageThread = ({ selectedUser, onBack }) => {
   const dispatch = useDispatch();
   const { user } = useAuth();
   const { currentConversation, isLoading, error } = useSelector((state) => state.message);

   const [newMessage, setNewMessage] = useState("");
   const [attachments, setAttachments] = useState([]);
   const [attachmentPreviews, setAttachmentPreviews] = useState([]);
   const [isSending, setIsSending] = useState(false);
   const [isStoryViewerOpen, setIsStoryViewerOpen] = useState(false);
   const [viewingThought, setViewingThought] = useState(null);
   const messagesEndRef = useRef(null);

   useEffect(() => {
      if (selectedUser) {
         const fetchConversation = async () => {
            try {
               dispatch(getConversationStart());
               const response = await getConversation(selectedUser._id);

               dispatch(
                  getConversationSuccess({
                     user: selectedUser,
                     messages: response.data,
                  }),
               );

               // Mark unread messages as read
               response.data.forEach(async (message) => {
                  if (message.recipient._id === user.id && message.sender._id === selectedUser._id && !message.read) {
                     try {
                        dispatch(markAsReadStart());
                        const readResponse = await markAsRead(message._id);
                        dispatch(markAsReadSuccess(readResponse.data));
                     } catch (error) {
                        const message =
                           error.response && error.response.data.error ? error.response.data.error : "Failed to mark message as read";
                        dispatch(markAsReadFailure(message));
                     }
                  }
               });
            } catch (error) {
               const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load conversation";
               dispatch(getConversationFailure(message));
            }
         };

         fetchConversation();

         // Refresh conversation every 10 seconds
         const intervalId = setInterval(fetchConversation, 10000);

         return () => clearInterval(intervalId);
      }
   }, [dispatch, selectedUser, user.id]);

   useEffect(() => {
      // Scroll to bottom when messages change
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [currentConversation.messages]);

   const handleAttachmentChange = (e) => {
      const files = Array.from(e.target.files);

      // Limit to 5 files
      if (files.length + attachments.length > 5) {
         alert("You can only upload up to 5 files");
         return;
      }

      setAttachments([...attachments, ...files]);

      // Create previews
      const newPreviews = files.map((file) => ({
         url: URL.createObjectURL(file),
         type: file.type.startsWith("image/") ? "image" : "file",
         name: file.name,
      }));

      setAttachmentPreviews([...attachmentPreviews, ...newPreviews]);
   };

   const removeAttachment = (index) => {
      const newAttachments = [...attachments];
      const newPreviews = [...attachmentPreviews];

      newAttachments.splice(index, 1);
      newPreviews.splice(index, 1);

      setAttachments(newAttachments);
      setAttachmentPreviews(newPreviews);
   };

   const handleSendMessage = async (e) => {
      e.preventDefault();

      if (!newMessage.trim() && attachments.length === 0) {
         return;
      }

      try {
         setIsSending(true);
         dispatch(sendMessageStart());

         const messageData = {
            recipient: selectedUser._id,
            content: newMessage.trim(),
            attachments,
         };

         const response = await sendMessage(messageData);
         dispatch(sendMessageSuccess(response.data));

         // Clear form
         setNewMessage("");
         setAttachments([]);
         setAttachmentPreviews([]);
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to send message";
         dispatch(sendMessageFailure(message));
      } finally {
         setIsSending(false);
      }
   };

   const handleDeleteMessage = async (messageId) => {
      if (window.confirm("Are you sure you want to delete this message?")) {
         try {
            dispatch(deleteMessageStart());
            await deleteMessage(messageId);
            dispatch(deleteMessageSuccess(messageId));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to delete message";
            dispatch(deleteMessageFailure(message));
         }
      }
   };

   // Format date
   const formatMessageDate = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
         // Today, show time
         return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      } else if (diffDays === 1) {
         // Yesterday
         return `Yesterday, ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         })}`;
      } else if (diffDays < 7) {
         // This week, show day name and time
         return `${date.toLocaleDateString([], {
            weekday: "short",
         })}, ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         })}`;
      } else {
         // Older, show date and time
         return `${date.toLocaleDateString([], {
            month: "short",
            day: "numeric",
         })}, ${date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
         })}`;
      }
   };

   const renderMessageContent = (message) => {
      try {
         console.log("Message type:", message.type, "thoughtRef:", message.thoughtRef);
         if (message.type === "story" && message.thoughtRef && typeof message.thoughtRef === "object") {
            if (!message.thoughtRef._id || !message.thoughtRef.content) {
               return <div className='text-sm text-gray-500 italic'>This story is no longer available</div>;
            }
            return (
               <div
                  onClick={() => {
                     setViewingThought(message.thoughtRef);
                     setIsStoryViewerOpen(true);
                  }}
                  className='shared-story-preview p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors group'>
                  {/* Story Header */}
                  <div className='flex items-center justify-between mb-3'>
                     <div className='flex items-center'>
                        <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-maple-red'>
                           <img
                              src={message.thoughtRef.user?.profileImage || defaultUserImage}
                              alt={message.thoughtRef.user?.name}
                              className='w-full h-full object-cover'
                           />
                        </div>
                        <div className='ml-3'>
                           <p className='text-sm font-semibold text-gray-900'>{message.thoughtRef.user?.name}</p>
                           <p className='text-xs text-gray-500'>
                              {new Date(message.thoughtRef.createdAt).toLocaleDateString([], {
                                 month: "short",
                                 day: "numeric",
                                 hour: "2-digit",
                                 minute: "2-digit",
                              })}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Story Content */}
                  <div className='mb-3'>
                     <p className='text-gray-800 whitespace-pre-wrap break-words'>{message.thoughtRef.content}</p>
                  </div>

                  {/* Story Footer - Engagement */}
                  <div className='flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100'>
                     <div className='flex items-center space-x-4'>
                        <div className='flex items-center'>
                           <span className='mr-1'>❤️</span>
                           <span>{message.thoughtRef.likes?.length || 0}</span>
                        </div>
                        <div className='flex items-center'>
                           <span className='mr-1'>💬</span>
                           <span>{message.thoughtRef.comments?.length || 0}</span>
                        </div>
                     </div>
                     <div className='flex items-center space-x-2'>
                        <p className='text-xs text-gray-400'>Story preview</p>
                        <span className='text-xs text-maple-red group-hover:translate-x-0.5 transition-transform'>Open →</span>
                     </div>
                  </div>
               </div>
            );
         }
         return <div className='text-sm whitespace-pre-wrap'>{message.content}</div>;
      } catch (error) {
         console.error("Error rendering message content:", error);
         return <div className='text-sm text-red-500'>Error displaying message</div>;
      }
   };

   if (!selectedUser) {
      return (
         <div className='bg-white rounded-xl shadow-md overflow-hidden h-full flex items-center justify-center'>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5 }}
               className='text-center p-8 max-w-md'>
               <div className='bg-gray-100 text-maple-red p-5 rounded-full inline-block mb-4'>
                  <svg className='h-14 w-14' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                     />
                  </svg>
               </div>
               <h3 className='text-xl font-semibold text-charcoal-gray mb-2'>Your messages</h3>
               <p className='text-gray-600 mb-6'>
                  Connect with your community through private conversations. Select a conversation from the list or start a new one.
               </p>
               <div className='relative'>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                     <div className='w-full border-t border-gray-200'></div>
                  </div>
                  <div className='relative flex justify-center'>
                     <span className='px-3 bg-white text-sm text-gray-500'>MapleConnect Messages</span>
                  </div>
               </div>
            </motion.div>
         </div>
      );
   }

   console.log("currentConversation", currentConversation);

   return (
      <div className='bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full'>
         {/* Header */}
         <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
            <div className='flex items-center'>
               {onBack && (
                  <button onClick={onBack} className='mr-2 text-gray-500 hover:text-maple-red md:hidden'>
                     <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                     </svg>
                  </button>
               )}
               <Link to={`/profile/${selectedUser._id}`} className='flex items-center'>
                  <div className='h-8 w-8 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white text-xs font-bold'>
                     {getUserInitials(selectedUser.name)}
                  </div>
                  <div className='ml-3'>
                     <span className='text-base font-semibold text-charcoal-gray hover:text-maple-red transition-colors'>
                        {selectedUser.name}
                     </span>
                     <div className='flex items-center text-xs text-green-600'>
                        <span className='h-2 w-2 rounded-full bg-green-500 mr-1'></span>
                        <span>Online</span>
                     </div>
                  </div>
               </Link>
            </div>
            <div className='flex items-center space-x-2'>
               <button className='p-2 rounded-full text-gray-500 hover:text-maple-red hover:bg-gray-100'>
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                     />
                  </svg>
               </button>
               <Link to={`/profile/${selectedUser._id}`} className='p-2 rounded-full text-gray-500 hover:text-maple-red hover:bg-gray-100'>
                  <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                     />
                  </svg>
               </Link>
            </div>
         </div>

         {/* Message Thread */}
         <div className='flex-1 overflow-y-auto p-4 bg-gray-50'>
            <AnimatePresence mode='wait'>
               {isLoading && currentConversation.messages.length === 0 ? (
                  <motion.div
                     key='loading'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='flex justify-center items-center h-full'>
                     <div className='flex flex-col items-center'>
                        <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-maple-red'></div>
                        <p className='mt-4 text-sm text-gray-500'>Loading conversation...</p>
                     </div>
                  </motion.div>
               ) : error ? (
                  <motion.div
                     key='error'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='flex justify-center items-center h-full'>
                     <div className='text-center bg-white p-6 rounded-xl shadow-sm max-w-md'>
                        <div className='bg-red-100 text-red-500 p-3 rounded-full inline-block mb-4'>
                           <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>Something went wrong</h3>
                        <p className='text-sm text-red-500 mb-4'>{error}</p>
                        <button
                           onClick={() => window.location.reload()}
                           className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-colors'>
                           Try again
                        </button>
                     </div>
                  </motion.div>
               ) : currentConversation.messages.length === 0 ? (
                  <motion.div
                     key='empty'
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className='flex justify-center items-center h-full'>
                     <div className='text-center bg-white p-6 rounded-xl shadow-sm max-w-md'>
                        <div className='bg-gray-100 text-maple-red p-3 rounded-full inline-block mb-4'>
                           <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                              />
                           </svg>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>Start a conversation</h3>
                        <p className='text-sm text-gray-500 mb-4'>
                           No messages yet with {selectedUser.name}. Send a message to start the conversation!
                        </p>
                     </div>
                  </motion.div>
               ) : (
                  <div className='space-y-3'>
                     {console.log("Messages to render:", currentConversation.messages)}
                     {currentConversation.messages.map((message, index) => {
                        console.log("Processing message:", message);
                        const isSentByMe = message.sender._id === user.id;
                        const isFirstInGroup = index === 0 || currentConversation.messages[index - 1].sender._id !== message.sender._id;
                        const isLastInGroup =
                           index === currentConversation.messages.length - 1 ||
                           currentConversation.messages[index + 1].sender._id !== message.sender._id;

                        return (
                           <motion.div
                              key={message._id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className={`flex ${isSentByMe ? "justify-end" : "justify-start"} ${isLastInGroup ? "mb-3" : "mb-1"}`}>
                              <div className='flex max-w-xs md:max-w-md'>
                                 {!isSentByMe && isFirstInGroup && (
                                    <div className='flex-shrink-0 mr-2 mt-1'>
                                       <div className='h-8 w-8 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white text-xs font-bold'>
                                          {getUserInitials(message.sender.name)}
                                       </div>
                                    </div>
                                 )}
                                 {!isSentByMe && !isFirstInGroup && <div className='w-8 mr-2'></div>}

                                 <div
                                    className={`rounded-2xl px-4 py-2 ${
                                       isSentByMe ? "bg-maple-red text-white" : "bg-white border border-gray-200 text-gray-800"
                                    } ${isFirstInGroup && isSentByMe ? "rounded-tr-none" : ""}
                                      ${isFirstInGroup && !isSentByMe ? "rounded-tl-none" : ""}`}>
                                    {renderMessageContent(message)}

                                    {message.attachments && message.attachments.length > 0 && (
                                       <div className='mt-2 space-y-2'>
                                          {message.attachments.map((attachment, index) => (
                                             <a
                                                key={index}
                                                href={`${attachment}`}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className={`block p-2 rounded-lg ${
                                                   isSentByMe
                                                      ? "bg-maple-red-dark hover:bg-maple-red-darker"
                                                      : "bg-gray-100 hover:bg-gray-200"
                                                } transition-colors`}>
                                                <div className='flex items-center'>
                                                   <svg
                                                      xmlns='http://www.w3.org/2000/svg'
                                                      className={`h-5 w-5 mr-2 ${isSentByMe ? "text-maple-red-light" : "text-gray-500"}`}
                                                      fill='none'
                                                      viewBox='0 0 24 24'
                                                      stroke='currentColor'>
                                                      <path
                                                         strokeLinecap='round'
                                                         strokeLinejoin='round'
                                                         strokeWidth={2}
                                                         d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                                                      />
                                                   </svg>
                                                   <span className={`text-sm truncate ${isSentByMe ? "text-white" : "text-gray-700"}`}>
                                                      {attachment.split("/").pop()}
                                                   </span>
                                                </div>
                                             </a>
                                          ))}
                                       </div>
                                    )}

                                    <div
                                       className={`text-xs mt-1 flex justify-between items-center ${
                                          isSentByMe ? "text-maple-red-light" : "text-gray-500"
                                       }`}>
                                       <span>{formatMessageDate(message.createdAt)}</span>
                                       {isSentByMe && (
                                          <div className='flex items-center'>
                                             <span className='mr-1'>
                                                {message.read ? (
                                                   <svg className='h-3 w-3 text-maple-red-light' viewBox='0 0 24 24' fill='currentColor'>
                                                      <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
                                                   </svg>
                                                ) : (
                                                   <svg className='h-3 w-3 text-maple-red-light' viewBox='0 0 24 24' fill='currentColor'>
                                                      <path d='M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z' />
                                                   </svg>
                                                )}
                                             </span>
                                             <button
                                                onClick={() => handleDeleteMessage(message._id)}
                                                className='ml-2 text-maple-red-light hover:text-white transition-colors'>
                                                <svg
                                                   xmlns='http://www.w3.org/2000/svg'
                                                   className='h-3.5 w-3.5'
                                                   fill='none'
                                                   viewBox='0 0 24 24'
                                                   stroke='currentColor'>
                                                   <path
                                                      strokeLinecap='round'
                                                      strokeLinejoin='round'
                                                      strokeWidth={2}
                                                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                                   />
                                                </svg>
                                             </button>
                                          </div>
                                       )}
                                    </div>
                                 </div>
                              </div>
                           </motion.div>
                        );
                     })}
                     <div ref={messagesEndRef} />
                  </div>
               )}
            </AnimatePresence>
         </div>

         {/* Message Input */}
         <div className='p-4 border-t border-gray-200 bg-white'>
            {attachmentPreviews.length > 0 && (
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='flex flex-wrap gap-2 mb-3 p-2 bg-gray-50 rounded-lg'>
                  {attachmentPreviews.map((preview, index) => (
                     <motion.div
                        key={index}
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className='relative bg-white rounded-lg p-2 flex items-center shadow-sm border border-gray-200'>
                        {preview.type === "image" ? (
                           <img src={preview.url} alt='Attachment preview' className='h-12 w-12 object-cover rounded-md mr-2' />
                        ) : (
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-12 w-12 text-gray-400 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                              />
                           </svg>
                        )}
                        <div className='flex flex-col'>
                           <span className='text-xs font-medium text-gray-700 truncate max-w-[120px]'>{preview.name}</span>
                           <span className='text-xs text-gray-500'>{(preview.size / 1024).toFixed(1)} KB</span>
                        </div>
                        <button
                           type='button'
                           onClick={() => removeAttachment(index)}
                           className='ml-2 p-1 rounded-full bg-gray-100 text-gray-500 hover:text-maple-red hover:bg-gray-200 transition-colors'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-4 w-4'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </motion.div>
                  ))}
               </motion.div>
            )}

            <form onSubmit={handleSendMessage} className='flex items-end'>
               <div className='flex-1 relative'>
                  <textarea
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     placeholder='Type a message...'
                     className='w-full border border-gray-300 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent resize-none shadow-sm'
                     rows='2'
                     disabled={isSending}></textarea>
                  <label className='absolute bottom-3 left-3 cursor-pointer text-gray-500 hover:text-maple-red transition-colors'>
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13'
                        />
                     </svg>
                     <input
                        type='file'
                        className='hidden'
                        multiple
                        onChange={handleAttachmentChange}
                        disabled={isSending || attachments.length >= 5}
                     />
                  </label>
                  {newMessage.length > 0 && <div className='absolute right-3 bottom-3 text-xs text-gray-500'>{newMessage.length}/1000</div>}
               </div>
               <motion.button
                  type='submit'
                  disabled={isSending || (!newMessage.trim() && attachments.length === 0)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`ml-2 p-3 rounded-full ${
                     isSending || (!newMessage.trim() && attachments.length === 0)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-maple-red text-white hover:bg-maple-red-dark shadow-sm"
                  } transition-colors`}>
                  {isSending ? (
                     <div className='h-5 w-5 border-t-2 border-b-2 border-white rounded-full animate-spin'></div>
                  ) : (
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                     </svg>
                  )}
               </motion.button>
            </form>
         </div>

         {/* Story Viewer */}
         {isStoryViewerOpen && viewingThought && (
            <ThoughtsContainer
               isOpen={isStoryViewerOpen}
               onClose={() => setIsStoryViewerOpen(false)}
               thoughts={[viewingThought]}
               initialStoryIndex={0}
            />
         )}
      </div>
   );
};

export default MessageThread;
