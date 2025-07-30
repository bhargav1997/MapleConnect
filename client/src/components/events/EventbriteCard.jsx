import { motion } from "framer-motion";

const EventbriteCard = ({ event }) => {
   return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white rounded-lg shadow-md overflow-hidden'>
         {event.imageUrl && <img src={event.imageUrl} alt={event.title} className='w-full h-48 object-cover' />}
         <div className='p-6'>
            <h3 className='text-xl font-semibold text-charcoal-gray mb-2'>{event.title}</h3>
            <div className='space-y-2 mb-4'>
               <p className='text-gray-600 line-clamp-2'>{event.description}</p>
               <div className='flex items-center text-gray-500 text-sm'>
                  <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                     />
                  </svg>
                  {new Date(event.startDate).toLocaleDateString()}
               </div>
               {event.venue && (
                  <div className='flex items-center text-gray-500 text-sm'>
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                           strokeLinecap='round'
                           strokeLinejoin='round'
                           strokeWidth={1.5}
                           d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                        />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                     </svg>
                     {event.venue.name}
                  </div>
               )}
            </div>
            <a
               href={event.url}
               target='_blank'
               rel='noopener noreferrer'
               className='inline-block w-full px-6 py-2 bg-maple-red text-white text-center rounded-md font-medium hover:bg-maple-red-dark transition-colors duration-200'>
               View Details
            </a>
         </div>
      </motion.div>
   );
};

export default EventbriteCard;
