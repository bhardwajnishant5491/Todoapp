import Rating from '../models/Rating.js';
import User from '../models/User.js';
import Contract from '../models/Contract.js';

// @desc    Create a new rating
// @route   POST /api/ratings
// @access  Private
export const createRating = async (req, res) => {
  try {
    const { contractId, ratedUserId, rating, review, communication, quality, timeliness } = req.body;
    const ratedBy = req.user.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if contract exists and is completed
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    if (contract.status !== 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed contracts',
      });
    }

    // Check if user is part of this contract
    const isBuyer = contract.buyerId.toString() === ratedBy;
    const isFarmer = contract.farmerId.toString() === ratedBy;

    if (!isBuyer && !isFarmer) {
      return res.status(403).json({
        success: false,
        message: 'You are not part of this contract',
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ contract: contractId, ratedBy });
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this contract',
      });
    }

    // Determine rating type
    const type = isBuyer ? 'buyer-to-farmer' : 'farmer-to-buyer';

    // Create rating
    const newRating = await Rating.create({
      ratedUser: ratedUserId,
      ratedBy,
      contract: contractId,
      crop: contract.cropId,
      rating,
      review,
      communication,
      quality,
      timeliness,
      type,
    });

    // Update user's average rating
    await updateUserRating(ratedUserId);

    // Populate the rating
    const populatedRating = await Rating.findById(newRating._id)
      .populate('ratedBy', 'name profilePic')
      .populate('ratedUser', 'name profilePic');

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: populatedRating,
    });
  } catch (error) {
    console.error('❌ Create rating error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create rating',
    });
  }
};

// @desc    Get ratings for a user
// @route   GET /api/ratings/user/:userId
// @access  Public
export const getUserRatings = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, type } = req.query;

    const query = { ratedUser: userId, status: 'active' };
    if (type) query.type = type;

    const ratings = await Rating.find(query)
      .populate('ratedBy', 'name profilePic role')
      .populate('contract', 'status')
      .populate('crop', 'cropType')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Rating.countDocuments(query);

    res.status(200).json({
      success: true,
      ratings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error('❌ Get user ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ratings',
    });
  }
};

// @desc    Get user rating statistics
// @route   GET /api/ratings/stats/:userId
// @access  Public
export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all ratings for user
    const ratings = await Rating.find({ ratedUser: userId, status: 'active' });

    // Calculate stats
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0 
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings).toFixed(1)
      : 0;

    // Calculate distribution
    const distribution = {
      5: ratings.filter(r => r.rating === 5).length,
      4: ratings.filter(r => r.rating === 4).length,
      3: ratings.filter(r => r.rating === 3).length,
      2: ratings.filter(r => r.rating === 2).length,
      1: ratings.filter(r => r.rating === 1).length,
    };

    // Calculate specific ratings averages
    const communicationRatings = ratings.filter(r => r.communication);
    const qualityRatings = ratings.filter(r => r.quality);
    const timelinessRatings = ratings.filter(r => r.timeliness);

    const avgCommunication = communicationRatings.length > 0
      ? (communicationRatings.reduce((sum, r) => sum + r.communication, 0) / communicationRatings.length).toFixed(1)
      : 0;

    const avgQuality = qualityRatings.length > 0
      ? (qualityRatings.reduce((sum, r) => sum + r.quality, 0) / qualityRatings.length).toFixed(1)
      : 0;

    const avgTimeliness = timelinessRatings.length > 0
      ? (timelinessRatings.reduce((sum, r) => sum + r.timeliness, 0) / timelinessRatings.length).toFixed(1)
      : 0;

    // Get successful transactions count
    const completedContracts = await Contract.countDocuments({
      $or: [{ farmerId: userId }, { buyerId: userId }],
      status: 'Completed',
    });

    res.status(200).json({
      success: true,
      stats: {
        averageRating: parseFloat(averageRating),
        totalRatings,
        distribution,
        avgCommunication: parseFloat(avgCommunication),
        avgQuality: parseFloat(avgQuality),
        avgTimeliness: parseFloat(avgTimeliness),
        completedTransactions: completedContracts,
      },
    });
  } catch (error) {
    console.error('❌ Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user stats',
    });
  }
};

// @desc    Get ratings for a contract
// @route   GET /api/ratings/contract/:contractId
// @access  Private
export const getContractRatings = async (req, res) => {
  try {
    const { contractId } = req.params;

    const ratings = await Rating.find({ contract: contractId })
      .populate('ratedBy', 'name profilePic role')
      .populate('ratedUser', 'name profilePic role');

    res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    console.error('❌ Get contract ratings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract ratings',
    });
  }
};

// @desc    Check if user can rate a contract
// @route   GET /api/ratings/can-rate/:contractId
// @access  Private
export const canRateContract = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user.id;

    // Check if contract exists and is completed
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    if (contract.status !== 'Completed') {
      return res.status(200).json({
        success: true,
        canRate: false,
        reason: 'Contract not yet completed',
      });
    }

    // Check if already rated
    const existingRating = await Rating.findOne({ contract: contractId, ratedBy: userId });
    if (existingRating) {
      return res.status(200).json({
        success: true,
        canRate: false,
        reason: 'Already rated',
        rating: existingRating,
      });
    }

    // Check if user is part of contract
    const isBuyer = contract.buyerId.toString() === userId;
    const isFarmer = contract.farmerId.toString() === userId;

    if (!isBuyer && !isFarmer) {
      return res.status(200).json({
        success: true,
        canRate: false,
        reason: 'Not part of this contract',
      });
    }

    res.status(200).json({
      success: true,
      canRate: true,
      ratedUserId: isBuyer ? contract.farmerId : contract.buyerId,
    });
  } catch (error) {
    console.error('❌ Can rate contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check rating status',
    });
  }
};

// @desc    Add response to a rating
// @route   PUT /api/ratings/:ratingId/response
// @access  Private
export const addRatingResponse = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { response } = req.body;
    const userId = req.user.id;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found',
      });
    }

    // Check if user is the rated person
    if (rating.ratedUser.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only respond to ratings about you',
      });
    }

    // Update response
    rating.response = response;
    rating.respondedAt = new Date();
    await rating.save();

    res.status(200).json({
      success: true,
      message: 'Response added successfully',
      rating,
    });
  } catch (error) {
    console.error('❌ Add rating response error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
    });
  }
};

// Helper function to update user's average rating
const updateUserRating = async (userId) => {
  try {
    const ratings = await Rating.find({ ratedUser: userId, status: 'active' });
    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    await User.findByIdAndUpdate(userId, {
      averageRating: averageRating,
      totalRatings: totalRatings,
    });
  } catch (error) {
    console.error('❌ Update user rating error:', error);
  }
};

export default {
  createRating,
  getUserRatings,
  getUserStats,
  getContractRatings,
  canRateContract,
  addRatingResponse,
};
