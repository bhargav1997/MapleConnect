import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/postService";
import { AnimatePresence } from "framer-motion";
import { getUserInitials } from "../utils/helpers";
import PollCreator from "./PollCreator";

const CreatePostForm = ({ onPostCreated, isInModal = false, initialVisibility = "public" }) => {
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const [location, setLocation] = useState("");
   const [feeling, setFeeling] = useState("");
   const [activity, setActivity] = useState("");
   const [imageUrls, setImageUrls] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [taggedUsers, setTaggedUsers] = useState([]);
   const [showImageUrlModal, setShowImageUrlModal] = useState(false);
   const [currentImageUrl, setCurrentImageUrl] = useState("");
   const [showLocationInput, setShowLocationInput] = useState(false);
   const [showFeelingSelector, setShowFeelingSelector] = useState(false);
   const [showPrivacySelector, setShowPrivacySelector] = useState(false);
   const [showPollCreator, setShowPollCreator] = useState(false);
   const [visibility, setVisibility] = useState(initialVisibility);
   const [poll, setPoll] = useState(null);

   const handleImageUrlSubmit = (e) => {
      e?.preventDefault();
      if (!currentImageUrl.trim()) {
         setError("Please enter a valid image URL");
         return;
      }

      if (imageUrls.length >= 4) {
         setError("You can only add up to 4 images");
         return;
      }

      setImageUrls([...imageUrls, currentImageUrl.trim()]);
      setCurrentImageUrl("");
      setShowImageUrlModal(false);
      setError("");
   };

   const handleImageModalClose = () => {
      setShowImageUrlModal(false);
      setCurrentImageUrl("");
      setError("");
   };

   const removeImage = (index) => {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
   };

   const handlePollCreate = (pollData) => {
      setPoll(pollData);
      setShowPollCreator(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!content.trim() && imageUrls.length === 0 && !poll) {
         setError("Please add some content, images, or create a poll");
         return;
      }

      setIsSubmitting(true);
      setError("");

      try {
         // Format poll data if it exists
         let formattedPoll = null;
         if (poll) {
            formattedPoll = {
               question: poll.question,
               options: poll.options.map((option) => ({
                  text: option,
                  votes: [],
               })),
               expiresAt: new Date(Date.now() + getPollDuration(poll.expiration)),
            };
         }

         const postData = {
            content: content.trim(),
            location,
            feeling,
            activity,
            visibility,
            imageUrls,
            taggedUserIds: taggedUsers.map((user) => user._id),
            poll: formattedPoll,
         };

         const response = await createPost(postData);

         if (response.data.success) {
            setContent("");
            setLocation("");
            setFeeling("");
            setActivity("");
            setImageUrls([]);
            setTaggedUsers([]);
            setPoll(null);

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

   // Helper function to convert poll duration to milliseconds
   const getPollDuration = (duration) => {
      const durations = {
         "1d": 24 * 60 * 60 * 1000,
         "3d": 3 * 24 * 60 * 60 * 1000,
         "7d": 7 * 24 * 60 * 60 * 1000,
         "14d": 14 * 24 * 60 * 60 * 1000,
         "30d": 30 * 24 * 60 * 60 * 1000,
      };
      return durations[duration] || durations["1d"];
   };

   const modalContainerStyle = isInModal
      ? "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      : "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";

   return (
      <div className={`${!isInModal ? "bg-white rounded-xl overflow-hidden" : ""} relative`}>
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
                     autoFocus={isInModal}
                  />

                  {/* Image URLs Display */}
                  {imageUrls.length > 0 && (
                     <div className='mb-4 grid grid-cols-2 gap-2'>
                        {imageUrls.map((url, index) => (
                           <div key={index} className='relative'>
                              <img
                                 src={url}
                                 alt={`Preview ${index + 1}`}
                                 className='w-full h-32 object-cover rounded-lg'
                                 onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/300x200?text=Invalid+Image+URL";
                                 }}
                              />
                              <button
                                 type='button'
                                 onClick={() => removeImage(index)}
                                 className='absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600'>
                                 <svg className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                 </svg>
                              </button>
                           </div>
                        ))}
                     </div>
                  )}

                  {/* Error Display */}
                  <AnimatePresence>
                     {error && (
                        <div className='bg-red-50 border border-red-100 rounded-lg p-3 mb-3 text-sm text-red-600 flex items-center'>
                           <svg className='w-5 h-5 mr-2 text-red-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           {error}
                        </div>
                     )}
                  </AnimatePresence>

                  <div className='flex flex-col border-t border-gray-100 pt-3'>
                     <div className='flex flex-wrap gap-2 mt-4'>
                        {/* Add Photos/Videos Button */}
                        <button
                           type='button'
                           onClick={() => setShowImageUrlModal(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                           Add Photos/Videos
                        </button>

                        {/* Poll Button */}
                        <button
                           type='button'
                           onClick={() => setShowPollCreator(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                              />
                           </svg>
                           Create Poll
                        </button>

                        {/* Location Button */}
                        <button
                           type='button'
                           onClick={() => setShowLocationInput(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                           {location ? location : "Add Location"}
                        </button>

                        {/* Feeling/Activity Button */}
                        <button
                           type='button'
                           onClick={() => setShowFeelingSelector(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                              />
                           </svg>
                           {feeling ? `Feeling ${feeling}` : activity ? `${activity}` : "Feeling/Activity"}
                        </button>

                        {/* Privacy Selector Button */}
                        <button
                           type='button'
                           onClick={() => setShowPrivacySelector(true)}
                           className='flex items-center gap-2 px-3 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
                           <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z'
                              />
                           </svg>
                           {visibility === "public" ? "Public" : visibility === "friends" ? "Friends Only" : "Only Me"}
                        </button>
                     </div>

                     <button
                        type='submit'
                        disabled={isSubmitting || (!content.trim() && imageUrls.length === 0 && !poll)}
                        className={`w-full py-2.5 mt-4 rounded-lg text-sm font-medium transition-all ${
                           isSubmitting || (!content.trim() && imageUrls.length === 0 && !poll)
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-maple-red text-white hover:bg-maple-red-dark shadow-sm hover:shadow"
                        }`}>
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
                     </button>
                  </div>
               </div>
            </div>
         </form>

         {/* Image URL Modal */}
         <AnimatePresence>
            {showImageUrlModal && (
               <div className={modalContainerStyle}>
                  <div className='relative bg-white rounded-xl p-6 max-w-md w-full my-8' onClick={(e) => e.stopPropagation()}>
                     <form onSubmit={handleImageUrlSubmit}>
                        <h3 className='text-lg font-semibold mb-4'>Add Image URL</h3>
                        <input
                           type='url'
                           value={currentImageUrl}
                           onChange={(e) => setCurrentImageUrl(e.target.value)}
                           placeholder='Enter image URL'
                           className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maple-red mb-4'
                           autoFocus
                        />
                        <div className='flex justify-end space-x-2'>
                           <button type='button' onClick={handleImageModalClose} className='px-4 py-2 text-gray-600 hover:text-gray-800'>
                              Cancel
                           </button>
                           <button type='submit' className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark'>
                              Add Image
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </AnimatePresence>

         {/* Location Input Modal */}
         <AnimatePresence>
            {showLocationInput && (
               <div className={modalContainerStyle}>
                  <div className='relative bg-white rounded-xl p-6 max-w-md w-full my-8' onClick={(e) => e.stopPropagation()}>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold'>Add Location</h3>
                        <button onClick={() => setShowLocationInput(false)} className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>
                     <input
                        type='text'
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder='Enter your location'
                        className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-maple-red mb-4'
                        autoFocus
                     />
                     <div className='flex justify-end space-x-2'>
                        <button
                           type='button'
                           onClick={() => setShowLocationInput(false)}
                           className='px-4 py-2 text-gray-600 hover:text-gray-800'>
                           Cancel
                        </button>
                        <button
                           type='button'
                           onClick={() => setShowLocationInput(false)}
                           className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark'>
                           Add Location
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </AnimatePresence>

         {/* Feeling/Activity Selector Modal */}
         <AnimatePresence>
            {showFeelingSelector && (
               <div className={modalContainerStyle}>
                  <div className='relative bg-white rounded-xl p-6 max-w-md w-full my-8' onClick={(e) => e.stopPropagation()}>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold'>How are you feeling?</h3>
                        <button onClick={() => setShowFeelingSelector(false)} className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>
                     <div className='space-y-4'>
                        <div>
                           <h4 className='text-sm font-medium text-gray-700 mb-2'>Feelings</h4>
                           <div className='grid grid-cols-2 gap-2'>
                              {[
                                 { emoji: "😊", text: "Happy" },
                                 { emoji: "😢", text: "Sad" },
                                 { emoji: "🤩", text: "Excited" },
                                 { emoji: "🥰", text: "Loved" },
                                 { emoji: "🙏", text: "Thankful" },
                                 { emoji: "✨", text: "Blessed" },
                              ].map((item) => (
                                 <button
                                    key={item.text}
                                    type='button'
                                    onClick={() => {
                                       setFeeling(item.text);
                                       setActivity("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                       feeling === item.text ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                                    }`}>
                                    <span>{item.emoji}</span>
                                    <span>{item.text}</span>
                                 </button>
                              ))}
                           </div>
                        </div>

                        <div>
                           <h4 className='text-sm font-medium text-gray-700 mb-2'>Activities</h4>
                           <div className='grid grid-cols-2 gap-2'>
                              {[
                                 { emoji: "✈️", text: "Traveling" },
                                 { emoji: "💼", text: "Working" },
                                 { emoji: "📚", text: "Studying" },
                                 { emoji: "🎉", text: "Celebrating" },
                                 { emoji: "👨‍🍳", text: "Cooking" },
                                 { emoji: "📖", text: "Reading" },
                              ].map((item) => (
                                 <button
                                    key={item.text}
                                    type='button'
                                    onClick={() => {
                                       setActivity(item.text);
                                       setFeeling("");
                                       setShowFeelingSelector(false);
                                    }}
                                    className={`flex items-center gap-2 p-2 rounded-lg ${
                                       activity === item.text ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                                    }`}>
                                    <span>{item.emoji}</span>
                                    <span>{item.text}</span>
                                 </button>
                              ))}
                           </div>
                        </div>
                     </div>

                     {(feeling || activity) && (
                        <div className='flex justify-end gap-2 mt-4'>
                           <button
                              type='button'
                              onClick={() => {
                                 setFeeling("");
                                 setActivity("");
                              }}
                              className='px-4 py-2 text-gray-600 hover:text-gray-800'>
                              Clear
                           </button>
                           <button
                              type='button'
                              onClick={() => setShowFeelingSelector(false)}
                              className='px-4 py-2 bg-maple-red text-white rounded-lg hover:bg-maple-red-dark'>
                              Done
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            )}
         </AnimatePresence>

         {/* Privacy Selector Modal */}
         <AnimatePresence>
            {showPrivacySelector && (
               <div className={modalContainerStyle}>
                  <div className='relative bg-white rounded-xl p-6 max-w-md w-full my-8' onClick={(e) => e.stopPropagation()}>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold'>Who can see your post?</h3>
                        <button onClick={() => setShowPrivacySelector(false)} className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>
                     <div className='space-y-2'>
                        {[
                           {
                              value: "public",
                              label: "Public",
                              description: "Anyone can see this post",
                              icon: (
                                 <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
                                    />
                                 </svg>
                              ),
                           },
                           {
                              value: "friends",
                              label: "Friends Only",
                              description: "Only your friends can see this post",
                              icon: (
                                 <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                                    />
                                 </svg>
                              ),
                           },
                           {
                              value: "private",
                              label: "Only Me",
                              description: "Only you can see this post",
                              icon: (
                                 <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z'
                                    />
                                 </svg>
                              ),
                           },
                        ].map((option) => (
                           <button
                              key={option.value}
                              type='button'
                              onClick={() => {
                                 setVisibility(option.value);
                                 setShowPrivacySelector(false);
                              }}
                              className={`w-full flex items-center gap-3 p-3 rounded-lg ${
                                 visibility === option.value ? "bg-maple-red/10 text-maple-red" : "hover:bg-gray-50"
                              }`}>
                              <div className='flex-shrink-0'>{option.icon}</div>
                              <div className='flex-1 text-left'>
                                 <div className='font-medium'>{option.label}</div>
                                 <div className='text-sm text-gray-500'>{option.description}</div>
                              </div>
                              {visibility === option.value && (
                                 <svg className='w-5 h-5 flex-shrink-0' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                                 </svg>
                              )}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </AnimatePresence>

         {/* Poll Creator Modal */}
         <AnimatePresence>
            {showPollCreator && (
               <div className={modalContainerStyle}>
                  <div className='relative bg-white rounded-xl p-6 max-w-md w-full my-8' onClick={(e) => e.stopPropagation()}>
                     <div className='flex items-center justify-between mb-4'>
                        <h3 className='text-lg font-semibold'>Create a Poll</h3>
                        <button onClick={() => setShowPollCreator(false)} className='text-gray-500 hover:text-gray-700'>
                           <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                           </svg>
                        </button>
                     </div>
                     <PollCreator onPollCreate={handlePollCreate} onCancel={() => setShowPollCreator(false)} />
                  </div>
               </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default CreatePostForm;
