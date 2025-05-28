import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateGroup } from "../../services/groupService";
import { updateGroupSuccess } from "../../redux/slices/groupSlice";
import { motion } from "framer-motion";

const EditGroupForm = ({ group, onClose }) => {
   const dispatch = useDispatch();

   const [formData, setFormData] = useState({
      name: "",
      description: "",
      location: "",
      isPrivate: false,
      image: "",
      coverImage: "",
   });

   const [isSubmitting, setIsSubmitting] = useState(false);
   const [formError, setFormError] = useState("");

   useEffect(() => {
      if (group) {
         setFormData({
            name: group.name || "",
            description: group.description || "",
            location: group.location || "",
            isPrivate: group.isPrivate || false,
            image: group.image || "",
            coverImage: group.coverImage || "",
         });
      }
   }, [group]);

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");

      // Validate form
      if (!formData.name.trim() || !formData.description.trim()) {
         setFormError("Name and description are required");
         return;
      }

      try {
         setIsSubmitting(true);

         const response = await updateGroup(group._id, formData);
         dispatch(updateGroupSuccess(response.data));
         onClose();
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to update circle";
         setFormError(message);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <motion.div
         className='bg-white rounded-xl shadow-lg p-6 overflow-hidden'
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}>
         <div className='border-b border-gray-100 pb-4 mb-6'>
            <h2 className='text-2xl font-bold text-charcoal-gray'>Edit Circle</h2>
            <p className='text-gray-500 mt-1'>Update your circle's information</p>
         </div>

         {formError && (
            <div className='mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700'>
               <p className='text-sm'>{formError}</p>
            </div>
         )}

         <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
               <div>
                  <label htmlFor='name' className='block text-sm font-medium text-charcoal-gray mb-1'>
                     Circle Name*
                  </label>
                  <input
                     type='text'
                     id='name'
                     name='name'
                     value={formData.name}
                     onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                     placeholder='Enter a name for your circle'
                     required
                  />
               </div>

               <div>
                  <label htmlFor='location' className='block text-sm font-medium text-charcoal-gray mb-1'>
                     Location
                  </label>
                  <input
                     type='text'
                     id='location'
                     name='location'
                     value={formData.location}
                     onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                     placeholder='City, Province, or Region'
                  />
               </div>
            </div>

            <div className='mb-6'>
               <label htmlFor='description' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Description*
               </label>
               <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                  placeholder='Describe what your circle is about, who should join, and what activities you plan to organize...'
                  required></textarea>
               <p className='mt-1 text-xs text-gray-500'>
                  A good description helps potential members understand the purpose of your circle.
               </p>
            </div>

            <div className='mb-6'>
               <label htmlFor='image' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Circle Profile Image URL
               </label>
               <input
                  type='url'
                  id='image'
                  name='image'
                  value={formData.image}
                  onChange={handleChange}
                  className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                  placeholder='https://example.com/image.jpg'
               />
               <p className='mt-1 text-xs text-gray-500'>
                  Enter a URL for your circle's profile image. Recommended: Square image, at least 300x300px
               </p>
            </div>

            <div className='mb-6'>
               <label htmlFor='coverImage' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Circle Cover Image URL
               </label>
               <input
                  type='url'
                  id='coverImage'
                  name='coverImage'
                  value={formData.coverImage}
                  onChange={handleChange}
                  className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                  placeholder='https://example.com/cover.jpg'
               />
               <p className='mt-1 text-xs text-gray-500'>
                  Enter a URL for your circle's cover image. Recommended: 1200x400px landscape image
               </p>
            </div>

            <div className='mb-6'>
               <div className='flex items-center'>
                  <input
                     id='isPrivate'
                     name='isPrivate'
                     type='checkbox'
                     checked={formData.isPrivate}
                     onChange={handleChange}
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                  />
                  <label htmlFor='isPrivate' className='ml-2 block text-sm text-gray-700'>
                     Make this circle private
                  </label>
               </div>
               <p className='mt-1 text-xs text-gray-500 ml-6'>Private circles require admin approval for new members to join.</p>
            </div>

            <div className='flex justify-end pt-4 border-t border-gray-100'>
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='button'
                  onClick={onClose}
                  className='mr-3 bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-all duration-200'>
                  Cancel
               </motion.button>
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type='submit'
                  disabled={isSubmitting}
                  className={`inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                     isSubmitting ? "bg-maple-red/70 cursor-not-allowed" : "bg-maple-red hover:bg-maple-red-dark"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-all duration-200`}>
                  {isSubmitting ? (
                     <>
                        <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' fill='none' viewBox='0 0 24 24'>
                           <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                           <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Updating...
                     </>
                  ) : (
                     "Save Changes"
                  )}
               </motion.button>
            </div>
         </form>
      </motion.div>
   );
};

export default EditGroupForm;
