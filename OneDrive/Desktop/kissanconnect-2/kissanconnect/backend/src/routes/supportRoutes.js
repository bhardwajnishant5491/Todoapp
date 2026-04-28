import express from 'express';
import {
  createSupportTicket,
  getAllSupportTickets,
  getSupportTicketById,
  replyToTicket,
  assignTicket,
  updateTicketStatus,
  closeTicket,
  deleteTicket
} from '../controllers/supportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes (optional authentication)
router.post('/', createSupportTicket);

// Protected routes (require authentication)
router.get('/', protect, getAllSupportTickets);
router.get('/:id', protect, getSupportTicketById);

// Admin only routes
router.post('/:id/reply', protect, adminOnly, replyToTicket);
router.put('/:id/assign', protect, adminOnly, assignTicket);
router.put('/:id/status', protect, adminOnly, updateTicketStatus);
router.put('/:id/close', protect, adminOnly, closeTicket);
router.delete('/:id', protect, adminOnly, deleteTicket);

export default router;
