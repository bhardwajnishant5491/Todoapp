import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    // Who is being rated
    ratedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Who gave the rating
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Related contract
    contract: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Contract',
      required: true,
    },
    // Related crop
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop',
    },
    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    // Review text
    review: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    // Specific ratings
    communication: {
      type: Number,
      min: 1,
      max: 5,
    },
    quality: {
      type: Number,
      min: 1,
      max: 5,
    },
    timeliness: {
      type: Number,
      min: 1,
      max: 5,
    },
    // Rating type
    type: {
      type: String,
      enum: ['buyer-to-farmer', 'farmer-to-buyer'],
      required: true,
    },
    // Response from rated user
    response: {
      type: String,
      maxlength: 300,
      trim: true,
    },
    respondedAt: {
      type: Date,
    },
    // Helpful votes
    helpfulCount: {
      type: Number,
      default: 0,
    },
    // Status
    status: {
      type: String,
      enum: ['active', 'hidden', 'flagged'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ratingSchema.index({ ratedUser: 1, createdAt: -1 });
ratingSchema.index({ ratedBy: 1 });
ratingSchema.index({ contract: 1 });
ratingSchema.index({ rating: 1 });

// Prevent duplicate ratings for same contract
ratingSchema.index({ contract: 1, ratedBy: 1 }, { unique: true });

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
