import mongoose from 'mongoose';

const cropSchema = new mongoose.Schema(
  {
    cropType: {
      type: String,
      required: [true, 'Please specify crop type'],
      enum: [
        'Wheat',
        'Rice',
        'Cotton',
        'Sugarcane',
        'Maize',
        'Barley',
        'Soybean',
        'Chickpea',
        'Mustard',
        'Groundnut',
        'Potato',
        'Onion',
        'Tomato',
        'Other',
      ],
    },
    quantity: {
      type: Number,
      required: [true, 'Please specify quantity'],
      min: [1, 'Quantity must be at least 1'],
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'bag'],
      default: 'quintal',
      required: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Please specify price per unit'],
      min: [0, 'Price cannot be negative'],
    },
    harvestDate: {
      type: Date,
      required: [true, 'Please specify harvest date'],
    },
    quality: {
      type: String,
      enum: ['Premium', 'Grade A', 'Grade B', 'Standard'],
      default: 'Standard',
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    location: {
      village: {
        type: String,
        required: [true, 'Please specify village'],
      },
      district: {
        type: String,
        required: [true, 'Please specify district'],
      },
      state: {
        type: String,
        required: [true, 'Please specify state'],
      },
      pincode: String,
    },
    images: [
      {
        type: String,
      },
    ],
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerPhone: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Available', 'In Contract', 'Sold', 'Unavailable'],
      default: 'Available',
    },
    views: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
cropSchema.index({ farmerId: 1 });
cropSchema.index({ cropType: 1 });
cropSchema.index({ status: 1 });
cropSchema.index({ 'location.state': 1 });
cropSchema.index({ pricePerUnit: 1 });
cropSchema.index({ harvestDate: 1 });

// Virtual for total value
cropSchema.virtual('totalValue').get(function () {
  return this.quantity * this.pricePerUnit;
});

// Ensure virtuals are included in JSON
cropSchema.set('toJSON', { virtuals: true });
cropSchema.set('toObject', { virtuals: true });

const Crop = mongoose.model('Crop', cropSchema);

export default Crop;
