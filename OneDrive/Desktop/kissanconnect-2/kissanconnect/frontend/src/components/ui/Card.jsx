import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'elevated', 
  hoverable = true,
  padding = 'md',
  className = '',
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-xl transition-all duration-300';
  
  const variants = {
    elevated: 'shadow-card hover:shadow-card-hover',
    flat: 'border border-gray-200',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-card',
    premium: 'shadow-premium border border-accent-100',
    glow: 'shadow-glow border border-accent-200',
  };

  const paddings = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverEffect = hoverable ? 'hover:-translate-y-1 cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverEffect}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
