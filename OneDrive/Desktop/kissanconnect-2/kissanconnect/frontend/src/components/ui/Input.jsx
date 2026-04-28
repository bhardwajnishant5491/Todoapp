import React, { useState } from 'react';

const Input = ({ 
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  disabled = false,
  required = false,
  fullWidth = true,
  className = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const baseStyles = 'px-4 py-3 rounded-lg border transition-all duration-300 font-inter text-base outline-none';
  const stateStyles = error 
    ? 'border-danger-500 focus:border-danger-500 focus:ring-2 focus:ring-danger-200' 
    : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200';
  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  const widthStyles = fullWidth ? 'w-full' : '';
  const paddingWithIcon = icon ? (iconPosition === 'left' ? 'pl-11' : 'pr-11') : '';

  return (
    <div className={`flex flex-col gap-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`font-inter font-medium text-sm ${error ? 'text-danger-500' : 'text-gray-700'} ${isFocused ? 'text-primary-500' : ''}`}
        >
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${disabledStyles}
            ${widthStyles}
            ${paddingWithIcon}
            ${className}
          `}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>

      {(error || helperText) && (
        <p className={`text-sm ${error ? 'text-danger-500' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
