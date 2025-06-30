import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllGroups } from "../services/groupService";
import { getGroupsStart, getGroupsSuccess, getGroupsFailure } from "../redux/slices/groupSlice";
import GroupCard from "../components/groups/GroupCard";
import CreateGroupForm from "../components/groups/CreateGroupForm";
import { motion } from "framer-motion";

const Groups = () => {
   const dispatch = useDispatch();
   const { groups, isLoading, error } = useSelector((state) => state.group);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterPrivate, setFilterPrivate] = useState(false);
   let filteredGroups = [];

   useEffect(() => {
      const fetchGroups = async () => {
         try {
            dispatch(getGroupsStart());
            const data = await getAllGroups();
            dispatch(getGroupsSuccess(data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load groups";
            dispatch(getGroupsFailure(message));
         }
      };

      fetchGroups();
   }, [dispatch]);

   // Filter groups based on search term and private filter
   filteredGroups = groups?.data?.filter((group) => group.name.toLowerCase().includes(searchTerm.toLowerCase()) && (!filterPrivate || !group.isPrivate));

   return (
      <div className='bg-whisper-white min-h-screen'>
         {/* Hero Section */}
         <div className='relative bg-gradient-to-r from-maple-red to-maple-red/80 text-white'>
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1582213782179-e0d4d3cce817?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className='text-4xl md:text-5xl font-bold mb-4'>Neighbourhood Circles</h1>
                  <p className='text-xl text-white/90 max-w-2xl mb-8'>
                     Connect with like-minded Canadians in your community. Join existing circles or create your own to bring people together
                     around shared interests and causes.
                  </p>
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setShowCreateForm(true)}
                     className='inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-lg text-base font-medium text-maple-red bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red transition-all duration-200'>
                     <svg
                        className='-ml-1 mr-2 h-5 w-5'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        aria-hidden='true'>
                        <path
                           fillRule='evenodd'
                           d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                           clipRule='evenodd'
                        />
                     </svg>
                     Create New Circle
                  </motion.button>
               </motion.div>
            </div>
         </div>

         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Search and Filter */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.5, delay: 0.2 }}
               className='bg-white rounded-xl shadow-md p-6 mb-8'>
               <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4'>
                  <h2 className='text-xl font-semibold text-charcoal-gray'>Find Your Circle</h2>
                  <div className='flex items-center space-x-2'>
                     <span className='text-sm text-gray-500'>{filteredGroups ? filteredGroups?.length : groups?.data?.length} circles found</span>
                     {(searchTerm || filterPrivate) && (
                        <button
                           onClick={() => {
                              setSearchTerm("");
                              setFilterPrivate(false);
                           }}
                           className='text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                           Clear filters
                        </button>
                     )}
                  </div>
               </div>

               <div className='flex flex-col sm:flex-row gap-4'>
                  <div className='relative flex-1'>
                     <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                        <svg
                           className='h-5 w-5 text-gray-400'
                           xmlns='http://www.w3.org/2000/svg'
                           viewBox='0 0 20 20'
                           fill='currentColor'
                           aria-hidden='true'>
                           <path
                              fillRule='evenodd'
                              d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z'
                              clipRule='evenodd'
                           />
                        </svg>
                     </div>
                     <input
                        type='text'
                        className='focus:ring-maple-red focus:border-maple-red block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-lg shadow-sm'
                        placeholder='Search by name, description, or location...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>
                  <div className='flex items-center bg-gray-50 px-4 py-2 rounded-lg'>
                     <input
                        id='filterPrivate'
                        name='filterPrivate'
                        type='checkbox'
                        checked={filterPrivate}
                        onChange={(e) => setFilterPrivate(e.target.checked)}
                        className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                     />
                     <label htmlFor='filterPrivate' className='ml-2 block text-sm text-gray-700'>
                        Hide private circles
                     </label>
                  </div>
               </div>
            </motion.div>

            {/* Create Group Form Modal */}
            {showCreateForm && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4'>
                  <motion.div
                     initial={{ scale: 0.9, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     transition={{ type: "spring", damping: 20 }}
                     className='max-w-2xl w-full'>
                     <CreateGroupForm onClose={() => setShowCreateForm(false)} />
                  </motion.div>
               </motion.div>
            )}

            {/* Groups List */}
            {isLoading && groups.length === 0 ? (
               <div className='flex justify-center items-center py-20'>
                  <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-maple-red'></div>
               </div>
            ) : error ? (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='bg-red-50 border-l-4 border-red-400 p-4 my-6 rounded-r-lg shadow-sm'>
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
                        <p className='text-sm text-red-700'>{error}</p>
                        <button
                           onClick={() => window.location.reload()}
                           className='mt-2 text-sm text-maple-red hover:text-maple-red-dark font-medium'>
                           Try again
                        </button>
                     </div>
                  </div>
               </motion.div>
            ) : filteredGroups?.length === 0 ? (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center py-10 bg-white rounded-xl shadow-md p-8'>
                  <svg className='mx-auto h-16 w-16 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                     />
                  </svg>
                  <h3 className='mt-4 text-lg font-medium text-charcoal-gray'>
                     {searchTerm || filterPrivate ? "No circles match your search" : "No circles yet"}
                  </h3>
                  <p className='mt-2 text-base text-gray-500 max-w-md mx-auto'>
                     {searchTerm || filterPrivate
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "Get started by creating a new circle to connect with your community."}
                  </p>
                  {searchTerm || filterPrivate ? (
                     <button
                        onClick={() => {
                           setSearchTerm("");
                           setFilterPrivate(false);
                        }}
                        className='mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                        Clear filters
                     </button>
                  ) : (
                     <button
                        onClick={() => setShowCreateForm(true)}
                        className='mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                        Create Your First Circle
                     </button>
                  )}
               </motion.div>
            ) : (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                     {filteredGroups?.map((group, index) => (
                        <motion.div
                           key={group._id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.3, delay: index * 0.1 }}>
                           <GroupCard group={group} />
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            )}
         </div>
      </div>
   );
};

export default Groups;
