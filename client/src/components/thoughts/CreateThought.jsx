import { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiLink, FiHash, FiFileText, FiType, FiTrendingUp } from "react-icons/fi";
import { createThought } from "../../services/thoughtService";
import { toast } from "react-hot-toast";
import defaultUserImage from "../../assets/default-user.png";
import { useAuth } from "../../context/AuthContext";

const CreateThought = ({ onClose, onSubmit }) => {
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const [type, setType] = useState("text"); // text, link, article
   const [topics, setTopics] = useState([]);
   const [currentTopic, setCurrentTopic] = useState("");
   const [error, setError] = useState("");

   // Sample trending topics - in real app, fetch from API
   const trendingTopics = ["MapleLife", "CanadianCulture", "TechInnovation", "StartupScene", "CommunityEvents", "LocalBusiness"];

   const handleTopicKeyDown = (e) => {
      if (e.key === "Enter" || e.key === ",") {
         e.preventDefault();
         addTopic();
      }
   };

   const addTopic = (topicToAdd = currentTopic) => {
      const topic = topicToAdd
         .trim()
         .toLowerCase()
         .replace(/[^a-z0-9]/g, "");
      if (topic && !topics.includes(topic) && topics.length < 5) {
         setTopics([...topics, topic]);
         setCurrentTopic("");
      }
   };

   const removeTopic = (topicToRemove) => {
      setTopics(topics.filter((topic) => topic !== topicToRemove));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!content.trim()) {
         setError("Please enter some content");
         return;
      }

      if (type === "link" && !isValidUrl(content)) {
         setError("Please enter a valid URL");
         return;
      }

      try {
         const response = await createThought({
            content: content.trim(),
            type,
            topics,
         });

         if (response.success) {
            toast.success("Story shared successfully!");
            // Pass the new thought data to parent component
            onSubmit(response.data);
            // Clear form
            setContent("");
            setTopics([]);
            setCurrentTopic("");
            // Close modal with animation
            setTimeout(() => {
               onClose();
            }, 500);
         }
      } catch (error) {
         console.error("Error creating story:", error);
         toast.error(error.response?.data?.message || "Failed to create story");
      }
   };

   const isValidUrl = (string) => {
      try {
         new URL(string);
         return true;
      } catch (_) {
         return false;
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className='fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4'>
         <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden'>
            {/* Header */}
            <div className='border-b border-gray-100 p-4 flex items-center justify-between'>
               <h2 className='text-lg font-semibold text-charcoal-gray'>Create Story</h2>
               <button
                  onClick={onClose}
                  className='text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100'
                  aria-label='Close modal'>
                  <FiX className='w-5 h-5' />
               </button>
            </div>

            <form onSubmit={handleSubmit} className='p-4'>
               {/* User Info */}
               <div className='flex items-center space-x-3 mb-4'>
                  <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-maple-red'>
                     <img src={user?.profileImage || defaultUserImage} alt={user?.name} className='w-full h-full object-cover' />
                  </div>
                  <div>
                     <h3 className='font-medium text-gray-900'>{user?.name}</h3>
                     <p className='text-xs text-gray-500'>Your story will be visible for 24 hours</p>
                  </div>
               </div>

               {/* Type Selection */}
               <div className='grid grid-cols-3 gap-2 mb-4'>
                  <button
                     type='button'
                     onClick={() => setType("text")}
                     className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                        type === "text"
                           ? "bg-maple-red text-white shadow-md transform scale-105"
                           : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                     }`}>
                     <FiType className='w-4 h-4' />
                     <span>Text</span>
                  </button>
                  <button
                     type='button'
                     onClick={() => setType("link")}
                     className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                        type === "link"
                           ? "bg-maple-red text-white shadow-md transform scale-105"
                           : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                     }`}>
                     <FiLink className='w-4 h-4' />
                     <span>Link</span>
                  </button>
                  <button
                     type='button'
                     onClick={() => setType("article")}
                     className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg transition-all ${
                        type === "article"
                           ? "bg-maple-red text-white shadow-md transform scale-105"
                           : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                     }`}>
                     <FiFileText className='w-4 h-4' />
                     <span>Article</span>
                  </button>
               </div>

               {/* Content Input */}
               <div className='mb-4'>
                  <textarea
                     value={content}
                     onChange={(e) => {
                        setContent(e.target.value);
                        setError("");
                     }}
                     placeholder={type === "text" ? "What's on your mind?" : type === "link" ? "Enter a URL" : "Write your article..."}
                     className={`w-full px-4 py-3 rounded-lg border ${
                        error
                           ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                           : "border-gray-200 focus:border-maple-red focus:ring-maple-red/20"
                     } focus:ring-2 focus:ring-opacity-50 resize-none transition-all`}
                     rows={type === "article" ? 6 : 3}
                  />
                  {error && (
                     <p className='mt-1 text-sm text-red-500 flex items-center'>
                        <FiX className='w-4 h-4 mr-1' />
                        {error}
                     </p>
                  )}
               </div>

               {/* Topics Section */}
               <div className='mb-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Add Topics (max 5)</label>

                  {/* Topics Input */}
                  <div className='relative mb-2'>
                     <FiHash className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
                     <input
                        type='text'
                        value={currentTopic}
                        onChange={(e) => setCurrentTopic(e.target.value)}
                        onKeyDown={handleTopicKeyDown}
                        placeholder='Add topics (press Enter)'
                        className='w-full pl-9 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-maple-red focus:border-maple-red'
                        disabled={topics.length >= 5}
                     />
                  </div>

                  {/* Selected Topics */}
                  {topics.length > 0 && (
                     <div className='flex flex-wrap gap-2 mb-3'>
                        {topics.map((topic) => (
                           <span
                              key={topic}
                              className='px-3 py-1 bg-maple-red/10 text-maple-red rounded-full text-sm font-medium flex items-center gap-1'>
                              #{topic}
                              <button type='button' onClick={() => removeTopic(topic)} className='hover:text-maple-red-dark'>
                                 <FiX className='w-4 h-4' />
                              </button>
                           </span>
                        ))}
                     </div>
                  )}

                  {/* Trending Topics */}
                  <div>
                     <div className='flex items-center gap-2 text-sm text-gray-500 mb-2'>
                        <FiTrendingUp className='w-4 h-4' />
                        <span>Trending Topics</span>
                     </div>
                     <div className='flex flex-wrap gap-2'>
                        {trendingTopics.map((topic) => (
                           <button
                              key={topic}
                              type='button'
                              onClick={() => addTopic(topic)}
                              disabled={topics.includes(topic.toLowerCase()) || topics.length >= 5}
                              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                 topics.includes(topic.toLowerCase()) || topics.length >= 5
                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              }`}>
                              #{topic}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Submit Button */}
               <div className='flex justify-end space-x-3'>
                  <button
                     type='button'
                     onClick={onClose}
                     className='px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors'>
                     Cancel
                  </button>
                  <button
                     type='submit'
                     className='px-6 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
                     disabled={!content.trim()}>
                     <span>Share Story</span>
                  </button>
               </div>
            </form>
         </motion.div>
      </motion.div>
   );
};

export default CreateThought;
