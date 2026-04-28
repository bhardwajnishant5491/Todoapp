import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiSearch, FiCheckCircle, FiXCircle, FiShield, FiMail, FiPhone, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAllUsers, blockUser, unblockUser } from '../../services/adminService';

const AdminUsers = () => {
  const roleTokens = getRoleTokens('admin');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, farmer, buyer, pending, active, suspended
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    if (!window.confirm('Are you sure you want to block this user?')) return;
    try {
      await blockUser(userId);
      toast.success('User blocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to block user');
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await unblockUser(userId);
      toast.success('User unblocked successfully');
      fetchUsers();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to unblock user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter || user.status === filter;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (user) => {
    if (user.isBlocked) return 'bg-red-100 text-red-700';
    if (user.isActive) return 'bg-green-100 text-green-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  const getStatusText = (user) => {
    if (user.isBlocked) return 'Blocked';
    if (user.isActive) return 'Active';
    return 'Inactive';
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      farmer: 'bg-green-50 text-green-700 border-green-200',
      buyer: 'bg-blue-50 text-blue-700 border-blue-200',
      admin: 'bg-purple-50 text-purple-700 border-purple-200',
    };
    return colors[role] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const stats = {
    total: users.length,
    farmers: users.filter(u => u.role === 'farmer').length,
    buyers: users.filter(u => u.role === 'buyer').length,
    active: users.filter(u => u.isActive && !u.isBlocked).length,
    blocked: users.filter(u => u.isBlocked).length,
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <FiUsers className="text-2xl" style={{ color: roleTokens.primaryColor }} />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">User Management</h1>
        </div>
        <p className="text-gray-600 font-inter">Manage all platform users</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {[
          { label: 'Total Users', value: stats.total, icon: FiUsers, color: roleTokens.primaryColor },
          { label: 'Farmers', value: stats.farmers, icon: FiUsers, color: '#4CAF50' },
          { label: 'Buyers', value: stats.buyers, icon: FiUsers, color: '#2196F3' },
          { label: 'Active', value: stats.active, icon: FiCheckCircle, color: '#10B981' },
          { label: 'Blocked', value: stats.blocked, icon: FiXCircle, color: '#EF4444' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-4"
            style={{
              borderRadius: roleTokens.radius.card,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon className="text-xl" style={{ color: stat.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white rounded-xl p-4 mb-6"
        style={{
          borderRadius: roleTokens.radius.card,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ borderRadius: roleTokens.radius.card }}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {['all', 'farmer', 'buyer', 'active'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 font-medium transition-all ${
                  filter === f
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  borderRadius: roleTokens.radius.card,
                  backgroundColor: filter === f ? roleTokens.primaryColor : undefined,
                }}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Users List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl p-12 text-center"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-poppins font-bold mb-2">No users found</h3>
          <p className="text-gray-600 font-inter">Try adjusting your filters or search query</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user._id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all"
              style={{
                borderRadius: roleTokens.radius.card,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.45 + index * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Avatar */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: roleTokens.primaryColor }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                      {!user.isBlocked && user.isActive && (
                        <FiCheckCircle className="text-green-600" title="Active" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiMail className="text-gray-400" />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiPhone className="text-gray-400" />
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges and Actions */}
                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-medium border ${getRoleBadgeColor(user.role)}`}
                    style={{ borderRadius: roleTokens.radius.card }}
                  >
                    {user.role.toUpperCase()}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 text-xs font-medium ${getStatusColor(user)}`}
                    style={{ borderRadius: roleTokens.radius.card }}
                  >
                    {getStatusText(user)}
                  </span>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {!user.isBlocked ? (
                      <button
                        onClick={() => handleBlock(user._id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        style={{ borderRadius: roleTokens.radius.card }}
                        title="Block User"
                      >
                        <FiXCircle />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                        style={{ borderRadius: roleTokens.radius.card }}
                        title="Unblock User"
                      >
                        <FiCheckCircle />
                      </button>
                    )}
                    <button
                      className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                      style={{ borderRadius: roleTokens.radius.card }}
                      title="View Details"
                      onClick={() => toast.info('User details view coming soon!')}
                    >
                      <FiUsers />
                    </button>
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default AdminUsers;
