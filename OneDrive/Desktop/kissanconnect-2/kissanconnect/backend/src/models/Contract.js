import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema(
  {
    // Crop reference
    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
      required: [true, 'Crop reference is required'],
    },
    
    // Parties involved
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Farmer reference is required'],
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Buyer reference is required'],
    },
    
    // Contract details
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    
    // Delivery details
    deliveryDate: {
      type: Date,
      required: [true, 'Delivery date is required'],
    },
    deliveryAddress: {
      address: String,
      city: String,
      state: String,
      pincode: String,
    },
    
    // Terms and conditions
    terms: {
      type: String,
      maxlength: [1000, 'Terms cannot exceed 1000 characters'],
    },
    paymentTerms: {
      type: String,
      enum: ['Escrow Payment (100% Secured)', 'Full Advance', '50% Advance', 'On Delivery', 'Net 30', 'Net 60'],
      default: 'Escrow Payment (100% Secured)',
    },
    
    // Contract status
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'In Progress', 'Delivered', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    
    // Messages and notes
    buyerNotes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    farmerNotes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
    },
    
    // Timestamps for status changes
    acceptedAt: Date,
    rejectedAt: Date,
    inProgressAt: Date,
    deliveredAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    
    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Partial', 'Completed'],
      default: 'Pending',
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    escrowTransactionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    
    // Ratings (after completion)
    farmerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    buyerRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    farmerReview: String,
    buyerReview: String,
    
    // SHA-256 Security Features (Digital Signature)
    contractHash: {
      type: String,
      default: null,
      index: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
    hashGeneratedAt: {
      type: Date,
      default: null,
    },

    // Admin intervention state
    interventionState: {
      isFlagged: {
        type: Boolean,
        default: false,
      },
      isOnHold: {
        type: Boolean,
        default: false,
      },
      lastAction: {
        type: String,
        enum: ['none', 'flag', 'unflag', 'hold', 'unhold', 'force_close'],
        default: 'none',
      },
      lastReason: {
        type: String,
        default: '',
      },
      lastActionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      lastActionAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
contractSchema.index({ farmerId: 1, status: 1 });
contractSchema.index({ buyerId: 1, status: 1 });
contractSchema.index({ cropId: 1 });
contractSchema.index({ status: 1 });
contractSchema.index({ createdAt: -1 });

// Calculate total amount before saving
contractSchema.pre('save', function (next) {
  if (this.isModified('quantity') || this.isModified('pricePerUnit')) {
    this.totalAmount = this.quantity * this.pricePerUnit;
  }
  next();
});

// Methods
contractSchema.methods.accept = function () {
  this.status = 'Accepted';
  this.acceptedAt = new Date();
  return this.save();
};

contractSchema.methods.reject = function (reason) {
  this.status = 'Rejected';
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  return this.save();
};

contractSchema.methods.complete = function () {
  this.status = 'Completed';
  this.completedAt = new Date();
  return this.save();
};

contractSchema.methods.cancel = function () {
  this.status = 'Cancelled';
  this.cancelledAt = new Date();
  return this.save();
};

const Contract = mongoose.model('Contract', contractSchema);

export default Contract;
