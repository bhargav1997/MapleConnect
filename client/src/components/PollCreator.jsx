import React, { useState } from "react";
import { motion } from "framer-motion";

const PollCreator = ({ onPollCreate, onCancel }) => {
   const [question, setQuestion] = useState("");
   const [options, setOptions] = useState(["", ""]);
   const [expiration, setExpiration] = useState("1d");
   const [error, setError] = useState("");

   const handleAddOption = () => {
      if (options.length < 6) {
         setOptions([...options, ""]);
      }
   };

   const handleRemoveOption = (index) => {
      if (options.length > 2) {
         const newOptions = options.filter((_, i) => i !== index);
         setOptions(newOptions);
      }
   };

   const handleOptionChange = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!question.trim()) {
         setError("Please enter a question");
         return;
      }
      if (options.some((opt) => !opt.trim())) {
         setError("Please fill in all options");
         return;
      }
      onPollCreate({
         question: question.trim(),
         options: options.map((opt) => opt.trim()),
         expiration,
      });
   };

   return (
      <form onSubmit={handleSubmit} className='space-y-4'>
         <div>
            <label htmlFor='question' className='block text-sm font-medium text-gray-700 mb-1'>
               Question
            </label>
            <input
               type='text'
               id='question'
               value={question}
               onChange={(e) => setQuestion(e.target.value)}
               placeholder='Ask something...'
               className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-red focus:border-maple-red outline-none transition-colors'
            />
         </div>

         <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Options</label>
            <div className='space-y-2'>
               {options.map((option, index) => (
                  <div key={index} className='flex items-center gap-2'>
                     <input
                        type='text'
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-red focus:border-maple-red outline-none transition-colors'
                     />
                     {options.length > 2 && (
                        <button
                           type='button'
                           onClick={() => handleRemoveOption(index)}
                           className='p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100'>
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
            {options.length < 6 && (
               <button
                  type='button'
                  onClick={handleAddOption}
                  className='mt-2 flex items-center text-sm text-maple-red hover:text-maple-red/80'>
                  <svg className='w-5 h-5 mr-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                     <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
                  </svg>
                  Add Option
               </button>
            )}
         </div>

         <div>
            <label htmlFor='expiration' className='block text-sm font-medium text-gray-700 mb-1'>
               Poll Duration
            </label>
            <select
               id='expiration'
               value={expiration}
               onChange={(e) => setExpiration(e.target.value)}
               className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maple-red focus:border-maple-red outline-none transition-colors'>
               <option value='1d'>1 Day</option>
               <option value='3d'>3 Days</option>
               <option value='7d'>1 Week</option>
               <option value='14d'>2 Weeks</option>
               <option value='30d'>1 Month</option>
            </select>
         </div>

         {error && <p className='text-sm text-red-500'>{error}</p>}

         <div className='flex justify-end gap-3 pt-2'>
            <button
               type='button'
               onClick={onCancel}
               className='px-4 py-2 text-gray-600 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200'>
               Cancel
            </button>
            <button type='submit' className='px-4 py-2 bg-maple-red text-white rounded-lg text-sm font-medium hover:bg-maple-red-dark'>
               Create Poll
            </button>
         </div>
      </form>
   );
};

export default PollCreator;
