import React from 'react';
import { motion } from 'framer-motion';

const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.3,
  initialScale = 0.8,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: initialScale }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: initialScale }}
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScaleIn;
