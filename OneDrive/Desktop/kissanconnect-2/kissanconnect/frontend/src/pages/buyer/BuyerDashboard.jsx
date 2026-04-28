import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import contractService from '../../services/contractService';
import { toast } from 'react-toastify';
import {
  FiFileText,
  FiClock,
  FiActivity,
  FiDollarSign,
  FiAlertCircle,
  FiShoppingCart,
  FiPackage,
  FiUser,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import DashboardLayout from '../../layouts/DashboardLayout';
import designTokens, { getRoleTokens } from '../../utils/designTokens';

const BuyerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('buyer');
  
  const [stats, setStats] = useState({
    totalContracts: 0,
    pendingContracts: 0,
    activeContracts: 0,
    totalSpending: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const statsData = await contractService.getBuyerContractStats();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FiFileText,
      label: 'Total Contracts',
      value: stats.totalContracts,
      iconBg: '#D4A57415'
    },
    {
      icon: FiClock,
      label: 'Pending Approval',
      value: stats.pendingContracts,
      iconBg: '#D4A57415'
    },
    {
      icon: FiCheckCircle,
      label: 'Active Contracts',
      value: stats.activeContracts,
      iconBg: '#4CAF5015'
    },
    {
      icon: FiDollarSign,
      label: 'Total Spending',
      value: `₹${stats.totalSpending?.toLocaleString() || 0}`,
      iconBg: '#D4A57420'
    },
    {
      icon: FiAlertCircle,
      label: 'Pending Payments',
      value: `₹${stats.pendingPayments?.toLocaleString() || 0}`,
      iconBg: '#D4A57420'
    }
  ];

  const quickActions = [
    {
      icon: GiWheat,
      title: 'Browse Crops',
      description: 'Find quality crops',
      iconBg: '#4CAF5015',
      iconColor: '#4CAF50',
      route: '/buyer/browse-crops'
    },
    {
      icon: FiFileText,
      title: 'My Contracts',
      description: 'Manage contracts',
      iconBg: '#D4A57415',
      iconColor: '#D4A574',
      route: '/buyer/contracts'
    },
    {
      icon: FiShoppingCart,
      title: 'Place Order',
      description: 'Create new purchase',
      iconBg: '#4CAF5015',
      iconColor: '#4CAF50',
      route: '/buyer/browse-crops'
    },
    {
      icon: FiActivity,
      title: 'Analytics',
      description: 'View insights',
      iconBg: '#D4A57415',
      iconColor: '#D4A574',
      route: '/buyer/contracts'
    }
  ];

  return (
    <DashboardLayout>
      {/* Header Banner */}
      <motion.div
        className="rounded-2xl p-6 mb-8"
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
        <div
          className="w-full max-w-xl rounded-2xl px-5 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(123, 76, 40, 0.92), rgba(173, 116, 66, 0.88))',
            border: '1px solid rgba(255,255,255,0.4)',
            boxShadow: '0 10px 30px rgba(107, 64, 30, 0.24)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <Badge 
            variant="warning" 
            size="sm" 
            className="mb-3 bg-white text-amber-800 border-white/80 w-fit font-semibold"
          >
            Buyer Account
          </Badge>
          <h2 className="text-2xl font-poppins font-bold text-white mb-2">
            Welcome back, {user?.name}
          </h2>
          <p className="text-amber-50 font-inter text-sm">
            Browse crops and manage your contracts
          </p>
        </div>
      </motion.div>

      {loading ? (
        <>
          {/* Stats Skeleton */}
          <div className="mb-10">
            <div className="h-6 w-36 bg-gray-200 rounded mb-5"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              <Skeleton variant="card" height="120px" count={5} />
            </div>
          </div>
          
          {/* Quick Actions Skeleton */}
          <div>
            <div className="h-6 w-32 bg-gray-200 rounded mb-5"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Skeleton variant="card" height="140px" count={4} />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Stats Section */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-5">Contract Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {statCards.map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-xl p-5 hover:shadow-md transition-all duration-300"
                  style={{
                    borderRadius: roleTokens.radius.card,
                    boxShadow: designTokens.shadows.card
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                  whileHover={{ y: -2, boxShadow: designTokens.shadows.cardHover }}
                >
                  <div 
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: stat.iconBg,
                      borderRadius: roleTokens.radius.card
                    }}
                  >
                    <stat.icon className="text-xl" style={{ color: stat.label.includes('Payment') || stat.label.includes('Spending') ? '#D4A574' : '#64748B' }} />
                  </div>
                  <p className="text-xs font-inter text-gray-600 mb-2">{stat.label}</p>
                  <p className="text-2xl font-poppins font-bold text-gray-900">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-xl p-6 mb-8"
            style={{
              borderRadius: roleTokens.radius.card,
              boxShadow: designTokens.shadows.card
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-poppins font-semibold text-gray-900 mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  className="text-left p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer group"
                  style={{ borderRadius: roleTokens.radius.card }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + index * 0.05 }}
                  whileHover={{ y: -2 }}
                  onClick={() => navigate(action.route)}
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                    style={{ 
                      backgroundColor: action.iconBg,
                      borderRadius: roleTokens.radius.card
                    }}
                  >
                    <action.icon className="text-2xl" style={{ color: action.iconColor }} />
                  </div>
                  <h4 className="font-poppins font-semibold text-sm mb-1 text-gray-900">
                    {action.title}
                  </h4>
                  <p className="text-xs font-inter text-gray-600">
                    {action.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </DashboardLayout>
  );
};

export default BuyerDashboard;
