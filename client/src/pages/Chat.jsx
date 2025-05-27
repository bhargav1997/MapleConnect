import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatUsers from "../components/chat/ChatUsers";
import { motion } from "framer-motion";

const Chat = () => {
   const { userId } = useParams();
   const [isMobileView, setIsMobileView] = useState(false);
   const [activeTab, setActiveTab] = useState("conversations"); // or "users"

   return (
      <div className='container mx-auto px-4 py-8'>
         <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
            <div className='flex h-[calc(100vh-12rem)]'>
               {/* Chat List */}
               <motion.div
                  initial={{ width: userId ? (isMobileView ? 0 : "30%") : "100%" }}
                  animate={{ width: userId ? (isMobileView ? 0 : "30%") : "100%" }}
                  className={`border-r ${userId && isMobileView ? "hidden" : "block"}`}>
                  <div className='p-4 border-b'>
                     <div className='flex items-center justify-between mb-4'>
                        <h2 className='text-xl font-semibold text-gray-900'>Messages</h2>
                        <div className='flex space-x-2'>
                           <button
                              onClick={() => setActiveTab("conversations")}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                 activeTab === "conversations" ? "bg-maple-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}>
                              Conversations
                           </button>
                           <button
                              onClick={() => setActiveTab("users")}
                              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                 activeTab === "users" ? "bg-maple-red text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}>
                              Find Users
                           </button>
                        </div>
                     </div>
                  </div>
                  <div className='h-[calc(100%-5rem)] overflow-y-auto'>{activeTab === "conversations" ? <ChatList /> : <ChatUsers />}</div>
               </motion.div>

               {/* Chat Window */}
               <motion.div
                  initial={{ width: userId ? (isMobileView ? "100%" : "70%") : 0 }}
                  animate={{ width: userId ? (isMobileView ? "100%" : "70%") : 0 }}
                  className={`${!userId && "hidden"}`}>
                  {userId && (
                     <>
                        <div className='p-4 border-b flex items-center justify-between'>
                           <button onClick={() => setIsMobileView(true)} className='lg:hidden text-gray-500 hover:text-gray-700'>
                              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                              </svg>
                           </button>
                           <h2 className='text-xl font-semibold text-gray-900'>Chat</h2>
                        </div>
                        <div className='h-[calc(100%-4rem)]'>
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

export default Chat;
