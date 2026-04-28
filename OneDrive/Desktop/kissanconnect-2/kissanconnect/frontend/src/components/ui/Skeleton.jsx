import React from 'react';

const Skeleton = ({ 
  variant = 'text', 
  width, 
  height,
  className = '',
  count = 1,
  ...props 
}) => {
  const baseStyles = 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-pulse rounded';
  
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    card: 'h-64 w-full rounded-xl',
    avatar: 'w-12 h-12 rounded-full',
  };

  const skeletonStyle = {
    width: width || undefined,
    height: height || undefined,
  };

  const skeletons = Array.from({ length: count }, (_, index) => (
    <div
      key={index}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `}
      style={skeletonStyle}
      {...props}
    />
  ));

  return count > 1 ? (
    <div className="flex flex-col gap-3">{skeletons}</div>
  ) : (
    skeletons[0]
  );
};

export default Skeleton;
