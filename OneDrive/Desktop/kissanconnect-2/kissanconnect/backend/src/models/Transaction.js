import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'contract_payment', 'contract_advance', 'refund', 'commission', 'commission_withdrawal', 'penalty'],
      required: [true, 'Transaction type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Reference to related entities
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
    },
    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Payment gateway details
    paymentGateway: {
      type: String,
      enum: ['demo', 'razorpay', 'stripe', 'paytm'],
      default: 'demo',
    },
    gatewayTransactionId: {
      type: String,
      trim: true,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
    // Balance tracking
    balanceBefore: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    notes: {
      type: String,
      trim: true,
    },
    // Admin actions
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ contract: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ type: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function () {
  return `₹${this.amount.toLocaleString('en-IN')}`;
});

// Instance method to complete transaction
transactionSchema.methods.markCompleted = async function (processedBy = null) {
  this.status = 'completed';
  this.processedAt = new Date();
  if (processedBy) {
    this.processedBy = processedBy;
  }
  return await this.save();
};

// Instance method to fail transaction
transactionSchema.methods.markFailed = async function (reason = '') {
  this.status = 'failed';
  this.notes = reason;
  this.processedAt = new Date();
  return await this.save();
};

// Static method to get user transactions
transactionSchema.statics.getUserTransactions = async function (userId, options = {}) {
  const {
    limit = 50,
    skip = 0,
    type = null,
    status = null,
    startDate = null,
    endDate = null,
  } = options;

  const query = { user: userId };

  if (type) query.type = type;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('contract', 'contractId quantity pricePerUnit')
    .populate('relatedUser', 'name email role')
    .populate('processedBy', 'name email');
};

// Static method to calculate user balance
transactionSchema.statics.calculateUserBalance = async function (userId) {
  const transactions = await this.find({ 
    user: userId, 
    status: 'completed' 
  });

  let balance = 0;
  transactions.forEach(tx => {
    if (['deposit', 'contract_payment', 'refund'].includes(tx.type)) {
      balance += tx.amount;
    } else if (['withdrawal', 'contract_advance', 'commission', 'commission_withdrawal', 'penalty'].includes(tx.type)) {
      balance -= tx.amount;
    }
  });

  return balance;
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
