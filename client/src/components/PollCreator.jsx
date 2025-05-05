import { motion } from "framer-motion";

const PollCreator = ({
   pollQuestion,
   setPollQuestion,
   pollOptions,
   handlePollOptionChange,
   addPollOption,
   removePollOption,
   pollExpiration,
   setPollExpiration,
   onClose,
}) => {
   const expirationOptions = [
      { value: "1d", label: "1 day" },
      { value: "3d", label: "3 days" },
      { value: "1w", label: "1 week" },
      { value: "2w", label: "2 weeks" },
   ];

   return (
      <motion.div
         initial={{ opacity: 0, y: -10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: -10 }}
         className='p-3 bg-white rounded-xl shadow-md border border-gray-200 w-full'>
         <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center'>
               <div className='w-8 h-8 rounded-full bg-maple-red/15 flex items-center justify-center mr-2'>
                  <svg className='w-5 h-5 text-maple-red' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                     />
                  </svg>
               </div>
               <h3 className='text-base font-medium text-gray-800'>Create a Poll</h3>
            </div>
            <button type='button' onClick={onClose} className='text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100'>
               <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
               </svg>
            </button>
         </div>

         <div className='space-y-3'>
            <div>
               <label htmlFor='poll-question' className='block text-sm font-medium text-gray-700 mb-1'>
                  Question
               </label>
               <input
                  id='poll-question'
                  type='text'
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder='Ask a question...'
                  className='w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent text-sm'
               />
            </div>

            <div>
               <label className='block text-sm font-medium text-gray-700 mb-1'>Options</label>
               <div className='space-y-1.5'>
                  {pollOptions.map((option, index) => (
                     <div key={index} className='flex items-center'>
                        <input
                           type='text'
                           value={option}
                           onChange={(e) => handlePollOptionChange(index, e.target.value)}
                           placeholder={`Option ${index + 1}`}
                           className='flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent text-sm'
                        />
                        {pollOptions.length > 2 && (
                           <button type='button' onClick={() => removePollOption(index)} className='ml-2 text-gray-400 hover:text-gray-600'>
                              <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                 <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                                 />
                              </svg>
                           </button>
                        )}
                     </div>
                  ))}
               </div>

               {pollOptions.length < 4 && (
                  <motion.button
                     type='button'
                     onClick={addPollOption}
                     className='mt-2 text-maple-red hover:text-maple-red-dark text-sm font-medium flex items-center'
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}>
                     <svg className='w-4 h-4 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                     </svg>
                     Add Option
                  </motion.button>
               )}
            </div>

            <div>
               <label htmlFor='poll-expiration' className='block text-sm font-medium text-gray-700 mb-1'>
                  Poll Duration
               </label>
               <select
                  id='poll-expiration'
                  value={pollExpiration}
                  onChange={(e) => setPollExpiration(e.target.value)}
                  className='w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maple-red focus:border-transparent text-sm'>
                  <option value=''>Select duration</option>
                  {expirationOptions.map((option) => (
                     <option key={option.value} value={option.value}>
                        {option.label}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         <div className='flex justify-end mt-3'>
            <motion.button
               type='button'
               onClick={onClose}
               className='px-3 py-1.5 bg-maple-red text-white rounded-lg text-sm font-medium'
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}>
               Done
            </motion.button>
         </div>
      </motion.div>
   );
};

export default PollCreator;
