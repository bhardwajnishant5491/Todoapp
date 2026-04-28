import React from 'react';
import { motion } from 'framer-motion';

const FloatingElement = ({ 
  children, 
  delay = 0,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      animate={{
        y: [-10, 10, -10],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: delay,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FloatingElement;
