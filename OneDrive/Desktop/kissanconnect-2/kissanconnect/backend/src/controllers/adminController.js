import User from '../models/User.js';
import Contract from '../models/Contract.js';
import Transaction from '../models/Transaction.js';
import Crop from '../models/Crop.js';
import AdminSettings from '../models/AdminSettings.js';
import AuditLog from '../models/AuditLog.js';
import { createAuditLog } from '../utils/auditLogger.js';

const maskAccountNumber = (value = '') => {
  const clean = String(value).replace(/\s+/g, '');
  if (clean.length <= 4) return clean;
  return `${'X'.repeat(clean.length - 4)}${clean.slice(-4)}`;
};

const getCommissionTreasurySnapshot = async () => {
  const [commissions, withdrawals] = await Promise.all([
    Transaction.find({ status: 'completed', type: 'commission' }),
    Transaction.find({ type: 'commission_withdrawal' }),
  ]);

  const totalCommission = commissions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalWithdrawn = withdrawals
    .filter((tx) => tx.status === 'completed')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const pendingWithdrawals = withdrawals
    .filter((tx) => tx.status === 'pending')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return {
    totalCommission,
    totalWithdrawn,
    pendingWithdrawals,
    availableCommission: Math.max(0, totalCommission - totalWithdrawn),
    availableToRequest: Math.max(0, totalCommission - totalWithdrawn - pendingWithdrawals),
  };
};

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    const stats = {
      total: users.length,
      farmers: users.filter(u => u.role === 'farmer').length,
      buyers: users.filter(u => u.role === 'buyer').length,
      admins: users.filter(u => u.role === 'admin').length,
      active: users.filter(u => u.isActive).length,
      blocked: users.filter(u => u.isBlocked).length,
    };

    res.status(200).json({
      success: true,
      users,
      stats,
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all pending withdrawals (Admin only)
 * @route   GET /api/admin/withdrawals
 * @access  Private/Admin
 */
export const getAllWithdrawals = async (req, res) => {
  try {
    const { status = 'all', limit = 100 } = req.query;

    const query = { type: 'withdrawal' };
    if (status !== 'all') {
      query.status = status;
    }

    const withdrawals = await Transaction.find(query)
      .populate('user', 'name email phone role wallet bankDetails')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    // Calculate stats
    const allWithdrawals = await Transaction.find({ type: 'withdrawal' });
    const stats = {
      total: allWithdrawals.length,
      pending: allWithdrawals.filter(t => t.status === 'pending').length,
      completed: allWithdrawals.filter(t => t.status === 'completed').length,
      failed: allWithdrawals.filter(t => t.status === 'failed').length,
      totalPendingAmount: allWithdrawals
        .filter(t => t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0),
    };

    res.status(200).json({
      success: true,
      withdrawals,
      stats,
    });
  } catch (error) {
    console.error('Get withdrawals error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get platform analytics (Admin only)
 * @route   GET /api/admin/analytics
 * @access  Private/Admin
 */
export const getPlatformAnalytics = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const farmers = await User.countDocuments({ role: 'farmer' });
    const buyers = await User.countDocuments({ role: 'buyer' });

    // Contract stats
    const totalContracts = await Contract.countDocuments();
    const activeContracts = await Contract.countDocuments({ status: 'Accepted' });
    const completedContracts = await Contract.countDocuments({ status: 'Completed' });
    const pendingContracts = await Contract.countDocuments({ status: 'Pending' });

    // Calculate total contract value
    const contracts = await Contract.find({ status: { $in: ['Accepted', 'Completed'] } });
    const totalContractValue = contracts.reduce((sum, c) => sum + c.totalAmount, 0);

    // Transaction stats
    const transactions = await Transaction.find({ status: 'completed' });
    const totalDeposits = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = transactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCommission = transactions
      .filter(t => t.type === 'commission')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalCommissionWithdrawn = transactions
      .filter(t => t.type === 'commission_withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);

    // Crop stats
    const totalCrops = await Crop.countDocuments();
    const availableCrops = await Crop.countDocuments({ status: 'Available' });

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          farmers,
          buyers,
        },
        contracts: {
          total: totalContracts,
          active: activeContracts,
          completed: completedContracts,
          pending: pendingContracts,
          totalValue: totalContractValue,
        },
        transactions: {
          totalDeposits,
          totalWithdrawals,
          totalCommission,
          totalCommissionWithdrawn,
          availableCommission: Math.max(0, totalCommission - totalCommissionWithdrawn),
          platformRevenue: totalCommission,
        },
        crops: {
          total: totalCrops,
          available: availableCrops,
        },
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get platform analytics time-series
 * @route   GET /api/admin/analytics/timeseries
 * @access  Private/Admin
 */
export const getPlatformAnalyticsTimeSeries = async (req, res) => {
  try {
    const { timeRange = 'week' } = req.query;

    const config = {
      week: { days: 7, unit: 'day', format: 'ddd' },
      month: { days: 30, unit: 'week', format: 'W' },
      year: { days: 365, unit: 'month', format: 'MMM' },
    }[timeRange] || { days: 7, unit: 'day', format: 'ddd' };

    const start = new Date();
    start.setDate(start.getDate() - config.days);

    const [transactions, contracts, users] = await Promise.all([
      Transaction.find({ status: 'completed', createdAt: { $gte: start } }).sort({ createdAt: 1 }),
      Contract.find({ createdAt: { $gte: start } }).sort({ createdAt: 1 }),
      User.find({ createdAt: { $gte: start } }).sort({ createdAt: 1 }),
    ]);

    const bucketMap = new Map();
    const getBucketKey = (date) => {
      const d = new Date(date);
      if (config.unit === 'day') {
        return d.toISOString().slice(0, 10);
      }
      if (config.unit === 'week') {
        const weekStart = new Date(d);
        weekStart.setDate(d.getDate() - d.getDay());
        return weekStart.toISOString().slice(0, 10);
      }
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    };

    const ensureBucket = (key) => {
      if (!bucketMap.has(key)) {
        bucketMap.set(key, {
          key,
          revenue: 0,
          contracts: 0,
          users: 0,
        });
      }
      return bucketMap.get(key);
    };

    transactions.forEach((tx) => {
      const bucket = ensureBucket(getBucketKey(tx.createdAt));
      if (tx.type === 'commission') {
        bucket.revenue += tx.amount;
      }
    });

    contracts.forEach((contract) => {
      const bucket = ensureBucket(getBucketKey(contract.createdAt));
      bucket.contracts += 1;
    });

    users.forEach((user) => {
      const bucket = ensureBucket(getBucketKey(user.createdAt));
      bucket.users += 1;
    });

    const series = Array.from(bucketMap.values()).sort((a, b) => a.key.localeCompare(b.key));

    res.status(200).json({
      success: true,
      series,
    });
  } catch (error) {
    console.error('Get analytics timeseries error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all contracts for admin monitoring
 * @route   GET /api/admin/contracts
 * @access  Private/Admin
 */
export const getAdminContracts = async (req, res) => {
  try {
    const { status, search = '', page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    let contracts = await Contract.find(query)
      .populate('farmerId', 'name email phone')
      .populate('buyerId', 'name email phone companyName')
      .populate('cropId', 'cropType quality')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    if (search.trim()) {
      const searchText = search.toLowerCase();
      contracts = contracts.filter((c) =>
        c._id.toString().toLowerCase().includes(searchText) ||
        c.cropId?.cropType?.toLowerCase().includes(searchText) ||
        c.farmerId?.name?.toLowerCase().includes(searchText) ||
        c.buyerId?.name?.toLowerCase().includes(searchText)
      );
    }

    const statsBase = await Contract.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalValue: { $sum: '$totalAmount' },
        },
      },
    ]);

    const stats = {
      total: 0,
      pending: 0,
      accepted: 0,
      inProgress: 0,
      delivered: 0,
      completed: 0,
      rejected: 0,
      cancelled: 0,
      totalValue: 0,
    };

    statsBase.forEach((item) => {
      stats.total += item.count;
      stats.totalValue += item.totalValue;
      if (item._id === 'Pending') stats.pending = item.count;
      if (item._id === 'Accepted') stats.accepted = item.count;
      if (item._id === 'In Progress') stats.inProgress = item.count;
      if (item._id === 'Delivered') stats.delivered = item.count;
      if (item._id === 'Completed') stats.completed = item.count;
      if (item._id === 'Rejected') stats.rejected = item.count;
      if (item._id === 'Cancelled') stats.cancelled = item.count;
    });

    const total = await Contract.countDocuments(query);

    res.status(200).json({
      success: true,
      contracts,
      stats,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get admin contracts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Admin intervention on contract
 * @route   PUT /api/admin/contracts/:contractId/intervene
 * @access  Private/Admin
 */
export const interveneContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const { action, reason, secondaryConfirmation } = req.body;

    if (!['flag', 'unflag', 'hold', 'unhold', 'force_close'].includes(action)) {
      return res.status(400).json({ message: 'Invalid intervention action' });
    }

    if (!reason || String(reason).trim().length < 5) {
      return res.status(400).json({ message: 'Please provide an audit reason (min 5 characters)' });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (!contract.interventionState) {
      contract.interventionState = {
        isFlagged: false,
        isOnHold: false,
        lastAction: 'none',
      };
    }

    if (action === 'flag') contract.interventionState.isFlagged = true;
    if (action === 'unflag') contract.interventionState.isFlagged = false;
    if (action === 'hold') contract.interventionState.isOnHold = true;
    if (action === 'unhold') contract.interventionState.isOnHold = false;
    if (action === 'force_close') {
      if (['Completed', 'Cancelled'].includes(contract.status)) {
        return res.status(400).json({ message: 'Contract already closed' });
      }
      if (contract.status === 'Delivered' && secondaryConfirmation !== true) {
        return res.status(400).json({
          message: 'Delivered contracts require secondary confirmation before force close',
          requiresSecondaryConfirmation: true,
        });
      }
      contract.status = 'Cancelled';
      contract.cancelledAt = new Date();
      contract.rejectionReason = reason;
    }

    contract.interventionState.lastAction = action;
    contract.interventionState.lastReason = reason;
    contract.interventionState.lastActionBy = req.user._id;
    contract.interventionState.lastActionAt = new Date();

    await contract.save();

    await createAuditLog({
      entityType: 'contract',
      entityId: contract._id,
      action: `admin_${action}`,
      reason,
      actor: req.user._id,
      req,
      metadata: {
        contractStatus: contract.status,
        secondaryConfirmation: !!secondaryConfirmation,
      },
    });

    const updatedContract = await Contract.findById(contract._id)
      .populate('farmerId', 'name email phone')
      .populate('buyerId', 'name email phone companyName')
      .populate('cropId', 'cropType quality');

    res.status(200).json({
      success: true,
      message: `Contract ${action.replace('_', ' ')} applied successfully`,
      contract: updatedContract,
    });
  } catch (error) {
    console.error('Intervene contract error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get audit logs for entity timeline
 * @route   GET /api/admin/audit-logs
 * @access  Private/Admin
 */
export const getAuditLogs = async (req, res) => {
  try {
    const { entityType, entityId, action, actor, startDate, endDate, search, limit = 50 } = req.query;

    const query = {};
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;
    if (action) query.action = action;
    if (actor) query.actor = actor;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search && String(search).trim()) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { reason: { $regex: search, $options: 'i' } },
      ];
    }

    const logs = await AuditLog.find(query)
      .populate('actor', 'name email role')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get platform treasury summary
 * @route   GET /api/admin/treasury
 * @access  Private/Admin
 */
export const getPlatformTreasury = async (req, res) => {
  try {
    const snapshot = await getCommissionTreasurySnapshot();
    const recentRequests = await Transaction.find({ type: 'commission_withdrawal' })
      .populate('user', 'name email role')
      .populate('processedBy', 'name email role')
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      treasury: {
        ...snapshot,
      },
      requests: recentRequests,
    });
  } catch (error) {
    console.error('Get treasury error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Withdraw platform commission
 * @route   POST /api/admin/treasury/withdraw
 * @access  Private/Admin
 */
export const withdrawPlatformCommission = async (req, res) => {
  try {
    const {
      amount,
      note = '',
      payoutDestination = {},
    } = req.body;

    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
      accountType,
      branchName = '',
      payoutPurpose = '',
      destinationReference = '',
    } = payoutDestination;

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (!accountHolderName || !bankName || !accountNumber || !ifscCode || !accountType) {
      return res.status(400).json({
        message: 'Payout destination is required (accountHolderName, bankName, accountNumber, ifscCode, accountType)',
      });
    }

    if (String(accountNumber).replace(/\s+/g, '').length < 6) {
      return res.status(400).json({ message: 'Invalid account number' });
    }

    const snapshot = await getCommissionTreasurySnapshot();

    if (numericAmount > snapshot.availableToRequest) {
      return res.status(400).json({ message: `Insufficient available commission. Available to request: ₹${snapshot.availableToRequest}` });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      type: 'commission_withdrawal',
      amount: numericAmount,
      status: 'pending',
      description: 'Platform commission withdrawal request',
      balanceBefore: snapshot.availableCommission,
      balanceAfter: Math.max(0, snapshot.availableCommission - numericAmount),
      notes: note,
      metadata: {
        treasuryWithdrawal: true,
        payoutDestination: {
          accountHolderName: String(accountHolderName).trim(),
          bankName: String(bankName).trim(),
          accountNumberMasked: maskAccountNumber(accountNumber),
          accountNumberLast4: String(accountNumber).replace(/\s+/g, '').slice(-4),
          ifscCode: String(ifscCode).trim().toUpperCase(),
          accountType: String(accountType).trim(),
          branchName: String(branchName).trim(),
          payoutPurpose: String(payoutPurpose).trim(),
          destinationReference: String(destinationReference).trim(),
        },
        approval: {
          status: 'pending',
          requestedBy: req.user._id,
          requestedAt: new Date(),
          reviewedBy: null,
          reviewedAt: null,
          reviewNote: '',
          bankReferenceNumber: '',
          bankUtrNumber: '',
        },
      },
    });

    await createAuditLog({
      entityType: 'withdrawal',
      entityId: transaction._id,
      action: 'admin_platform_commission_withdraw_request',
      reason: note || 'Platform commission withdrawal request',
      actor: req.user._id,
      req,
      metadata: {
        amount: numericAmount,
        payoutDestination: transaction.metadata?.payoutDestination,
      },
    });

    const updatedSnapshot = await getCommissionTreasurySnapshot();

    res.status(201).json({
      success: true,
      message: 'Platform commission withdrawal request submitted for approval',
      transaction,
      treasury: {
        ...updatedSnapshot,
      },
    });
  } catch (error) {
    console.error('Withdraw treasury error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Process platform commission withdrawal request
 * @route   PUT /api/admin/treasury/withdraw/:transactionId/process
 * @access  Private/Admin
 */
export const processPlatformCommissionWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const {
      decision,
      reviewNote = '',
      bankReferenceNumber = '',
      bankUtrNumber = '',
    } = req.body;

    if (!['approve', 'reject'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision. Use approve or reject.' });
    }

    const transaction = await Transaction.findById(transactionId);
    if (!transaction || transaction.type !== 'commission_withdrawal') {
      return res.status(404).json({ message: 'Commission withdrawal request not found' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Request is already processed' });
    }

    if (decision === 'approve' && (!String(bankReferenceNumber).trim() || !String(bankUtrNumber).trim())) {
      return res.status(400).json({ message: 'bankReferenceNumber and bankUtrNumber are required for approval' });
    }

    if (decision === 'approve') {
      const snapshot = await getCommissionTreasurySnapshot();
      if (transaction.amount > snapshot.availableCommission) {
        return res.status(400).json({
          message: `Insufficient commission at approval time. Available: ₹${snapshot.availableCommission}`,
        });
      }

      transaction.status = 'completed';
      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      transaction.gatewayTransactionId = String(bankUtrNumber).trim();
      transaction.notes = reviewNote || transaction.notes || 'Approved and paid out';
      transaction.metadata = {
        ...(transaction.metadata || {}),
        approval: {
          ...(transaction.metadata?.approval || {}),
          status: 'approved',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
          reviewNote: String(reviewNote).trim(),
          bankReferenceNumber: String(bankReferenceNumber).trim(),
          bankUtrNumber: String(bankUtrNumber).trim(),
        },
      };
    } else {
      transaction.status = 'failed';
      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      transaction.notes = reviewNote || transaction.notes || 'Rejected';
      transaction.metadata = {
        ...(transaction.metadata || {}),
        approval: {
          ...(transaction.metadata?.approval || {}),
          status: 'rejected',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
          reviewNote: String(reviewNote).trim(),
          bankReferenceNumber: '',
          bankUtrNumber: '',
        },
      };
    }

    await transaction.save();

    await createAuditLog({
      entityType: 'withdrawal',
      entityId: transaction._id,
      action: decision === 'approve' ? 'admin_platform_commission_withdraw_approved' : 'admin_platform_commission_withdraw_rejected',
      reason: reviewNote || `Commission withdrawal ${decision}`,
      actor: req.user._id,
      req,
      metadata: {
        amount: transaction.amount,
        decision,
        bankReferenceNumber: decision === 'approve' ? String(bankReferenceNumber).trim() : '',
        bankUtrNumber: decision === 'approve' ? String(bankUtrNumber).trim() : '',
      },
    });

    const updatedSnapshot = await getCommissionTreasurySnapshot();

    res.status(200).json({
      success: true,
      message: decision === 'approve' ? 'Commission withdrawal approved' : 'Commission withdrawal rejected',
      transaction,
      treasury: updatedSnapshot,
    });
  } catch (error) {
    console.error('Process treasury withdrawal error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get admin platform settings
 * @route   GET /api/admin/settings
 * @access  Private/Admin
 */
export const getAdminSettings = async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = await AdminSettings.create({});
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error('Get admin settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update admin platform settings
 * @route   PUT /api/admin/settings
 * @access  Private/Admin
 */
export const updateAdminSettings = async (req, res) => {
  try {
    const {
      platformFeePercent,
      disputeSlaHours,
      maxWithdrawalPerDay,
      supportEmail,
      supportPhone,
      autoCloseResolvedDisputes,
    } = req.body;

    if (platformFeePercent < 0 || platformFeePercent > 15) {
      return res.status(400).json({ message: 'Platform fee must be between 0 and 15' });
    }

    if (!supportEmail || !String(supportEmail).trim()) {
      return res.status(400).json({ message: 'Support email is required' });
    }

    let settings = await AdminSettings.findOne();
    if (!settings) {
      settings = new AdminSettings();
    }

    settings.platformFeePercent = platformFeePercent;
    settings.disputeSlaHours = disputeSlaHours;
    settings.maxWithdrawalPerDay = maxWithdrawalPerDay;
    settings.supportEmail = supportEmail;
    settings.supportPhone = supportPhone;
    settings.autoCloseResolvedDisputes = !!autoCloseResolvedDisputes;
    settings.updatedBy = req.user._id;

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Admin settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update admin settings error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Block/Unblock user (Admin only)
 * @route   PUT /api/admin/users/:id/block
 * @access  Private/Admin
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isBlocked } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot block admin users' });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error('Toggle user block error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
