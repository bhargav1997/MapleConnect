import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../../services/groupService";
import { createGroupStart, createGroupSuccess, createGroupFailure } from "../../redux/slices/groupSlice";
import { motion } from "framer-motion";

const CreateGroupForm = ({ onClose }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoading, error } = useSelector((state) => state.group);

   const [formData, setFormData] = useState({
      name: "",
      description: "",
      location: "",
      isPrivate: false,
      image: "",
      coverImage: "",
   });

   const [formError, setFormError] = useState("");

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
         dispatch(createGroupStart());

         const response = await createGroup(formData);
         dispatch(createGroupSuccess(response.data));

         if (onClose) {
            onClose();
         } else {
            navigate(`/groups/${response.data._id}`);
         }
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to create group";
         dispatch(createGroupFailure(message));
         setFormError(message);
      }
   };

   return (
      <motion.div
         className='bg-white rounded-xl shadow-lg p-6 overflow-hidden'
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.3 }}>
         <div className='border-b border-gray-100 pb-4 mb-6'>
            <h2 className='text-2xl font-bold text-charcoal-gray'>Create New Circle</h2>
            <p className='text-gray-500 mt-1'>Connect with others by creating your own community circle</p>
         </div>

         {(formError || error) && (
            <motion.div
               className='bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg'
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.3 }}>
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
                  <div className='ml-3'>
                     <p className='text-sm text-red-700'>{formError || error}</p>
                  </div>
               </div>
            </motion.div>
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
                  <div className='relative'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg className='h-5 w-5 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                           <path
                              fillRule='evenodd'
                              d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <input
                        type='text'
                        id='location'
                        name='location'
                        value={formData.location}
                        onChange={handleChange}
                        className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                        placeholder='City, Province, or Region'
                     />
                  </div>
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

            <div className='mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100'>
               <div className='flex items-center'>
                  <input
                     id='isPrivate'
                     name='isPrivate'
                     type='checkbox'
                     checked={formData.isPrivate}
                     onChange={handleChange}
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                  />
                  <label htmlFor='isPrivate' className='ml-2 block text-sm font-medium text-charcoal-gray'>
                     Make this circle private
                  </label>
               </div>
               <p className='mt-2 text-sm text-gray-500'>
                  <span className='font-medium block mb-1'>Privacy settings:</span>
                  <span className='flex items-start mb-1'>
                     <svg className='h-4 w-4 text-maple-red mr-1 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                           fillRule='evenodd'
                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                           clipRule='evenodd'
                        />
                     </svg>
                     Private circles are only visible to members
                  </span>
                  <span className='flex items-start'>
                     <svg className='h-4 w-4 text-maple-red mr-1 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                           fillRule='evenodd'
                           d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                           clipRule='evenodd'
                        />
                     </svg>
                     New members require approval to join
                  </span>
               </p>
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
                  disabled={isLoading}
                  className={`inline-flex items-center justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                     isLoading ? "bg-maple-red/70 cursor-not-allowed" : "bg-maple-red hover:bg-maple-red-dark"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-all duration-200`}>
                  {isLoading ? (
                     <>
                        <svg className='animate-spin -ml-1 mr-2 h-4 w-4 text-white' fill='none' viewBox='0 0 24 24'>
                           <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                           <path
                              className='opacity-75'
                              fill='currentColor'
                              d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                        </svg>
                        Creating...
                     </>
                  ) : (
                     "Create Circle"
                  )}
               </motion.button>
            </div>
         </form>
      </motion.div>
   );
};

export default CreateGroupForm;
