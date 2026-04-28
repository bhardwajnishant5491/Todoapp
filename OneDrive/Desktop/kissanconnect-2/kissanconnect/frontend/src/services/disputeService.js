import api from './api';

/**
 * Dispute Service - For Farmers & Buyers
 * Handles all dispute-related operations for regular users
 */

/**
 * Create a new dispute
 * @param {Object} disputeData - Dispute information
 * @returns {Promise} - Created dispute object
 */
export const createDispute = async (disputeData) => {
  try {
    const response = await api.post('/disputes', disputeData);
    return response.data;
  } catch (error) {
    console.error('Create dispute error:', error);
    throw error?.message || 'Failed to create dispute';
  }
};

/**
 * Get all disputes for current user
 * @param {Object} filters - Filter options (status, type, etc.)
 * @returns {Promise} - Array of disputes
 */
export const getMyDisputes = async (filters = {}) => {
  try {
    const response = await api.get('/disputes', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get disputes error:', error);
    throw error?.message || 'Failed to fetch disputes';
  }
};

/**
 * Get dispute by ID
 * @param {String} disputeId - Dispute ID
 * @returns {Promise} - Dispute object
 */
export const getDisputeById = async (disputeId) => {
  try {
    const response = await api.get(`/disputes/${disputeId}`);
    return response.data;
  } catch (error) {
    console.error('Get dispute error:', error);
    throw error?.message || 'Failed to fetch dispute details';
  }
};

/**
 * Add a message to dispute thread
 * @param {String} disputeId - Dispute ID
 * @param {String} message - Message text
 * @returns {Promise} - Updated dispute
 */
export const addMessageToDispute = async (disputeId, message) => {
  try {
    const response = await api.post(`/disputes/${disputeId}/message`, { message });
    return response.data;
  } catch (error) {
    console.error('Add message error:', error);
    throw error?.message || 'Failed to add message';
  }
};

export default {
  createDispute,
  getMyDisputes,
  getDisputeById,
  addMessageToDispute,
};
