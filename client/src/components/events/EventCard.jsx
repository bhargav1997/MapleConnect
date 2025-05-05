import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
   const { user } = useAuth();

   // Check if user is attending
   const userAttendance = event.attendees.find((attendee) => attendee.user._id === user?.id || attendee.user === user?.id);

   const isAttending = userAttendance && userAttendance.status === "going";
   const isInterested = userAttendance && userAttendance.status === "interested";

   // Format dates
   const formatDate = (dateString) => {
      const options = {
         weekday: "short",
         month: "short",
         day: "numeric",
         hour: "numeric",
         minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   // Check if event is past
   const isPastEvent = new Date(event.endDate) < new Date();

   // Default event images if none provided
   const defaultEventImages = [
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1540317580384-e5d43867caa6?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop",
   ];

   // Use event ID to consistently select the same default image for an event
   const defaultEventImage = defaultEventImages[parseInt(event._id.slice(-2), 16) % defaultEventImages.length];

   return (
      <motion.div
         whileHover={{ y: -5 }}
         className={`bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 ${
            isPastEvent ? "opacity-75" : ""
         }`}>
         <div className='h-40 bg-gray-200 relative overflow-hidden'>
            <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 1.5 }} className='w-full h-full'>
               <img
                  src={event.image ? `http://localhost:5000/uploads/${event.image}` : defaultEventImage}
                  alt={event.title}
                  className='w-full h-full object-cover'
               />
               <div className='absolute inset-0 bg-gradient-to-t from-black/40 to-transparent'></div>
            </motion.div>

            {/* Status badges */}
            <div className='absolute top-3 right-3 flex flex-col gap-2'>
               {event.isPrivate && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm'>
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                     </svg>
                     Private
                  </span>
               )}

               {isPastEvent && (
                  <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-black/30 text-white backdrop-blur-sm'>
                     <svg className='h-3 w-3 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={2}
                           d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                     </svg>
                     Past
                  </span>
               )}
            </div>

            {/* Date badge */}
            <div className='absolute bottom-3 left-3'>
               <div className='bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-semibold text-maple-red shadow-sm'>
                  {formatDate(event.startDate)}
               </div>
            </div>
         </div>

         <div className='p-5'>
            <h3 className='text-xl font-bold text-charcoal-gray mb-2 line-clamp-1'>{event.title}</h3>

            <div className='flex items-center mb-3 text-sm text-gray-600'>
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
               <span className='line-clamp-1'>{event.location}</span>
            </div>

            {event.group && (
               <div className='flex items-center mb-4'>
                  <div className='flex-shrink-0 h-6 w-6 rounded-full overflow-hidden bg-gray-200 mr-2 border border-gray-100'>
                     <img
                        src={event.group.image ? `http://localhost:5000/uploads/${event.group.image}` : "https://via.placeholder.com/150"}
                        alt={event.group.name}
                        className='h-full w-full object-cover'
                     />
                  </div>
                  <Link
                     to={`/groups/${event.group._id}`}
                     className='text-sm font-medium text-gray-700 hover:text-maple-red transition-colors'>
                     {event.group.name}
                  </Link>
               </div>
            )}

            <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
               <div className='flex items-center'>
                  <div className='flex -space-x-2 mr-2'>
                     {event.attendees
                        .filter((attendee) => attendee.status === "going")
                        .slice(0, 3)
                        .map((attendee) => (
                           <div
                              key={attendee.user._id || attendee.user}
                              className='h-6 w-6 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                              <img
                                 src={
                                    attendee.user.profileImage
                                       ? `http://localhost:5000/uploads/${attendee.user.profileImage}`
                                       : "https://via.placeholder.com/150"
                                 }
                                 alt='Attendee'
                                 className='h-full w-full object-cover'
                              />
                           </div>
                        ))}
                  </div>
                  <span className='text-xs text-gray-500'>
                     {event.attendees.filter((attendee) => attendee.status === "going").length} going
                  </span>
               </div>

               <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                     to={`/events/${event._id}`}
                     className={`inline-flex items-center px-3 py-1.5 border text-xs font-medium rounded-md shadow-sm transition-colors ${
                        isAttending
                           ? "bg-green-100 text-green-800 border-green-200"
                           : isInterested
                           ? "bg-blue-100 text-blue-800 border-blue-200"
                           : "text-white bg-maple-red hover:bg-maple-red-dark border-transparent"
                     }`}>
                     {isAttending ? "Going" : isInterested ? "Interested" : "View Event"}

                     {!isAttending && !isInterested && (
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

export default EventCard;
