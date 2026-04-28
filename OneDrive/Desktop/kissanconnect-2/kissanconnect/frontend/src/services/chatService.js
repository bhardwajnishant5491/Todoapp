import api from './api';

// Chat Service - API calls for messaging operations
const chatService = {
  // Send a message
  sendMessage: async (receiverId, message, contractId = null) => {
    try {
      const response = await api.post('/chat/send', {
        receiverId,
        message,
        contractId,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get conversation with specific user
  getConversation: async (userId) => {
    try {
      const response = await api.get(`/chat/conversation/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all conversations
  getAllConversations: async () => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get unread message count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Mark conversation as read
  markAsRead: async (userId) => {
    try {
      const response = await api.put(`/chat/mark-read/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get contract participants
  getContractParticipants: async (contractId) => {
    try {
      const response = await api.get(`/chat/contract/${contractId}/participants`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user details for chat
  getUserForChat: async (userId) => {
    try {
      const response = await api.get(`/chat/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default chatService;
