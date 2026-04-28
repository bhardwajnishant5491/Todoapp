import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be null for anonymous support tickets
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      enum: ['technical', 'payment', 'account', 'contract', 'general'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
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
    responses: [
      {
        respondedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
          maxlength: 2000,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    resolvedAt: {
      type: Date,
    },
    closedAt: {
      type: Date,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Generate ticket ID automatically
supportSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    // Generate ticket ID: SUPP-YYYYMMDD-XXX
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Find the last ticket of today
    const lastTicket = await this.constructor.findOne({
      ticketId: new RegExp(`^SUPP-${dateStr}-`)
    }).sort({ ticketId: -1 });

    let counter = 1;
    if (lastTicket) {
      const lastCounter = parseInt(lastTicket.ticketId.split('-')[2]);
      counter = lastCounter + 1;
    }

    this.ticketId = `SUPP-${dateStr}-${counter.toString().padStart(3, '0')}`;
  }
  next();
});

// Update lastActivityAt when responses are added
supportSchema.pre('save', function (next) {
  if (this.isModified('responses')) {
    this.lastActivityAt = new Date();
  }
  next();
});

// Indexes
supportSchema.index({ userId: 1 });
supportSchema.index({ email: 1 });
supportSchema.index({ status: 1 });
supportSchema.index({ category: 1 });
supportSchema.index({ assignedTo: 1 });
supportSchema.index({ createdAt: -1 });
supportSchema.index({ lastActivityAt: -1 });

const Support = mongoose.model('Support', supportSchema);

export default Support;
