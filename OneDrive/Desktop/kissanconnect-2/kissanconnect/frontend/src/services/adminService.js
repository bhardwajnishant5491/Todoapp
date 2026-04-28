import api from './api';

/**
 * Admin Service - API calls for admin-only operations
 * All endpoints require admin authentication
 */

// ==================== USER MANAGEMENT ====================

/**
 * Get all platform users with stats
 * @returns {Promise} - { users: Array, stats: Object }
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const response = await api.get('/admin/users', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get all users error:', error);
    throw error.message || 'Failed to fetch users';
  }
};

/**
 * Get single user by ID
 * @param {string} userId - User ID
 * @returns {Promise} - User object
 */
export const getUserById = async (userId) => {
  try {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Get user error:', error);
    throw error.message || 'Failed to fetch user';
  }
};

/**
 * Block a user
 * @param {string} userId - User ID
 * @returns {Promise}
 */
export const blockUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/block`, { isBlocked: true });
    return response.data;
  } catch (error) {
    console.error('Block user error:', error);
    throw error.message || 'Failed to block user';
  }
};

/**
 * Unblock a user
 * @param {string} userId - User ID
 * @returns {Promise}
 */
export const unblockUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/block`, { isBlocked: false });
    return response.data;
  } catch (error) {
    console.error('Unblock user error:', error);
    throw error.message || 'Failed to unblock user';
  }
};

/**
 * Update user role
 * @param {string} userId - User ID
 * @param {string} newRole - New role (farmer/buyer/admin)
 * @returns {Promise}
 */
export const updateUserRole = async (userId, newRole) => {
  try {
    const response = await api.put(`/admin/users/${userId}/role`, { role: newRole });
    return response.data;
  } catch (error) {
    console.error('Update role error:', error);
    throw error.message || 'Failed to update user role';
  }
};

/**
 * Verify a user (KYC approval)
 * @param {string} userId - User ID
 * @returns {Promise}
 */
export const verifyUser = async (userId) => {
  try {
    const response = await api.put(`/admin/users/${userId}/verify`);
    return response.data;
  } catch (error) {
    console.error('Verify user error:', error);
    throw error.message || 'Failed to verify user';
  }
};

// ==================== ANALYTICS ====================

/**
 * Get platform analytics
 * @param {string} timeRange - Time range filter (week/month/year/all)
 * @returns {Promise} - Analytics data
 */
export const getPlatformAnalytics = async (timeRange = 'all') => {
  try {
    const response = await api.get('/admin/analytics', { params: { timeRange } });
    return response.data;
  } catch (error) {
    console.error('Get analytics error:', error);
    throw error.message || 'Failed to fetch analytics';
  }
};

/**
 * Get platform analytics time-series
 * @param {string} timeRange - week/month/year
 * @returns {Promise}
 */
