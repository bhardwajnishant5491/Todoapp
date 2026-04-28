import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cropService from '../../services/cropService';
import ratingService from '../../services/ratingService';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import UserRatingDisplay from '../../components/common/UserRatingDisplay';

const CropBrowser = () => {
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('buyer');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [farmerStats, setFarmerStats] = useState({});
  const [filters, setFilters] = useState({
    cropType: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    quality: [],
    location: '',
    state: '',
    sortBy: '',
  });

  const cropTypes = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Barley',
    'Soybean', 'Chickpea', 'Mustard', 'Groundnut', 'Potato',
    'Onion', 'Tomato', 'Other',
  ];

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async (incomingFilters = filters) => {
    try {
      setLoading(true);
      
      // Build filter object with backend-compatible keys only
      const appliedFilters = {};

      if (incomingFilters.cropType) appliedFilters.cropType = incomingFilters.cropType;
      if (incomingFilters.search?.trim()) appliedFilters.search = incomingFilters.search.trim();
      if (incomingFilters.minPrice) appliedFilters.minPrice = incomingFilters.minPrice;
      if (incomingFilters.maxPrice) appliedFilters.maxPrice = incomingFilters.maxPrice;
      if (incomingFilters.state) appliedFilters.state = incomingFilters.state;
      if (incomingFilters.location?.trim()) appliedFilters.location = incomingFilters.location.trim();
      if (incomingFilters.quality?.length > 0) {
        appliedFilters.quality = incomingFilters.quality.join(',');
      }
      if (incomingFilters.sortBy) appliedFilters.sortBy = incomingFilters.sortBy;

      const result = await cropService.getAllCrops(appliedFilters);
      
      if (result.success) {
        setCrops(result.crops);
        // Fetch farmer stats for all farmers
        fetchFarmerStats(result.crops);
      } else {
        toast.error('Failed to load crops');
      }
    } catch (error) {
      console.error('Error fetching crops:', error);
      toast.error('An error occurred while loading crops');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerStats = async (cropsList) => {
    try {
      // Get unique farmer IDs
      const farmerIds = [...new Set(cropsList.map(crop => crop.farmerId?._id).filter(Boolean))];
      
      // Fetch stats for each farmer
      const statsPromises = farmerIds.map(farmerId => 
        ratingService.getUserStats(farmerId).catch(() => null)
      );
      
      const statsResults = await Promise.all(statsPromises);
      
      // Map farmer ID to stats
      const statsMap = {};
      farmerIds.forEach((farmerId, index) => {
        if (statsResults[index]?.success) {
          statsMap[farmerId] = statsResults[index].stats;
        }
      });
      
      setFarmerStats(statsMap);
    } catch (error) {
      console.error('Error fetching farmer stats:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleQualityChange = (quality) => {
    const updatedQuality = filters.quality.includes(quality)
      ? filters.quality.filter(q => q !== quality)
      : [...filters.quality, quality];
    
    setFilters({
      ...filters,
      quality: updatedQuality,
    });
  };

  const applySorting = (cropsToSort) => {
    if (!filters.sortBy) return cropsToSort;

    const sorted = [...cropsToSort];
    switch (filters.sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
      case 'price-high':
        return sorted.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
      case 'quantity-low':
        return sorted.sort((a, b) => a.quantity - b.quantity);
      case 'quantity-high':
        return sorted.sort((a, b) => b.quantity - a.quantity);
      case 'date-new':
        return sorted.sort((a, b) => new Date(b.harvestDate) - new Date(a.harvestDate));
      case 'date-old':
        return sorted.sort((a, b) => new Date(a.harvestDate) - new Date(b.harvestDate));
      default:
        return sorted;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCrops();
  };

  const handleReset = () => {
    const resetFilters = {
      cropType: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      quality: [],
      location: '',
      state: '',
      sortBy: '',
    };

    setFilters(resetFilters);
    fetchCrops(resetFilters);
  };

  // Apply sorting to fetched crops
  const sortedCrops = applySorting(crops);

  return (
    <DashboardLayout>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/buyer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <GiWheat className="text-2xl text-primary-600" />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">Browse Crops</h1>
        </div>
        <p className="text-gray-600 font-inter">Find quality crops from farmers</p>
      </motion.div>
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="card sticky top-4">
              <h3 className="text-lg font-bold mb-4">Filters</h3>
              
              <form onSubmit={handleSearch} className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search crops..."
                    className="input-field"
                  />
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Type
                  </label>
                  <select
                    name="cropType"
                    value={filters.cropType}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    {cropTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quality */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quality
                  </label>
                  <div className="space-y-2">
                    {['Premium', 'Grade A', 'Grade B', 'Standard'].map((quality) => (
                      <label key={quality} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.quality.includes(quality)}
                          onChange={() => handleQualityChange(quality)}
                          className="w-4 h-4 rounded border-gray-300 focus:ring-2"
                          style={{ 
                            accentColor: roleTokens.primaryColor,
                          }}
                        />
                        <span className="text-sm text-gray-700">{quality}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="quantity-low">Quantity: Low to High</option>
                    <option value="quantity-high">Quantity: High to Low</option>
                    <option value="date-new">Harvest Date: Newest First</option>
                    <option value="date-old">Harvest Date: Oldest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range (₹)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="input-field"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="input-field"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    value={filters.state}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All States</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City/District
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter city or district"
                    className="input-field"
                  />
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button type="submit" className="w-full btn-primary">
                    Apply Filters
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Crops Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading crops...</p>
              </div>
            ) : sortedCrops.length === 0 ? (
              <div className="card text-center py-12">
                <h3 className="text-xl font-bold mb-4">No crops found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later for new listings.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-gray-600">
                    Found {sortedCrops.length} crop{sortedCrops.length !== 1 ? 's' : ''}
                  </span>
                  {filters.sortBy && (
                    <span className="text-sm text-gray-500">
                      Sorted by: {filters.sortBy.replace('-', ' ')}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedCrops.map((crop) => (
                    <div key={crop._id} className="card hover:shadow-lg transition-shadow">
                      {/* Crop Image */}
                      <div className="w-full h-48 rounded-xl mb-4 overflow-hidden bg-gray-100">
                        {crop.images && crop.images.length > 0 && crop.images[0] !== 'https://via.placeholder.com/400x300?text=Crop+Image' ? (
                          <img
                            src={crop.images[0]}
                            alt={crop.cropType}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                            <GiWheat className="text-6xl text-primary-300" />
                          </div>
                        )}
                      </div>

                      {/* Quality Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span 
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            crop.status === 'Available' 
                              ? 'bg-green-100 text-green-700' 
                              : crop.status === 'In Contract'
                              ? 'bg-blue-100 text-blue-700'
                              : crop.status === 'Sold'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {crop.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {crop.quality}
                        </span>
                      </div>

                      {/* Crop Details */}
                      <h3 className="text-xl font-bold mb-2">{crop.cropType}</h3>
                      <div className="space-y-2 text-gray-700 mb-4">
                        <p>
                          <span className="font-medium">Quantity:</span> {crop.quantity} {crop.unit}
                        </p>
                        <p>
                          <span className="font-medium">Price:</span> ₹{crop.pricePerUnit}/{crop.unit}
                        </p>
                        <p>
                          <span className="font-medium">Total Value:</span> ₹
                          {(crop.quantity * crop.pricePerUnit).toLocaleString()}
                        </p>
                        <p>
                          <span className="font-medium">Harvest Date:</span>{' '}
                          {new Date(crop.harvestDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          📍 {crop.location.district}, {crop.location.state}
                        </p>
                      </div>

                      {/* Description */}
                      {crop.description && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {crop.description}
                        </p>
                      )}

                      {/* Farmer Info */}
                      <div className="border-t pt-3 mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Farmer:</span> {crop.farmerId?.name || 'N/A'}
                        </p>
                        {farmerStats[crop.farmerId?._id] && (
                          <div className="mb-2">
                            <UserRatingDisplay 
                              stats={farmerStats[crop.farmerId._id]} 
                              size="small"
                            />
                          </div>
                        )}
                        {crop.farmerId?.farmSize && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Farm Size:</span> {crop.farmerId.farmSize} acres
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <button
                        onClick={() => navigate(`/buyer/crop/${crop._id}`)}
                        className={`w-full ${
                          crop.status === 'Available' 
                            ? 'btn-primary' 
                            : 'bg-gray-400 text-white py-2 px-4 rounded-lg cursor-not-allowed'
                        }`}
                      >
                        {crop.status === 'Available' 
                          ? 'View Details & Send Proposal' 
                          : `View Details (${crop.status})`
                        }
                      </button>

                      {/* Posted Date */}
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        Posted {new Date(crop.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
    </DashboardLayout>
  );
};

export default CropBrowser;
