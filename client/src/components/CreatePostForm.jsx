import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { motion, AnimatePresence } from "framer-motion";
import { searchUsers } from "../services/userService";
import PollCreator from "./PollCreator";

const CreatePostForm = ({ onPostCreated, isInModal = false, initialVisibility = "public" }) => {
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const [location, setLocation] = useState("");
   const [feeling, setFeeling] = useState("");
   const [activity, setActivity] = useState("");
   const [visibility, setVisibility] = useState(initialVisibility);
   const [media, setMedia] = useState([]);
   const [mediaPreview, setMediaPreview] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [showLocationInput, setShowLocationInput] = useState(false);
   const [showFeelingSelector, setShowFeelingSelector] = useState(false);
   const [showActivitySelector, setShowActivitySelector] = useState(false);
   const [showPollCreator, setShowPollCreator] = useState(false);
   const [showTagPeople, setShowTagPeople] = useState(false);
   const [showVisibilitySelector, setShowVisibilitySelector] = useState(false);

   // Poll state
   const [pollQuestion, setPollQuestion] = useState("");
   const [pollOptions, setPollOptions] = useState(["", ""]);
   const [pollExpiration, setPollExpiration] = useState("");

   // Tagged users state
   const [taggedUsers, setTaggedUsers] = useState([]);
   const [userSearchQuery, setUserSearchQuery] = useState("");
   const [userSearchResults, setUserSearchResults] = useState([]);
   const [isSearchingUsers, setIsSearchingUsers] = useState(false);

   // Predefined feelings and activities
   const feelings = ["Happy", "Sad", "Excited", "Loved", "Thankful", "Blessed", "Nostalgic", "Hopeful", "Motivated", "Relaxed"];

   const activities = [
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
   ];

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

   const handlePollOptionChange = (index, value) => {
      const newOptions = [...pollOptions];
      newOptions[index] = value;
      setPollOptions(newOptions);
   };

   const addPollOption = () => {
      if (pollOptions.length < 4) {
         setPollOptions([...pollOptions, ""]);
      }
   };

   const removePollOption = (index) => {
      if (pollOptions.length > 2) {
         const newOptions = [...pollOptions];
         newOptions.splice(index, 1);
         setPollOptions(newOptions);
      }
   };

   const handleUserSearch = async (query) => {
      if (query.trim().length < 2) {
         setUserSearchResults([]);
         return;
      }

      try {
         setIsSearchingUsers(true);
         const response = await searchUsers(query);
         setUserSearchResults(
            response.data.filter(
               (searchUser) => searchUser._id !== user.id && !taggedUsers.some((taggedUser) => taggedUser._id === searchUser._id),
            ),
         );
      } catch (error) {
         console.error("Error searching users:", error);
      } finally {
         setIsSearchingUsers(false);
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

   const addTaggedUser = (selectedUser) => {
      setTaggedUsers([...taggedUsers, selectedUser]);
      setUserSearchQuery("");
      setUserSearchResults([]);
   };

   const removeTaggedUser = (userId) => {
      setTaggedUsers(taggedUsers.filter((user) => user._id !== userId));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!content.trim()) {
         setError("Post content is required");
         return;
      }

      try {
         setIsSubmitting(true);
         setError("");

         const postData = {
            content,
            location: location.trim() || undefined,
            media,
            feeling: feeling || undefined,
            activity: activity || undefined,
            visibility,
            taggedUserIds: taggedUsers.map((user) => user._id),
         };

         // Add poll data if poll creator is active
         if (showPollCreator && pollQuestion.trim() && pollOptions.filter((opt) => opt.trim()).length >= 2) {
            postData.poll = {
               question: pollQuestion,
               options: pollOptions.filter((opt) => opt.trim()),
               expiresAt: pollExpiration || undefined,
            };
         }

         await createPost(postData);

         // Reset form
         setContent("");
         setLocation("");
         setFeeling("");
         setActivity("");
         setVisibility("public");
         setMedia([]);
         setMediaPreview([]);
         setPollQuestion("");
         setPollOptions(["", ""]);
         setPollExpiration("");
         setTaggedUsers([]);
         setShowLocationInput(false);
         setShowFeelingSelector(false);
         setShowActivitySelector(false);
         setShowPollCreator(false);
         setShowTagPeople(false);
         setShowVisibilitySelector(false);

         if (onPostCreated) {
            onPostCreated();
         }
      } catch (error) {
         setError(error.response?.data?.error || "Failed to create post. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   const fileInputRef = useRef(null);

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
                           {user?.name?.charAt(0).toUpperCase() || "M"}
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
                     <div className='flex flex-wrap gap-2 mb-3'>
                        <motion.button
                           type='button'
                           onClick={() => fileInputRef.current?.click()}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                           <span className='text-sm font-medium'>Media</span>
                           <input
                              ref={fileInputRef}
                              type='file'
                              multiple
                              accept='image/*,video/*'
                              onChange={handleMediaChange}
                              className='hidden'
                           />
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowLocationInput(!showLocationInput)}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                           <span className='text-sm font-medium'>{location ? location : "Location"}</span>
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowFeelingSelector(!showFeelingSelector)}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           <span className='text-sm font-medium'>{feeling ? `Feeling ${feeling}` : "Feeling/Activity"}</span>
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowTagPeople(!showTagPeople)}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                              />
                           </svg>
                           <span className='text-sm font-medium'>
                              {taggedUsers.length > 0
                                 ? `With ${taggedUsers.length} ${taggedUsers.length === 1 ? "person" : "people"}`
                                 : "Tag People"}
                           </span>
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowPollCreator(!showPollCreator)}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                              />
                           </svg>
                           <span className='text-sm font-medium'>Create Poll</span>
                        </motion.button>

                        <motion.button
                           type='button'
                           onClick={() => setShowVisibilitySelector(!showVisibilitySelector)}
                           className='flex items-center text-gray-500 hover:text-maple-red transition-colors rounded-lg px-3 py-1.5 hover:bg-gray-50'
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-5 w-5 mr-2'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                              />
                           </svg>
                           <span className='text-sm font-medium'>
                              {visibility === "public" ? "Public" : visibility === "friends" ? "Friends Only" : "Private"}
                           </span>
                        </motion.button>
                     </div>

                     <motion.button
                        type='submit'
                        disabled={isSubmitting || !content.trim()}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${
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

               {/* Location Input Popup */}
               <AnimatePresence>
                  {showLocationInput && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='mt-3 p-3 bg-white rounded-lg shadow-md border border-gray-200'>
                        <div className='flex items-center justify-between mb-2'>
                           <h3 className='text-sm font-medium text-gray-700'>Add Location</h3>
                           <button type='button' onClick={() => setShowLocationInput(false)} className='text-gray-400 hover:text-gray-600'>
                              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                 <path
                                    fillRule='evenodd'
                                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                 />
                              </svg>
                           </button>
                        </div>
                        <div className='flex items-center border border-gray-300 rounded-lg overflow-hidden'>
                           <div className='p-2 bg-gray-50'>
                              <svg
                                 xmlns='http://www.w3.org/2000/svg'
                                 className='h-5 w-5 text-gray-500'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                                 />
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={1.5}
                                    d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                                 />
                              </svg>
                           </div>
                           <input
                              type='text'
                              value={location}
                              onChange={(e) => setLocation(e.target.value)}
                              placeholder='Enter your location'
                              className='flex-1 p-2 focus:outline-none text-sm'
                           />
                           {location && (
                              <button type='button' onClick={() => setLocation("")} className='p-2 text-gray-400 hover:text-gray-600'>
                                 <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                    <path
                                       fillRule='evenodd'
                                       d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                       clipRule='evenodd'
                                    />
                                 </svg>
                              </button>
                           )}
                        </div>
                        <div className='flex justify-end mt-3'>
                           <motion.button
                              type='button'
                              onClick={() => setShowLocationInput(false)}
                              className='px-4 py-1.5 bg-maple-red text-white rounded-lg text-sm font-medium'
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}>
                              Done
                           </motion.button>
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* Feeling/Activity Selector Popup */}
               <AnimatePresence>
                  {showFeelingSelector && (
                     <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className='absolute z-50 left-0 right-0 mt-3 p-3 bg-white rounded-lg shadow-md border border-gray-200 max-h-[400px] overflow-y-auto mx-auto max-w-[90%] w-[500px]'>
                        <div className='flex items-center justify-between mb-2'>
                           <h3 className='text-sm font-medium text-gray-700'>How are you feeling?</h3>
                           <button
                              type='button'
                              onClick={() => setShowFeelingSelector(false)}
                              className='text-gray-400 hover:text-gray-600'>
                              <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                                 <path
                                    fillRule='evenodd'
                                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                 />
                              </svg>
                           </button>
                        </div>

                        <div className='mb-4'>
                           <div className='flex items-center mb-2'>
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
                              <h4 className='text-sm font-medium text-gray-700'>Feelings</h4>
                           </div>

                           <div className='grid grid-cols-3 sm:grid-cols-4 gap-1.5'>
                              {feelings.map((item) => (
                                 <motion.button
                                    key={item}
                                    type='button'
                                    onClick={() => {
                                       setFeeling(item);
                                       setActivity("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`py-1.5 px-2 rounded-lg text-xs text-left ${
                                       feeling === item ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-100"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    {item}
                                 </motion.button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <div className='flex items-center mb-2'>
                              <div className='w-8 h-8 rounded-full bg-maple-red/15 flex items-center justify-center mr-2'>
                                 <svg className='w-5 h-5 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={1.5}
                                       d='M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z'
                                    />
                                 </svg>
                              </div>
                              <h4 className='text-sm font-medium text-gray-700'>Activities</h4>
                           </div>

                           <div className='grid grid-cols-3 sm:grid-cols-4 gap-1.5'>
                              {activities.map((item) => (
                                 <motion.button
                                    key={item}
                                    type='button'
                                    onClick={() => {
                                       setActivity(item);
                                       setFeeling("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`py-1.5 px-2 rounded-lg text-xs text-left ${
                                       activity === item ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-100"
                                    }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}>
                                    {item}
                                 </motion.button>
                              ))}
                           </div>
                        </div>

                        {(feeling || activity) && (
                           <div className='flex justify-between mt-3'>
                              <motion.button
                                 type='button'
                                 onClick={() => {
                                    setFeeling("");
                                    setActivity("");
                                 }}
                                 className='px-4 py-1.5 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium'
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}>
                                 Clear
                              </motion.button>

                              <motion.button
                                 type='button'
                                 onClick={() => setShowFeelingSelector(false)}
                                 className='px-4 py-1.5 bg-maple-red text-white rounded-lg text-sm font-medium'
                                 whileHover={{ scale: 1.05 }}
                                 whileTap={{ scale: 0.95 }}>
                                 Done
                              </motion.button>
                           </div>
                        )}
                     </motion.div>
                  )}
               </AnimatePresence>

               {/* Poll Creator */}
               <AnimatePresence>
                  {showPollCreator && (
                     <div className='absolute z-50 left-0 right-0 mt-3 max-h-[450px] overflow-y-auto mx-auto max-w-[90%] w-[500px]'>
                        <PollCreator
                           pollQuestion={pollQuestion}
                           setPollQuestion={setPollQuestion}
                           pollOptions={pollOptions}
                           handlePollOptionChange={handlePollOptionChange}
                           addPollOption={addPollOption}
                           removePollOption={removePollOption}
                           pollExpiration={pollExpiration}
                           setPollExpiration={setPollExpiration}
                           onClose={() => setShowPollCreator(false)}
                        />
                     </div>
                  )}
               </AnimatePresence>
            </div>
         </form>
      </div>
   );
};

export default CreatePostForm;
