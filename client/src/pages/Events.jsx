import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEvents } from "../services/eventService";
import { getEventsStart, getEventsSuccess, getEventsFailure } from "../redux/slices/eventSlice";
import EventCard from "../components/events/EventCard";
import CreateEventForm from "../components/events/CreateEventForm";
import { motion } from "framer-motion";

const Events = () => {
   const dispatch = useDispatch();
   const { events, isLoading, error } = useSelector((state) => state.event);
   const [showCreateForm, setShowCreateForm] = useState(false);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterPrivate, setFilterPrivate] = useState(false);
   const [filterPast, setFilterPast] = useState(true);

   useEffect(() => {
      const fetchEvents = async () => {
         try {
            dispatch(getEventsStart());
            const response = await getEvents();
            dispatch(getEventsSuccess(response.data));
         } catch (error) {
            const message = error.response && error.response.data.error ? error.response.data.error : "Failed to load events";
            dispatch(getEventsFailure(message));
         }
      };

      fetchEvents();
   }, [dispatch]);

   // Filter events based on search term, private filter, and past filter
   const filteredEvents = events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrivate = !filterPrivate || !event.isPrivate;
      const matchesPast = !filterPast || new Date(event.startDate) >= new Date();

      return matchesSearch && matchesPrivate && matchesPast;
   });

   // Sort events by start date (upcoming first)
   const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

   return (
      <div className='bg-whisper-white min-h-screen'>
         {/* Hero Section */}
         <div className='relative bg-gradient-to-r from-maple-red to-maple-red/80 text-white'>
            <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10'>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className='text-4xl md:text-5xl font-bold mb-4'>Local Gatherings</h1>
                  <p className='text-xl text-white/90 max-w-2xl mb-8'>
                     Discover and join events in your community. Connect with fellow Canadians through meaningful local experiences.
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
                     Create New Event
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
                  <h2 className='text-xl font-semibold text-charcoal-gray'>Find Events</h2>
                  <div className='flex items-center space-x-2'>
                     <span className='text-sm text-gray-500'>{sortedEvents.length} events found</span>
                     {(searchTerm || filterPrivate || !filterPast) && (
                        <button
                           onClick={() => {
                              setSearchTerm("");
                              setFilterPrivate(false);
                              setFilterPast(true);
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
                        placeholder='Search by title, description, or location...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                     />
                  </div>

                  <div className='flex flex-wrap items-center gap-4'>
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
                           Hide private events
                        </label>
                     </div>

                     <div className='flex items-center bg-gray-50 px-4 py-2 rounded-lg'>
                        <input
                           id='filterPast'
                           name='filterPast'
                           type='checkbox'
                           checked={filterPast}
                           onChange={(e) => setFilterPast(e.target.checked)}
                           className='h-4 w-4 text-maple-red focus:ring-maple-red border-gray-300 rounded'
                        />
                        <label htmlFor='filterPast' className='ml-2 block text-sm text-gray-700'>
                           Hide past events
                        </label>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Create Event Form Modal */}
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
                     <CreateEventForm onClose={() => setShowCreateForm(false)} />
                  </motion.div>
               </motion.div>
            )}

            {/* Events List */}
            {isLoading && events.length === 0 ? (
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
            ) : sortedEvents.length === 0 ? (
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-center py-10 bg-white rounded-xl shadow-md p-8'>
                  <svg className='mx-auto h-16 w-16 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                     />
                  </svg>
                  <h3 className='mt-4 text-lg font-medium text-charcoal-gray'>
                     {searchTerm || filterPrivate || filterPast ? "No events match your search" : "No events yet"}
                  </h3>
                  <p className='mt-2 text-base text-gray-500 max-w-md mx-auto'>
                     {searchTerm || filterPrivate || filterPast
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "Get started by creating a new event to connect with your community."}
                  </p>
                  {searchTerm || filterPrivate || filterPast ? (
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                           setSearchTerm("");
                           setFilterPrivate(false);
                           setFilterPast(false);
                        }}
                        className='mt-6 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                        Clear filters
                     </motion.button>
                  ) : (
                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateForm(true)}
                        className='mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-maple-red hover:bg-maple-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-maple-red'>
                        Create Your First Event
                     </motion.button>
                  )}
               </motion.div>
            ) : (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                     {sortedEvents.map((event, index) => (
                        <motion.div
                           key={event._id}
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.3, delay: index * 0.1 }}>
                           <EventCard event={event} />
                        </motion.div>
                     ))}
                  </div>
               </motion.div>
            )}
         </div>
      </div>
   );
};

export default Events;
