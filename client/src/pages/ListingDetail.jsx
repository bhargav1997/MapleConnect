import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { getListingById, updateStatus, deleteListing } from "../services/marketplaceService";
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
import { motion } from "framer-motion";

const ListingDetail = () => {
   const { id } = useParams();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { user } = useAuth();
   const { listing, isLoading, error } = useSelector((state) => state.marketplace);

   const [activeImage, setActiveImage] = useState(0);
   const [showContactInfo, setShowContactInfo] = useState(false);
   const [confirmDelete, setConfirmDelete] = useState(false);
   const [showEditForm, setShowEditForm] = useState(false);

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
                  <div className='relative h-64 md:h-full'>
                     <img
                        src={listing.images[activeImage] || "https://via.placeholder.com/400x300?text=No+Image"}
                        alt={listing.title}
                        className='w-full h-full object-cover'
                     />
                     {listing.images.length > 1 && (
                        <div className='absolute bottom-4 left-0 right-0 flex justify-center space-x-2'>
                           {listing.images.map((_, idx) => (
                              <button
                                 key={idx}
                                 onClick={() => setActiveImage(idx)}
                                 aria-label={`View image ${idx + 1}`}
                                 className={`w-2 h-2 rounded-full ${idx === activeImage ? "bg-white" : "bg-white/50"}`}
                              />
                           ))}
                        </div>
                     )}
                  </div>
               </div>

               {/* Listing Details */}
               <div className='md:w-1/2 p-6'>
                  <div className='flex justify-between items-start'>
                     <h1 className='text-2xl font-bold text-gray-900 mb-2'>{listing.title}</h1>
                     <span className='text-2xl font-bold text-indigo-600'>{formatPrice(listing.price)}</span>
                  </div>

                  <div className='flex items-center mb-4'>
                     <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                     <span className='mx-2 text-gray-300'>•</span>
                     <span className='text-sm text-gray-500'>{listing.category}</span>
                     <span className='mx-2 text-gray-300'>•</span>
                     <span className='text-sm text-gray-500'>Listed {formatDate(listing.createdAt)}</span>
                  </div>

                  <div className='prose max-w-none mb-6'>
                     <p className='text-gray-600'>{listing.description}</p>
                  </div>

                  <div className='space-y-4'>
                     <div>
                        <h3 className='text-sm font-medium text-gray-900'>Location</h3>
                        <p className='mt-1 text-sm text-gray-500'>{listing.location}</p>
                     </div>

                     {listing.isDeliveryAvailable && (
                        <div>
                           <h3 className='text-sm font-medium text-gray-900'>Delivery</h3>
                           <p className='mt-1 text-sm text-gray-500'>Delivery available</p>
                        </div>
                     )}

                     <div>
                        <h3 className='text-sm font-medium text-gray-900'>Seller</h3>
                        <div className='mt-1 flex items-center'>
                           <img
                              src={listing.seller.profileImage || "https://via.placeholder.com/40"}
                              alt={listing.seller.name}
                              className='w-10 h-10 rounded-full'
                           />
                           <div className='ml-3'>
                              <p className='text-sm font-medium text-gray-900'>{listing.seller.name}</p>
                              <p className='text-sm text-gray-500'>Member since {formatDate(listing.seller.createdAt)}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {isOwner ? (
                     <div className='space-y-3 mt-6'>
                        <div className='flex items-center'>
                           <span className='mr-3 text-sm font-medium text-gray-700'>Status:</span>
                           <select
                              value={listing.status}
                              onChange={(e) => handleStatusChange(e.target.value)}
                              className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'>
                              <option value='available'>Available</option>
                              <option value='pending'>Pending</option>
                              <option value='sold'>Sold</option>
                           </select>
                        </div>

                        <div className='flex space-x-3'>
                           <button
                              onClick={() => setShowEditForm(true)}
                              className='flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
                              Edit Listing
                           </button>

                           <div className='relative flex-1'>
                              <button
                                 onClick={() => setConfirmDelete(!confirmDelete)}
                                 className='w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50'>
                                 Delete Listing
                              </button>

                              {confirmDelete && (
                                 <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10'>
                                    <div className='py-1'>
                                       <p className='px-4 py-2 text-sm text-gray-700'>Are you sure?</p>
                                       <button
                                          onClick={handleDeleteListing}
                                          className='block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100'>
                                          Yes, delete
                                       </button>
                                       <button
                                          onClick={() => setConfirmDelete(false)}
                                          className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
                                          Cancel
                                       </button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className='mt-6'>
                        <button
                           onClick={() => setShowContactInfo(!showContactInfo)}
                           className='w-full inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                           {showContactInfo ? "Hide Contact Info" : "Show Contact Info"}
                        </button>

                        {showContactInfo && (
                           <div className='mt-4 p-4 bg-gray-50 rounded-md'>
                              <h3 className='text-sm font-medium text-gray-900'>Contact Information</h3>
                              <div className='mt-2 space-y-2'>
                                 <p className='text-sm text-gray-500'>
                                    <span className='font-medium'>Name:</span> {listing.seller.name}
                                 </p>
                                 <p className='text-sm text-gray-500'>
                                    <span className='font-medium'>Email:</span> {listing.seller.email}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ListingDetail;
