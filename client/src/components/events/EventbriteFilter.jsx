import { useState } from "react";
import { motion } from "framer-motion";

const EventbriteFilter = ({ onSearch }) => {
   const [location, setLocation] = useState("");
   const [radius, setRadius] = useState(10);
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      await onSearch({ location, radius });
      setIsLoading(false);
   };

   return (
      <div className='bg-white rounded-lg shadow p-6 mb-6'>
         <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex flex-col md:flex-row gap-4'>
               <div className='flex-1'>
                  <label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-1'>
                     Location
                  </label>
                  <input
                     type='text'
                     id='location'
                     value={location}
                     onChange={(e) => setLocation(e.target.value)}
                     placeholder='Enter city or postal code'
                     className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'
                  />
               </div>
               <div className='w-full md:w-48'>
                  <label htmlFor='radius' className='block text-sm font-medium text-gray-700 mb-1'>
                     Search Radius (km)
                  </label>
                  <select
                     id='radius'
                     value={radius}
                     onChange={(e) => setRadius(Number(e.target.value))}
                     className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'>
                     <option value={5}>5 km</option>
                     <option value={10}>10 km</option>
                     <option value={25}>25 km</option>
                     <option value={50}>50 km</option>
                  </select>
               </div>
            </div>
            <motion.button
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               type='submit'
               disabled={isLoading || !location}
               className={`w-full md:w-auto px-6 py-2 bg-maple-red text-white rounded-md font-medium
            ${isLoading || !location ? "opacity-50 cursor-not-allowed" : "hover:bg-maple-red-dark"}
            transition-all duration-200 flex items-center justify-center`}>
               {isLoading ? (
                  <>
                     <svg
                        className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path
                           className='opacity-75'
                           fill='currentColor'
                           d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                     </svg>
                     Searching...
                  </>
               ) : (
                  "Search Events"
               )}
            </motion.button>
         </form>
      </div>
   );
};

export default EventbriteFilter;
