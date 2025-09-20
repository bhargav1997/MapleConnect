import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import ThoughtsContainer from "./ThoughtsContainer";
import defaultUserImage from "../../assets/default-user.png";

const StoriesPreview = ({ thoughts }) => {
   const { user } = useAuth();
   const [showStories, setShowStories] = useState(false);
   const [initialStoryIndex, setInitialStoryIndex] = useState(null);

   // Group thoughts by user
   const groupedThoughts = useMemo(() => {
      const grouped = thoughts.reduce((acc, thought) => {
         const userId = thought.user._id;
         if (!acc[userId]) {
            acc[userId] = {
               user: thought.user,
               thoughts: [],
            };
         }
         acc[userId].thoughts.push(thought);
         return acc;
      }, {});

      // Convert to array and sort
      return Object.values(grouped).sort((a, b) => {
         // Current user's stories first
         if (a.user._id === user?._id) return -1;
         if (b.user._id === user?._id) return 1;
         // Then sort by most recent story
         return new Date(b.thoughts[0].createdAt) - new Date(a.thoughts[0].createdAt);
      });
   }, [thoughts, user]);

   const handleAvatarClick = (userIndex) => {
      setInitialStoryIndex(userIndex);
      setShowStories(true);
   };

   return (
      <>
         <div className='flex items-center space-x-4 p-4 overflow-x-auto'>
            {groupedThoughts.map((group, index) => {
               const isCurrentUser = group.user._id === user?._id;
               const hasMultipleStories = group.thoughts.length > 1;

               return (
                  <motion.button
                     key={group.user._id}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => handleAvatarClick(index)}
                     className='flex flex-col items-center space-y-2 min-w-[72px]'>
                     <div
                        className={`relative rounded-full p-1 ${
                           isCurrentUser ? "bg-maple-red" : "bg-gradient-to-tr from-yellow-400 to-fuchsia-600"
                        }`}>
                        <img
                           src={group.user.profileImage || defaultUserImage}
                           alt={group.user.name}
                           className='w-16 h-16 rounded-full object-cover border-2 border-white'
                        />
                        {hasMultipleStories && (
                           <div className='absolute -top-1 -right-1 bg-maple-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>
                              {group.thoughts.length}
                           </div>
                        )}
                     </div>
                     <span className='text-xs text-gray-600 truncate w-full text-center'>
                        {isCurrentUser ? "Your Story" : group.user.name}
                     </span>
                  </motion.button>
               );
            })}
         </div>

         <ThoughtsContainer
            isOpen={showStories}
            onClose={() => setShowStories(false)}
            thoughts={thoughts}
            initialStoryIndex={initialStoryIndex}
         />
      </>
   );
};

export default StoriesPreview;
