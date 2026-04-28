import api from './api';

// Contract Service - API calls for contract management
const contractService = {
  // Create new contract proposal (Buyer only)
  createContract: async (contractData) => {
    try {
      const response = await api.post('/contracts', contractData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all contracts (filtered by role)
  getAllContracts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await api.get(`/contracts?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single contract by ID
  getContractById: async (id) => {
    try {
      const response = await api.get(`/contracts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update contract status
  updateContractStatus: async (id, status, notes = '') => {
    try {
      const response = await api.put(`/contracts/${id}/status`, {
        status,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get farmer contract statistics
  getFarmerContractStats: async () => {
    try {
      const response = await api.get('/contracts/farmer/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get buyer contract statistics
  getBuyerContractStats: async () => {
    try {
      const response = await api.get('/contracts/buyer/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Accept contract (Farmer)
  acceptContract: async (id, notes = '') => {
    return contractService.updateContractStatus(id, 'Accepted', notes);
  },

  // Reject contract (Farmer)
  rejectContract: async (id, reason) => {
    return contractService.updateContractStatus(id, 'Rejected', reason);
  },

  // Mark contract as completed
  completeContract: async (id) => {
    return contractService.updateContractStatus(id, 'Completed');
  },

  // Cancel contract
  cancelContract: async (id) => {
    return contractService.updateContractStatus(id, 'Cancelled');
  },
};

export default contractService;
