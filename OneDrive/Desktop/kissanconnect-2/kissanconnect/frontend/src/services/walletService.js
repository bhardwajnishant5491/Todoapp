import api from './api';

/**
 * Get wallet info
 */
export const getWallet = async () => {
  try {
    const response = await api.get('/wallet');
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to fetch wallet info';
  }
};

/**
 * Deposit funds to wallet
 */
export const depositFunds = async (amount) => {
  try {
    const response = await api.post('/wallet/deposit', { amount });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to deposit funds';
  }
};

/**
 * Request withdrawal from wallet
 */
export const requestWithdrawal = async (amount) => {
  try {
    const response = await api.post('/wallet/withdraw', { amount });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to request withdrawal';
  }
};

/**
 * Get transaction history
 */
export const getTransactions = async (params = {}) => {
  try {
    const response = await api.get('/wallet/transactions', { params });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to fetch transactions';
  }
};

/**
 * Get wallet statistics
 */
export const getWalletStats = async () => {
  try {
    const response = await api.get('/wallet/stats');
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to fetch wallet stats';
  }
};

/**
 * Process withdrawal (Admin only)
 */
export const processWithdrawal = async (transactionId, status, notes = '') => {
  try {
    const response = await api.put(`/wallet/withdraw/${transactionId}/process`, { status, notes });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to process withdrawal';
  }
};

/**
 * Get all withdrawals (Admin only)
 */
export const getAllWithdrawals = async (params = {}) => {
  try {
    const response = await api.get('/admin/withdrawals', { params });
    return response.data;
  } catch (error) {
    throw error?.message || 'Failed to fetch withdrawals';
  }
};

