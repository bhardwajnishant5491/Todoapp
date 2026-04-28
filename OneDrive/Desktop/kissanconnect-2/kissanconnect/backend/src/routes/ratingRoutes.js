import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  createRating,
  getUserRatings,
  getUserStats,
  getContractRatings,
  canRateContract,
  addRatingResponse,
} from '../controllers/ratingController.js';

const router = express.Router();

// Public routes
router.get('/user/:userId', getUserRatings);
router.get('/stats/:userId', getUserStats);

// Protected routes
router.post('/', protect, createRating);
router.get('/contract/:contractId', protect, getContractRatings);
router.get('/can-rate/:contractId', protect, canRateContract);
router.put('/:ratingId/response', protect, addRatingResponse);

export default router;
