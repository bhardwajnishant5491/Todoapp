import React from 'react';
import { motion } from 'framer-motion';

const SlideIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.5,
  distance = 50,
  className = '',
  ...props 
}) => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0,
        ...directions[direction]
      }}
      animate={{ 
        opacity: 1,
        x: 0,
        y: 0
      }}
      exit={{ 
        opacity: 0,
        ...directions[direction]
      }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default SlideIn;
