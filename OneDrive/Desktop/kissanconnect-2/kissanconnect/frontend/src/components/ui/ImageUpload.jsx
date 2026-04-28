import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';

const ImageUpload = ({ 
  value = null, 
  onChange, 
  maxSize = 5, // MB
  accept = "image/jpeg,image/png,image/jpg",
  label = "Upload Image",
  required = false,
  error = null
}) => {
  const [preview, setPreview] = useState(value);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onChange(null, 'Please upload an image file');
      return;
    }

    // Validate file size (in MB)
    if (file.size > maxSize * 1024 * 1024) {
      onChange(null, `File size must be less than ${maxSize}MB`);
      return;
    }

    // Create preview and convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setPreview(base64String);
      // Pass base64 string to parent component
      onChange(base64String, null);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const removeImage = () => {
    setPreview(null);
    onChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transform hover:scale-110"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Click the X icon to remove image
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
            className={`
              relative w-full h-64 rounded-xl border-2 border-dashed 
              ${dragActive 
                ? 'border-primary-500 bg-primary-50' 
                : error 
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
              }
              transition-all duration-200 cursor-pointer
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
              <motion.div
                animate={{
                  scale: dragActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center mb-4
                  ${dragActive ? 'bg-primary-100' : 'bg-gray-100'}
                `}
              >
                {dragActive ? (
                  <FiUpload className="text-3xl text-primary-600" />
                ) : (
                  <FiImage className="text-3xl text-gray-400" />
                )}
              </motion.div>
              
              <p className="text-sm font-medium text-gray-700 mb-1">
                {dragActive ? 'Drop image here' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG up to {maxSize}MB
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-red-600"
        >
          {error}
        </motion.p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        required={required && !preview}
      />
    </div>
  );
};

export default ImageUpload;
