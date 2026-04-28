import express from 'express';
import {
  createCrop,
  getAllCrops,
  getCropById,
  getFarmerCrops,
  updateCrop,
  deleteCrop,
  getFarmerStats,
} from '../controllers/cropController.js';
import { protect } from '../middleware/authMiddleware.js';
import { farmerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCrops);

// Protected routes - Farmer only
router.post('/', protect, farmerOnly, createCrop);
router.get('/my/listings', protect, farmerOnly, getFarmerCrops);
router.get('/stats/farmer', protect, farmerOnly, getFarmerStats);
router.put('/:id', protect, farmerOnly, updateCrop);
router.delete('/:id', protect, farmerOnly, deleteCrop);

// Public route with parameter
router.get('/:id', getCropById);

export default router;
