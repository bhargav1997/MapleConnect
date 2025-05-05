import { motion } from 'framer-motion';
import mapleLeaf from '../../assets/maple-leaf.svg';

const AnimatedBackground = () => {
  // Create an array of maple leaves with random positions and animation properties
  const leaves = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100, // Random horizontal position (0-100%)
    y: Math.random() * 100, // Random vertical position (0-100%)
    size: Math.random() * 30 + 20, // Random size (20-50px)
    duration: Math.random() * 20 + 15, // Random animation duration (15-35s)
    delay: Math.random() * 5, // Random delay (0-5s)
    rotate: Math.random() * 360, // Random initial rotation
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute opacity-[0.03]"
          style={{
            left: `${leaf.x}%`,
            top: `${leaf.y}%`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
          }}
          initial={{ 
            rotate: leaf.rotate,
            scale: 0.8,
          }}
          animate={{ 
            rotate: leaf.rotate + 360,
            scale: [0.8, 1.2, 0.8],
            y: [`${leaf.y}%`, `${leaf.y + 10}%`, `${leaf.y}%`],
            x: [`${leaf.x}%`, `${leaf.x + (Math.random() * 10 - 5)}%`, `${leaf.x}%`],
          }}
          transition={{ 
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src={mapleLeaf} 
            alt="Maple Leaf" 
            className="w-full h-full"
          />
        </motion.div>
      ))}
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-maple-red/[0.02] to-transparent"></div>
      
      {/* Animated circles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full bg-maple-red/[0.02]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0.01, 0.03, 0.01],
          }}
          transition={{ 
            duration: Math.random() * 20 + 20,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
