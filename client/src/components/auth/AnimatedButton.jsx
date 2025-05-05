import React from 'react';

const AnimatedButton = ({ 
  type = 'button', 
  onClick, 
  disabled = false, 
  isLoading = false, 
  loadingText = 'Loading...', 
  children,
  className = '',
  variant = 'primary'
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg text-base font-medium transition-all duration-300 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (disabled || isLoading) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed text-white ${className}`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-maple-red hover:bg-red-700 text-white focus:ring-maple-red ${className}`;
      case 'secondary':
        return `${baseClasses} bg-white border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-maple-red ${className}`;
      case 'outline':
        return `${baseClasses} bg-transparent border-maple-red text-maple-red hover:bg-maple-red/5 focus:ring-maple-red ${className}`;
      default:
        return `${baseClasses} bg-maple-red hover:bg-red-700 text-white focus:ring-maple-red ${className}`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={getButtonClasses()}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default AnimatedButton;
