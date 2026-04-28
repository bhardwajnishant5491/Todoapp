import api from './api';

// Crop Service - API calls for crop operations
const cropService = {
  // Create new crop listing (Farmer only)
  createCrop: async (cropData) => {
    try {
      // Format the data to match backend expectations
      const formattedData = {
        ...cropData,
        // Convert single image to images array for backend
        images: cropData.image ? [cropData.image] : [],
      };
      // Remove the old image field
      delete formattedData.image;
      
      const response = await api.post('/crops', formattedData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all crops with filters
  getAllCrops: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/crops?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single crop by ID
  getCropById: async (id) => {
    try {
      const response = await api.get(`/crops/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get farmer's own crops
  getFarmerCrops: async () => {
    try {
      const response = await api.get('/crops/my/listings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update crop
  updateCrop: async (id, cropData) => {
    try {
      const response = await api.put(`/crops/${id}`, cropData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete crop
  deleteCrop: async (id) => {
    try {
      const response = await api.delete(`/crops/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get farmer statistics
  getFarmerStats: async () => {
    try {
      const response = await api.get('/crops/stats/farmer');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default cropService;
