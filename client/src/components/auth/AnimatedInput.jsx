import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AnimatedInput = ({ id, name, type = "text", value, onChange, label, required = false, autoComplete, error, icon }) => {
   const [isFocused, setIsFocused] = useState(false);
   const [hasValue, setHasValue] = useState(false);
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

   useEffect(() => {
      setHasValue(value !== "");
   }, [value]);

   const handleTogglePassword = () => {
      setIsPasswordVisible(!isPasswordVisible);
   };

   // Set default autocomplete value based on input type and name
   const getAutoComplete = () => {
      if (autoComplete) return autoComplete;

      if (type === "password") {
         if (name === "confirmPassword") return "new-password";
         if (name === "newPassword") return "new-password";
         return "current-password";
      }

      switch (name) {
         case "email":
            return "email";
         case "username":
            return "username";
         case "name":
            return "name";
         default:
            return "off";
      }
   };

   const handleAddImage = (url) => {
      // Implementation of handleAddImage
   };

   return (
      <div className='relative mb-4'>
         <div
            className={`
              relative border rounded-lg transition-all duration-300 ease-in-out
              ${isFocused ? "border-maple-red shadow-sm" : "border-gray-300"}
              ${error ? "border-red-500" : ""}
              group
            `}>
            {icon && <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10'>{icon}</div>}

            <input
               id={id}
               name={name}
               type={type === "password" ? (isPasswordVisible ? "text" : "password") : type}
               value={value}
               onChange={onChange}
               required={required}
               autoComplete={getAutoComplete()}
               className={`
                block w-full ${icon ? "pl-10" : "pl-4"} pr-${type === "password" ? "10" : "4"} pt-6 pb-2
                rounded-lg text-gray-900 bg-transparent
                appearance-none focus:outline-none transition-all duration-300
              `}
               placeholder=' '
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
            />

            {type === "password" && (
               <button
                  type='button'
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
                  onClick={handleTogglePassword}
                  tabIndex={-1}>
                  {isPasswordVisible ? (
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                        <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                        <path
                           fillRule='evenodd'
                           d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                           clipRule='evenodd'
                        />
                     </svg>
                  ) : (
                     <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
                        <path
                           fillRule='evenodd'
                           d='M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z'
                           clipRule='evenodd'
                        />
                        <path d='M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z' />
                     </svg>
                  )}
               </button>
            )}

            <label
               htmlFor={id}
               className={`
                absolute ${icon ? "left-10" : "left-4"} top-0 px-0 py-3 text-gray-500
                pointer-events-none transform origin-left transition-all duration-300 ease-in-out
                ${isFocused || hasValue ? "text-xs translate-y-1" : "text-base translate-y-2"}
                ${isFocused ? "text-maple-red" : ""}
                ${error ? "text-red-500" : ""}
              `}>
               {label}
            </label>

            {isFocused && (
               <motion.div
                  className='absolute bottom-0 left-0 h-0.5 bg-maple-red'
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  exit={{ width: 0 }}
                  transition={{ duration: 0.3 }}
               />
            )}
         </div>

         {error && (
            <motion.p
               className='mt-1 text-sm text-red-500 flex items-center'
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: "auto" }}
               transition={{ duration: 0.2 }}>
               <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4 mr-1' viewBox='0 0 20 20' fill='currentColor'>
                  <path
                     fillRule='evenodd'
                     d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                     clipRule='evenodd'
                  />
               </svg>
               {error}
            </motion.p>
         )}
      </div>
   );
};

export default AnimatedInput;
