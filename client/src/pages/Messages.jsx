import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ConversationList from "../components/messages/ConversationList";
import MessageThread from "../components/messages/MessageThread";

const Messages = () => {
   const { userId } = useParams();
   const [selectedUser, setSelectedUser] = useState(null);
   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
   const [showConversations, setShowConversations] = useState(!userId);

   useEffect(() => {
      const handleResize = () => {
         const mobile = window.innerWidth < 768;
         setIsMobileView(mobile);

         // On desktop, always show both panels
         if (!mobile) {
            setShowConversations(true);
         }
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, []);

   useEffect(() => {
      if (userId) {
         // If userId is provided in the URL, set it as the selected user
         setSelectedUser({ _id: userId });

         // On mobile, show the message thread when a userId is provided
         if (isMobileView) {
            setShowConversations(false);
         }
      }
   }, [userId, isMobileView]);

   const handleSelectConversation = (user) => {
      setSelectedUser(user);

      // On mobile, switch to message thread view
      if (isMobileView) {
         setShowConversations(false);
      }
   };

   const handleBackToConversations = () => {
      setShowConversations(true);
   };

   return (
      <div className='bg-whisper-white min-h-screen'>
         {/* Hero Section */}
         <div className='relative bg-gradient-to-r from-maple-red to-maple-red/80 text-white'>
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10'>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className='text-3xl md:text-4xl font-bold mb-2'>Messages</h1>
                  <p className='text-lg text-white/90 max-w-2xl'>Connect with your community through private conversations</p>
               </motion.div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
            <div className='flex flex-col md:flex-row gap-6 h-[calc(100vh-250px)] min-h-[500px]'>
               {/* Mobile back button */}
               {isMobileView && selectedUser && !showConversations && (
                  <motion.button
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className='mb-4 inline-flex items-center text-maple-red hover:text-maple-red-dark'
                     onClick={handleBackToConversations}>
                     <svg className='w-5 h-5 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                     </svg>
                     Back to conversations
                  </motion.button>
               )}

               {/* Conversation List */}
               {(!isMobileView || showConversations) && (
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.3 }}
                     className='md:w-1/3 h-full'>
                     <ConversationList onSelectConversation={handleSelectConversation} selectedUserId={selectedUser?._id} />
                  </motion.div>
               )}

               {/* Message Thread */}
               {(!isMobileView || !showConversations) && (
                  <motion.div
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ duration: 0.3 }}
                     className='md:w-2/3 h-full'>
                     <MessageThread selectedUser={selectedUser} onBack={isMobileView ? handleBackToConversations : undefined} />
                  </motion.div>
               )}
            </div>
         </div>
      </div>
   );
};

export default Messages;
