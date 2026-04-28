import express from 'express';
import {
  createContract,
  getAllContracts,
  getContractById,
  updateContractStatus,
  getFarmerContractStats,
  getBuyerContractStats,
  verifyContractIntegrity,
} from '../controllers/contractController.js';
import { protect } from '../middleware/authMiddleware.js';
import { farmerOnly, buyerOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get all contracts (filtered by user role)
router.get('/', protect, getAllContracts);

// Create new contract (buyer only)
router.post('/', protect, buyerOnly, createContract);

// Get contract statistics
router.get('/farmer/stats', protect, farmerOnly, getFarmerContractStats);
router.get('/buyer/stats', protect, buyerOnly, getBuyerContractStats);

// Get single contract by ID
router.get('/:id', protect, getContractById);

// Verify contract integrity (SHA-256 hash verification)
router.get('/:id/verify', protect, verifyContractIntegrity);

// Update contract status
router.put('/:id/status', protect, updateContractStatus);

export default router;
