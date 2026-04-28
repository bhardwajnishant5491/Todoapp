import mongoose from 'mongoose';

const adminSettingsSchema = new mongoose.Schema(
  {
    platformFeePercent: {
      type: Number,
      default: 2,
      min: 0,
      max: 15,
    },
    disputeSlaHours: {
      type: Number,
      default: 48,
      min: 1,
      max: 720,
    },
    maxWithdrawalPerDay: {
      type: Number,
      default: 500000,
      min: 1000,
    },
    supportEmail: {
      type: String,
      default: 'support@kissanconnect.com',
      trim: true,
      lowercase: true,
    },
    supportPhone: {
      type: String,
      default: '+91-90000-00000',
      trim: true,
    },
    autoCloseResolvedDisputes: {
      type: Boolean,
      default: false,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);

export default AdminSettings;
