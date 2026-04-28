import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['contract', 'dispute', 'withdrawal'],
      required: true,
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      default: '',
      trim: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    actorIp: {
      type: String,
      default: '',
      trim: true,
    },
    actorUserAgent: {
      type: String,
      default: '',
      trim: true,
    },
    actorDeviceType: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet', 'unknown'],
      default: 'unknown',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
