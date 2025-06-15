import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThoughtStory from "./ThoughtStory";
import CreateThought from "./CreateThought";
import { useAuth } from "../../context/AuthContext";

const ThoughtsContainer = ({ isOpen, onClose, thoughts: initialThoughts = [], initialStoryIndex = null, onStoryCreated }) => {
   const { user } = useAuth();
   const [thoughts, setThoughts] = useState(initialThoughts);
   const [activeUserIndex, setActiveUserIndex] = useState(0);
   const [activeThoughtIndex, setActiveThoughtIndex] = useState(0);
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [progress, setProgress] = useState(0);
   const progressInterval = useRef(null);

   // Group thoughts by user and ensure they're in chronological order
   const groupedThoughts = useMemo(() => {
      const grouped = {};

      initialThoughts.forEach((thought) => {
         if (!grouped[thought.user._id]) {
            grouped[thought.user._id] = {
               user: thought.user,
               thoughts: [],
            };
         }
         // Add thought and sort by date to maintain chronological order
         grouped[thought.user._id].thoughts.push(thought);
         grouped[thought.user._id].thoughts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });

      return Object.values(grouped).sort((a, b) => {
         // Current user's stories first
         if (a.user._id === user?._id) return -1;
         if (b.user._id === user?._id) return 1;
         // Then sort by most recent story
         return new Date(b.thoughts[0].createdAt) - new Date(a.thoughts[0].createdAt);
      });
   }, [initialThoughts, user]);

   // In ThoughtsContainer.js
   useEffect(() => {
      if (initialStoryIndex !== null && initialStoryIndex >= 0 && initialStoryIndex < initialThoughts.length) {
         // Find which user group contains the thought at initialStoryIndex
         let cumulativeIndex = 0;
         for (let i = 0; i < groupedThoughts.length; i++) {
            const userThoughts = groupedThoughts[i].thoughts;
            if (cumulativeIndex + userThoughts.length > initialStoryIndex) {
               setActiveUserIndex(i);
               setActiveThoughtIndex(initialStoryIndex - cumulativeIndex);
               break;
            }
            cumulativeIndex += userThoughts.length;
         }
      }
   }, [initialStoryIndex, groupedThoughts, initialThoughts.length]);

   useEffect(() => {
      if (!isOpen) return;

      // Reset progress when story changes
      setProgress(0);

      // Calculate timing based on story duration
      const STORY_DURATION = 10000; // 10 seconds per story
      const PROGRESS_INTERVAL = 50; // Update every 50ms
      const PROGRESS_INCREMENT = (100 * PROGRESS_INTERVAL) / STORY_DURATION;

      // Start progress timer
      progressInterval.current = setInterval(() => {
         setProgress((prev) => {
            const nextProgress = prev + PROGRESS_INCREMENT;
            if (nextProgress >= 100) {
               clearInterval(progressInterval.current);
               handleNext();
               return 0;
            }
            return nextProgress;
         });
      }, PROGRESS_INTERVAL);

      return () => {
         if (progressInterval.current) {
            clearInterval(progressInterval.current);
         }
      };
   }, [activeUserIndex, activeThoughtIndex, isOpen]);

   const handleNext = () => {
      clearInterval(progressInterval.current);
      setProgress(0);

      // Get current user's stories
      const currentUserStories = groupedThoughts[activeUserIndex]?.thoughts || [];

      // Calculate next indexes based on current state
      let nextThoughtIndex = activeThoughtIndex + 1;
      let nextUserIndex = activeUserIndex;

      // If we're at the end of current user's stories, move to next user
      if (nextThoughtIndex >= currentUserStories.length) {
         nextThoughtIndex = 0;
         nextUserIndex = activeUserIndex + 1;
      }

      // If we've reached the end of all stories, close the viewer
      if (nextUserIndex >= groupedThoughts.length) {
         onClose();
         return;
      }

      // Update state
      setActiveThoughtIndex(nextThoughtIndex);
      setActiveUserIndex(nextUserIndex);
   };

   const handlePrevious = () => {
      clearInterval(progressInterval.current);
      setProgress(0);

      // Calculate next indexes based on current state
      let prevThoughtIndex = activeThoughtIndex - 1;
      let prevUserIndex = activeUserIndex;

      // If we're at the start of current user's stories, move to previous user
      if (prevThoughtIndex < 0) {
         prevUserIndex = activeUserIndex - 1;
         // If there's a previous user, set to their last story
         if (prevUserIndex >= 0) {
            prevThoughtIndex = (groupedThoughts[prevUserIndex]?.thoughts?.length || 0) - 1;
         }
      }

      // Only update if we have valid indexes
      if (prevUserIndex >= 0 && prevThoughtIndex >= 0) {
         setActiveThoughtIndex(prevThoughtIndex);
         setActiveUserIndex(prevUserIndex);
      }
   };

   const handleThoughtCreated = (newThought) => {
      setThoughts((prev) => [newThought, ...prev]);
      setShowCreateModal(false);
      if (onStoryCreated) {
         onStoryCreated(newThought);
      }
   };

   const handleThoughtDeleted = (thoughtId) => {
      setThoughts((prev) => prev.filter((t) => t._id !== thoughtId));
      handleNext();
   };

   if (!isOpen) return null;

   const currentUserStories = groupedThoughts[activeUserIndex]?.thoughts || [];
   const currentThought = currentUserStories[activeThoughtIndex];

   return (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'>
         <AnimatePresence>
            {showCreateModal ? (
               <CreateThought onClose={() => setShowCreateModal(false)} onSubmit={handleThoughtCreated} />
            ) : (
               <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className='relative w-full max-w-2xl mx-auto h-full flex flex-col'>
                  {/* Story Display + Progress Bar */}
                  <div className='flex-1 flex flex-col items-center justify-center gap-4 px-4'>
                     {/* Progress bars */}
                     {currentUserStories.length > 0 && (
                        <div className='w-full flex gap-1 z-10'>
                           {currentUserStories.map((_, idx) => (
                              <div key={idx} className='h-1 flex-1 bg-gray-300 rounded-full overflow-hidden'>
                                 <div
                                    className={`h-full ${
                                       idx === activeThoughtIndex ? "bg-white" : idx < activeThoughtIndex ? "bg-white" : "bg-white/30"
                                    }`}
                                    style={{
                                       width:
                                          idx === activeThoughtIndex
                                             ? `${Number.isFinite(progress) ? progress : 0}%`
                                             : idx < activeThoughtIndex
                                             ? "100%"
                                             : "0%",
                                       transition: idx === activeThoughtIndex ? "width 20ms linear" : "none",
                                    }}
                                 />
                              </div>
                           ))}
                        </div>
                     )}

                     {/* Thought content */}
                     <AnimatePresence mode='wait'>
                        {currentThought ? (
                           <ThoughtStory
                              key={`${currentThought._id}-${activeUserIndex}-${activeThoughtIndex}`}
                              thought={currentThought}
                              isActive={true}
                              onClose={onClose}
                              onDelete={handleThoughtDeleted}
                              onNext={handleNext}
                              onPrevious={handlePrevious}
                           />
                        ) : (
                           <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className='bg-white rounded-lg p-8 text-center'>
                              <p className='text-gray-600 mb-4'>No stories to display</p>
                              <button
                                 onClick={() => setShowCreateModal(true)}
                                 className='px-6 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-all transform hover:scale-105 active:scale-95'>
                                 Create Your First Story
                              </button>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default ThoughtsContainer;
