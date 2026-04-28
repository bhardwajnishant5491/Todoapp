import api from './api';

/**
 * Get bank details for authenticated user
 */
export const getBankDetails = async () => {
  try {
    const response = await api.get('/bank');
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to fetch bank details';
  }
};

/**
 * Add or update bank details
 */
export const updateBankDetails = async (bankData) => {
  try {
    const response = await api.put('/bank', bankData);
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to update bank details';
  }
};

/**
 * Delete bank details
 */
export const deleteBankDetails = async () => {
  try {
    const response = await api.delete('/bank');
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to delete bank details';
  }
};

/**
 * Verify bank details (Admin only)
 */
export const verifyBankDetails = async (userId, isVerified) => {
  try {
    const response = await api.put(`/bank/verify/${userId}`, { isVerified });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to verify bank details';
  }
};
