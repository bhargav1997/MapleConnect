import { motion } from "framer-motion";

const EventSearch = ({
   searchTerm,
   onSearchChange,
   selectedLocation,
   onLocationChange,
   selectedRadius,
   onRadiusChange,
   showEventbrite,
   onEventbriteToggle,
   filterPrivate,
   onPrivateToggle,
   filterPast,
   onPastToggle,
}) => {
   return (
      <div className='bg-white rounded-lg shadow p-6 mb-6'>
         <div className='flex flex-col md:flex-row gap-4 mb-4'>
            <div className='flex-1'>
               <input
                  type='text'
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder='Search events...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'
               />
            </div>
            {showEventbrite && (
               <>
                  <div className='w-full md:w-48'>
                     <input
                        type='text'
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        placeholder='Enter location'
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'
                     />
                  </div>
                  <div className='w-full md:w-36'>
                     <select
                        value={selectedRadius}
                        onChange={(e) => onRadiusChange(Number(e.target.value))}
                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-maple-red focus:border-maple-red'>
                        <option value={5}>5 km</option>
                        <option value={10}>10 km</option>
                        <option value={25}>25 km</option>
                        <option value={50}>50 km</option>
                     </select>
                  </div>
               </>
            )}
         </div>
         <div className='flex justify-between items-center'>
            <div className='flex flex-wrap items-center gap-4'>
               <label className='flex items-center space-x-2'>
                  <input
                     type='checkbox'
                     checked={showEventbrite}
                     onChange={(e) => onEventbriteToggle(e.target.checked)}
                     className='form-checkbox h-4 w-4 text-maple-red'
                  />
                  <span className='text-sm text-gray-700'>Include Eventbrite events</span>
               </label>
               <label className='flex items-center space-x-2'>
                  <input
                     type='checkbox'
                     checked={filterPrivate}
                     onChange={(e) => onPrivateToggle(e.target.checked)}
                     className='form-checkbox h-4 w-4 text-maple-red'
                  />
                  <span className='text-sm text-gray-700'>Hide private events</span>
               </label>
               <label className='flex items-center space-x-2'>
                  <input
                     type='checkbox'
                     checked={filterPast}
                     onChange={(e) => onPastToggle(e.target.checked)}
                     className='form-checkbox h-4 w-4 text-maple-red'
                  />
                  <span className='text-sm text-gray-700'>Hide past events</span>
               </label>
            </div>
         </div>
      </div>
   );
};

export default EventSearch;
