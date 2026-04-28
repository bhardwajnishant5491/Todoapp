import React from 'react';

const Spinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    xs: 'w-4 h-4 border-2',
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  const colors = {
    primary: 'border-primary-500 border-t-transparent',
    secondary: 'border-secondary-500 border-t-transparent',
    success: 'border-success-500 border-t-transparent',
    danger: 'border-danger-500 border-t-transparent',
    accent: 'border-accent-500 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
