import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getListingById, updateStatus, deleteListing } from "../services/marketplaceService";
import { useSocket } from "../context/SocketContext";
import {
   getListingStart,
   getListingSuccess,
   getListingFailure,
   updateStatusStart,
   updateStatusSuccess,
   updateStatusFailure,
   deleteListingStart,
   deleteListingSuccess,
   deleteListingFailure,
} from "../redux/slices/marketplaceSlice";
import EditListingForm from "../components/marketplace/EditListingForm";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ListingDetail = () => {
   const { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { listing, isLoading, error } = useSelector((state) => state.marketplace);
   const { sendMessage } = useSocket();

   const [activeImage, setActiveImage] = useState(0);
   const [showContactInfo, setShowContactInfo] = useState(false);
   const [confirmDelete, setConfirmDelete] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);
   const [showMessageInput, setShowMessageInput] = useState(false);
   const [message, setMessage] = useState("");

   useEffect(() => {
      const fetchListing = async () => {
         try {
            dispatch(getListingStart());
            const response = await getListingById(id);
            dispatch(getListingSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load listing";
            dispatch(getListingFailure(message));
         }
      };

      fetchListing();
   }, [dispatch, id]);

   const handleStatusChange = async (status) => {
      try {
         dispatch(updateStatusStart());
         const response = await updateStatus(id, status);
         dispatch(updateStatusSuccess(response.data));
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to update status";
         dispatch(updateStatusFailure(message));
      }
   };

   const handleDeleteListing = async () => {
      try {
         dispatch(deleteListingStart());
         await deleteListing(id);
         dispatch(deleteListingSuccess(id));
         navigate("/marketplace");
      } catch (error) {
         const message = error.response && error.response.data.error ? error.response.data.error : "Failed to delete listing";
         dispatch(deleteListingFailure(message));
         setConfirmDelete(false);
      }
   };

   const handleSendMessage = () => {
      if (!message.trim() && !showMessageInput) {
         // If first click and no message, show the input field with default message
         setMessage(`Hi, I'm interested in your listing: "${listing.title}"`);
         setShowMessageInput(true);
         return;
      }

      if (!message.trim()) {
         toast.error("Please enter a message");
         return;
      }

      try {
         sendMessage(listing.seller._id, message.trim());
         toast.success("Message sent successfully");
         // Navigate to the chat with this seller
         navigate(`/messages/${listing.seller._id}`);
      } catch (error) {
         console.error("Error sending message:", error);
         toast.error("Failed to send message");
      }
   };

   if (isLoading && !listing) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='flex justify-center items-center py-20'>
               <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center py-10'>
               <h3 className='text-lg font-medium text-gray-900'>Error</h3>
               <p className='mt-1 text-sm text-gray-500'>{error}</p>
               <div className='mt-6'>
                  <Link
                     to='/marketplace'
                     className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                     Back to Marketplace
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   if (!listing) {
      return (
         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='text-center py-10'>
               <h3 className='text-lg font-medium text-gray-900'>Listing not found</h3>
               <p className='mt-1 text-sm text-gray-500'>The listing you're looking for doesn't exist or has been removed.</p>
               <div className='mt-6'>
                  <Link
                     to='/marketplace'
                     className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                     Back to Marketplace
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   const isOwner = listing.seller._id === user.id || listing.seller === user.id;

   // Format price
   const formatPrice = (price) => {
      return new Intl.NumberFormat("en-CA", {
         style: "currency",
         currency: "CAD",
      }).format(price);
   };

   // Format date
   const formatDate = (dateString) => {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   return (
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
         {/* Edit Listing Form Modal */}
         {showEditForm && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4'>
               <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className='max-w-2xl w-full'>
                  <EditListingForm listing={listing} onClose={() => setShowEditForm(false)} />
               </motion.div>
            </motion.div>
         )}

         <div className='bg-white shadow-lg rounded-lg overflow-hidden'>
            <div className='md:flex'>
               {/* Image Gallery */}
               <div className='md:w-1/2'>
                  <div className='relative h-96 md:h-[600px] group'>
                     <motion.img
                        key={activeImage}
                        src={listing.images[activeImage] || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={`${listing.title} - Image ${activeImage + 1}`}
                        className='w-full h-full object-cover'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                     />

                     {listing.images.length > 1 && (
                        <>
                           {/* Navigation Arrows */}
                           <button
                              onClick={() => setActiveImage((prev) => (prev - 1 + listing.images.length) % listing.images.length)}
                              className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                              aria-label='Previous image'>
                              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                              </svg>
                           </button>
                           <button
                              onClick={() => setActiveImage((prev) => (prev + 1) % listing.images.length)}
                              className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                              aria-label='Next image'>
                              <svg className='w-6 h-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                              </svg>
                           </button>

                           {/* Thumbnail Strip */}
                           <div className='absolute bottom-4 left-4 right-4 flex justify-center space-x-2 bg-black/30 p-2 rounded-lg backdrop-blur-sm'>
                              {listing.images.map((image, idx) => (
                                 <button
                                    key={idx}
                                    onClick={() => setActiveImage(idx)}
                                    className={`relative h-16 w-16 rounded-md overflow-hidden ${
                                       idx === activeImage ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
                                    }`}
                                    aria-label={`View image ${idx + 1}`}>
                                    <img src={image} alt={`${listing.title} thumbnail ${idx + 1}`} className='h-full w-full object-cover' />
                                 </button>
                              ))}
                           </div>
                        </>
                     )}
                  </div>
               </div>

               {/* Listing Details */}
               <div className='md:w-1/2 p-6 md:p-8'>
                  <div className='flex justify-between items-start mb-4'>
                     <h1 className='text-2xl md:text-3xl font-bold text-charcoal-gray'>{listing.title}</h1>
                     <div className='text-2xl md:text-3xl font-bold text-maple-red'>{formatPrice(listing.price)}</div>
                  </div>

                  <div className='flex flex-wrap gap-2 mb-6'>
                     <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                           listing.condition === "New"
                              ? "bg-green-100 text-green-800"
                              : listing.condition === "Like New"
                              ? "bg-blue-100 text-blue-800"
                              : listing.condition === "Good"
                              ? "bg-yellow-100 text-yellow-800"
                              : listing.condition === "Fair"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-red-100 text-red-800"
                        }`}>
                        {listing.condition}
                     </span>
                     <span className='inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800'>
                        {listing.category}
                     </span>
                     {listing.isDeliveryAvailable && (
                        <span className='inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700'>
                           <svg className='w-4 h-4 mr-1.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                           </svg>
                           Delivery Available
                        </span>
                     )}
                  </div>

                  <div className='prose prose-sm max-w-none mb-8'>
                     <h3 className='text-lg font-semibold mb-2'>Description</h3>
                     <p className='text-gray-600 whitespace-pre-wrap'>{listing.description}</p>
                  </div>

                  <div className='space-y-4 mb-8'>
                     <div className='flex items-center text-gray-600'>
                        <svg className='w-5 h-5 mr-2 text-maple-red/70' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                           />
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                        </svg>
                        <span>{listing.location}</span>
                     </div>
                     <div className='flex items-center text-gray-600'>
                        <svg className='w-5 h-5 mr-2 text-maple-red/70' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={1.5}
                              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                           />
                        </svg>
                        <span>Listed on {new Date(listing.createdAt).toLocaleDateString()}</span>
                     </div>
                  </div>

                  {/* Seller Information */}
                  <div className='border-t border-gray-200 pt-6'>
                     <h3 className='text-lg font-semibold mb-4'>Seller Information</h3>
                     <div className='flex items-center mb-6'>
                        <div className='h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-3 border border-gray-100'>
                           <img
                              src={listing.seller.profileImage || "https://via.placeholder.com/150"}
                              alt={listing.seller.name}
                              className='h-full w-full object-cover'
                           />
                        </div>
                        <div>
                           <Link
                              to={`/profile/${listing.seller._id}`}
                              className='text-lg font-medium text-charcoal-gray hover:text-maple-red transition-colors'>
                              {listing.seller.name}
                           </Link>
                           <p className='text-sm text-gray-500'>Member since {new Date(listing.seller.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>

                     {isOwner ? (
                        <div className='space-y-4'>
                           {/* Status Update */}
                           <div className='bg-gray-50 rounded-lg p-4'>
                              <h4 className='font-medium text-gray-900 mb-3'>Listing Status</h4>
                              <select
                                 value={listing.status}
                                 onChange={(e) => handleStatusChange(e.target.value)}
                                 className='block w-full rounded-md border-gray-300 shadow-sm focus:border-maple-red focus:ring-maple-red sm:text-sm'>
                                 <option value='available'>Available</option>
                                 <option value='pending'>Pending</option>
                                 <option value='sold'>Sold</option>
                              </select>
                           </div>

                           {/* Action Buttons */}
                           <div className='flex gap-3'>
                              <motion.button
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setShowEditForm(true)}
                                 className='flex-1 bg-maple-red text-white py-3 px-4 rounded-lg font-medium hover:bg-maple-red-dark transition-colors flex items-center justify-center'>
                                 <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                                    />
                                 </svg>
                                 Edit Listing
                              </motion.button>

                              <motion.button
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={() => setConfirmDelete(true)}
                                 className='flex-1 bg-red-50 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center'>
                                 <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                    />
                                 </svg>
                                 Delete Listing
                              </motion.button>
                           </div>

                           {/* Delete Confirmation Modal */}
                           <AnimatePresence>
                              {confirmDelete && (
                                 <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                                    <motion.div
                                       initial={{ scale: 0.95, opacity: 0 }}
                                       animate={{ scale: 1, opacity: 1 }}
                                       exit={{ scale: 0.95, opacity: 0 }}
                                       className='bg-white rounded-lg p-6 max-w-sm w-full shadow-xl'>
                                       <h3 className='text-lg font-semibold text-gray-900 mb-2'>Delete Listing</h3>
                                       <p className='text-gray-600 mb-6'>
                                          Are you sure you want to delete this listing? This action cannot be undone.
                                       </p>
                                       <div className='flex gap-3'>
                                          <button
                                             onClick={handleDeleteListing}
                                             className='flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors'>
                                             Yes, Delete
                                          </button>
                                          <button
                                             onClick={() => setConfirmDelete(false)}
                                             className='flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors'>
                                             Cancel
                                          </button>
                                       </div>
                                    </motion.div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     ) : (
                        <div className='space-y-4'>
                           <motion.div initial={false} animate={{ height: showMessageInput ? "auto" : 48 }} className='overflow-hidden'>
                              {showMessageInput && (
                                 <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder='Type your message...'
                                    className='w-full p-3 mb-3 border border-gray-200 rounded-lg focus:ring-maple-red focus:border-maple-red resize-none'
                                    rows={3}
                                 />
                              )}
                              <motion.button
                                 whileHover={{ scale: 1.02 }}
                                 whileTap={{ scale: 0.98 }}
                                 onClick={handleSendMessage}
                                 className='w-full bg-maple-red text-white py-3 px-4 rounded-lg font-medium hover:bg-maple-red-dark transition-colors flex items-center justify-center'>
                                 <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                    <path
                                       strokeLinecap='round'
                                       strokeLinejoin='round'
                                       strokeWidth={2}
                                       d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                                    />
                                 </svg>
                                 {showMessageInput ? "Send Message" : "I'm Interested"}
                              </motion.button>
                           </motion.div>

                           <button
                              onClick={() => setShowContactInfo(!showContactInfo)}
                              className='w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center'>
                              <svg className='w-5 h-5 mr-2' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                 />
                              </svg>
                              {showContactInfo ? "Hide Contact Info" : "Show Contact Info"}
                           </button>
                        </div>
                     )}

                     <AnimatePresence>
                        {showContactInfo && (
                           <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className='mt-4 bg-gray-50 rounded-lg p-4'>
                              <h4 className='font-medium text-gray-900 mb-2'>Contact Information</h4>
                              <div className='space-y-2 text-gray-600'>
                                 <p className='flex items-center'>
                                    <svg className='w-5 h-5 mr-2 text-maple-red/70' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                       <path
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                          strokeWidth={1.5}
                                          d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                                       />
                                    </svg>
                                    {listing.seller.email}
                                 </p>
                                 {listing.seller.phone && (
                                    <p className='flex items-center'>
                                       <svg
                                          className='w-5 h-5 mr-2 text-maple-red/70'
                                          fill='none'
                                          viewBox='0 0 24 24'
                                          stroke='currentColor'>
                                          <path
                                             strokeLinecap='round'
                                             strokeLinejoin='round'
                                             strokeWidth={1.5}
                                             d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                                          />
                                       </svg>
                                       {listing.seller.phone}
                                    </p>
                                 )}
                              </div>
                           </motion.div>
                        )}
                     </AnimatePresence>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ListingDetail;
