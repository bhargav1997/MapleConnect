import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { searchUsers } from "../services/userService";
import PollCreator from "./PollCreator";
import PrivacySelector from "./PrivacySelector";
import { getUserInitials } from "../utils/helpers";

const CreatePostForm = ({ onPostCreated, isInModal = false, initialVisibility = "public" }) => {
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const [location, setLocation] = useState("");
   const [locationSearch, setLocationSearch] = useState("");
   const [feeling, setFeeling] = useState("");
   const [activity, setActivity] = useState("");
   const [visibility, setVisibility] = useState(initialVisibility);
   const [media, setMedia] = useState([]);
   const [mediaPreview, setMediaPreview] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [showLocationInput, setShowLocationInput] = useState(false);
   const [showFeelingSelector, setShowFeelingSelector] = useState(false);
   const [selectedFeeling, setSelectedFeeling] = useState(null);
   const [selectedActivity, setSelectedActivity] = useState(null);
   const [showTagPeople, setShowTagPeople] = useState(false);
   const [showPollCreator, setShowPollCreator] = useState(false);
   const [showPrivacySelector, setShowPrivacySelector] = useState(false);
   const [userSearchQuery, setUserSearchQuery] = useState("");
   const [userSearchResults, setUserSearchResults] = useState([]);
   const [isSearchingUsers, setIsSearchingUsers] = useState(false);
   const [taggedUsers, setTaggedUsers] = useState([]);
   const [pollQuestion, setPollQuestion] = useState("");
   const [pollOptions, setPollOptions] = useState(["", ""]);
   const [pollExpiration, setPollExpiration] = useState("1");
   const [pollError, setPollError] = useState("");
   const [privacy, setPrivacy] = useState("public");

   const handleMediaChange = (e) => {
      const files = Array.from(e.target.files);

      // Limit to 5 files
      if (files.length + media.length > 5) {
         setError("You can only upload up to 5 files");
         return;
      }

      setMedia([...media, ...files]);

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setMediaPreview([...mediaPreview, ...newPreviews]);

      setError("");
   };

   const removeMedia = (index) => {
      const newMedia = [...media];
      const newPreviews = [...mediaPreview];

      newMedia.splice(index, 1);
      newPreviews.splice(index, 1);

      setMedia(newMedia);
      setMediaPreview(newPreviews);
   };

   const handleUserSearch = (query) => {
      setUserSearchQuery(query);
      if (query.trim()) {
         setIsSearchingUsers(true);
         // Simulate API call
         setTimeout(() => {
            setUserSearchResults([
               { _id: "1", name: "John Doe" },
               { _id: "2", name: "Jane Smith" },
               { _id: "3", name: "Bob Johnson" },
            ]);
            setIsSearchingUsers(false);
         }, 500);
      } else {
         setUserSearchResults([]);
      }
   };

   useEffect(() => {
      const delayDebounceFn = setTimeout(() => {
         if (userSearchQuery) {
            handleUserSearch(userSearchQuery);
         }
      }, 300);

      return () => clearTimeout(delayDebounceFn);
   }, [userSearchQuery]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!content.trim() && media.length === 0) {
         setError("Please add some content or media to your post");
         return;
      }

      setIsSubmitting(true);
      setError("");

      try {
         const formData = new FormData();
         formData.append("content", content.trim());
         if (location) formData.append("location", location);
         if (feeling) formData.append("feeling", feeling);
         if (activity) formData.append("activity", activity);
         formData.append("visibility", visibility);

         // Add tagged users if any
         if (taggedUsers.length > 0) {
            formData.append("taggedUserIds", JSON.stringify(taggedUsers.map((user) => user._id)));
         }

         // Add poll if created
         if (showPollCreator && pollQuestion && pollOptions.filter((opt) => opt.trim()).length >= 2) {
            formData.append("pollQuestion", pollQuestion);
            formData.append("pollOptions", JSON.stringify(pollOptions.filter((opt) => opt.trim())));
            formData.append("pollExpiration", pollExpiration);
         }

         // Add media files
         media.forEach((file) => {
            formData.append("media", file);
         });

         const response = await createPost(formData);

         if (response.data.success) {
            setContent("");
            setLocation("");
            setFeeling("");
            setActivity("");
            setMedia([]);
            setMediaPreview([]);
            setTaggedUsers([]);
            setPollQuestion("");
            setPollOptions(["", ""]);
            setPollExpiration("1");
            setShowPollCreator(false);

            if (onPostCreated) {
               onPostCreated(response.data.data);
            }
         }
      } catch (err) {
         console.error("Error creating post:", err);
         setError(err.response?.data?.error || "Failed to create post");
      } finally {
         setIsSubmitting(false);
      }
   };

   const fileInputRef = useRef(null);

   const handlePollOptionChange = (index, value) => {
      const newOptions = [...pollOptions];
      newOptions[index] = value;
      setPollOptions(newOptions);
   };

   const handleRemovePollOption = (index) => {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
   };

   const handleAddPollOption = () => {
      if (pollOptions.length < 4) {
         setPollOptions([...pollOptions, ""]);
      }
   };

   const handleCreatePoll = () => {
      if (!pollQuestion.trim()) {
         setPollError("Please enter a question");
         return;
      }

      const validOptions = pollOptions.filter((option) => option.trim());
      if (validOptions.length < 2) {
         setPollError("Please add at least 2 options");
         return;
      }

      setPollError("");
      setShowPollCreator(false);
   };

   return (
      <div className={`${!isInModal ? "bg-white rounded-xl overflow-hidden" : ""}`}>
         <form onSubmit={handleSubmit}>
            <div className='flex items-start gap-4 p-1'>
               {!isInModal && (
                  <div className='flex-shrink-0 mt-3 ml-2'>
                     {user?.profilePicture ? (
                        <img
                           className='h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm'
                           src={user.profilePicture}
                           alt={user?.name}
                        />
                     ) : (
                        <div className='h-12 w-12 rounded-full bg-gradient-to-br from-maple-red/80 to-maple-red flex items-center justify-center text-white font-bold shadow-sm'>
                           {getUserInitials(user?.name)}
                        </div>
                     )}
                  </div>
               )}

               <div className='flex-grow pt-2 pr-3'>
                  <textarea
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     placeholder={isInModal ? "What's on your mind?" : "What's happening in your part of Canada today?"}
                     className='w-full border-0 bg-transparent rounded-xl p-2 mb-3 focus:outline-none focus:ring-0 resize-none transition-all text-base placeholder:text-gray-400'
                     rows={isInModal ? "5" : content.length > 0 ? "4" : "2"}
                     autoFocus={isInModal}></textarea>

                  <AnimatePresence>
                     {error && (
                        <motion.div
                           initial={{ opacity: 0, y: -10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0 }}
                           className='bg-red-50 border border-red-100 rounded-lg p-3 mb-3 text-sm text-red-600 flex items-center'>
                           <svg className='w-5 h-5 mr-2 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           {error}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <AnimatePresence>
                     {mediaPreview.length > 0 && (
                        <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           className='grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4'>
                           {mediaPreview.map((preview, index) => (
                              <motion.div
                                 key={index}
                                 className='relative rounded-xl overflow-hidden shadow-sm border border-gray-100'
                                 initial={{ opacity: 0, scale: 0.9 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.9 }}
                                 transition={{ duration: 0.2 }}>
                                 <img src={preview} alt={`Preview ${index + 1}`} className='w-full h-32 object-cover' />
                                 <button
                                    type='button'
                                    onClick={() => removeMedia(index)}
                                    className='absolute top-2 right-2 bg-charcoal-gray/70 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-charcoal-gray transition-colors shadow-sm'>
                                    <svg
                                       xmlns='http://www.w3.org/2000/svg'
                                       className='h-4 w-4'
                                       fill='none'
                                       viewBox='0 0 24 24'
                                       stroke='currentColor'>
                                       <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                 </button>
                              </motion.div>
                           ))}
                        </motion.div>
                     )}
                  </AnimatePresence>

                  <div className='flex flex-col border-t border-gray-100 pt-3'>
                     <div className='flex flex-wrap gap-2 mt-4'>
                        <motion.button
                           type='button'
                           onClick={() => fileInputRef.current?.click()}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                           Add Photos/Videos
                        </motion.button>
                        <input
                           ref={fileInputRef}
                           type='file'
                           multiple
                           accept='image/*,video/*'
                           onChange={handleMediaChange}
                           className='hidden'
                        />

                        <motion.button
                           type='button'
                           onClick={() => setShowLocationInput(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                           Check in
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowFeelingSelector(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           Feeling/Activity
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowTagPeople(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                           </svg>
                           Tag People
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowPollCreator(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01'
                              />
                           </svg>
                           Create Poll
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowPrivacySelector(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                              />
                           </svg>
                           {visibility === "public" ? "Public" : visibility === "friends" ? "Friends Only" : "Only Me"}
                        </motion.button>
                     </div>

                     <motion.button
                        type='submit'
                        disabled={isSubmitting || !content.trim()}
                        className={`w-full py-2.5 mt-4 rounded-lg text-sm font-medium transition-all ${
                           isSubmitting || !content.trim()
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-maple-red text-white hover:bg-maple-red-dark shadow-sm hover:shadow"
                        }`}
                        whileHover={isSubmitting || !content.trim() ? {} : { scale: 1.02 }}
                        whileTap={isSubmitting || !content.trim() ? {} : { scale: 0.98 }}>
                        {isSubmitting ? (
                           <div className='flex items-center justify-center'>
                              <svg
                                 className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                                 xmlns='http://www.w3.org/2000/svg'
                                 fill='none'
                                 viewBox='0 0 24 24'>
                                 <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                                 <path
                                    className='opacity-75'
                                    fill='currentColor'
                                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                              </svg>
                              Posting...
                           </div>
                        ) : (
                           <div className='flex items-center justify-center'>
                              <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8' />
                              </svg>
                              {isInModal ? "Post" : "Share Post"}
                           </div>
                        )}
                     </motion.button>
                  </div>
               </div>
            </div>
         </form>

         {/* Location Input Modal */}
         <AnimatePresence>
            {showLocationInput && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className='w-full max-w-md p-6 bg-white rounded-xl shadow-xl'>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>Add Location</h3>
                        <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => setShowLocationInput(false)}
                           className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </motion.button>
                     </div>
                     <div className='mb-4'>
                        <input
                           type='text'
                           value={location}
                           onChange={(e) => setLocation(e.target.value)}
                           placeholder='Search for a location...'
                           className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                     </div>
                     {location && (
                        <div className='flex items-center justify-between p-3 mb-4 bg-gray-50 rounded-lg'>
                           <div className='flex items-center gap-2'>
                              <svg className='w-5 h-5 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                 />
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                              </svg>
                              <span className='text-sm text-gray-700'>{location}</span>
                           </div>
                           <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setLocation("")}
                              className='text-gray-500 hover:text-gray-700'>
                              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                              </svg>
                           </motion.button>
                        </div>
                     )}
                     <div className='flex justify-end gap-2'>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setShowLocationInput(false)}
                           className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'>
                           Cancel
                        </motion.button>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setShowLocationInput(false)}
                           className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
                           Done
                        </motion.button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Tag People Modal */}
         <AnimatePresence>
            {showTagPeople && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className='w-full max-w-md p-6 bg-white rounded-xl shadow-xl'>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>Tag People</h3>
                        <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => setShowTagPeople(false)}
                           className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </motion.button>
                     </div>
                     <div className='mb-4'>
                        <input
                           type='text'
                           value={userSearchQuery}
                           onChange={(e) => handleUserSearch(e.target.value)}
                           placeholder='Search for people to tag...'
                           className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        />
                     </div>
                     {taggedUsers.length > 0 && (
                        <div className='mb-4'>
                           <h4 className='mb-2 text-sm font-medium text-gray-700'>Tagged Users</h4>
                           <div className='flex flex-wrap gap-2'>
                              {taggedUsers.map((user) => (
                                 <div key={user._id} className='flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full'>
                                    <span className='text-sm text-gray-700'>{user.name}</span>
                                    <motion.button
                                       whileHover={{ scale: 1.1 }}
                                       whileTap={{ scale: 0.9 }}
                                       onClick={() => setTaggedUsers(taggedUsers.filter((u) => u._id !== user._id))}
                                       className='text-gray-500 hover:text-gray-700'>
                                       <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                       </svg>
                                    </motion.button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                     {isSearchingUsers ? (
                        <div className='flex justify-center py-4'>
                           <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                        </div>
                     ) : userSearchResults.length > 0 ? (
                        <div className='mb-4'>
                           <h4 className='mb-2 text-sm font-medium text-gray-700'>Search Results</h4>
                           <div className='space-y-2'>
                              {userSearchResults.map((user) => (
                                 <motion.div
                                    key={user._id}
                                    whileHover={{ scale: 1.02 }}
                                    className='flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100'
                                    onClick={() => {
                                       if (!taggedUsers.some((u) => u._id === user._id)) {
                                          setTaggedUsers([...taggedUsers, user]);
                                       }
                                    }}>
                                    <div className='flex items-center gap-2'>
                                       <div className='w-8 h-8 bg-gray-200 rounded-full'></div>
                                       <span className='text-sm text-gray-700'>{user.name}</span>
                                    </div>
                                    {taggedUsers.some((u) => u._id === user._id) && (
                                       <svg className='w-5 h-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                       </svg>
                                    )}
                                 </motion.div>
                              ))}
                           </div>
                        </div>
                     ) : null}
                     <div className='flex justify-end gap-2'>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setShowTagPeople(false)}
                           className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'>
                           Cancel
                        </motion.button>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setShowTagPeople(false)}
                           className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
                           Done
                        </motion.button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Feeling/Activity Selector Modal */}
         <AnimatePresence>
            {showFeelingSelector && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className='w-full max-w-md p-6 bg-white rounded-xl shadow-xl'>
                     <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center'>
                           <div className='w-8 h-8 rounded-full bg-maple-red/15 flex items-center justify-center mr-2'>
                              <svg className='w-5 h-5 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                 />
                              </svg>
                           </div>
                           <h3 className='text-base font-medium text-gray-800'>How are you feeling?</h3>
                        </div>
                        <button
                           type='button'
                           onClick={() => setShowFeelingSelector(false)}
                           className='text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>

                     <div className='space-y-4'>
                        <div>
                           <h4 className='text-sm font-medium text-gray-700 mb-2'>Feelings</h4>
                           <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                              {[
                                 "Happy",
                                 "Sad",
                                 "Excited",
                                 "Loved",
                                 "Thankful",
                                 "Blessed",
                                 "Nostalgic",
                                 "Hopeful",
                                 "Motivated",
                                 "Relaxed",
                              ].map((item) => (
                                 <motion.button
                                    key={item}
                                    type='button'
                                    onClick={() => {
                                       setFeeling(item);
                                       setActivity("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`py-2 px-3 rounded-lg text-sm text-left flex items-center ${
                                       feeling === item ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    <span className='mr-2'>
                                       {item === "Happy" && "😊"}
                                       {item === "Sad" && "😢"}
                                       {item === "Excited" && "🤩"}
                                       {item === "Loved" && "🥰"}
                                       {item === "Thankful" && "🙏"}
                                       {item === "Blessed" && "✨"}
                                       {item === "Nostalgic" && "🕰️"}
                                       {item === "Hopeful" && "🌟"}
                                       {item === "Motivated" && "💪"}
                                       {item === "Relaxed" && "😌"}
                                    </span>
                                    {item}
                                 </motion.button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h4 className='text-sm font-medium text-gray-700 mb-2'>Activities</h4>
                           <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                              {[
                                 "Traveling",
                                 "Working",
                                 "Studying",
                                 "Celebrating",
                                 "Cooking",
                                 "Reading",
                                 "Watching",
                                 "Playing",
                                 "Shopping",
                                 "Hiking",
                              ].map((item) => (
                                 <motion.button
                                    key={item}
                                    type='button'
                                    onClick={() => {
                                       setActivity(item);
                                       setFeeling("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`py-2 px-3 rounded-lg text-sm text-left flex items-center ${
                                       activity === item ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    <span className='mr-2'>
                                       {item === "Traveling" && "✈️"}
                                       {item === "Working" && "💼"}
                                       {item === "Studying" && "📚"}
                                       {item === "Celebrating" && "🎉"}
                                       {item === "Cooking" && "👨‍🍳"}
                                       {item === "Reading" && "📖"}
                                       {item === "Watching" && "📺"}
                                       {item === "Playing" && "🎮"}
                                       {item === "Shopping" && "🛍️"}
                                       {item === "Hiking" && "🏃"}
                                    </span>
                                    {item}
                                 </motion.button>
                              ))}
                           </div>
                        </div>
                     </div>

                     {(feeling || activity) && (
                        <div className='flex justify-between mt-4'>
                           <motion.button
                              type='button'
                              onClick={() => {
                                 setFeeling("");
                                 setActivity("");
                              }}
                              className='px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              Clear
                           </motion.button>

                           <motion.button
                              type='button'
                              onClick={() => setShowFeelingSelector(false)}
                              className='px-4 py-2 bg-maple-red text-white rounded-lg text-sm font-medium'
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              Done
                           </motion.button>
                        </div>
                     )}
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Poll Creator Modal */}
         <AnimatePresence>
            {showPollCreator && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className='w-full max-w-md p-6 bg-white rounded-xl shadow-xl'>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>Create Poll</h3>
                        <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => setShowPollCreator(false)}
                           className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </motion.button>
                     </div>

                     <div className='space-y-4'>
                        <div>
                           <label htmlFor='pollQuestion' className='block mb-2 text-sm font-medium text-gray-700'>
                              Question
                           </label>
                           <input
                              type='text'
                              id='pollQuestion'
                              value={pollQuestion}
                              onChange={(e) => setPollQuestion(e.target.value)}
                              placeholder='Ask a question...'
                              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                           />
                        </div>

                        <div>
                           <label className='block mb-2 text-sm font-medium text-gray-700'>Options</label>
                           <div className='space-y-2'>
                              {pollOptions.map((option, index) => (
                                 <div key={index} className='flex items-center gap-2'>
                                    <input
                                       type='text'
                                       value={option}
                                       onChange={(e) => handlePollOptionChange(index, e.target.value)}
                                       placeholder={`Option ${index + 1}`}
                                       className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                    />
                                    {pollOptions.length > 2 && (
                                       <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() => handleRemovePollOption(index)}
                                          className='p-2 text-gray-500 hover:text-gray-700'>
                                          <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                             <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                strokeWidth={2}
                                                d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                             />
                                          </svg>
                                       </motion.button>
                                    )}
                                 </div>
                              ))}
                           </div>
                           {pollOptions.length < 4 && (
                              <motion.button
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}
                                 onClick={handleAddPollOption}
                                 className='mt-2 text-sm text-blue-600 hover:text-blue-700'>
                                 + Add Option
                              </motion.button>
                           )}
                        </div>

                        <div>
                           <label htmlFor='pollExpiration' className='block mb-2 text-sm font-medium text-gray-700'>
                              Poll Duration
                           </label>
                           <select
                              id='pollExpiration'
                              value={pollExpiration}
                              onChange={(e) => setPollExpiration(e.target.value)}
                              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                              <option value='1'>1 day</option>
                              <option value='3'>3 days</option>
                              <option value='7'>1 week</option>
                              <option value='30'>1 month</option>
                           </select>
                        </div>
                     </div>

                     {pollError && <p className='text-sm text-red-500'>{pollError}</p>}

                     <div className='flex justify-end gap-2 mt-6'>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => setShowPollCreator(false)}
                           className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200'>
                           Cancel
                        </motion.button>
                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={handleCreatePoll}
                           className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700'>
                           Create Poll
                        </motion.button>
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>

         {/* Privacy Selector Modal */}
         <AnimatePresence>
            {showPrivacySelector && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0.9, opacity: 0 }}
                     className='w-full max-w-md p-6 bg-white rounded-xl shadow-xl'>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold text-gray-900'>Select Privacy</h3>
                        <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.9 }}
                           onClick={() => setShowPrivacySelector(false)}
                           className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </motion.button>
                     </div>
                     <div className='space-y-2'>
                        {[
                           { value: "public", label: "Public", icon: "🌍", description: "Anyone can see this post" },
                           { value: "friends", label: "Friends Only", icon: "👥", description: "Only your friends can see this post" },
                           { value: "private", label: "Only Me", icon: "🔒", description: "Only you can see this post" },
                        ].map((option) => (
                           <motion.div
                              key={option.value}
                              whileHover={{ scale: 1.02 }}
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                                 visibility === option.value ? "bg-blue-50" : "bg-gray-50 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                 setVisibility(option.value);
                                 setShowPrivacySelector(false);
                              }}>
                              <span className='text-2xl'>{option.icon}</span>
                              <div className='flex-1'>
                                 <h4 className='text-sm font-medium text-gray-900'>{option.label}</h4>
                                 <p className='text-xs text-gray-500'>{option.description}</p>
                              </div>
                              {visibility === option.value && (
                                 <svg className='w-5 h-5 text-blue-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                 </svg>
                              )}
                           </motion.div>
                        ))}
                     </div>
                  </motion.div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default CreatePostForm;
