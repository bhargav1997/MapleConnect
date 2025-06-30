import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { toast } from "react-hot-toast";

const FeedPreferences = ({ isOpen, onClose, onUpdate }) => {
   const { user } = useAuth();
   const [preferences, setPreferences] = useState({
      sortBy: "recent",
      contentTypes: ["text", "images", "polls"],
      prioritizeFollowing: true,
      showReplies: true,
      topicsOfInterest: [],
      excludedTopics: [],
      minimumEngagement: 0,
      timeWindow: "all",
      sentimentFilter: ["POSITIVE", "NEUTRAL"], // Default: show positive & neutral
   });
   const [newTopic, setNewTopic] = useState("");
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (user?.feedPreferences) {
         setPreferences((prev) => ({
            ...prev,
            ...user.feedPreferences,
            sentimentFilter: user.feedPreferences.sentimentFilter || ["POSITIVE", "NEUTRAL"],
         }));
      }
   }, [user]);

   const handleSave = async () => {
      try {
         setLoading(true);
         const response = await api.put("/users/feed-preferences", preferences);
         if (response.data.success) {
            toast.success("Feed preferences updated!");
            onUpdate();
            onClose();
         }
      } catch (error) {
         console.error("Error updating feed preferences:", error);
         toast.error("Failed to update preferences");
      } finally {
         setLoading(false);
      }
   };

   const addTopic = (type) => {
      if (!newTopic.trim()) return;

      if (type === "interest") {
         setPreferences((prev) => ({
            ...prev,
            topicsOfInterest: [...new Set([...prev.topicsOfInterest, newTopic.trim()])],
         }));
      } else {
         setPreferences((prev) => ({
            ...prev,
            excludedTopics: [...new Set([...prev.excludedTopics, newTopic.trim()])],
         }));
      }
      setNewTopic("");
   };

   const removeTopic = (topic, type) => {
      if (type === "interest") {
         setPreferences((prev) => ({
            ...prev,
            topicsOfInterest: prev.topicsOfInterest.filter((t) => t !== topic),
         }));
      } else {
         setPreferences((prev) => ({
            ...prev,
            excludedTopics: prev.excludedTopics.filter((t) => t !== topic),
         }));
      }
   };

   if (!isOpen) return null;

   return (
      <div
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
         <div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className='bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
            <div className='p-6'>
               <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold text-gray-900'>Feed Preferences</h2>
                  <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                     <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                     </svg>
                  </button>
               </div>

               <div className='space-y-6'>
                  {/* Sort Order */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Sort Posts By</label>
                     <select
                        value={preferences.sortBy}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, sortBy: e.target.value }))}
                        className='w-full rounded-lg border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red'>
                        <option value='recent'>Most Recent</option>
                        <option value='popular'>Most Popular</option>
                        <option value='relevant'>Most Relevant</option>
                     </select>
                  </div>

                  {/* Sentiment Filter */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Show Posts With Mood</label>
                     <div className='flex gap-4'>
                        {[
                           { label: "Positive", value: "POSITIVE", emoji: "😊" },
                           { label: "Neutral", value: "NEUTRAL", emoji: "😐" },
                           { label: "Negative", value: "NEGATIVE", emoji: "😞" },
                        ].map((mood) => (
                           <label key={mood.value} className='flex items-center gap-1'>
                              <input
                                 type='checkbox'
                                 checked={preferences.sentimentFilter.includes(mood.value)}
                                 onChange={(e) => {
                                    setPreferences((prev) => {
                                       const newFilter = e.target.checked
                                          ? [...prev.sentimentFilter, mood.value]
                                          : prev.sentimentFilter.filter((v) => v !== mood.value);
                                       return { ...prev, sentimentFilter: newFilter };
                                    });
                                 }}
                                 className='rounded border-gray-300 text-maple-red focus:ring-maple-red'
                              />
                              <span>
                                 {mood.emoji} {mood.label}
                              </span>
                           </label>
                        ))}
                     </div>
                     <div className='text-xs text-gray-400 mt-1'>(Mood is automatically analyzed by AI)</div>
                  </div>

                  {/* Content Types */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Content Types</label>
                     <div className='space-y-2'>
                        {["text", "images", "polls"].map((type) => (
                           <label key={type} className='flex items-center'>
                              <input
                                 type='checkbox'
                                 checked={preferences.contentTypes.includes(type)}
                                 onChange={(e) => {
                                    const newTypes = e.target.checked
                                       ? [...preferences.contentTypes, type]
                                       : preferences.contentTypes.filter((t) => t !== type);
                                    setPreferences((prev) => ({ ...prev, contentTypes: newTypes }));
                                 }}
                                 className='rounded border-gray-300 text-maple-red focus:ring-maple-red'
                              />
                              <span className='ml-2 text-gray-700 capitalize'>{type}</span>
                           </label>
                        ))}
                     </div>
                  </div>

                  {/* Time Window */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Show Posts From</label>
                     <select
                        value={preferences.timeWindow}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, timeWindow: e.target.value }))}
                        className='w-full rounded-lg border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red'>
                        <option value='all'>All Time</option>
                        <option value='day'>Past 24 Hours</option>
                        <option value='week'>Past Week</option>
                        <option value='month'>Past Month</option>
                     </select>
                  </div>

                  {/* Topics of Interest */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Topics of Interest</label>
                     <div className='flex gap-2 mb-2'>
                        <input
                           type='text'
                           value={newTopic}
                           onChange={(e) => setNewTopic(e.target.value)}
                           placeholder='Add a topic'
                           className='flex-1 rounded-lg border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red'
                        />
                        <button
                           onClick={() => addTopic("interest")}
                           className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark'>
                           Add
                        </button>
                     </div>
                     <div className='flex flex-wrap gap-2'>
                        {preferences.topicsOfInterest.map((topic) => (
                           <span key={topic} className='px-3 py-1 bg-maple-red/10 text-maple-red rounded-full flex items-center'>
                              {topic}
                              <button onClick={() => removeTopic(topic, "interest")} className='ml-2'>
                                 ×
                              </button>
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* Excluded Topics */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Topics to Exclude</label>
                     <div className='flex gap-2 mb-2'>
                        <input
                           type='text'
                           value={newTopic}
                           onChange={(e) => setNewTopic(e.target.value)}
                           placeholder='Add a topic to exclude'
                           className='flex-1 rounded-lg border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red'
                        />
                        <button
                           onClick={() => addTopic("exclude")}
                           className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark'>
                           Add
                        </button>
                     </div>
                     <div className='flex flex-wrap gap-2'>
                        {preferences.excludedTopics.map((topic) => (
                           <span key={topic} className='px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center'>
                              {topic}
                              <button onClick={() => removeTopic(topic, "exclude")} className='ml-2'>
                                 ×
                              </button>
                           </span>
                        ))}
                     </div>
                  </div>

                  {/* Other Preferences */}
                  <div className='space-y-3'>
                     <label className='flex items-center'>
                        <input
                           type='checkbox'
                           checked={preferences.prioritizeFollowing}
                           onChange={(e) => setPreferences((prev) => ({ ...prev, prioritizeFollowing: e.target.checked }))}
                           className='rounded border-gray-300 text-maple-red focus:ring-maple-red'
                        />
                        <span className='ml-2 text-gray-700'>Prioritize posts from people I follow</span>
                     </label>
                     <label className='flex items-center'>
                        <input
                           type='checkbox'
                           checked={preferences.showReplies}
                           onChange={(e) => setPreferences((prev) => ({ ...prev, showReplies: e.target.checked }))}
                           className='rounded border-gray-300 text-maple-red focus:ring-maple-red'
                        />
                        <span className='ml-2 text-gray-700'>Show replies in feed</span>
                     </label>
                  </div>

                  {/* Minimum Engagement */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Minimum Engagement (likes + comments)</label>
                     <input
                        type='number'
                        min='0'
                        value={preferences.minimumEngagement}
                        onChange={(e) => setPreferences((prev) => ({ ...prev, minimumEngagement: parseInt(e.target.value) || 0 }))}
                        className='w-full rounded-lg border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red'
                     />
                  </div>
               </div>

               <div className='mt-6 flex justify-end gap-3'>
                  <button onClick={onClose} className='px-4 py-2 text-gray-700 hover:text-gray-900'>
                     Cancel
                  </button>
                  <button
                     onClick={handleSave}
                     disabled={loading}
                     className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark disabled:opacity-50'>
                     {loading ? "Saving..." : "Save Preferences"}
                  </button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default FeedPreferences;
