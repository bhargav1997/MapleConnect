import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const ListingCard = ({ listing }) => {
   const { user } = useAuth();
   const isOwner = listing.seller._id === user?.id || listing.seller === user?.id;

   // Format price
   const formatPrice = (price) => {
      return new Intl.NumberFormat("en-CA", {
         style: "currency",
         currency: "CAD",
      }).format(price);
   };

   // Format date
   const formatDate = (dateString) => {
      const options = { month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   // Default listing images if none provided
   const defaultListingImages = [
      "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556740772-1a741367b93e?q=80&w=2070&auto=format&fit=crop",
   ];

   // Use listing ID to consistently select the same default image for a listing
   const defaultListingImage = defaultListingImages[parseInt(listing._id.slice(-2), 16) % defaultListingImages.length];

   return (
      <motion.div
         whileHover={{ y: -5 }}
         className='bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300'>
         <div className='h-48 bg-gray-200 relative overflow-hidden'>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 1.5 }} className='w-full h-full'>
               {listing.images && listing.images.length > 0 ? (
                  <img
                     src={`http://localhost:5000/uploads/${listing.images[0]}`}
                     alt={listing.title}
                     className='w-full h-full object-cover'
                  />
               ) : (
                  <img src={defaultListingImage} alt={listing.title} className='w-full h-full object-cover' />
               )}
               <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
            </motion.div>

            {listing.status !== "available" && (
               <div className='absolute top-3 right-3'>
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm'>
                     <span
                        className={`w-1.5 h-1.5 ${
                           listing.status === "pending" ? "bg-yellow-500" : "bg-gray-500"
                        } rounded-full mr-1`}></span>
                     {listing.status === "pending" ? "Pending" : "Sold"}
                  </span>
               </div>
            )}

            <div className='absolute bottom-3 left-3'>
               <div className='bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5 text-lg font-bold text-maple-red shadow-sm'>
                  {formatPrice(listing.price)}
               </div>
            </div>
         </div>

         <div className='p-5'>
            <h3 className='text-xl font-bold text-charcoal-gray mb-2 line-clamp-1'>{listing.title}</h3>

            <div className='flex flex-wrap gap-1.5 mb-3'>
               <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
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
               <span className='inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800'>
                  {listing.category}
               </span>
            </div>

            <div className='flex items-center mb-4 text-sm text-gray-600'>
               <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-maple-red/70 mr-1.5 flex-shrink-0'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                     strokeLinecap='round'
                     strokeLinejoin='round'
                     strokeWidth={1.5}
                     d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                  />
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
               </svg>
               <span className='line-clamp-1'>{listing.location}</span>
               <span className='mx-2 text-gray-300'>•</span>
               <span className='text-sm text-gray-500'>Listed {formatDate(listing.createdAt)}</span>
            </div>

            <div className='flex justify-between items-center pt-3 border-t border-gray-100'>
               <div className='flex items-center'>
                  <div className='h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2 border border-gray-100'>
                     <img
                        src={
                           listing.seller.profileImage
                              ? `http://localhost:5000/uploads/${listing.seller.profileImage}`
                              : "https://via.placeholder.com/150"
                        }
                        alt={listing.seller.name}
                        className='h-full w-full object-cover'
                     />
                  </div>
                  <Link
                     to={`/profile/${listing.seller._id}`}
                     className='text-sm font-medium text-gray-700 hover:text-maple-red transition-colors'>
                     {listing.seller.name}
                  </Link>
               </div>

               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                     to={`/marketplace/${listing._id}`}
                     className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark shadow-sm transition-colors'>
                     {isOwner ? "Manage" : "View Details"}
                     {!isOwner && (
                        <svg className='ml-1 h-3.5 w-3.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                           <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14 5l7 7m0 0l-7 7m7-7H3' />
                        </svg>
                     )}
                  </Link>
               </motion.div>
            </div>
         </div>
      </motion.div>
   );
};

export default ListingCard;
