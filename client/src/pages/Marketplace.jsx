import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getListings } from "../services/marketplaceService";
import { getListingsStart, getListingsSuccess, getListingsFailure } from "../redux/slices/marketplaceSlice";
import ListingCard from "../components/marketplace/ListingCard";
import CreateListingForm from "../components/marketplace/CreateListingForm";
import { motion } from "framer-motion";

const Marketplace = () => {
   const dispatch = useDispatch();
   const { listings, isLoading, error } = useSelector((state) => state.marketplace);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterCategory, setFilterCategory] = useState("");
   const [filterCondition, setFilterCondition] = useState("");
   const [filterSold, setFilterSold] = useState(true);
   const [sortBy, setSortBy] = useState("newest");

   const categories = ["Electronics", "Furniture", "Clothing", "Books", "Sports", "Toys", "Vehicles", "Services", "Other"];

   const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

   useEffect(() => {
      const fetchListings = async () => {
         try {
            dispatch(getListingsStart());
            const response = await getListings();
            dispatch(getListingsSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load listings";
            dispatch(getListingsFailure(message));
         }
      };

      fetchListings();
   }, [dispatch]);

   // Filter listings based on search term, category, condition, and sold filter
   const filteredListings = listings.filter((listing) => {
      const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filterCategory || listing.category === filterCategory;
      const matchesCondition = !filterCondition || listing.condition === filterCondition;
      const matchesSold = !filterSold || listing.status !== "sold";

      return matchesSearch && matchesCategory && matchesCondition && matchesSold;
   });

   // Sort listings
   const sortedListings = [...filteredListings].sort((a, b) => {
      if (sortBy === "newest") {
         return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
         return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "price-low") {
         return a.price - b.price;
      } else if (sortBy === "price-high") {
         return b.price - a.price;
      }
      return 0;
   });

   return (
      <div className="bg-whisper-white min-h-screen">
         {/* Hero Section */}
         <div className="relative bg-gradient-to-r from-maple-red to-maple-red/80 text-white">
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
               >
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Local Exchange</h1>
                  <p className="text-xl text-white/90 max-w-2xl mb-8">
                     Buy, sell, and trade items with your neighbors. Support your local community through sustainable commerce.
                  </p>
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setShowCreateForm(true)}
                     className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-lg text-base font-medium text-maple-red bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-all duration-200"
                  >
                     <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                     >
                        <path
                           fillRule="evenodd"
                           d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                           clipRule="evenodd"
                        />
                     </svg>
                     Create New Listing
                  </motion.button>
               </motion.div>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

         {/* Search and Filter */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
         >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <h2 className="text-xl font-semibold text-charcoal-gray">Find Items</h2>
               <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{sortedListings.length} items found</span>
                  {(searchTerm || filterCategory || filterCondition || filterSold) && (
                     <button
                        onClick={() => {
                           setSearchTerm("");
                           setFilterCategory("");
                           setFilterCondition("");
                           setFilterSold(false);
                        }}
                        className="text-sm text-maple-red hover:text-maple-red-dark font-medium"
                     >
                        Clear filters
                     </button>
                  )}
               </div>
            </div>

            <div className="relative mb-6">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                     className="h-5 w-5 text-gray-400"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 20 20"
                     fill="currentColor"
                     aria-hidden="true"
                  >
                     <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                     />
                  </svg>
               </div>
               <input
                  type="text"
                  className="focus:ring-maple-red focus:border-maple-red block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm"
                  placeholder="Search by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div>
                  <label
                     htmlFor="category"
                     className="block text-sm font-medium text-charcoal-gray mb-1"
                  >
                     Category
                  </label>
                  <select
                     id="category"
                     name="category"
                     value={filterCategory}
                     onChange={(e) => setFilterCategory(e.target.value)}
                     className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-maple-red focus:border-maple-red rounded-lg shadow-sm"
                  >
                     <option value="">All Categories</option>
                     {categories.map((category) => (
                        <option key={category} value={category}>
                           {category}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label
                     htmlFor="condition"
                     className="block text-sm font-medium text-charcoal-gray mb-1"
                  >
                     Condition
                  </label>
                  <select
                     id="condition"
                     name="condition"
                     value={filterCondition}
                     onChange={(e) => setFilterCondition(e.target.value)}
                     className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-maple-red focus:border-maple-red rounded-lg shadow-sm"
                  >
                     <option value="">All Conditions</option>
                     {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                           {condition}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label htmlFor="sort" className="block text-sm font-medium text-charcoal-gray mb-1">
                     Sort By
                  </label>
                  <select
                     id="sort"
                     name="sort"
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="block w-full pl-3 pr-10 py-2.5 text-sm border-gray-300 focus:outline-none focus:ring-maple-red focus:border-maple-red rounded-lg shadow-sm"
                  >
                     <option value="newest">Newest First</option>
                     <option value="oldest">Oldest First</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="price-high">Price: High to Low</option>
                  </select>
               </div>

               <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg h-[42px] self-end">
                  <input
                     id="filterSold"
                     name="filterSold"
                     type="checkbox"
                     checked={filterSold}
                     onChange={(e) => setFilterSold(e.target.checked)}
                     className="h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded"
                  />
                  <label
                     htmlFor="filterSold"
                     className="ml-2 block text-sm text-gray-700"
                  >
                     Hide sold items
                  </label>
               </div>
            </div>
         </motion.div>

         {/* Create Listing Form Modal */}
         {showCreateForm && (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
            >
               <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 20 }}
                  className="max-w-2xl w-full"
               >
                  <CreateListingForm onClose={() => setShowCreateForm(false)} />
               </motion.div>
            </motion.div>
         )}

         {/* Listings */}
         {isLoading && listings.length === 0 ? (
            <div className="flex justify-center items-center py-20">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red"></div>
            </div>
         ) : error ? (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded-r-lg shadow-sm"
            >
               <div className="flex">
                  <div className="flex-shrink-0">
                     <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path
                           fillRule="evenodd"
                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                           clipRule="evenodd"
                        />
                     </svg>
                  </div>
                  <div className="ml-3">
                     <p className="text-sm text-red-700">{error}</p>
                     <button
                        onClick={() => window.location.reload()}
                        className="mt-2 text-sm text-maple-red hover:text-maple-red-dark font-medium"
                     >
                        Try again
                     </button>
                  </div>
               </div>
            </motion.div>
         ) : sortedListings.length === 0 ? (
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-center py-10 bg-white rounded-xl shadow-md p-8"
            >
               <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={1.5}
                     d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
               </svg>
               <h3 className="mt-4 text-lg font-medium text-charcoal-gray">
                  {searchTerm || filterCategory || filterCondition || filterSold ? "No listings match your search" : "No listings yet"}
               </h3>
               <p className="mt-2 text-base text-gray-500 max-w-md mx-auto">
                  {searchTerm || filterCategory || filterCondition || filterSold
                     ? "Try adjusting your search or filters to find what you're looking for."
                     : "Get started by creating a new listing to exchange with your community."}
               </p>
               {(searchTerm || filterCategory || filterCondition || filterSold) ? (
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => {
                        setSearchTerm("");
                        setFilterCategory("");
                        setFilterCondition("");
                        setFilterSold(false);
                     }}
                     className="mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red"
                  >
                     Clear filters
                  </motion.button>
               ) : (
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setShowCreateForm(true)}
                     className="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red"
                  >
                     Create Your First Listing
                  </motion.button>
               )}
            </motion.div>
         ) : (
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.5 }}
            >
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedListings.map((listing, index) => (
                     <motion.div
                        key={listing._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                     >
                        <ListingCard listing={listing} />
                     </motion.div>
                  ))}
               </div>
            </motion.div>
         )}
      </div>
      </div>
   );
};

export default Marketplace;
