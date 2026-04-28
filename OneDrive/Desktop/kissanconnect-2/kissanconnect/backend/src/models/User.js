import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'admin'],
      default: 'farmer',
      required: [true, 'Please select a role'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide your phone number'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number'],
    },
    address: {
      village: String,
      district: String,
      state: String,
      pincode: String,
    },
    profilePic: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/default-avatar.png',
    },
    profilePicPublicId: {
      type: String,
      default: '',
    },
    // Farmer specific fields
    farmSize: {
      type: Number, // in acres
      required: function () {
        return this.role === 'farmer';
      },
    },
    // Buyer specific fields
    companyName: {
      type: String,
      required: function () {
        return this.role === 'buyer';
      },
    },
    gstNumber: {
      type: String,
      required: function () {
        return this.role === 'buyer';
      },
    },
    // Bank details (for farmers - payment receiving)
    bankDetails: {
      accountHolderName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        uppercase: true,
        trim: true,
      },
      bankName: {
        type: String,
        trim: true,
      },
      branchName: {
        type: String,
        trim: true,
      },
      accountType: {
        type: String,
        enum: ['Savings', 'Current'],
      },
      upiId: {
        type: String,
        lowercase: true,
        trim: true,
      },
      panNumber: {
        type: String,
        uppercase: true,
        trim: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    // Wallet (virtual balance - calculated from transactions)
    wallet: {
      balance: {
        type: Number,
        default: 0,
        min: [0, 'Wallet balance cannot be negative'],
      },
      lockedAmount: {
        type: Number,
        default: 0,
        min: [0, 'Locked amount cannot be negative'],
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    // Account status
    isActive: {
      type: Boolean,
      default: true,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    // Legal Acceptance
    legalAcceptance: {
      termsAccepted: {
        type: Boolean,
        default: false,
        required: true,
      },
      termsAcceptedAt: {
        type: Date,
      },
      privacyAccepted: {
        type: Boolean,
        default: false,
        required: true,
      },
      privacyAcceptedAt: {
        type: Date,
      },
      ipAddress: {
        type: String,
      },
    },
    // Ratings
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Wallet methods
userSchema.methods.getAvailableBalance = function () {
  return this.wallet.balance - this.wallet.lockedAmount;
};

userSchema.methods.canWithdraw = function (amount) {
  return this.getAvailableBalance() >= amount && amount >= 100; // Min ₹100
};

userSchema.methods.lockFunds = function (amount) {
  if (this.getAvailableBalance() < amount) {
    throw new Error('Insufficient available balance');
  }
  this.wallet.lockedAmount += amount;
  this.wallet.lastUpdated = new Date();
};

userSchema.methods.unlockFunds = function (amount) {
  if (this.wallet.lockedAmount < amount) {
    throw new Error('Cannot unlock more than locked amount');
  }
  this.wallet.lockedAmount -= amount;
  this.wallet.lastUpdated = new Date();
};

userSchema.methods.addToWallet = function (amount) {
  this.wallet.balance += amount;
  this.wallet.lastUpdated = new Date();
};

userSchema.methods.deductFromWallet = function (amount) {
  if (this.wallet.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  this.wallet.balance -= amount;
  this.wallet.lastUpdated = new Date();
};

const User = mongoose.model('User', userSchema);

export default User;
