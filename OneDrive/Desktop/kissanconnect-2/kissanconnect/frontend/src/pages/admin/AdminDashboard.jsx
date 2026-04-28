import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiUsers,
  FiFileText,
  FiAlertTriangle,
  FiDollarSign,
  FiSettings,
  FiShield,
  FiTrendingUp,
  FiActivity,
  FiCheckCircle,
  FiDatabase
} from 'react-icons/fi';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import DashboardLayout from '../../layouts/DashboardLayout';
import designTokens, { getRoleTokens } from '../../utils/designTokens';
import { getDashboardStats, getAllDisputes, getAllUsers } from '../../services/adminService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('admin');

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFarmers: 0,
    totalBuyers: 0,
    activeContracts: 0,
    pendingDisputes: 0,
    platformRevenue: 0,
    recentActivity: 0,
    verifiedUsers: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, disputeResponse, usersResponse] = await Promise.all([
        getDashboardStats(),
        getAllDisputes({ status: 'open' }),
        getAllUsers(),
      ]);

      const analytics = dashboardResponse.analytics;
      const disputeStats = disputeResponse.stats || {};
      const users = usersResponse.users || [];
      const verifiedUsers = users.filter((u) => u.bankDetails?.isVerified).length;
      
      setStats({
        totalUsers: analytics.users?.total || 0,
        totalFarmers: analytics.users?.farmers || 0,
        totalBuyers: analytics.users?.buyers || 0,
        activeContracts: analytics.contracts?.active || 0,
        pendingDisputes: disputeStats.open || 0,
        platformRevenue: analytics.transactions?.platformRevenue || 0,
        recentActivity: analytics.contracts?.total || 0,
        verifiedUsers,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FiUsers,
      label: 'Total Users',
      value: stats.totalUsers,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiUsers,
      label: 'Farmers',
      value: stats.totalFarmers,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiUsers,
      label: 'Buyers',
      value: stats.totalBuyers,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiFileText,
      label: 'Active Contracts',
      value: stats.activeContracts,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiAlertTriangle,
      label: 'Disputes',
      value: stats.pendingDisputes,
      iconBg: '#EF444415'
    },
    {
      icon: FiDollarSign,
      label: 'Revenue',
      value: `₹${stats.platformRevenue?.toLocaleString() || 0}`,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiActivity,
      label: 'Activity',
      value: stats.recentActivity,
      iconBg: '#8B7BE315'
    },
    {
      icon: FiCheckCircle,
      label: 'Verified',
      value: stats.verifiedUsers,
      iconBg: '#10B98115'
    }
  ];

  const adminFeatures = [
    {
      icon: FiUsers,
      title: 'User Management',
      description: 'Manage all platform users',
      iconBg: '#8B7BE315',
      iconColor: '#8B7BE3',
      path: '/admin/users',
    },
    {
      icon: FiFileText,
      title: 'Contract Monitor',
      description: 'Track all transactions',
      iconBg: '#8B7BE315',
      iconColor: '#8B7BE3',
      path: '/admin/contracts',
    },
    {
      icon: FiShield,
      title: 'Dispute Resolution',
      description: 'Handle platform disputes',
      iconBg: '#EF444415',
      iconColor: '#EF4444',
      path: '/admin/disputes',
    },
    {
      icon: FiDatabase,
      title: 'Data Integrity',
      description: 'Verify contract hashes',
      iconBg: '#8B7BE315',
      iconColor: '#8B7BE3',
      path: '/admin/data-integrity',
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics',
      description: 'Platform insights',
      iconBg: '#8B7BE315',
      iconColor: '#8B7BE3',
      path: '/admin/analytics',
    },
    {
      icon: FiSettings,
      title: 'System Config',
      description: 'Platform settings',
      iconBg: '#8B7BE315',
      iconColor: '#8B7BE3',
      path: '/admin/settings',
    }
  ];

  return (
    <DashboardLayout>
      {/* Header Banner */}
      <motion.div
        className="rounded-lg p-5 mb-6"
        style={{
          background: roleTokens.header.gradient,
          height: roleTokens.header.height,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRadius: roleTokens.radius.card
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Badge 
          variant="default" 
          size="sm" 
          className="mb-2 bg-purple-500/20 text-purple-700 border-purple-500/30 w-fit"
        >
          Administrator
        </Badge>
        <h2 className="text-xl font-poppins font-bold text-gray-900 mb-1">
          Admin Control Panel
        </h2>
        <p className="text-gray-700 font-inter text-sm">
          Monitor platform operations and manage system resources
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-base font-poppins font-semibold text-gray-900 mb-4">System Statistics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg p-4 hover:shadow-md transition-all duration-300"
              style={{
                borderRadius: roleTokens.radius.card,
                boxShadow: designTokens.shadows.card
              }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 + index * 0.04 }}
              whileHover={{ y: -1, boxShadow: designTokens.shadows.cardHover }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ 
                  backgroundColor: stat.iconBg,
                  borderRadius: roleTokens.radius.card
                }}
              >
                <stat.icon 
                  className="text-lg" 
                  style={{ 
                    color: stat.label === 'Disputes' ? '#EF4444' : 
                           stat.label === 'Verified' ? '#10B981' : 
                           '#8B7BE3' 
                  }} 
                />
              </div>
              <p className="text-xs font-inter text-gray-600 mb-1">{stat.label}</p>
              <p className="text-xl font-poppins font-bold text-gray-900">
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Admin Tools */}
      <motion.div
        className="bg-white rounded-lg p-5 mb-6"
        style={{
          borderRadius: roleTokens.radius.card,
          boxShadow: designTokens.shadows.card
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <h3 className="text-base font-poppins font-semibold text-gray-900 mb-4">Admin Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {adminFeatures.map((feature, index) => (
            <motion.button
              key={index}
              className="text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
              style={{ borderRadius: roleTokens.radius.card }}
              onClick={() => navigate(feature.path)}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.04 }}
              whileHover={{ y: -1 }}
            >
              <div 
                className="w-11 h-11 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform"
                style={{ 
                  backgroundColor: feature.iconBg,
                  borderRadius: roleTokens.radius.card
                }}
              >
                <feature.icon className="text-xl" style={{ color: feature.iconColor }} />
              </div>
              <h4 className="font-poppins font-semibold text-sm mb-1 text-gray-900">
                {feature.title}
              </h4>
              <p className="text-xs font-inter text-gray-600">
                {feature.description}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
