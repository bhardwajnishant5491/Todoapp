import express from 'express';
import {
  getBankDetails,
  updateBankDetails,
  verifyBankDetails,
  deleteBankDetails,
} from '../controllers/bankController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get bank details (authenticated users)
router.get('/', protect, getBankDetails);

// Add/Update bank details (authenticated users)
router.put('/', protect, updateBankDetails);

// Delete bank details (authenticated users)
router.delete('/', protect, deleteBankDetails);

// Verify bank details (admin only)
router.put('/verify/:userId', protect, adminOnly, verifyBankDetails);

export default router;
