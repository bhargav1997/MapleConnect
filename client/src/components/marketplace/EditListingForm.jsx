import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateListing } from "../../services/marketplaceService";
import { updateListingStart, updateListingSuccess, updateListingFailure } from "../../redux/slices/marketplaceSlice";

const EditListingForm = ({ listing, onClose }) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoading, error } = useSelector((state) => state.marketplace);

   const [formData, setFormData] = useState({
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price || "",
      category: listing.category || "",
      condition: listing.condition || "",
      location: listing.location || "",
      isDeliveryAvailable: listing.isDeliveryAvailable || false,
      images: listing.images?.length > 0 ? [...listing.images] : [""],
   });

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

   const handleImageUrlChange = (index, value) => {
      const newImages = [...formData.images];
      newImages[index] = value;
      setFormData({ ...formData, images: newImages });
   };

   const addImageField = () => {
      if (formData.images.length < 5) {
         setFormData({ ...formData, images: [...formData.images, ""] });
      }
   };

   const removeImageField = (index) => {
      const newImages = [...formData.images];
      newImages.splice(index, 1);
      setFormData({ ...formData, images: newImages });
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

      // Validate at least one image URL
      const validImages = formData.images.filter((url) => url.trim() !== "");
      if (validImages.length === 0) {
         setFormError("Please provide at least one image URL");
         return;
      }

      try {
         dispatch(updateListingStart());

         const listingData = {
            ...formData,
            price: parseFloat(formData.price),
            images: validImages,
         };

         const response = await updateListing(listing._id, listingData);
         dispatch(updateListingSuccess(response.data));

         if (onClose) {
            onClose();
         } else {
            navigate(`/marketplace/${response.data._id}`);
         }
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to update listing";
         dispatch(updateListingFailure(message));
         setFormError(message);
      }
   };

   return (
      <div className='bg-white rounded-xl shadow-lg p-6'>
         <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold text-charcoal-gray'>Edit Listing</h2>
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
               <label className='block text-sm font-medium text-gray-700 mb-2'>Image URLs (up to 5)</label>
               {formData.images.map((url, idx) => (
                  <div key={idx} className='flex items-center mb-2'>
                     <input
                        type='url'
                        value={url}
                        onChange={(e) => handleImageUrlChange(idx, e.target.value)}
                        className='block w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-maple-red focus:border-maple-red sm:text-sm'
                        placeholder={`https://example.com/image${idx + 1}.jpg`}
                     />
                     {formData.images.length > 1 && (
                        <button
                           type='button'
                           onClick={() => removeImageField(idx)}
                           className='ml-2 text-red-500 hover:text-red-700 text-lg font-bold px-2'>
                           &times;
                        </button>
                     )}
                  </div>
               ))}
               {formData.images.length < 5 && (
                  <button
                     type='button'
                     onClick={addImageField}
                     className='mt-2 px-3 py-1 bg-gray-100 text-sm rounded hover:bg-gray-200 text-maple-red font-medium'>
                     + Add another image
                  </button>
               )}
               <p className='mt-1 text-xs text-gray-500'>Paste up to 5 image URLs for your listing. At least one is required.</p>
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
                  {isLoading ? "Updating..." : "Update Listing"}
               </button>
            </div>
         </form>
      </div>
   );
};

export default EditListingForm;
