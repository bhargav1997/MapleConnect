import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createEvent } from "../../services/eventService";
import { getAllGroups } from "../../services/groupService";
import { motion } from "framer-motion";
import { createEventStart, createEventSuccess, createEventFailure } from "../../redux/slices/eventSlice";

const CreateEventForm = ({ onClose, groupId }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoading, error } = useSelector((state) => state.event);

   const [formData, setFormData] = useState({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      group: groupId || "",
      isPrivate: false,
   });

   const [image, setImage] = useState(null);
   const [imagePreview, setImagePreview] = useState(null);
   const [formError, setFormError] = useState("");
   const [groups, setGroups] = useState([]);

   useEffect(() => {
      const fetchGroups = async () => {
         try {
            const data = await getAllGroups();
            setGroups(data);
         } catch (error) {
            console.error("Error fetching groups:", error);
         }
      };

      if (!groupId) {
         fetchGroups();
      }
   }, [groupId]);

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setImage(file);
         setImagePreview(URL.createObjectURL(file));
      }
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");

      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim() || !formData.startDate || !formData.endDate) {
         setFormError("Please fill in all required fields");
         return;
      }

      // Validate dates
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const now = new Date();

      if (startDate < now) {
         setFormError("Start date cannot be in the past");
         return;
      }

      if (endDate < startDate) {
         setFormError("End date must be after start date");
         return;
      }

      try {
         dispatch(createEventStart());

         const eventData = {
            ...formData,
            image,
         };

         const response = await createEvent(eventData);
         dispatch(createEventSuccess(response.data));

         if (onClose) {
            onClose();
         } else {
            navigate(`/events/${response.data._id}`);
         }
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to create event";
         dispatch(createEventFailure(message));
         setFormError(message);
      }
   };

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 20 }}
         className='bg-white rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto'>
         <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-charcoal-gray'>Create New Event</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-500 focus:outline-none'>
               <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
               </svg>
            </button>
         </div>

         {(formError || error) && (
            <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className='bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg'>
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

         <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
               <label htmlFor='title' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Event Title*
               </label>
               <input
                  type='text'
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  placeholder='Enter a descriptive title for your event'
                  className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700 placeholder-gray-400'
                  required
               />
            </div>

            <div>
               <label htmlFor='description' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Description*
               </label>
               <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  placeholder='Provide details about your event, including what attendees can expect'
                  className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700 placeholder-gray-400'
                  required></textarea>
            </div>

            <div>
               <label htmlFor='location' className='block text-sm font-medium text-charcoal-gray mb-1'>
                  Location*
               </label>
               <input
                  type='text'
                  id='location'
                  name='location'
                  value={formData.location}
                  onChange={handleChange}
                  placeholder='Enter the event venue or address'
                  className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700 placeholder-gray-400'
                  required
               />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
               <div>
                  <label htmlFor='startDate' className='block text-sm font-medium text-charcoal-gray mb-1'>
                     Start Date & Time*
                  </label>
                  <input
                     type='datetime-local'
                     id='startDate'
                     name='startDate'
                     value={formData.startDate}
                     onChange={handleChange}
                     className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700'
                     required
                  />
               </div>

               <div>
                  <label htmlFor='endDate' className='block text-sm font-medium text-charcoal-gray mb-1'>
                     End Date & Time*
                  </label>
                  <input
                     type='datetime-local'
                     id='endDate'
                     name='endDate'
                     value={formData.endDate}
                     onChange={handleChange}
                     className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700'
                     required
                  />
               </div>
            </div>

            {!groupId && (
               <div>
                  <label htmlFor='group' className='block text-sm font-medium text-charcoal-gray mb-1'>
                     Group (Optional)
                  </label>
                  <select
                     id='group'
                     name='group'
                     value={formData.group}
                     onChange={handleChange}
                     className='w-full rounded-lg border-light-slate focus:ring-maple-red focus:border-maple-red px-4 py-2.5 text-gray-700'>
                     <option value=''>Select a group (optional)</option>
                     {groups?.data?.map((group) => (
                        <option key={group._id} value={group._id}>
                           {group.name}
                        </option>
                     ))}
                  </select>
               </div>
            )}

            <div>
               <label className='block text-sm font-medium text-charcoal-gray mb-2'>Event Image</label>
               <div className='flex items-center'>
                  <div className='flex-shrink-0 h-24 w-24 rounded-lg overflow-hidden bg-gray-100 mr-4 border border-light-slate'>
                     {imagePreview ? (
                        <img src={imagePreview} alt='Event preview' className='h-full w-full object-cover' />
                     ) : (
                        <div className='h-full w-full flex items-center justify-center'>
                           <svg
                              xmlns='http://www.w3.org/2000/svg'
                              className='h-12 w-12 text-gray-300'
                              fill='none'
                              viewBox='0 0 24 24'
                              stroke='currentColor'>
                              <path
                                 strokeLinecap='round'
                                 strokeLinejoin='round'
                                 strokeWidth={2}
                                 d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                           </svg>
                        </div>
                     )}
                  </div>
                  <label className='cursor-pointer bg-white py-2.5 px-4 border border-light-slate rounded-lg shadow-sm text-sm leading-4 font-medium text-charcoal-gray hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors'>
                     Upload Image
                     <input type='file' className='hidden' accept='image/*' onChange={handleImageChange} />
                  </label>
               </div>
               <p className='mt-1 text-xs text-gray-500'>Recommended size: 1200x630 pixels. Max file size: 5MB</p>
            </div>

            <div>
               <div className='flex items-center'>
                  <input
                     id='isPrivate'
                     name='isPrivate'
                     type='checkbox'
                     checked={formData.isPrivate}
                     onChange={handleChange}
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-light-slate rounded'
                  />
                  <label htmlFor='isPrivate' className='ml-2 block text-sm text-charcoal-gray'>
                     Make this event private
                  </label>
               </div>
               <p className='mt-1 text-xs text-gray-500'>Private events are only visible to group members or invited guests.</p>
            </div>

            <div className='flex justify-end space-x-3'>
               <button
                  type='button'
                  onClick={onClose}
                  className='px-4 py-2.5 bg-white text-charcoal-gray border border-light-slate rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors'>
                  Cancel
               </button>
               <button
                  type='submit'
                  disabled={isLoading}
                  className={`px-4 py-2.5 rounded-lg text-white font-medium ${
                     isLoading
                        ? "bg-maple-red/70 cursor-not-allowed"
                        : "bg-maple-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red"
                  } transition-colors`}>
                  {isLoading ? (
                     <div className='flex items-center'>
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
                        Creating...
                     </div>
                  ) : (
                     "Create Event"
                  )}
               </button>
            </div>
         </form>
      </motion.div>
   );
};

export default CreateEventForm;
