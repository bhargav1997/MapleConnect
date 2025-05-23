import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { createPost } from "../../services/postService";
import { addPost } from "../../redux/slices/postSlice";
import { useAuth } from "../../context/AuthContext";

const CreatePost = ({ onClose }) => {
   const dispatch = useDispatch();
   const { user } = useAuth();
   const [content, setContent] = useState("");
   const [images, setImages] = useState([]);
   const [location, setLocation] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const fileInputRef = useRef(null);
   const [showLocationInput, setShowLocationInput] = useState(false);
   const [suggestedLocations, setSuggestedLocations] = useState([]);

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files);
      if (files.length + images.length > 4) {
         setError("You can only upload up to 4 images");
         return;
      }
      setImages([...images, ...files]);
   };

   const removeImage = (index) => {
      setImages(images.filter((_, i) => i !== index));
   };

   const handleLocationChange = (e) => {
      const value = e.target.value;
      setLocation(value);

      // Simulate location suggestions (replace with actual API call)
      if (value.length > 2) {
         setSuggestedLocations([`${value}, City`, `${value}, State`, `${value}, Country`]);
      } else {
         setSuggestedLocations([]);
      }
   };

   const selectLocation = (suggestion) => {
      setLocation(suggestion);
      setSuggestedLocations([]);
      setShowLocationInput(false);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!content.trim() && images.length === 0) {
         setError("Please add some content or images to your post");
         return;
      }

      setIsSubmitting(true);
      setError("");

      try {
         const formData = new FormData();
         formData.append("content", content);
         if (location) formData.append("location", location);
         images.forEach((image) => {
            formData.append("images", image);
         });

         const response = await createPost(formData);
         dispatch(addPost(response.data));
         onClose();
      } catch (err) {
         setError(err.response?.data?.error || "Failed to create post");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 20 }}
         className='fixed inset-0 z-50 overflow-y-auto'>
         <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
            <div className='fixed inset-0 transition-opacity' aria-hidden='true'>
               <div className='absolute inset-0 bg-gray-500 opacity-75'></div>
            </div>

            <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
               <form onSubmit={handleSubmit} className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                     <h3 className='text-lg font-medium text-gray-900'>Create Post</h3>
                     <button type='button' onClick={onClose} className='text-gray-400 hover:text-gray-500'>
                        <span className='sr-only'>Close</span>
                        <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>
                  </div>

                  <div className='flex items-start space-x-4 mb-4'>
                     <img src={user.profileImage || "https://via.placeholder.com/40"} alt={user.name} className='h-10 w-10 rounded-full' />
                     <div className='flex-1'>
                        <textarea
                           value={content}
                           onChange={(e) => setContent(e.target.value)}
                           placeholder="What's on your mind?"
                           className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500'
                           rows='4'
                        />
                     </div>
                  </div>

                  {/* Location Input */}
                  <div className='mb-4'>
                     <div className='flex items-center space-x-2'>
                        <button
                           type='button'
                           onClick={() => setShowLocationInput(!showLocationInput)}
                           className='flex items-center text-gray-600 hover:text-indigo-600'>
                           <svg className='h-5 w-5 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth='2'
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                           {location || "Add location"}
                        </button>
                     </div>

                     <AnimatePresence>
                        {showLocationInput && (
                           <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className='mt-2'>
                              <input
                                 type='text'
                                 value={location}
                                 onChange={handleLocationChange}
                                 placeholder='Enter location'
                                 className='w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-indigo-500'
                              />
                              {suggestedLocations.length > 0 && (
                                 <div className='mt-2 bg-white border rounded-lg shadow-lg'>
                                    {suggestedLocations.map((suggestion, index) => (
                                       <button
                                          key={index}
                                          type='button'
                                          onClick={() => selectLocation(suggestion)}
                                          className='w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none'>
                                          {suggestion}
                                       </button>
                                    ))}
                                 </div>
                              )}
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  {/* Image Preview */}
                  {images.length > 0 && (
                     <div className='mb-4 grid grid-cols-2 gap-2'>
                        {images.map((image, index) => (
                           <div key={index} className='relative'>
                              <img
                                 src={URL.createObjectURL(image)}
                                 alt={`Preview ${index + 1}`}
                                 className='w-full h-32 object-cover rounded-lg'
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

                  {/* Error Message */}
                  {error && <div className='mb-4 p-3 bg-red-100 text-red-700 rounded-lg'>{error}</div>}

                  {/* Action Buttons */}
                  <div className='flex items-center justify-between'>
                     <div className='flex space-x-2'>
                        <button
                           type='button'
                           onClick={() => fileInputRef.current.click()}
                           className='p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100'>
                           <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth='2'
                                 d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                        </button>
                        <input type='file' ref={fileInputRef} onChange={handleImageChange} accept='image/*' multiple className='hidden' />
                     </div>

                     <button
                        type='submit'
                        disabled={isSubmitting}
                        className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50'>
                        {isSubmitting ? "Posting..." : "Post"}
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </motion.div>
   );
};

export default CreatePost;
