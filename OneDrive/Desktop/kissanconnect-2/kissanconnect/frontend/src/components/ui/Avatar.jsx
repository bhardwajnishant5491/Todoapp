import React, { useEffect, useState } from 'react';

const Avatar = ({ 
  src, 
  alt = 'User', 
  size = 'md',
  status,
  name,
  className = '',
  ...props 
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const sizes = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-10 h-10 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
    xl: 'w-20 h-20 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
    xl: 'w-5 h-5',
    '2xl': 'w-6 h-6',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover border-2 border-white shadow-md`}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white font-poppins font-semibold border-2 border-white shadow-md`}>
          {getInitials(name || alt)}
        </div>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 ${statusSizes[size]} ${statusColors[status]} rounded-full border-2 border-white`}></span>
      )}
    </div>
  );
};

export default Avatar;
