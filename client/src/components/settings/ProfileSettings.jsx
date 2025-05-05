import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ProfileSettings = () => {
   const { user, updateUserContext } = useAuth();
   const dispatch = useDispatch();

   const [formData, setFormData] = useState({
      name: user?.name || "",
      bio: user?.bio || "",
      location: user?.location || "",
   });

   const [profileImage, setProfileImage] = useState(null);
   const [coverImage, setCoverImage] = useState(null);
   const [profileImagePreview, setProfileImagePreview] = useState(
      user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : null,
   );
   const [coverImagePreview, setCoverImagePreview] = useState(user?.coverImage ? `http://localhost:5000/uploads/${user.coverImage}` : null);

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const profileImageRef = useRef(null);
   const coverImageRef = useRef(null);

   // Auto-dismiss success message after 5 seconds
   useEffect(() => {
      if (success) {
         const timer = setTimeout(() => {
            setSuccess("");
         }, 5000);
         return () => clearTimeout(timer);
      }
   }, [success]);

   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleProfileImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setProfileImage(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setProfileImagePreview(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleCoverImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setCoverImage(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            setCoverImagePreview(reader.result);
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      try {
         // Create form data for file upload
         const formDataObj = new FormData();
         formDataObj.append("name", formData.name);
         formDataObj.append("bio", formData.bio);
         formDataObj.append("location", formData.location);

         if (profileImage) {
            formDataObj.append("profileImage", profileImage);
         }

         if (coverImage) {
            formDataObj.append("coverImage", coverImage);
         }

         // Update user profile
         const response = await axios.put(`/api/users/${user.id}`, formDataObj, {
            headers: {
               "Content-Type": "multipart/form-data",
            },
         });

         // Update user context
         updateUserContext(response.data.data);

         setSuccess("Profile updated successfully");

         // Reset file inputs
         setProfileImage(null);
         setCoverImage(null);

         // Update previews with new images from response
         if (response.data.data.profileImage) {
            setProfileImagePreview(`http://localhost:5000/uploads/${response.data.data.profileImage}`);
         }

         if (response.data.data.coverImage) {
            setCoverImagePreview(`http://localhost:5000/uploads/${response.data.data.coverImage}`);
         }
      } catch (err) {
         setError(err.response?.data?.error || "Failed to update profile. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <div className='p-6'>
         <div className='flex items-center mb-6'>
            <div className='bg-maple-red/10 p-2 rounded-full mr-3'>
               <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                  />
               </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>Profile Information</h2>
         </div>

         <p className='text-gray-500 mb-6'>
            Update your profile information, photo and cover image. This information will be displayed publicly.
         </p>

         <AnimatePresence>
            {error && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
                  <div className='flex'>
                     <div className='flex-shrink-0'>
                        <svg className='h-5 w-5 text-red-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-red-800'>{error}</p>
                     </div>
                     <button onClick={() => setError("")} className='text-red-500 hover:text-red-700'>
                        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <AnimatePresence>
            {success && (
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='bg-green-50 border border-green-200 rounded-lg p-4 mb-6'>
                  <div className='flex'>
                     <div className='flex-shrink-0'>
                        <svg className='h-5 w-5 text-green-400' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'>
                           <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <div className='ml-3 flex-1'>
                        <p className='text-sm font-medium text-green-800'>{success}</p>
                     </div>
                     <button onClick={() => setSuccess("")} className='text-green-500 hover:text-green-700'>
                        <svg className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                        </svg>
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>

         <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='bg-white rounded-xl border border-gray-200 p-6'>
               <h3 className='text-lg font-medium text-gray-900 mb-4'>Profile Images</h3>
               <div className='space-y-6'>
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Profile Photo</label>
                     <div className='flex items-center space-x-6'>
                        <motion.div
                           whileHover={{ scale: 1.05 }}
                           className='relative h-28 w-28 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-2 border-gray-200 shadow-sm'>
                           {profileImagePreview ? (
                              <img src={profileImagePreview} alt='Profile' className='h-full w-full object-cover' />
                           ) : (
                              <div className='h-full w-full flex items-center justify-center bg-maple-red/10'>
                                 <svg className='h-12 w-12 text-maple-red/60' fill='currentColor' viewBox='0 0 24 24'>
                                    <path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
                                 </svg>
                              </div>
                           )}

                           <div className='absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                              <button
                                 type='button'
                                 onClick={() => profileImageRef.current.click()}
                                 className='text-white font-medium text-sm'>
                                 Change
                              </button>
                           </div>
                        </motion.div>

                        <div className='flex-1'>
                           <p className='text-sm text-gray-500 mb-2'>
                              Upload a new profile photo. This will be displayed on your profile and in comments.
                           </p>
                           <div className='flex space-x-3'>
                              <input
                                 type='file'
                                 ref={profileImageRef}
                                 onChange={handleProfileImageChange}
                                 className='hidden'
                                 accept='image/*'
                              />
                              <motion.button
                                 type='button'
                                 onClick={() => profileImageRef.current.click()}
                                 whileHover={{ scale: 1.03 }}
                                 whileTap={{ scale: 0.98 }}
                                 className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'>
                                 Upload Photo
                              </motion.button>

                              {profileImagePreview && (
                                 <motion.button
                                    type='button'
                                    onClick={() => {
                                       setProfileImage(null);
                                       setProfileImagePreview(
                                          user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : null,
                                       );
                                    }}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors'>
                                    Reset
                                 </motion.button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>

                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-2'>Cover Image</label>
                     <motion.div
                        whileHover={{ scale: 1.01 }}
                        className='relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center border border-gray-200 shadow-sm'>
                        {coverImagePreview ? (
                           <img src={coverImagePreview} alt='Cover' className='h-full w-full object-cover' />
                        ) : (
                           <div className='h-full w-full flex items-center justify-center bg-maple-red/5'>
                              <svg className='h-16 w-16 text-maple-red/30' fill='currentColor' viewBox='0 0 24 24'>
                                 <path d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
                              </svg>
                           </div>
                        )}

                        <div className='absolute inset-0 bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center'>
                           <button
                              type='button'
                              onClick={() => coverImageRef.current.click()}
                              className='px-4 py-2 bg-white bg-opacity-90 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-opacity-100 transition-colors'>
                              Change Cover Image
                           </button>
                        </div>
                     </motion.div>

                     <div className='mt-3 flex justify-between items-center'>
                        <p className='text-sm text-gray-500'>Recommended size: 1200 x 400 pixels</p>

                        <div className='flex space-x-3'>
                           <input type='file' ref={coverImageRef} onChange={handleCoverImageChange} className='hidden' accept='image/*' />

                           {coverImagePreview && (
                              <motion.button
                                 type='button'
                                 onClick={() => {
                                    setCoverImage(null);
                                    setCoverImagePreview(user?.coverImage ? `http://localhost:5000/uploads/${user.coverImage}` : null);
                                 }}
                                 whileHover={{ scale: 1.03 }}
                                 whileTap={{ scale: 0.98 }}
                                 className='px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 transition-colors'>
                                 Reset
                              </motion.button>
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className='bg-white rounded-xl border border-gray-200 p-6'>
               <h3 className='text-lg font-medium text-gray-900 mb-4'>Personal Information</h3>
               <div className='space-y-6'>
                  <div>
                     <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                        Full Name
                     </label>
                     <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                           <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                              />
                           </svg>
                        </div>
                        <input
                           type='text'
                           name='name'
                           id='name'
                           value={formData.name}
                           onChange={handleChange}
                           required
                           placeholder='Your full name'
                           className='pl-10 shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg py-2.5'
                        />
                     </div>
                     <p className='mt-1 text-xs text-gray-500'>This is how your name will appear across MapleConnect</p>
                  </div>

                  <div>
                     <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
                        Location
                     </label>
                     <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                           <svg className='h-5 w-5 text-gray-400' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={1.5}
                                 d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                              />
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                           </svg>
                        </div>
                        <input
                           type='text'
                           name='location'
                           id='location'
                           value={formData.location}
                           onChange={handleChange}
                           placeholder='City, Province'
                           className='pl-10 shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg py-2.5'
                        />
                     </div>
                     <p className='mt-1 text-xs text-gray-500'>Your location helps connect you with local events and groups</p>
                  </div>

                  <div>
                     <label htmlFor='bio' className='block text-sm font-medium text-gray-700 mb-1'>
                        Bio
                     </label>
                     <div className='relative'>
                        <textarea
                           id='bio'
                           name='bio'
                           rows={4}
                           value={formData.bio}
                           onChange={handleChange}
                           placeholder='Tell others about yourself...'
                           className='shadow-sm focus:ring-maple-red focus:border-maple-red block w-full sm:text-sm border-gray-300 rounded-lg'
                        />
                     </div>
                     <div className='mt-1 flex justify-between'>
                        <p className='text-xs text-gray-500'>Brief description for your profile. URLs are hyperlinked.</p>
                        <p className='text-xs text-gray-500'>{formData.bio.length}/500 characters</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className='pt-5'>
               <div className='flex justify-end space-x-3'>
                  <motion.button
                     type='button'
                     whileHover={{ scale: 1.03 }}
                     whileTap={{ scale: 0.98 }}
                     className='bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                     onClick={() => {
                        setFormData({
                           name: user?.name || "",
                           bio: user?.bio || "",
                           location: user?.location || "",
                        });
                        setProfileImage(null);
                        setCoverImage(null);
                        setProfileImagePreview(user?.profileImage ? `http://localhost:5000/uploads/${user.profileImage}` : null);
                        setCoverImagePreview(user?.coverImage ? `http://localhost:5000/uploads/${user.coverImage}` : null);
                     }}>
                     Reset Changes
                  </motion.button>
                  <motion.button
                     type='submit'
                     disabled={isSubmitting}
                     whileHover={isSubmitting ? {} : { scale: 1.03 }}
                     whileTap={isSubmitting ? {} : { scale: 0.98 }}
                     className={`inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                        isSubmitting ? "bg-maple-red/60 cursor-not-allowed" : "bg-maple-red hover:bg-maple-red-dark transition-colors"
                     }`}>
                     {isSubmitting ? (
                        <>
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
                           Saving...
                        </>
                     ) : (
                        <>
                           <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                           </svg>
                           Save Changes
                        </>
                     )}
                  </motion.button>
               </div>
            </div>
         </form>
      </div>
   );
};

export default ProfileSettings;
