import React from 'react';

const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  dot = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-inter font-medium rounded-full transition-all duration-300';
  
  const variants = {
    primary: 'bg-primary-100 text-primary-700 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-700 border border-secondary-200',
    success: 'bg-success-100 text-success-700 border border-success-200',
    warning: 'bg-warning-100 text-warning-700 border border-warning-200',
    danger: 'bg-danger-100 text-danger-700 border border-danger-200',
    accent: 'bg-accent-100 text-accent-700 border border-accent-200',
    gray: 'bg-gray-100 text-gray-700 border border-gray-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const dotColors = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    accent: 'bg-accent-500',
    gray: 'bg-gray-500',
  };

  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className={`w-2 h-2 rounded-full ${dotColors[variant]} animate-pulse`}></span>}
      {children}
    </span>
  );
};

export default Badge;
