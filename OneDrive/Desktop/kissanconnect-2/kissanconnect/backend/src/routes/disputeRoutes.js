import express from 'express';
import {
  createDispute,
  getAllDisputes,
  getDisputeById,
  assignDispute,
  updateDisputeStatus,
  resolveDispute,
  addDisputeMessage,
  deleteDispute,
} from '../controllers/disputeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes (require authentication)
router.post('/', protect, createDispute);
router.get('/', protect, getAllDisputes);
router.get('/:id', protect, getDisputeById);
router.post('/:id/message', protect, addDisputeMessage);

// Admin only routes
router.put('/:id/assign', protect, adminOnly, assignDispute);
router.put('/:id/status', protect, adminOnly, updateDisputeStatus);
router.put('/:id/resolve', protect, adminOnly, resolveDispute);
router.delete('/:id', protect, adminOnly, deleteDispute);

export default router;
