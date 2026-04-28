import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { emitNotification } from '../utils/socketUtils.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { sendWithdrawalApprovedEmail, sendWithdrawalRejectedEmail } from '../utils/emailService.js';

/**
 * @desc    Get wallet info for authenticated user
 * @route   GET /api/wallet
 * @access  Private
 */
export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('wallet bankDetails');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const availableBalance = user.getAvailableBalance();
    
    res.status(200).json({
      success: true,
      wallet: {
        balance: user.wallet.balance,
        lockedAmount: user.wallet.lockedAmount,
        availableBalance,
        lastUpdated: user.wallet.lastUpdated,
        canWithdraw: user.bankDetails?.isVerified && availableBalance >= 100,
      },
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Add funds to wallet (Demo Payment Gateway)
 * @route   POST /api/wallet/deposit
 * @access  Private
 */
export const depositFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (amount < 10) {
      return res.status(400).json({ message: 'Minimum deposit amount is ₹10' });
    }

    if (amount > 100000) {
      return res.status(400).json({ message: 'Maximum deposit amount is ₹1,00,000' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Demo Payment Gateway - Simulate payment success
    const gatewayTransactionId = `DEMO${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Create transaction record
    const transaction = new Transaction({
      user: user._id,
      type: 'deposit',
      amount,
      status: 'completed',
      description: `Wallet deposit of ₹${amount}`,
      paymentGateway: 'demo',
      gatewayTransactionId,
      gatewayResponse: {
        status: 'success',
        message: 'Payment processed successfully (Demo)',
        timestamp: new Date(),
      },
      balanceBefore: user.wallet.balance,
      balanceAfter: user.wallet.balance + amount,
      processedAt: new Date(),
    });

    // Add to wallet
    user.addToWallet(amount);
    
    // Save both
    await Promise.all([user.save(), transaction.save()]);

    // Emit real-time notification
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      
      if (io && connectedUsers) {
        emitNotification(io, connectedUsers, user._id.toString(), {
          type: 'success',
          title: 'Deposit Successful',
          message: `₹${amount} has been added to your wallet`,
          timestamp: new Date(),
        });
      }
    } catch (socketError) {
      console.error('Socket notification error:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Deposit successful',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        transactionId: gatewayTransactionId,
        timestamp: transaction.createdAt,
      },
      wallet: {
        balance: user.wallet.balance,
        availableBalance: user.getAvailableBalance(),
      },
    });
  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Request withdrawal from wallet
 * @route   POST /api/wallet/withdraw
 * @access  Private
 */
export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    if (amount < 100) {
      return res.status(400).json({ message: 'Minimum withdrawal amount is ₹100' });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if bank details are verified
    if (!user.bankDetails || !user.bankDetails.isVerified) {
      return res.status(400).json({ 
        message: 'Bank details not verified. Please add and verify your bank details first.' 
      });
    }

    // Check if user can withdraw
    if (!user.canWithdraw(amount)) {
      return res.status(400).json({ 
        message: `Insufficient available balance. Available: ₹${user.getAvailableBalance()}` 
      });
    }

    // Create withdrawal transaction (pending status)
    const transaction = new Transaction({
      user: user._id,
      type: 'withdrawal',
      amount,
      status: 'pending',
      description: `Withdrawal request for ₹${amount}`,
      balanceBefore: user.wallet.balance,
      balanceAfter: user.wallet.balance - amount,
      metadata: {
        bankDetails: {
          accountHolderName: user.bankDetails.accountHolderName,
          accountNumber: 'XXXX' + user.bankDetails.accountNumber.slice(-4),
          ifscCode: user.bankDetails.ifscCode,
          bankName: user.bankDetails.bankName,
        },
      },
      notes: 'Pending admin approval',
    });

    // Lock funds for withdrawal
    user.lockFunds(amount);

    // Save both
    await Promise.all([user.save(), transaction.save()]);

    // Emit real-time notification
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      
      if (io && connectedUsers) {
        emitNotification(io, connectedUsers, user._id.toString(), {
          type: 'info',
          title: 'Withdrawal Requested',
          message: `Your withdrawal request of ₹${amount} is pending approval`,
          timestamp: new Date(),
        });
      }
    } catch (socketError) {
      console.error('Socket notification error:', socketError);
    }

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully. Processing usually takes 1-2 business days.',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        timestamp: transaction.createdAt,
      },
      wallet: {
        balance: user.wallet.balance,
        lockedAmount: user.wallet.lockedAmount,
        availableBalance: user.getAvailableBalance(),
      },
    });
  } catch (error) {
    console.error('Withdrawal request error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * @desc    Get transaction history
 * @route   GET /api/wallet/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      type = null, 
      status = null,
      startDate = null,
      endDate = null,
    } = req.query;

    const skip = (page - 1) * limit;

    const transactions = await Transaction.getUserTransactions(req.user._id, {
      limit: parseInt(limit),
      skip: parseInt(skip),
      type,
      status,
      startDate,
      endDate,
    });

    const totalCount = await Transaction.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalTransactions: totalCount,
        hasMore: skip + transactions.length < totalCount,
      },
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Process withdrawal (Admin only)
 * @route   PUT /api/wallet/withdraw/:transactionId/process
 * @access  Private/Admin
 */
export const processWithdrawal = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { status, notes } = req.body; // status: 'completed' or 'failed'

    if (!['completed', 'failed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be completed or failed' });
    }

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({ message: 'Not a withdrawal transaction' });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({ message: 'Transaction already processed' });
    }

    const user = await User.findById(transaction.user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (status === 'completed') {
      user.deductFromWallet(transaction.amount);
      user.unlockFunds(transaction.amount);
      transaction.status = 'completed';
      transaction.notes = notes || 'Withdrawal processed successfully';
      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      transaction.gatewayTransactionId = `WTH${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try { await sendWithdrawalApprovedEmail(user, transaction.amount); } catch (e) { console.error('Email error:', e.message); }
      try {
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');
        if (io && connectedUsers) {
          emitNotification(io, connectedUsers, user._id.toString(), {
            type: 'success', title: 'Withdrawal Completed',
            message: `₹${transaction.amount} has been transferred to your bank account`,
            timestamp: new Date(),
          });
        }
      } catch (socketError) { console.error('Socket notification error:', socketError); }
    } else {
      user.unlockFunds(transaction.amount);
      transaction.status = 'failed';
      transaction.notes = notes || 'Withdrawal failed';
      transaction.processedBy = req.user._id;
      transaction.processedAt = new Date();
      try { await sendWithdrawalRejectedEmail(user, transaction.amount, notes); } catch (e) { console.error('Email error:', e.message); }
      try {
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');
        if (io && connectedUsers) {
          emitNotification(io, connectedUsers, user._id.toString(), {
            type: 'error', title: 'Withdrawal Failed',
            message: `Your withdrawal of ₹${transaction.amount} failed: ${notes}`,
            timestamp: new Date(),
          });
        }
      } catch (socketError) { console.error('Socket notification error:', socketError); }
    }

    await Promise.all([user.save(), transaction.save()]);

    await createAuditLog({
      entityType: 'withdrawal',
      entityId: transaction._id,
      action: status === 'completed' ? 'admin_withdrawal_approved' : 'admin_withdrawal_rejected',
      reason: notes || '',
      actor: req.user._id,
      req,
      metadata: { status, amount: transaction.amount, userId: user._id },
    });

    res.status(200).json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      transaction,
    });
  } catch (error) {
    console.error('Process withdrawal error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

/**
 * @desc    Get wallet statistics
 * @route   GET /api/wallet/stats
 * @access  Private
 */
export const getWalletStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all completed transactions
    const transactions = await Transaction.find({ 
      user: userId, 
      status: 'completed' 
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalEarnings = 0;
    let totalSpending = 0;
    let totalCommission = 0;

    transactions.forEach(tx => {
      if (tx.type === 'deposit') {
        totalDeposits += tx.amount;
      } else if (tx.type === 'withdrawal') {
        totalWithdrawals += tx.amount;
      } else if (['contract_payment', 'refund'].includes(tx.type)) {
        totalEarnings += tx.amount;
      } else if (tx.type === 'contract_advance') {
        totalSpending += tx.amount;
      } else if (tx.type === 'commission') {
        totalCommission += tx.amount;
      }
    });

    const user = await User.findById(userId).select('wallet');

    res.status(200).json({
      success: true,
      stats: {
        currentBalance: user.wallet.balance,
        lockedAmount: user.wallet.lockedAmount,
        availableBalance: user.getAvailableBalance(),
        totalDeposits,
        totalWithdrawals,
        totalEarnings,
        totalSpending,
        totalCommission,
        transactionCount: transactions.length,
      },
    });
  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
