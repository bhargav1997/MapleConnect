import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ThoughtStory from "./ThoughtStory";
import CreateThought from "./CreateThought";
import { getThoughts } from "../../services/thoughtService";
import { useAuth } from "../../context/AuthContext";

const ThoughtsContainer = ({ isOpen, onClose, thoughts: initialThoughts = [], initialStoryIndex = null, onStoryCreated }) => {
   const { user } = useAuth();
   const [thoughts, setThoughts] = useState(initialThoughts);
   const [activeUserIndex, setActiveUserIndex] = useState(0);
   const [activeThoughtIndex, setActiveThoughtIndex] = useState(0);
   const [showCreateModal, setShowCreateModal] = useState(false);
   const [progress, setProgress] = useState(0);
   const progressInterval = useRef(null);

   // Group thoughts by user
   const groupedThoughts = useMemo(() => {
      const grouped = {};

      initialThoughts.forEach((thought) => {
         if (!grouped[thought.user._id]) {
            grouped[thought.user._id] = {
               user: thought.user,
               thoughts: [],
            };
         }
         grouped[thought.user._id].thoughts.push(thought);
      });

      return Object.values(grouped).sort((a, b) => {
         // Current user's stories first
         if (a.user._id === user?._id) return -1;
         if (b.user._id === user?._id) return 1;
         // Then sort by most recent story
         return new Date(b.thoughts[0].createdAt) - new Date(a.thoughts[0].createdAt);
      });
   }, [initialThoughts, user]);

   useEffect(() => {
      if (initialStoryIndex !== null) {
         // Find which user group contains the thought at initialStoryIndex
         let cumulativeIndex = 0;
         for (let i = 0; i < groupedThoughts.length; i++) {
            if (cumulativeIndex + groupedThoughts[i].thoughts.length > initialStoryIndex) {
               setActiveUserIndex(i);
               setActiveThoughtIndex(initialStoryIndex - cumulativeIndex);
               break;
            }
            cumulativeIndex += groupedThoughts[i].thoughts.length;
         }
      }
   }, [initialStoryIndex, groupedThoughts]);

   useEffect(() => {
      if (!isOpen) return;

      // Reset progress when story changes
      setProgress(0);

      // Start progress timer
      progressInterval.current = setInterval(() => {
         setProgress((prev) => {
            if (prev >= 100) {
               clearInterval(progressInterval.current);
               handleNext();
               return 0;
            }
            return prev + 0.3; // Adjust this value to control speed
         });
      }, 20);

      return () => {
         if (progressInterval.current) {
            clearInterval(progressInterval.current);
         }
      };
   }, [activeUserIndex, activeThoughtIndex, isOpen]);

   const handleNext = () => {
      clearInterval(progressInterval.current);
      setProgress(0);

      const currentUserStories = groupedThoughts[activeUserIndex]?.thoughts || [];
      if (activeThoughtIndex < currentUserStories.length - 1) {
         setActiveThoughtIndex((prev) => prev + 1);
      } else if (activeUserIndex < groupedThoughts.length - 1) {
         setActiveUserIndex((prev) => prev + 1);
         setActiveThoughtIndex(0);
      } else {
         onClose();
      }
   };

   const handlePrevious = () => {
      clearInterval(progressInterval.current);
      setProgress(0);

      if (activeThoughtIndex > 0) {
         setActiveThoughtIndex((prev) => prev - 1);
      } else if (activeUserIndex > 0) {
         setActiveUserIndex((prev) => prev - 1);
         setActiveThoughtIndex(groupedThoughts[activeUserIndex - 1].thoughts.length - 1);
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
                  {/* Navigation Buttons */}
                  <button
                     onClick={handlePrevious}
                     className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10 z-10'
                     aria-label='Previous story'>
                     <FiChevronLeft className='w-8 h-8' />
                  </button>
                  <button
                     onClick={handleNext}
                     className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10 z-10'
                     aria-label='Next story'>
                     <FiChevronRight className='w-8 h-8' />
                  </button>

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
                              key={currentThought._id}
                              thought={currentThought}
                              isActive={true}
                              onClose={onClose}
                              onDelete={handleThoughtDeleted}
                              onNext={handleNext}
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
