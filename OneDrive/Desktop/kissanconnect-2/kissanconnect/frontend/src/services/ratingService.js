import api from './api';

const ratingService = {
  // Create a new rating
  createRating: async (ratingData) => {
    try {
      const response = await api.post('/ratings', ratingData);
      return response.data;
    } catch (error) {
      console.error('Error creating rating:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to submit rating',
      };
    }
  },

  // Get ratings for a user
  getUserRatings: async (userId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/ratings/user/${userId}?${queryString}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user ratings:', error);
      return {
        success: false,
        message: 'Failed to fetch ratings',
        ratings: [],
      };
    }
  },

  // Get user rating statistics
  getUserStats: async (userId) => {
    try {
      const response = await api.get(`/ratings/stats/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return {
        success: false,
        message: 'Failed to fetch user statistics',
        stats: {
          averageRating: 0,
          totalRatings: 0,
          completedTransactions: 0,
          distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        },
      };
    }
  },

  // Get ratings for a contract
  getContractRatings: async (contractId) => {
    try {
      const response = await api.get(`/ratings/contract/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching contract ratings:', error);
      return {
        success: false,
        message: 'Failed to fetch contract ratings',
        ratings: [],
      };
    }
  },

  // Check if user can rate a contract
  canRateContract: async (contractId) => {
    try {
      const response = await api.get(`/ratings/can-rate/${contractId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking rating status:', error);
      return {
        success: false,
        canRate: false,
        reason: 'Failed to check rating status',
      };
    }
  },

  // Add response to a rating
  addRatingResponse: async (ratingId, response) => {
    try {
      const result = await api.put(`/ratings/${ratingId}/response`, { response });
      return result.data;
    } catch (error) {
      console.error('Error adding rating response:', error);
      return {
        success: false,
        message: 'Failed to add response',
      };
    }
  },
};

export default ratingService;
