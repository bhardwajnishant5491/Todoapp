import express from 'express';
import {
  getAllUsers,
  getAllWithdrawals,
  getAuditLogs,
  getPlatformTreasury,
  getPlatformAnalyticsTimeSeries,
  getPlatformAnalytics,
  getAdminContracts,
  getAdminSettings,
  interveneContract,
  processPlatformCommissionWithdrawal,
  toggleUserBlock,
  updateAdminSettings,
  withdrawPlatformCommission,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Protect all admin routes
router.use(protect);
router.use(adminOnly);

// @route   GET /api/admin/users
router.get('/users', getAllUsers);

// @route   GET /api/admin/withdrawals
router.get('/withdrawals', getAllWithdrawals);

// @route   GET /api/admin/analytics
router.get('/analytics', getPlatformAnalytics);

// @route   GET /api/admin/analytics/timeseries
router.get('/analytics/timeseries', getPlatformAnalyticsTimeSeries);

// @route   GET /api/admin/contracts
router.get('/contracts', getAdminContracts);

// @route   PUT /api/admin/contracts/:contractId/intervene
router.put('/contracts/:contractId/intervene', interveneContract);

// @route   GET /api/admin/audit-logs
router.get('/audit-logs', getAuditLogs);

// @route   GET /api/admin/treasury
router.get('/treasury', getPlatformTreasury);

// @route   POST /api/admin/treasury/withdraw
router.post('/treasury/withdraw', withdrawPlatformCommission);

// @route   PUT /api/admin/treasury/withdraw/:transactionId/process
router.put('/treasury/withdraw/:transactionId/process', processPlatformCommissionWithdrawal);

// @route   GET /api/admin/settings
router.get('/settings', getAdminSettings);

// @route   PUT /api/admin/settings
router.put('/settings', updateAdminSettings);

// @route   PUT /api/admin/users/:userId/block
router.put('/users/:userId/block', toggleUserBlock);

export default router;
