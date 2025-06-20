import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FiX, FiHeart, FiMessageCircle, FiShare2, FiBookmark, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { deleteThought } from "../../services/thoughtService";
import { toast } from "react-hot-toast";
import ConfirmationDialog from "../common/ConfirmationDialog";
import ShareStoryModal from "./ShareStoryModal";

const STORY_DURATION = 10000; // 10 seconds per story

const ThoughtStory = ({ thought, onClose, isActive, onDelete, onNext, totalStories, currentIndex, onPrevious }) => {
   const { user } = useAuth();
   const [progress, setProgress] = useState(0);
   const [isDeleting, setIsDeleting] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);

   // Reset progress when story changes
   useEffect(() => {
      setProgress(0);
   }, [thought._id]);

   // Auto-advance timer
   useEffect(() => {
      if (!isActive) return;

      const startTime = Date.now();
      const timer = setInterval(() => {
         const elapsed = Date.now() - startTime;
         const newProgress = (elapsed / STORY_DURATION) * 100;

         if (newProgress >= 100) {
            onNext();
         } else {
            setProgress(newProgress);
         }
      }, 100);

      return () => clearInterval(timer);
   }, [isActive, thought._id, onNext]);

   const handleDelete = useCallback(async () => {
      try {
         setIsDeleting(true);
         const response = await deleteThought(thought._id);
         if (response.success) {
            toast.success("Story deleted successfully");
            if (onDelete) {
               onDelete(thought._id);
            }
            setShowDeleteConfirm(false);
         } else {
            throw new Error(response.error || "Failed to delete story");
         }
      } catch (error) {
         console.error("Delete error:", error);
         toast.error(error.message || "Failed to delete story");
      } finally {
         setIsDeleting(false);
      }
   }, [thought._id, onDelete]);

   const handleShare = useCallback((users) => {
      toast.success(`Shared story with ${users.length} ${users.length === 1 ? "user" : "users"}`);
   }, []);

   // Check if the current user is the author of the thought
   const isAuthor =
      user &&
      thought.user &&
      (user._id === thought.user._id || // Check direct _id match
         user.id === thought.user._id || // Check if user.id matches thought.user._id
         user._id === thought.user.id || // Check if user._id matches thought.user.id
         user.id === thought.user.id); // Check if user.id matches thought.user.id

   useEffect(() => {
      // Debug log for user comparison
      if (user && thought.user) {
         console.log("Auth check:", {
            currentUser: { id: user.id, _id: user._id },
            thoughtUser: { id: thought.user.id, _id: thought.user._id },
            isAuthor,
         });
      }
   }, [user, thought.user, isAuthor]);

   const renderContent = () => {
      if (thought.type === "link") {
         return (
            <a href={thought.content} target='_blank' rel='noopener noreferrer' className='text-blue-500 underline break-all'>
               {thought.content}
            </a>
         );
      }
      return <p className='text-lg whitespace-pre-wrap break-words'>{thought.content}</p>;
   };

   // Helper for mood display
   const getMoodDisplay = (mood) => {
      switch ((mood || "").toUpperCase()) {
         case "POSITIVE":
            return { label: "Positive", color: "text-green-600", emoji: "😊" };
         case "NEGATIVE":
            return { label: "Negative", color: "text-red-600", emoji: "😞" };
         case "NEUTRAL":
         default:
            return { label: "Neutral", color: "text-gray-500", emoji: "😐" };
      }
   };

   const moodInfo = getMoodDisplay(thought.sentiment?.mood);

   return (
      <>
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl relative'>
            {/* Progress Bar */}
            <div className='h-1 bg-gray-200'>
               <motion.div
                  className='h-full bg-maple-red'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
               />
            </div>

            {/* Header */}
            <div className='p-4 border-b border-gray-100 flex items-center justify-between'>
               <div className='flex items-center space-x-3'>
                  <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-maple-red'>
                     <img src={thought.user?.profileImage} alt={thought.user?.name} className='w-full h-full object-cover' />
                  </div>
                  <div>
                     <h3 className='font-medium text-gray-900'>{thought.user?.name}</h3>
                     <p className='text-xs text-gray-500'>{formatDistanceToNow(new Date(thought.createdAt), { addSuffix: true })}</p>
                  </div>
               </div>
               <div className='flex items-center space-x-2'>
                  {isAuthor && (
                     <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={isDeleting}
                        className='text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 disabled:opacity-50'
                        aria-label='Delete story'>
                        <FiTrash2 className='w-5 h-5' />
                     </button>
                  )}
                  <button
                     onClick={onClose}
                     className='text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                     aria-label='Close story'>
                     <FiX className='w-5 h-5' />
                  </button>
               </div>
            </div>

            {/* Content */}
            <div className='p-6 bg-gradient-to-br from-gray-50 to-white'>
               {/* Topics */}
               <div className='flex flex-wrap gap-2 mb-4'>
                  {thought.topics.map((topic) => (
                     <span key={topic} className='px-3 py-1 bg-maple-red/10 text-maple-red rounded-full text-sm font-medium'>
                        #{topic}
                     </span>
                  ))}
               </div>

               {/* Main content */}
               <div className='mb-6'>{renderContent()}</div>

               {/* Mood Indicator (AI-analyzed) */}
               <div className='flex items-center gap-2 pb-2 mb-2'>
                  <span
                     className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 ${moodInfo.color}`}
                     title='This mood is analyzed by AI, not set by the user.'>
                     <span className='mr-1'>{moodInfo.emoji}</span>
                     <span>{moodInfo.label}</span>
                     {thought.sentiment?.confidence > 0 && (
                        <span className='ml-1 text-gray-400'>({Math.round(thought.sentiment.confidence * 100)}%)</span>
                     )}
                  </span>
                  <span className='text-xs text-gray-400 ml-2 italic' title='This is an automatic analysis, not user-provided.'>
                     (AI-analyzed mood)
                  </span>
               </div>

               {/* Engagement */}
               <div className='flex items-center justify-between text-gray-500'>
                  <div className='flex items-center space-x-4'>
                     <button className='flex items-center space-x-1 hover:text-maple-red transition-colors'>
                        <FiHeart className='w-5 h-5' />
                        <span className='text-sm'>{thought.likes?.length || 0}</span>
                     </button>
                     <button className='flex items-center space-x-1 hover:text-maple-red transition-colors'>
                        <FiMessageCircle className='w-5 h-5' />
                        <span className='text-sm'>{thought.comments?.length || 0}</span>
                     </button>
                     <button
                        onClick={() => setShowShareModal(true)}
                        className='flex items-center space-x-1 hover:text-maple-red transition-colors'>
                        <FiShare2 className='w-5 h-5' />
                     </button>
                  </div>
                  <button className='hover:text-maple-red transition-colors'>
                     <FiBookmark className='w-5 h-5' />
                  </button>
               </div>
            </div>

            {/* Story Footer */}
            <div className='p-4 bg-gray-50 flex justify-between items-center'>
               <div className='flex items-center space-x-2'>
                  <button
                     onClick={onPrevious}
                     className='flex items-center justify-center px-2 py-2 bg-maple-red text-white rounded-full hover:bg-maple-red-dark transition-colors'>
                     <FiChevronLeft className='w-8 h-8' />
                  </button>
               </div>

               <div className='text-sm text-gray-500'>
                  {typeof currentIndex === "number" && typeof totalStories === "number" ? `${currentIndex + 1} of ${totalStories}` : ""}
               </div>

               <div className='flex items-center space-x-2'>
                  <button
                     onClick={onNext}
                     className='flex items-center justify-center px-2 py-2 bg-maple-red text-white rounded-full hover:bg-maple-red-dark transition-colors'>
                     <FiChevronRight className='w-8 h-8' />
                  </button>
               </div>
            </div>
         </motion.div>

         {/* Confirmation Dialog */}
         <AnimatePresence>
            {showDeleteConfirm && (
               <ConfirmationDialog
                  isOpen={showDeleteConfirm}
                  title='Delete Story'
                  message='Are you sure you want to delete this story? This action cannot be undone.'
                  onConfirm={handleDelete}
                  onCancel={() => setShowDeleteConfirm(false)}
                  confirmText='Delete'
                  cancelText='Cancel'
                  type='danger'
               />
            )}
         </AnimatePresence>

         {/* Share Modal */}
         <AnimatePresence>
            {showShareModal && (
               <ShareStoryModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} thought={thought} onShare={handleShare} />
            )}
         </AnimatePresence>
      </>
   );
};

export default ThoughtStory;
