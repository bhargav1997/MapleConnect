import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatUsers from "../components/chat/ChatUsers";
import { motion } from "framer-motion";
import { FiUser, FiUsers, FiMessageSquare } from "react-icons/fi";

const Messages = () => {
   const { userId } = useParams();
   const navigate = useNavigate();
   const [activeTab, setActiveTab] = useState("conversations"); // or "users"
   const [showUserList, setShowUserList] = useState(false);

   const handleTabChange = (tab) => {
      setActiveTab(tab);
      if (userId) {
         setShowUserList(true);
         navigate("/messages"); // Go back to main messages view
      }
   };

   return (
      <div className='container mx-auto px-4 py-8'>
         <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='flex h-[calc(100vh-12rem)]'>
               {/* Sidebar */}
               <motion.div
                  initial={{ width: userId ? 80 : 320 }}
                  animate={{ width: userId ? 80 : 320 }}
                  transition={{ duration: 0.3 }}
                  className='border-r bg-white transition-all duration-300 flex flex-col items-center min-w-[80px]'>
                  {!userId && (
                     <div className='p-4 border-b bg-white shadow-sm z-10 w-full'>
                        <div className='flex flex-col'>
                           <h2 className='text-xl font-semibold text-charcoal-gray mb-4 text-center'>Conversations</h2>
                           <div className='flex flex-col space-y-2 w-full'>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                                    activeTab === "conversations" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => handleTabChange("conversations")}>
                                 <FiMessageSquare /> Conversations
                              </button>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                                    activeTab === "users" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => handleTabChange("users")}>
                                 <FiUsers /> Find Users
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {!userId && (
                     <div className='flex-1 w-full overflow-y-auto'>{activeTab === "conversations" ? <ChatList /> : <ChatUsers />}</div>
                  )}

                  {/* Icon section to fill bottom space in narrow view */}
                  {userId && (
                     <div className='flex flex-col items-center gap-4 py-4 text-gray-400'>
                        <button
                           onClick={() => navigate("/messages")}
                           className={`hover:text-maple-red transition-colors ${activeTab === "conversations" ? "text-maple-red" : ""}`}>
                           <FiMessageSquare className='w-5 h-5' />
                        </button>
                        <button
                           onClick={() => handleTabChange("users")}
                           className={`hover:text-maple-red transition-colors ${activeTab === "users" ? "text-maple-red" : ""}`}>
                           <FiUsers className='w-5 h-5' />
                        </button>
                        <button
                           onClick={() => handleTabChange("users")}
                           className={`hover:text-maple-red transition-colors ${activeTab === "users" ? "text-maple-red" : ""}`}>
                           <FiUser className='w-5 h-5' />
                        </button>
                     </div>
                  )}
               </motion.div>

               {/* Chat Window */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className='flex-1 min-w-0 flex flex-col bg-gray-50'>
                  {userId ? (
                     <ChatWindow />
                  ) : showUserList && activeTab === "users" ? (
                     <div className='h-full'>
                        <div className='p-4 border-b bg-white shadow-sm'>
                           <h2 className='text-xl font-semibold text-charcoal-gray'>Find Users</h2>
                        </div>
                        <div className='p-4'>
                           <ChatUsers />
                        </div>
                     </div>
                  ) : !userId ? (
                     <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                        <div className='w-16 h-16 text-gray-400 mb-4'>
                           <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                              />
                           </svg>
                        </div>
                        <h3 className='text-xl font-semibold text-gray-700 mb-2'>Select a conversation</h3>
                        <p className='text-gray-500'>Choose a conversation from the list or start a new one</p>
                     </div>
                  ) : null}
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Messages;
