import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { AnimatePresence } from "framer-motion";
import api from "../../services/api";
import defaultCoverImage from "../../assets/default-cover.png";
import defaultUserImage from "../../assets/default-user.png";

const AccountSettings = () => {
   const { user } = useAuth();

   const [formData, setFormData] = useState({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      bio: user?.bio || "",
      location: user?.location || "",
      profileImage: user?.profileImage || "",
      coverImage: user?.coverImage || "",
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

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

   const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!user) {
         setError("Please log in to update your settings");
         return;
      }

      setIsSubmitting(true);

      try {
         const updateData = {
            profileImage: formData.profileImage,
            coverImage: formData.coverImage,
         };

         await api.put(`/users/${user.id}/settings`, updateData);
         setSuccess("Profile images updated successfully");
      } catch (err) {
         setError(err.response?.data?.error || "Failed to update profile images. Please try again.");
      } finally {
         setIsSubmitting(false);
      }
   };

   // If user is not available, show loading state
   if (!user) {
      return (
         <div className='p-6 flex items-center justify-center'>
            <div className='text-gray-500'>Loading...</div>
         </div>
      );
   }

   return (
      <div className='p-6'>
         <div className='flex items-center mb-6'>
            <div className='bg-maple-red/10 p-2 rounded-full mr-3'>
               <svg className='w-6 h-6 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z'
                  />
               </svg>
            </div>
            <h2 className='text-xl font-semibold text-gray-900'>Account Settings</h2>
         </div>

         <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Profile Images Section */}
            <div className='bg-white rounded-lg shadow p-6'>
               <h3 className='text-lg font-medium text-gray-900 mb-4'>Profile Images</h3>
               <div className='space-y-8'>
                  {/* Cover Image */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-4'>Cover Image</label>
                     <div className='relative'>
                        <div className='h-48 w-full overflow-hidden rounded-lg bg-gray-100'>
                           <img
                              src={formData.coverImage || defaultCoverImage}
                              alt='Cover'
                              className='h-full w-full object-cover'
                              onError={(e) => {
                                 e.target.src = defaultCoverImage;
                              }}
                           />
                        </div>
                        <div className='mt-2'>
                           <input
                              type='url'
                              name='coverImage'
                              value={formData.coverImage}
                              onChange={handleChange}
                              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                              placeholder='https://example.com/cover-image.jpg'
                           />
                        </div>
                     </div>
                  </div>

                  {/* Profile Image */}
                  <div>
                     <label className='block text-sm font-medium text-gray-700 mb-4'>Profile Image</label>
                     <div className='flex items-center space-x-6'>
                        <div className='h-32 w-32 overflow-hidden rounded-full bg-gray-100 flex-shrink-0'>
                           <img
                              src={formData.profileImage || defaultUserImage}
                              alt='Profile'
                              className='h-full w-full object-cover'
                              onError={(e) => {
                                 e.target.src = defaultUserImage;
                              }}
                           />
                        </div>
                        <div className='flex-1'>
                           <input
                              type='url'
                              name='profileImage'
                              value={formData.profileImage}
                              onChange={handleChange}
                              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                              placeholder='https://example.com/profile-image.jpg'
                           />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Profile Information */}
            <div className='bg-white rounded-lg shadow p-6'>
               <h3 className='text-lg font-medium text-gray-900 mb-4'>Profile Information</h3>
               <div className='grid grid-cols-1 gap-6'>
                  <div>
                     <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
                        Name
                     </label>
                     <input
                        type='text'
                        name='name'
                        id='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                     />
                  </div>

                  <div>
                     <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                        Username
                     </label>
                     <input
                        type='text'
                        name='username'
                        id='username'
                        value={formData.username}
                        onChange={handleChange}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                     />
                  </div>

                  <div>
                     <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                        Email
                     </label>
                     <input
                        type='email'
                        name='email'
                        id='email'
                        value={user.email}
                        disabled
                        className='mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm cursor-not-allowed'
                     />
                     <p className='mt-2 text-sm text-gray-500'>
                        Your email address cannot be changed. Please contact support if you need to update it.
                     </p>
                  </div>

                  <div>
                     <label htmlFor='bio' className='block text-sm font-medium text-gray-700'>
                        Bio
                     </label>
                     <textarea
                        name='bio'
                        id='bio'
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                        placeholder='Tell us about yourself...'
                     />
                  </div>

                  <div>
                     <label htmlFor='location' className='block text-sm font-medium text-gray-700'>
                        Location
                     </label>
                     <input
                        type='text'
                        name='location'
                        id='location'
                        value={formData.location}
                        onChange={handleChange}
                        className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'
                        placeholder='e.g., New York, USA'
                     />
                  </div>
               </div>
            </div>

            {/* Error and Success Messages */}
            <AnimatePresence>
               {error && (
                  <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                     <div className='flex'>
                        <div className='flex-shrink-0'>
                           <svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                        <div className='ml-3'>
                           <p className='text-sm font-medium text-red-800'>{error}</p>
                        </div>
                     </div>
                  </div>
               )}

               {success && (
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                     <div className='flex'>
                        <div className='flex-shrink-0'>
                           <svg className='h-5 w-5 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
                              <path
                                 fillRule='evenodd'
                                 d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                 clipRule='evenodd'
                              />
                           </svg>
                        </div>
                        <div className='ml-3'>
                           <p className='text-sm font-medium text-green-800'>{success}</p>
                        </div>
                     </div>
                  </div>
               )}
            </AnimatePresence>

            {/* Submit Button */}
            <div className='flex justify-end'>
               <button
                  type='submit'
                  disabled={isSubmitting}
                  className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red disabled:opacity-50 disabled:cursor-not-allowed'>
                  {isSubmitting ? "Saving..." : "Save Changes"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default AccountSettings;
