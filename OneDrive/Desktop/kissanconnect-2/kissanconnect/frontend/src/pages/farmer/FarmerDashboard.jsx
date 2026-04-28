import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cropService from '../../services/cropService';
import contractService from '../../services/contractService';
import { toast } from 'react-toastify';
import { 
  FiPackage, 
  FiCheckCircle, 
  FiDollarSign,
  FiClock,
  FiActivity,
  FiPlus,
  FiFileText,
  FiArrowRight
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import DashboardLayout from '../../layouts/DashboardLayout';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import designTokens, { getRoleTokens } from '../../utils/designTokens';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('farmer');
  
  const [stats, setStats] = useState({
    totalCrops: 0,
    availableCrops: 0,
    soldCrops: 0,
    totalValue: 0,
  });
  const [contractStats, setContractStats] = useState({
    totalContracts: 0,
    pendingContracts: 0,
    activeContracts: 0,
    totalEarnings: 0,
  });
  const [recentCrops, setRecentCrops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, cropsData, contractStatsData] = await Promise.all([
        cropService.getFarmerStats(),
        cropService.getFarmerCrops(),
        contractService.getFarmerContractStats(),
      ]);
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
      
      if (cropsData.success) {
        setRecentCrops(cropsData.crops.slice(0, 5));
      }
      
      if (contractStatsData.success) {
        setContractStats(contractStatsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header Banner */}
      <motion.div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: roleTokens.header.gradient,
          height: roleTokens.header.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge 
          variant="success" 
          size="sm" 
          className="mb-3 bg-white/20 text-gray-900 border-white/30 w-fit font-semibold"
        >
          Farmer Account
        </Badge>
        <h2 className="text-2xl font-poppins font-bold text-white mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-white/90 font-inter text-sm mb-4">
          Manage your crops and track your farming business
        </p>
        <button
          onClick={() => navigate('/farmer/add-crop')}
          className="flex items-center gap-2 px-4 py-2 bg-white text-primary-600 rounded-xl font-medium hover:bg-gray-50 transition-colors w-fit"
          style={{ borderRadius: roleTokens.radius }}
        >
          <FiPlus />
          Add New Crop
        </button>
      </motion.div>

      {loading ? (
        <>
          {/* Crop Stats Skeleton */}
          <div className="mb-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton variant="card" height="140px" count={4} />
            </div>
          </div>
          
          {/* Contract Stats Skeleton */}
          <div className="mb-6">
            <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton variant="card" height="140px" count={4} />
            </div>
          </div>
          
          {/* Recent Listings Skeleton */}
          <div>
            <div className="h-6 w-36 bg-gray-200 rounded mb-4"></div>
            <Skeleton variant="card" height="200px" />
          </div>
        </>
      ) : (
        <>
          {/* Crop Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
              Crop Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: GiWheat, label: 'Total Crops', value: stats.totalCrops, color: '#4CAF50' },
                { icon: FiPackage, label: 'Available', value: stats.availableCrops, color: '#4CAF50' },
                { icon: FiCheckCircle, label: 'Sold', value: stats.soldCrops, color: '#4CAF50' },
                { icon: FiDollarSign, label: 'Total Value', value: `₹${stats.totalValue?.toLocaleString()}`, color: '#F4A261' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-2xl"
                  style={{
                    borderRadius: roleTokens.radius,
                    boxShadow: designTokens.shadows.card,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ 
                    boxShadow: designTokens.shadows.cardHover,
                    y: -4
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="text-2xl" style={{ color: stat.color }} />
                  </div>
                  <p className="text-sm font-inter text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-poppins font-bold" style={{ color: designTokens.colors.text.primary }}>
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contract Stats */}
          <div className="mb-6">
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-4">
              Contracts & Earnings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: FiFileText, label: 'Total Contracts', value: contractStats.totalContracts, color: '#4CAF50', clickable: true },
                { icon: FiClock, label: 'Pending', value: contractStats.pendingContracts, color: '#F4A261', clickable: true },
                { icon: FiActivity, label: 'Active', value: contractStats.activeContracts, color: '#4CAF50', clickable: true },
                { icon: FiDollarSign, label: 'Total Earnings', value: `₹${contractStats.totalEarnings?.toLocaleString()}`, color: '#4CAF50' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className={`bg-white p-6 rounded-2xl ${stat.clickable ? 'cursor-pointer' : ''}`}
                  style={{
                    borderRadius: roleTokens.radius,
                    boxShadow: designTokens.shadows.card,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ 
                    boxShadow: designTokens.shadows.cardHover,
                    y: -4
                  }}
                  onClick={stat.clickable ? () => navigate('/farmer/contracts') : undefined}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="text-2xl" style={{ color: stat.color }} />
                  </div>
                  <p className="text-sm font-inter text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-poppins font-bold" style={{ color: designTokens.colors.text.primary }}>
                    {stat.value}
                  </p>
                  {stat.clickable && (
                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      View details <FiArrowRight className="text-[10px]" />
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Crops */}
          {recentCrops.length > 0 ? (
            <motion.div
              className="bg-white p-6 rounded-2xl"
              style={{
                borderRadius: roleTokens.radius,
                boxShadow: designTokens.shadows.card,
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-poppins font-bold text-gray-900">
                  Recent Listings
                </h3>
                <button
                  onClick={() => navigate('/farmer/crops')}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View All <FiArrowRight className="text-xs" />
                </button>
              </div>
              <div className="space-y-3">
                {recentCrops.map((crop, index) => (
                  <motion.div
                    key={crop._id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: '#4CAF5015' }}
                      >
                        <GiWheat className="text-2xl text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-poppins font-semibold text-gray-900">{crop.cropType}</h4>
                        <p className="text-sm font-inter text-gray-600">
                          {crop.quantity} {crop.unit} @ ₹{crop.pricePerUnit}/{crop.unit}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        crop.status === 'Available'
                          ? 'bg-green-50 text-green-700'
                          : crop.status === 'In Contract'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {crop.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="bg-white p-12 rounded-2xl text-center"
              style={{
                borderRadius: roleTokens.radius,
                boxShadow: designTokens.shadows.card,
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: '#4CAF5015' }}
              >
                <GiWheat className="text-5xl text-primary-600" />
              </div>
              <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-3">
                No Crops Listed Yet
              </h3>
              <p className="text-gray-600 font-inter mb-6 max-w-md mx-auto">
                Start by listing your first crop to connect with buyers
              </p>
              <button
                onClick={() => navigate('/farmer/add-crop')}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
              >
                <FiPlus />
                List Your First Crop
              </button>
            </motion.div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default FarmerDashboard;
