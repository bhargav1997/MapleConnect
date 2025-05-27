import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatUsers from "../components/chat/ChatUsers";
import { motion } from "framer-motion";

const Messages = () => {
   const { userId } = useParams();
   const [isMobileView, setIsMobileView] = useState(false);
   const [activeTab, setActiveTab] = useState("conversations");

   return (
      <div className='bg-whisper-white min-h-screen'>
         {/* Hero Section */}
         <div className='relative bg-gradient-to-r from-maple-red to-maple-red/80 text-white'>
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10'>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className='text-4xl md:text-5xl font-bold mb-4'>Messages</h1>
                  <p className='text-xl text-white/90 max-w-2xl'>
                     Connect with your community through private conversations. Stay in touch with friends and make new connections.
                  </p>
               </motion.div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className='bg-white rounded-xl shadow-md overflow-hidden'>
               <div className='flex h-[calc(100vh-16rem)]'>
                  {/* Chat List */}
                  <motion.div
                     initial={{ width: userId ? (isMobileView ? 0 : "30%") : "100%" }}
                     animate={{ width: userId ? (isMobileView ? 0 : "30%") : "100%" }}
                     className={`border-r ${userId && isMobileView ? "hidden lg:block" : "block"}`}>
                     <div className='p-4 border-b bg-white shadow-sm z-10'>
                        <div className='flex items-center justify-between mb-2'>
                           <h2 className='text-xl font-semibold text-charcoal-gray'>Conversations</h2>
                           <div className='flex space-x-2'>
                              <button
                                 onClick={() => setActiveTab("conversations")}
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === "conversations" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}>
                                 Conversations
                              </button>
                              <button
                                 onClick={() => setActiveTab("users")}
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === "users" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}>
                                 Find Users
                              </button>
                           </div>
                        </div>
                     </div>
                     <div className='h-[calc(100%-5rem)] overflow-y-auto p-4'>
                        {activeTab === "conversations" ? <ChatList /> : <ChatUsers />}
                     </div>
                  </motion.div>

                  {/* Chat Window - always visible */}
                  <motion.div
                     initial={{ width: userId ? (isMobileView ? "100%" : "70%") : "70%" }}
                     animate={{ width: userId ? (isMobileView ? "100%" : "70%") : "70%" }}
                     className='flex flex-col h-full min-h-0 flex-1'>
                     {userId ? (
                        <>
                           <div className='p-4 border-b bg-white shadow-sm z-10 flex items-center justify-between min-h-[64px]'>
                              <button onClick={() => setIsMobileView(true)} className='lg:hidden text-gray-500 hover:text-gray-700'>
                                 <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                                 </svg>
                              </button>
                              <h2 className='text-xl font-semibold text-charcoal-gray'>Chat</h2>
                              <div className='w-6 h-6'></div> {/* Spacer for alignment */}
                           </div>
                           <div className='h-[calc(100%-4rem)]'>
                              <ChatWindow />
                           </div>
                        </>
                     ) : (
                        <div className='flex flex-col items-center justify-center h-full bg-gray-50 text-center p-8'>
                           <div className='w-20 h-20 mx-auto mb-4 text-gray-300'>
                              <svg className='w-full h-full' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                 />
                              </svg>
                           </div>
                           <h2 className='text-2xl font-semibold text-charcoal-gray mb-2'>Welcome to MapleConnect Chat</h2>
                           <p className='text-gray-500 mb-4'>Select a conversation or find a user to start chatting.</p>
                        </div>
                     )}
                  </motion.div>
               </div>
            </motion.div>
         </div>
      </div>
   );
};

export default Messages;