export const getAnalyticsTimeSeries = async (timeRange = 'week') => {
  try {
    const response = await api.get('/admin/analytics/timeseries', { params: { timeRange } });
    return response.data;
  } catch (error) {
    console.error('Get analytics time-series error:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch analytics time-series';
  }
};

/**
 * Get admin contracts monitoring data
 * @param {Object} filters - status/search/page/limit
 * @returns {Promise}
 */
export const getAdminContracts = async (filters = {}) => {
  try {
    const response = await api.get('/admin/contracts', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get admin contracts error:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch contracts';
  }
};

/**
 * Verify contract hash integrity
 * @param {string} contractId
 * @returns {Promise}
 */
export const verifyContractIntegrity = async (contractId) => {
  try {
    const response = await api.get(`/contracts/${contractId}/verify`);
    return response.data;
  } catch (error) {
    console.error('Verify contract integrity error:', error);
    const msg = error?.message || error?.response?.data?.message || 'Failed to verify contract integrity';
    throw msg;
  }
};

/**
 * Admin contract intervention action
 * @param {string} contractId
 * @param {Object} payload - { action, reason }
 * @returns {Promise}
 */
export const interveneContract = async (contractId, payload) => {
  try {
    const response = await api.put(`/admin/contracts/${contractId}/intervene`, payload);
    return response.data;
  } catch (error) {
    console.error('Intervene contract error:', error);
    throw error.response?.data?.message || error.message || 'Failed to apply intervention';
  }
};

/**
 * Get audit logs timeline
 * @param {Object} filters - { entityType, entityId, limit }
 * @returns {Promise}
 */
export const getAuditLogs = async (filters = {}) => {
  try {
    const response = await api.get('/admin/audit-logs', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get audit logs error:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch audit logs';
  }
};

/**
 * Get platform treasury summary
 * @returns {Promise}
 */
export const getPlatformTreasury = async () => {
  try {
    const response = await api.get('/admin/treasury');
    return response.data;
  } catch (error) {
    console.error('Get platform treasury error:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch treasury';
  }
};

/**
 * Withdraw platform commission
 * @param {number} amount
 * @param {string} note
 * @param {Object} payoutDestination
 * @returns {Promise}
 */
export const withdrawPlatformCommission = async (amount, note = '', payoutDestination = {}) => {
  try {
    const response = await api.post('/admin/treasury/withdraw', { amount, note, payoutDestination });
    return response.data;
  } catch (error) {
    console.error('Withdraw platform commission error:', error);
    throw error.response?.data?.message || error.message || 'Failed to withdraw commission';
  }
};

/**
 * Process platform commission withdrawal request
 * @param {string} transactionId
 * @param {Object} payload - { decision, reviewNote, bankReferenceNumber, bankUtrNumber }
 * @returns {Promise}
 */
export const processPlatformCommissionWithdrawal = async (transactionId, payload) => {
  try {
    const response = await api.put(`/admin/treasury/withdraw/${transactionId}/process`, payload);
    return response.data;
  } catch (error) {
    console.error('Process platform commission withdrawal error:', error);
    throw error.response?.data?.message || error.message || 'Failed to process withdrawal request';
  }
};

/**
 * Get admin platform settings
 * @returns {Promise}
 */
export const getAdminSettings = async () => {
  try {
    const response = await api.get('/admin/settings');
    return response.data;
  } catch (error) {
    console.error('Get admin settings error:', error);
    throw error.response?.data?.message || error.message || 'Failed to fetch admin settings';
  }
};

/**
 * Update admin platform settings
 * @param {Object} settings
 * @returns {Promise}
 */
export const updateAdminSettings = async (settings) => {
  try {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  } catch (error) {
    console.error('Update admin settings error:', error);
    throw error.response?.data?.message || error.message || 'Failed to update admin settings';
  }
};

/**
 * Get dashboard stats (quick summary)
 * @returns {Promise} - Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/admin/analytics');
    return response.data;
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error.message || 'Failed to fetch dashboard stats';
  }
};

/**
 * Get revenue chart data
 * @param {string} period - Time period (day/week/month/year)
 * @returns {Promise} - Chart data
 */
export const getRevenueChart = async (period = 'month') => {
  try {
    const response = await api.get('/admin/analytics/revenue', { params: { period } });
    return response.data;
  } catch (error) {
    console.error('Get revenue chart error:', error);
    throw error.message || 'Failed to fetch revenue chart';
  }
};

/**
 * Get user growth chart data
 * @param {string} period - Time period (day/week/month/year)
 * @returns {Promise} - Chart data
 */
export const getUserGrowthChart = async (period = 'month') => {
  try {
    const response = await api.get('/admin/analytics/users', { params: { period } });
    return response.data;
  } catch (error) {
    console.error('Get user growth chart error:', error);
    throw error.message || 'Failed to fetch user growth chart';
  }
};

/**
 * Get top crops by value
 * @param {number} limit - Number of crops to return
 * @returns {Promise} - Top crops array
 */
export const getTopCrops = async (limit = 10) => {
  try {
    const response = await api.get('/admin/analytics/top-crops', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Get top crops error:', error);
    throw error.message || 'Failed to fetch top crops';
  }
};

/**
 * Get recent platform activity
 * @param {number} limit - Number of activities to return
 * @returns {Promise} - Recent activities array
 */
export const getRecentActivity = async (limit = 20) => {
  try {
    const response = await api.get('/admin/analytics/activity', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Get recent activity error:', error);
    throw error.message || 'Failed to fetch recent activity';
  }
};

// ==================== WITHDRAWALS ====================

/**
 * Get all withdrawal requests
 * @param {string} status - Filter by status (all/pending/completed/failed)
 * @param {number} limit - Max results
 * @returns {Promise} - { withdrawals: Array, stats: Object }
 */
export const getAllWithdrawals = async (status = 'all', limit = 100) => {
  try {
    const response = await api.get('/admin/withdrawals', { params: { status, limit } });
    return response.data;
  } catch (error) {
    console.error('Get withdrawals error:', error);
    throw error.message || 'Failed to fetch withdrawals';
  }
};

/**
 * Approve a withdrawal request
 * @param {string} withdrawalId - Transaction ID
 * @param {string} notes - Admin notes (optional)
 * @returns {Promise}
 */
export const approveWithdrawal = async (withdrawalId, notes = '') => {
  try {
    const response = await api.put(`/admin/withdrawals/${withdrawalId}/approve`, { notes });
    return response.data;
  } catch (error) {
    console.error('Approve withdrawal error:', error);
    throw error.message || 'Failed to approve withdrawal';
  }
};

/**
 * Reject a withdrawal request
 * @param {string} withdrawalId - Transaction ID
 * @param {string} reason - Rejection reason
 * @returns {Promise}
 */
export const rejectWithdrawal = async (withdrawalId, reason) => {
  try {
    const response = await api.put(`/admin/withdrawals/${withdrawalId}/reject`, { reason });
    return response.data;
  } catch (error) {
    console.error('Reject withdrawal error:', error);
    throw error.message || 'Failed to reject withdrawal';
  }
};

/**
 * Get withdrawal statistics
 * @returns {Promise} - Withdrawal stats object
 */
export const getWithdrawalStats = async () => {
  try {
    const response = await api.get('/admin/withdrawals/stats');
    return response.data;
  } catch (error) {
    console.error('Get withdrawal stats error:', error);
    throw error.message || 'Failed to fetch withdrawal stats';
  }
};

// ==================== SYSTEM ====================

/**
 * Get system activity logs
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {Promise} - Logs array
 */
export const getSystemLogs = async (page = 1, limit = 50) => {
  try {
    const response = await api.get('/admin/logs', { params: { page, limit } });
    return response.data;
  } catch (error) {
    console.error('Get system logs error:', error);
    throw error.message || 'Failed to fetch system logs';
  }
};

/**
 * Export platform data
 * @param {string} type - Data type (users/contracts/transactions/crops)
 * @param {Object} filters - Additional filters
 * @returns {Promise} - Download URL or file blob
 */
export const exportData = async (type, filters = {}) => {
  try {
    const response = await api.get(`/admin/export/${type}`, { 
      params: filters,
      responseType: 'blob' // For file download
    });
    return response.data;
  } catch (error) {
    console.error('Export data error:', error);
    throw error.message || 'Failed to export data';
  }
};

// ==================== DISPUTES (To be implemented) ====================

/**
 * Get all disputes
 * @param {Object} filters - Filter options
 * @returns {Promise} - Disputes array
 */
export const getAllDisputes = async (filters = {}) => {
  try {
    const response = await api.get('/admin/disputes', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get disputes error:', error);
    throw error.message || 'Failed to fetch disputes';
  }
};

/**
 * Assign dispute to admin
 * @param {string} disputeId - Dispute ID
 * @param {string} adminId - Admin user ID
 * @returns {Promise}
 */
export const assignDispute = async (disputeId, adminId) => {
  try {
    const response = await api.put(`/admin/disputes/${disputeId}/assign`, { adminId });
    return response.data;
  } catch (error) {
    console.error('Assign dispute error:', error);
    throw error.message || 'Failed to assign dispute';
  }
};

/**
 * Update dispute status
 * @param {string} disputeId - Dispute ID
 * @param {string} status - New status
 * @returns {Promise}
 */
export const updateDisputeStatus = async (disputeId, status) => {
  try {
    const response = await api.put(`/admin/disputes/${disputeId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Update dispute status error:', error);
    throw error.message || 'Failed to update dispute status';
  }
};

/**
 * Resolve a dispute
 * @param {string} disputeId - Dispute ID
 * @param {string} resolution - Resolution notes
 * @returns {Promise}
 */
export const resolveDispute = async (disputeId, resolution) => {
  try {
    const response = await api.put(`/admin/disputes/${disputeId}/resolve`, { resolution });
    return response.data;
  } catch (error) {
    console.error('Resolve dispute error:', error);
    console.error('Error response:', error.response?.data);
    throw error.response?.data?.message || error.message || 'Failed to resolve dispute';
  }
};

// ==================== SUPPORT TICKETS (To be implemented) ====================

/**
 * Get all support tickets
 * @param {Object} filters - Filter options
 * @returns {Promise} - Support tickets array
 */
export const getAllSupportTickets = async (filters = {}) => {
  try {
    const response = await api.get('/admin/support', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Get support tickets error:', error);
    throw error.message || 'Failed to fetch support tickets';
  }
};

/**
 * Reply to support ticket
 * @param {string} ticketId - Ticket ID
 * @param {string} message - Reply message
 * @returns {Promise}
 */
export const replyToTicket = async (ticketId, message) => {
  try {
    const response = await api.post(`/admin/support/${ticketId}/reply`, { message });
    return response.data;
  } catch (error) {
    console.error('Reply to ticket error:', error);
    throw error.message || 'Failed to reply to ticket';
  }
};

/**
 * Close support ticket
 * @param {string} ticketId - Ticket ID
 * @returns {Promise}
 */
export const closeTicket = async (ticketId) => {
  try {
    const response = await api.put(`/admin/support/${ticketId}/close`);
    return response.data;
  } catch (error) {
    console.error('Close ticket error:', error);
    throw error.message || 'Failed to close ticket';
  }
};

export default {
  // User Management
  getAllUsers,
  getUserById,
  blockUser,
  unblockUser,
  updateUserRole,
  verifyUser,
  
  // Analytics
  getPlatformAnalytics,
  getAnalyticsTimeSeries,
  getDashboardStats,
  getAdminContracts,
  interveneContract,
  getAuditLogs,
  getPlatformTreasury,
  withdrawPlatformCommission,
  getAdminSettings,
  updateAdminSettings,
  getRevenueChart,
  getUserGrowthChart,
  getTopCrops,
  getRecentActivity,
  
  // Withdrawals
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  getWithdrawalStats,
  
  // System
  getSystemLogs,
  exportData,
  
  // Disputes (Future)
  getAllDisputes,
  assignDispute,
  updateDisputeStatus,
  resolveDispute,
  
  // Support (Future)
  getAllSupportTickets,
  replyToTicket,
  closeTicket,
};
