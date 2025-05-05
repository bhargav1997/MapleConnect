import { motion } from 'framer-motion';
import React from 'react';

const CanadianLandscape = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-100 to-blue-300 opacity-10"></div>
      
      {/* Mountains */}
      <div className="absolute bottom-0 left-0 right-0 h-2/3 overflow-hidden">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/2 bg-gray-700 opacity-5"
          style={{
            clipPath: 'polygon(0% 100%, 15% 65%, 25% 85%, 35% 50%, 45% 70%, 55% 40%, 65% 60%, 75% 30%, 85% 55%, 100% 20%, 100% 100%)',
          }}
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-800 opacity-5"
          style={{
            clipPath: 'polygon(0% 100%, 10% 70%, 20% 90%, 30% 60%, 40% 80%, 50% 50%, 60% 70%, 70% 40%, 80% 60%, 90% 30%, 100% 60%, 100% 100%)',
          }}
          initial={{ y: 10 }}
          animate={{ y: -5 }}
          transition={{ duration: 25, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 2 }}
        />
      </div>
      
      {/* Forest */}
      <div className="absolute bottom-0 left-0 right-0 h-1/4">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`tree-${i}`}
            className="absolute bottom-0 w-8 opacity-5"
            style={{
              left: `${i * 5 + Math.random() * 5}%`,
              height: `${Math.random() * 10 + 10}%`,
            }}
            initial={{ y: 0 }}
            animate={{ y: [-2, 2, -2] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: 'easeInOut',
              delay: i * 0.1
            }}
          >
            <div 
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-gray-900"
              style={{ height: '40%' }}
            />
            <div 
              className="absolute bottom-[40%] left-0 right-0 bg-green-900"
              style={{ 
                height: '60%',
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              }}
            />
          </motion.div>
        ))}
      </div>
      
      {/* Lake */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-[10%] bg-blue-500 opacity-5"
        initial={{ y: 0 }}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      {/* Clouds */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`cloud-${i}`}
          className="absolute rounded-full bg-white opacity-5"
          style={{
            top: `${10 + i * 10}%`,
            left: `-20%`,
            width: `${Math.random() * 100 + 100}px`,
            height: `${Math.random() * 30 + 30}px`,
          }}
          initial={{ x: '-20%' }}
          animate={{ x: '120%' }}
          transition={{ 
            duration: Math.random() * 60 + 60,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 5
          }}
        />
      ))}
      
      {/* Maple leaves falling */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={`falling-leaf-${i}`}
          className="absolute w-6 h-6 text-maple-red opacity-5"
          style={{
            top: `-5%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ y: '-5%', rotate: 0, x: 0 }}
          animate={{ 
            y: '105%', 
            rotate: 360,
            x: [0, 20, -20, 10, -10, 0]
          }}
          transition={{ 
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 2
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2C11.8,2 11.6,2.1 11.4,2.3L9.6,4.1L11.5,6L9.9,7.6L8,5.7L6.1,7.6L8,9.5L6.4,11.1L4.6,9.3C4.2,8.9 3.5,8.9 3.1,9.3C2.7,9.7 2.7,10.4 3.1,10.8L4.9,12.6L3.5,14L4.9,15.4L6.3,14L8.1,15.8C8.5,16.2 9.2,16.2 9.6,15.8C10,15.4 10,14.7 9.6,14.3L7.8,12.5L9.4,10.9L11.3,12.8L13.1,10.9L11.2,9L12.8,7.4L14.6,9.2C15,9.6 15.7,9.6 16.1,9.2C16.5,8.8 16.5,8.1 16.1,7.7L14.3,5.9L15.7,4.5L14.3,3.1L12.9,4.5L11.1,2.7C10.9,2.1 10.5,2 12,2M18.5,14C17.7,14 17,14.7 17,15.5C17,16.3 17.7,17 18.5,17C19.3,17 20,16.3 20,15.5C20,14.7 19.3,14 18.5,14M18.5,19C17.7,19 17,19.7 17,20.5C17,21.3 17.7,22 18.5,22C19.3,22 20,21.3 20,20.5C20,19.7 19.3,19 18.5,19M13,19C12.2,19 11.5,19.7 11.5,20.5C11.5,21.3 12.2,22 13,22C13.8,22 14.5,21.3 14.5,20.5C14.5,19.7 13.8,19 13,19M13,14C12.2,14 11.5,14.7 11.5,15.5C11.5,16.3 12.2,17 13,17C13.8,17 14.5,16.3 14.5,15.5C14.5,14.7 13.8,14 13,14Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default CanadianLandscape;
