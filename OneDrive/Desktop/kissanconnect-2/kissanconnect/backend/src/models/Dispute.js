import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema(
  {
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    against: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['quality', 'quantity', 'delivery', 'payment', 'other'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    evidence: [
      {
        type: {
          type: String,
          enum: ['image', 'document', 'video'],
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ['open', 'investigating', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolution: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    resolvedAt: {
      type: Date,
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 1000,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isInternal: {
          type: Boolean,
          default: false, // Internal notes only visible to admins
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
disputeSchema.index({ contractId: 1 });
disputeSchema.index({ raisedBy: 1 });
disputeSchema.index({ against: 1 });
disputeSchema.index({ status: 1 });
disputeSchema.index({ assignedTo: 1 });
disputeSchema.index({ createdAt: -1 });

// Virtual to get contract details
disputeSchema.virtual('contract', {
  ref: 'Contract',
  localField: 'contractId',
  foreignField: '_id',
  justOne: true,
});

// Virtual to get user who raised dispute
disputeSchema.virtual('raiser', {
  ref: 'User',
  localField: 'raisedBy',
  foreignField: '_id',
  justOne: true,
});

// Virtual to get user against whom dispute is raised
disputeSchema.virtual('defendant', {
  ref: 'User',
  localField: 'against',
  foreignField: '_id',
  justOne: true,
});

// Virtual to get assigned admin
disputeSchema.virtual('assignedAdmin', {
  ref: 'User',
  localField: 'assignedTo',
  foreignField: '_id',
  justOne: true,
});

// Enable virtuals in JSON
disputeSchema.set('toJSON', { virtuals: true });
disputeSchema.set('toObject', { virtuals: true });

const Dispute = mongoose.model('Dispute', disputeSchema);

export default Dispute;
