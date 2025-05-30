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

   return (
      <div className='container mx-auto px-4 py-8'>
         <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='flex h-[calc(100vh-12rem)]'>
               {/* Sidebar */}
               <motion.div
                  initial={{ width: userId ? 80 : 320 }}
                  animate={{ width: userId ? 80 : 320 }}
                  transition={{ duration: 0.3 }}
                  className={`border-r bg-white transition-all duration-300 flex flex-col items-center justify-between`}
               >
                  {!userId && (
                     <div className='p-4 border-b bg-white shadow-sm z-10 w-full'>
                        <div className='flex flex-col'>
                           <h2 className='text-xl font-semibold text-charcoal-gray mb-4 text-center'>Conversations</h2>
                           <div className='flex flex-col space-y-2 w-full'>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                                    activeTab === "conversations" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => setActiveTab("conversations")}
                              >
                                 <FiMessageSquare /> Conversations
                              </button>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 justify-center ${
                                    activeTab === "users" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => setActiveTab("users")}
                              >
                                 <FiUsers /> Find Users
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {!userId && (
                     <div className='flex-1 w-full overflow-y-auto'>
                        {activeTab === "conversations" ? <ChatList /> : <ChatUsers />}
                     </div>
                  )}

                  {/* Icon section to fill bottom space in narrow view */}
                  {userId && (
                     <div className='flex flex-col items-center gap-4 py-4 text-gray-400'>
                        <FiMessageSquare className='w-5 h-5' />
                        <FiUsers className='w-5 h-5' />
                        <FiUser className='w-5 h-5' />
                     </div>
                  )}
               </motion.div>

               {/* Chat Window */}
               <motion.div
                  initial={{ width: userId ? "100%" : 0, opacity: 0 }}
                  animate={{ width: userId ? "100%" : 0, opacity: userId ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-1 min-w-0 ${!userId ? "hidden" : "flex flex-col"}`}
               >
                  {userId && (
                     <>
                        <div className='p-4 border-b bg-white shadow-sm flex items-center gap-4'>
                           <button
                              onClick={() => navigate(-1)}
                              className='p-2 rounded-full hover:bg-gray-100 text-gray-500'
                              aria-label='Back'
                           >
                              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                              </svg>
                           </button>
                           <h2 className='text-xl font-semibold text-charcoal-gray'>Chat</h2>
                        </div>
                        <div className='flex-1'>
                           <ChatWindow />
                        </div>
                     </>
                  )}
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Messages;
