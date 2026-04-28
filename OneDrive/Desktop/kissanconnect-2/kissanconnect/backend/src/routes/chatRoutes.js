import express from 'express';
import {
  sendMessage,
  getConversation,
  getAllConversations,
  getUnreadCount,
  markConversationAsRead,
  getContractParticipants,
  getUserForChat,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Send a message
router.post('/send', sendMessage);

// Get all conversations
router.get('/conversations', getAllConversations);

// Get unread message count
router.get('/unread-count', getUnreadCount);

// Get conversation with specific user
router.get('/conversation/:userId', getConversation);

// Mark conversation as read
router.put('/mark-read/:userId', markConversationAsRead);

// Get chat participants for a contract
router.get('/contract/:contractId/participants', getContractParticipants);

// Get user details for chat
router.get('/user/:userId', getUserForChat);

export default router;
