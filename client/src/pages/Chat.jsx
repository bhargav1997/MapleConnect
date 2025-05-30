import { useState } from "react";
import { useParams } from "react-router-dom";
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/chat/ChatWindow";
import ChatUsers from "../components/chat/ChatUsers";
import { motion } from "framer-motion";

const Chat = () => {
   const { userId } = useParams();
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
                  className={`border-r bg-white transition-all duration-300 flex flex-col items-start`}>
                  {/* Only show title & buttons if NO chat is open */}
                  {!userId && (
                     <div className='p-4 border-b bg-white shadow-sm z-10 w-full'>
                        <div className='flex flex-col'>
                           <h2 className='text-xl font-semibold text-charcoal-gray mb-4 text-center'>Conversations</h2>
                           <div className='flex flex-col space-y-2 w-full'>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === "conversations" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => setActiveTab("conversations")}>
                                 Conversations 22
                              </button>
                              <button
                                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === "users" ? "bg-maple-red text-white" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                 }`}
                                 onClick={() => setActiveTab("users")}>
                                 Find Users
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Only show chat list or users list when no chat is open */}
                  {!userId && (
                     <div className='flex-1 w-full overflow-y-auto'>{activeTab === "conversations" ? <ChatList /> : <ChatUsers />}</div>
                  )}
               </motion.div>

               {/* Chat Window */}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: userId ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex-1 min-w-0 ${!userId ? "hidden" : ""}`}>
                  {userId && <ChatWindow />}
               </motion.div>
            </div>
         </div>
      </div>
   );
};

export default Chat;
