import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createListing } from "../../services/marketplaceService";
import { createListingStart, createListingSuccess, createListingFailure } from "../../redux/slices/marketplaceSlice";

const CreateListingForm = ({ onClose }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoading, error } = useSelector((state) => state.marketplace);

   const [formData, setFormData] = useState({
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      location: "",
      isDeliveryAvailable: false,
   });

   const [images, setImages] = useState([]);
   const [imagePreviews, setImagePreviews] = useState([]);
   const [formError, setFormError] = useState("");

   const categories = ["Electronics", "Furniture", "Clothing", "Books", "Sports", "Toys", "Vehicles", "Services", "Other"];

   const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData({
         ...formData,
         [name]: type === "checkbox" ? checked : value,
      });
   };

   const handleImageChange = (e) => {
      const files = Array.from(e.target.files);

      // Limit to 5 files
      if (files.length + images.length > 5) {
         setFormError("You can only upload up to 5 images");
         return;
      }

      setImages([...images, ...files]);

      // Create previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);

      setFormError("");
   };

   const removeImage = (index) => {
      const newImages = [...images];
      const newPreviews = [...imagePreviews];

      newImages.splice(index, 1);
      newPreviews.splice(index, 1);

      setImages(newImages);
      setImagePreviews(newPreviews);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setFormError("");

      // Validate form
      if (
         !formData.title.trim() ||
         !formData.description.trim() ||
         !formData.price ||
         !formData.category ||
         !formData.condition ||
         !formData.location.trim()
      ) {
         setFormError("Please fill in all required fields");
         return;
      }

      // Validate price
      if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
         setFormError("Please enter a valid price");
         return;
      }

      try {
         dispatch(createListingStart());

         const listingData = {
            ...formData,
            price: parseFloat(formData.price),
            images,
         };

         const response = await createListing(listingData);
         dispatch(createListingSuccess(response.data));

         if (onClose) {
            onClose();
         } else {
            navigate(`/marketplace/${response.data._id}`);
         }
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to create listing";
         dispatch(createListingFailure(message));
         setFormError(message);
      }
   };

   return (
      <div className='bg-white rounded-xl shadow-lg p-6'>
         <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-charcoal-gray'>Create New Listing</h2>
            <button type='button' onClick={onClose} className='text-gray-400 hover:text-gray-500'>
               <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
               </svg>
            </button>
         </div>

         {(formError || error) && (
            <div className='bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-r-lg'>
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
            </div>
         )}

         <form onSubmit={handleSubmit}>
            <div className='mb-4'>
               <label htmlFor='title' className='block text-sm font-medium text-gray-700'>
                  Title*
               </label>
               <input
                  type='text'
                  id='title'
                  name='title'
                  value={formData.title}
                  onChange={handleChange}
                  className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                  required
               />
            </div>

            <div className='mb-4'>
               <label htmlFor='description' className='block text-sm font-medium text-gray-700'>
                  Description*
               </label>
               <textarea
                  id='description'
                  name='description'
                  value={formData.description}
                  onChange={handleChange}
                  rows='4'
                  className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                  required></textarea>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
               <div>
                  <label htmlFor='price' className='block text-sm font-medium text-gray-700'>
                     Price (CAD)*
                  </label>
                  <div className='mt-1 relative rounded-md shadow-sm'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <span className='text-gray-500 sm:text-sm'>$</span>
                     </div>
                     <input
                        type='text'
                        id='price'
                        name='price'
                        value={formData.price}
                        onChange={handleChange}
                        className='block w-full pl-7 pr-12 border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                        placeholder='0.00'
                        required
                     />
                  </div>
               </div>

               <div>
                  <label htmlFor='location' className='block text-sm font-medium text-gray-700'>
                     Location*
                  </label>
                  <input
                     type='text'
                     id='location'
                     name='location'
                     value={formData.location}
                     onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                     required
                  />
               </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
               <div>
                  <label htmlFor='category' className='block text-sm font-medium text-gray-700'>
                     Category*
                  </label>
                  <select
                     id='category'
                     name='category'
                     value={formData.category}
                     onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                     required>
                     <option value=''>Select a category</option>
                     {categories.map((category) => (
                        <option key={category} value={category}>
                           {category}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor='condition' className='block text-sm font-medium text-gray-700'>
                     Condition*
                  </label>
                  <select
                     id='condition'
                     name='condition'
                     value={formData.condition}
                     onChange={handleChange}
                     className='mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                     required>
                     <option value=''>Select condition</option>
                     {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                           {condition}
                        </option>
                     ))}
                  </select>
               </div>
            </div>

            <div className='mb-4'>
               <label className='block text-sm font-medium text-gray-700 mb-2'>Images (up to 5)</label>

               {imagePreviews.length > 0 && (
                  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-3'>
                     {imagePreviews.map((preview, index) => (
                        <div key={index} className='relative'>
                           <img src={preview} alt={`Preview ${index + 1}`} className='w-full h-24 object-cover rounded' />
                           <button
                              type='button'
                              onClick={() => removeImage(index)}
                              className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600'>
                              <svg
                                 xmlns='http://www.w3.org/2000/svg'
                                 className='h-4 w-4'
                                 fill='none'
                                 viewBox='0 0 24 24'
                                 stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                              </svg>
                           </button>
                        </div>
                     ))}
                  </div>
               )}

               <div className='flex items-center'>
                  <label className='cursor-pointer bg-white py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors'>
                     {imagePreviews.length === 0 ? "Upload Images" : "Add More Images"}
                     <input
                        type='file'
                        className='hidden'
                        accept='image/*'
                        multiple
                        onChange={handleImageChange}
                        disabled={imagePreviews.length >= 5}
                     />
                  </label>
                  <span className='ml-2 text-xs text-gray-500'>{imagePreviews.length}/5 images</span>
               </div>
            </div>

            <div className='mb-6'>
               <div className='flex items-center'>
                  <input
                     id='isDeliveryAvailable'
                     name='isDeliveryAvailable'
                     type='checkbox'
                     checked={formData.isDeliveryAvailable}
                     onChange={handleChange}
                     className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                  />
                  <label htmlFor='isDeliveryAvailable' className='ml-2 block text-sm text-gray-900'>
                     Delivery available
                  </label>
               </div>
            </div>

            <div className='flex justify-end'>
               <button
                  type='button'
                  onClick={onClose}
                  className='mr-3 bg-white py-2.5 px-5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors'>
                  Cancel
               </button>
               <button
                  type='submit'
                  disabled={isLoading}
                  className={`inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${
                     isLoading
                        ? "bg-maple-red/60 cursor-not-allowed"
                        : "bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-colors"
                  }`}>
                  {isLoading ? "Creating..." : "Create Listing"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default CreateListingForm;
