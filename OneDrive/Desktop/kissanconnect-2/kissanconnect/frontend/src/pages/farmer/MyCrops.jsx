import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cropService from '../../services/cropService';
import { toast } from 'react-toastify';
import { FiPlus, FiArrowLeft, FiEdit, FiTrash2, FiDownload } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { exportCropsToCSV } from '../../utils/exportUtils';

const MyCrops = () => {
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('farmer');
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, Available, In Contract, Sold

  useEffect(() => {
    fetchMyCrops();
  }, []);

  const fetchMyCrops = async () => {
    try {
      setLoading(true);
      const result = await cropService.getFarmerCrops();
      
      if (result.success) {
        setCrops(result.crops);
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crop listing?')) {
      return;
    }

    try {
      const result = await cropService.deleteCrop(id);
      
      if (result.success) {
        toast.success('Crop deleted successfully');
        setCrops(crops.filter((crop) => crop._id !== id));
      } else {
        toast.error(result.message || 'Failed to delete crop');
      }
    } catch (error) {
      console.error('Error deleting crop:', error);
      toast.error('An error occurred while deleting crop');
    }
  };

  const handleExport = () => {
    if (filteredCrops.length === 0) {
      toast.error('No crops to export');
      return;
    }
    
    try {
      exportCropsToCSV(filteredCrops);
      toast.success(`Exported ${filteredCrops.length} crop(s) to CSV`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export crops');
    }
  };

  const filteredCrops = filter === 'all' 
    ? crops 
    : crops.filter((crop) => crop.status === filter);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => navigate('/farmer/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-3 transition-colors"
            >
              <FiArrowLeft /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-poppins font-bold text-gray-900">My Crops</h1>
            <p className="text-gray-600 font-inter mt-1">Manage all your listed crops</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={crops.length === 0}
              className="px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: roleTokens.radius.card }}
            >
              <FiDownload /> Export CSV
            </button>
            <button
              onClick={() => navigate('/farmer/add-crop')}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors flex items-center gap-2 font-medium"
              style={{ borderRadius: roleTokens.radius.card }}
            >
              <FiPlus /> Add New Crop
            </button>
          </div>
        </div>
      </motion.div>
      {/* Filters */}
      <motion.div
        className="mb-6 flex flex-wrap gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <button
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-xl font-medium transition-all ${
            filter === 'all'
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ borderRadius: roleTokens.radius.card }}
        >
          All ({crops.length})
        </button>
        <button
          onClick={() => setFilter('Available')}
          className={`px-5 py-2 rounded-xl font-medium transition-all ${
            filter === 'Available'
              ? 'bg-green-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ borderRadius: roleTokens.radius.card }}
        >
          Available ({crops.filter((c) => c.status === 'Available').length})
        </button>
        <button
          onClick={() => setFilter('In Contract')}
          className={`px-5 py-2 rounded-xl font-medium transition-all ${
            filter === 'In Contract'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ borderRadius: roleTokens.radius.card }}
        >
          In Contract ({crops.filter((c) => c.status === 'In Contract').length})
        </button>
        <button
          onClick={() => setFilter('Sold')}
          className={`px-5 py-2 rounded-xl font-medium transition-all ${
            filter === 'Sold'
              ? 'bg-gray-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={{ borderRadius: roleTokens.radius.card }}
        >
          Sold ({crops.filter((c) => c.status === 'Sold').length})
        </button>
      </motion.div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading your crops...</p>
        </div>
      ) : filteredCrops.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl p-12 text-center"
          style={{ borderRadius: roleTokens.radius.card, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <GiWheat className="text-4xl text-primary-600" />
          </div>
          <h3 className="text-xl font-poppins font-bold mb-2">No crops found</h3>
          <p className="text-gray-600 font-inter mb-6">
            {filter === 'all'
              ? "You haven't listed any crops yet."
              : `No crops with status "${filter}"`}
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/farmer/add-crop')}
              className="px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors inline-flex items-center gap-2 font-medium"
              style={{ borderRadius: roleTokens.radius.card }}
            >
              <FiPlus /> List Your First Crop
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredCrops.map((crop, index) => (
            <motion.div
              key={crop._id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all"
              style={{ borderRadius: roleTokens.radius.card, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              whileHover={{ y: -4 }}
            >
                {/* Crop Image */}
                <div 
                  className="w-full h-48 rounded-xl mb-4 overflow-hidden bg-gray-100"
                  style={{ borderRadius: roleTokens.radius.card }}
                >
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

                {/* Status Badge */}
                <div className="flex justify-between items-start mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      crop.status === 'Available'
                        ? 'bg-green-100 text-green-700'
                        : crop.status === 'In Contract'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
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

              {/* Action Buttons */}
              <motion.div 
                className="flex gap-3 mt-6 pt-4 border-t border-gray-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={() => navigate(`/farmer/edit-crop/${crop._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  style={{ borderRadius: roleTokens.radius.card }}
                >
                  <FiEdit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(crop._id)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-600 font-semibold rounded-2xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  style={{ borderRadius: roleTokens.radius.card }}
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>

              {/* Posted Date */}
              <p className="text-xs text-gray-400 mt-3 font-inter">
                Posted on {new Date(crop.createdAt).toLocaleDateString()}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default MyCrops;
