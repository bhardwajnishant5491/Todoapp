import { v2 as cloudinary } from 'cloudinary';
import config from '../config/env.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export const uploadProfileImageToCloudinary = async (imageData, userId) => {
  const result = await cloudinary.uploader.upload(imageData, {
    folder: config.cloudinary.folder,
    resource_type: 'image',
    public_id: `user_${userId}_${Date.now()}`,
    overwrite: false,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
    ],
  });

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
  };
};

export const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (error) {
    // Non-blocking cleanup
    console.error('Cloudinary delete error:', error.message || error);
  }
};

export default cloudinary;
