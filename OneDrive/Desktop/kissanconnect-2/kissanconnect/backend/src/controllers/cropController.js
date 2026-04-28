import Crop from '../models/Crop.js';
import { emitNewCrop } from '../utils/socketUtils.js';

// @desc    Create new crop listing
// @route   POST /api/crops
// @access  Private (Farmer only)
export const createCrop = async (req, res) => {
  try {
    const {
      cropType,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      quality,
      description,
      location,
      images,
    } = req.body;

    // Create crop with farmer info
    const crop = await Crop.create({
      cropType,
      quantity,
      unit,
      pricePerUnit,
      harvestDate,
      quality,
      description,
      location,
      images,
      farmerId: req.user._id,
      farmerName: req.user.name,
      farmerPhone: req.user.phone,
    });

    // Emit real-time event for new crop listing
    try {
      const io = req.app.get('io');
      if (io) {
        emitNewCrop(io, crop);
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
      // Don't fail the request if socket fails
    }

    res.status(201).json({
      success: true,
      message: 'Crop listed successfully',
      crop,
    });
  } catch (error) {
    console.error('❌ Create crop error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create crop listing',
    });
  }
};

// @desc    Get all crops with filtering and pagination
// @route   GET /api/crops
// @access  Public
export const getAllCrops = async (req, res) => {
  try {
    const {
      cropType,
      search,
      quality,
      minPrice,
      maxPrice,
      state,
      district,
      location,
      status,
      sortBy,
      page = 1,
      limit = 12,
      sort = '-createdAt',
    } = req.query;

    // Build filter query
    const filter = { isActive: true };

    if (cropType && cropType !== 'All') {
      filter.cropType = cropType;
    }

    if (quality) {
      const qualityValues = Array.isArray(quality)
        ? quality
        : String(quality)
            .split(',')
            .map((q) => q.trim())
            .filter(Boolean);

      if (qualityValues.length === 1) {
        filter.quality = qualityValues[0];
      } else if (qualityValues.length > 1) {
        filter.quality = { $in: qualityValues };
      }
    }

    if (minPrice || maxPrice) {
      filter.pricePerUnit = {};
      if (minPrice) filter.pricePerUnit.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerUnit.$lte = Number(maxPrice);
    }

    if (state) {
      filter['location.state'] = state;
    }

    const districtFilter = district || location;
    if (districtFilter) {
      filter['location.district'] = { $regex: districtFilter, $options: 'i' };
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filter.$or = [
        { cropType: searchRegex },
        { description: searchRegex },
        { 'location.village': searchRegex },
        { 'location.district': searchRegex },
        { 'location.state': searchRegex },
      ];
    }

    // Keep backwards compatibility with explicit sort, else honor UI sortBy values.
    let sortField = sort;
    if ((!sort || sort === '-createdAt') && sortBy) {
      const sortMap = {
        'price-low': 'pricePerUnit',
        'price-high': '-pricePerUnit',
        'quantity-low': 'quantity',
        'quantity-high': '-quantity',
        'date-new': '-harvestDate',
        'date-old': 'harvestDate',
      };
      sortField = sortMap[sortBy] || sort;
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const crops = await Crop.find(filter)
      .sort(sortField)
      .limit(limitNum)
      .skip(skip)
      .populate('farmerId', 'name phone averageRating');

    // Get total count for pagination
    const total = await Crop.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: crops.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      crops,
    });
  } catch (error) {
    console.error('❌ Get crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crops',
    });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
// @access  Public
export const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate(
      'farmerId',
      'name phone email address averageRating totalRatings'
    );

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    // Increment views
    crop.views += 1;
    await crop.save();

    res.status(200).json({
      success: true,
      crop,
    });
  } catch (error) {
    console.error('❌ Get crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch crop',
    });
  }
};

// @desc    Get farmer's crops
// @route   GET /api/crops/my/listings
// @access  Private (Farmer only)
export const getFarmerCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user._id }).sort(
      '-createdAt'
    );

    res.status(200).json({
      success: true,
      count: crops.length,
      crops,
    });
  } catch (error) {
    console.error('❌ Get farmer crops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your crops',
    });
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private (Farmer - own crops only)
export const updateCrop = async (req, res) => {
  try {
    let crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    // Check if user owns the crop
    if (crop.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this crop',
      });
    }

    // Don't allow updating if crop is in contract
    if (crop.status === 'In Contract' || crop.status === 'Sold') {
      return res.status(400).json({
        success: false,
        message: `Cannot update crop that is ${crop.status}`,
      });
    }

    crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      crop,
    });
  } catch (error) {
    console.error('❌ Update crop error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update crop',
    });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private (Farmer - own crops only)
export const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);

    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    // Check if user owns the crop
    if (crop.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this crop',
      });
    }

    // Don't allow deleting if crop is in contract
    if (crop.status === 'In Contract' || crop.status === 'Sold') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete crop that is ${crop.status}`,
      });
    }

    // Soft delete - just mark as inactive
    crop.isActive = false;
    await crop.save();

    res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    console.error('❌ Delete crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete crop',
    });
  }
};

// @desc    Get crop statistics for farmer dashboard
// @route   GET /api/crops/stats/farmer
// @access  Private (Farmer only)
export const getFarmerStats = async (req, res) => {
  try {
    const totalCrops = await Crop.countDocuments({
      farmerId: req.user._id,
      isActive: true,
    });

    const availableCrops = await Crop.countDocuments({
      farmerId: req.user._id,
      status: 'Available',
      isActive: true,
    });

    const inContractCrops = await Crop.countDocuments({
      farmerId: req.user._id,
      status: 'In Contract',
      isActive: true,
    });

    const soldCrops = await Crop.countDocuments({
      farmerId: req.user._id,
      status: 'Sold',
    });

    // Calculate total value of available crops
    const crops = await Crop.find({
      farmerId: req.user._id,
      status: 'Available',
      isActive: true,
    });

    const totalValue = crops.reduce((sum, crop) => sum + crop.totalValue, 0);

    res.status(200).json({
      success: true,
      stats: {
        totalCrops,
        availableCrops,
        inContractCrops,
        soldCrops,
        totalValue,
      },
    });
  } catch (error) {
    console.error('❌ Get farmer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};
