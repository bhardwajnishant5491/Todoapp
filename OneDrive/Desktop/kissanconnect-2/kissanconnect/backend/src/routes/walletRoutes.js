import express from 'express';
import {
  getWallet,
  depositFunds,
  requestWithdrawal,
  getTransactions,
  processWithdrawal,
  getWalletStats,
} from '../controllers/walletController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Get wallet info
router.get('/', protect, getWallet);

// Deposit funds (Demo payment gateway)
router.post('/deposit', protect, depositFunds);

// Request withdrawal
router.post('/withdraw', protect, requestWithdrawal);

// Get transaction history
router.get('/transactions', protect, getTransactions);

// Get wallet statistics
router.get('/stats', protect, getWalletStats);

// Process withdrawal (Admin only)
router.put('/withdraw/:transactionId/process', protect, adminOnly, processWithdrawal);

export default router;
