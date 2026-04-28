import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiUsers, 
  FiPackage, 
  FiDollarSign, 
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import {
  getPlatformAnalytics,
  getAnalyticsTimeSeries,
  getPlatformTreasury,
  processPlatformCommissionWithdrawal,
  withdrawPlatformCommission,
} from '../../services/adminService';
import { exportAnalyticsToCSV } from '../../utils/exportUtils';

const AdminAnalytics = () => {
  const roleTokens = getRoleTokens('admin');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year
  const [analytics, setAnalytics] = useState({
    users: { total: 0, farmers: 0, buyers: 0 },
    contracts: { total: 0, active: 0, completed: 0, pending: 0, totalValue: 0 },
    transactions: { totalDeposits: 0, totalWithdrawals: 0, totalCommission: 0, platformRevenue: 0 },
    crops: { total: 0, available: 0 },
  });
  const [seriesData, setSeriesData] = useState([]);
  const [treasury, setTreasury] = useState({ totalCommission: 0, totalWithdrawn: 0, availableCommission: 0 });
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawNote, setWithdrawNote] = useState('');
  const [payoutDestination, setPayoutDestination] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    accountType: 'Savings',
    branchName: '',
    payoutPurpose: '',
    destinationReference: '',
  });
  const [withdrawing, setWithdrawing] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [summaryResponse, seriesResponse] = await Promise.all([
        getPlatformAnalytics(timeRange),
        getAnalyticsTimeSeries(timeRange),
      ]);

      setAnalytics(summaryResponse.analytics || {
        users: { total: 0, farmers: 0, buyers: 0 },
        contracts: { total: 0, active: 0, completed: 0, pending: 0, totalValue: 0 },
        transactions: { totalDeposits: 0, totalWithdrawals: 0, totalCommission: 0, platformRevenue: 0 },
        crops: { total: 0, available: 0 },
      });
      setSeriesData(seriesResponse.series || []);

      const treasuryResponse = await getPlatformTreasury();
      setTreasury(treasuryResponse.treasury || {
        totalCommission: 0,
        totalWithdrawn: 0,
        pendingWithdrawals: 0,
        availableCommission: 0,
        availableToRequest: 0,
      });
      setWithdrawalRequests(treasuryResponse.requests || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Platform Revenue',
      value: `₹${((analytics.transactions?.platformRevenue || 0) / 1000).toFixed(1)}k`,
      icon: FiDollarSign,
      change: '+12.5%',
      color: '#10B981',
      bgColor: '#10B98115',
    },
    {
      label: 'Total Contracts',
      value: analytics.contracts?.total || 0,
      icon: FiPackage,
      change: '+8.2%',
      color: roleTokens.primaryColor,
      bgColor: `${roleTokens.primaryColor}15`,
    },
    {
      label: 'Total Users',
      value: analytics.users?.total || 0,
      icon: FiUsers,
      change: '+15.3%',
      color: '#3B82F6',
      bgColor: '#3B82F615',
    },
    {
      label: 'Total Deposits',
      value: `₹${((analytics.transactions?.totalDeposits || 0) / 1000).toFixed(1)}k`,
      icon: FiActivity,
      change: '+23.1%',
      color: '#F59E0B',
      bgColor: '#F59E0B15',
    },
  ];

  const handleExportAnalytics = () => {
    const reportData = {
      totalUsers: analytics.users?.total || 0,
      farmers: analytics.users?.farmers || 0,
      buyers: analytics.users?.buyers || 0,
      totalCrops: analytics.crops?.total || 0,
      activeContracts: analytics.contracts?.active || 0,
      completedContracts: analytics.contracts?.completed || 0,
      totalRevenue: analytics.transactions?.platformRevenue || 0,
      period: timeRange,
    };

    exportAnalyticsToCSV(reportData);
    toast.success('Analytics report exported');
  };

  const trendData = seriesData.map((item) => ({
    label: item.key,
    revenue: item.revenue,
    contracts: item.contracts,
    users: item.users,
  }));

  const distributionData = [
    {
      name: 'Pending Contracts',
      value: analytics.contracts?.pending || 0,
      fill: '#F59E0B',
    },
    {
      name: 'Active Contracts',
      value: analytics.contracts?.active || 0,
      fill: '#3B82F6',
    },
    {
      name: 'Completed Contracts',
      value: analytics.contracts?.completed || 0,
      fill: '#10B981',
    },
  ];

  const handleWithdrawCommission = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!payoutDestination.accountHolderName || !payoutDestination.bankName || !payoutDestination.accountNumber || !payoutDestination.ifscCode) {
      toast.error('Please fill payout destination details');
      return;
    }

    if (amount > Number(treasury.availableToRequest || 0)) {
      toast.error(`Amount exceeds requestable commission (₹${Number(treasury.availableToRequest || 0)})`);
      return;
    }

    try {
      setWithdrawing(true);
      await withdrawPlatformCommission(amount, withdrawNote, payoutDestination);
      toast.success('Commission withdrawal request submitted');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawNote('');
      setPayoutDestination({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        accountType: 'Savings',
        branchName: '',
        payoutPurpose: '',
        destinationReference: '',
      });
      fetchAnalytics();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to withdraw commission');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleProcessRequest = async (request, decision) => {
    const reviewNote = window.prompt(
      decision === 'approve' ? 'Add approval note (optional):' : 'Add rejection reason:'
    ) || '';

    let bankReferenceNumber = '';
    let bankUtrNumber = '';

    if (decision === 'approve') {
      bankReferenceNumber = window.prompt('Enter bank reference number:') || '';
      bankUtrNumber = window.prompt('Enter bank UTR number:') || '';
      if (!bankReferenceNumber.trim() || !bankUtrNumber.trim()) {
        toast.error('Bank reference and UTR are required for approval');
        return;
      }
    }

    try {
      setProcessingRequestId(request._id);
      await processPlatformCommissionWithdrawal(request._id, {
        decision,
        reviewNote,
        bankReferenceNumber,
        bankUtrNumber,
      });
      toast.success(decision === 'approve' ? 'Request approved' : 'Request rejected');
      fetchAnalytics();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to process request');
    } finally {
      setProcessingRequestId('');
    }
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
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingUp className="text-2xl" style={{ color: roleTokens.primaryColor }} />
              <h1 className="text-2xl font-poppins font-bold text-gray-900">Analytics Dashboard</h1>
            </div>
            <p className="text-gray-600 font-inter">Platform performance and insights</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 bg-emerald-600 text-white border border-emerald-700 rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
            >
              Withdraw Commission
            </button>
            <button
              onClick={handleExportAnalytics}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FiDownload /> Export CSV
            </button>
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 font-medium transition-all ${
                  timeRange === range
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  borderRadius: roleTokens.radius.card,
                  backgroundColor: timeRange === range ? roleTokens.primaryColor : undefined,
                }}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600 font-inter">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-white p-5"
                style={{
                  borderRadius: roleTokens.radius.card,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: stat.bgColor }}
                  >
                    <stat.icon className="text-xl" style={{ color: stat.color }} />
                  </div>
                  <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium uppercase mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-4 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p className="text-xs text-gray-500 uppercase">Total Commission</p>
              <p className="text-2xl font-bold text-emerald-700">₹{Number(treasury.totalCommission || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-4 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p className="text-xs text-gray-500 uppercase">Commission Withdrawn</p>
              <p className="text-2xl font-bold text-orange-700">₹{Number(treasury.totalWithdrawn || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-4 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p className="text-xs text-gray-500 uppercase">Available Commission</p>
              <p className="text-2xl font-bold text-blue-700">₹{Number(treasury.availableCommission || 0).toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-white p-4 rounded-xl" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <p className="text-xs text-gray-500 uppercase">Pending Payout Requests</p>
              <p className="text-2xl font-bold text-purple-700">₹{Number(treasury.pendingWithdrawals || 0).toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500 mt-1">Requestable: ₹{Number(treasury.availableToRequest || 0).toLocaleString('en-IN')}</p>
            </div>
          </motion.div>

          {/* Charts and Data Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Revenue and Growth Trend */}
            <motion.div
              className="bg-white p-6"
              style={{
                borderRadius: roleTokens.radius.card,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FiTrendingUp className="text-xl" style={{ color: roleTokens.primaryColor }} />
                <h2 className="text-lg font-poppins font-bold">Revenue and Growth Trend</h2>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip formatter={(value) => Number(value).toLocaleString('en-IN')} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#10B981"
                      fill="#10B98133"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="contracts"
                      name="Contracts"
                      stroke={roleTokens.primaryColor}
                      fill={`${roleTokens.primaryColor}33`}
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Users"
                      stroke="#3B82F6"
                      fill="#3B82F633"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Contract Status Distribution */}
            <motion.div
              className="bg-white p-6"
              style={{
                borderRadius: roleTokens.radius.card,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <FiPackage className="text-xl" style={{ color: roleTokens.primaryColor }} />
                <h2 className="text-lg font-poppins font-bold">Contract Status Distribution</h2>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={distributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip formatter={(value) => Number(value).toLocaleString('en-IN')} />
                    <Bar dataKey="value" name="Count" radius={[8, 8, 0, 0]}>
                      {distributionData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="bg-white p-6 mb-6"
            style={{
              borderRadius: roleTokens.radius.card,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-poppins font-bold">Commission Payout Requests</h2>
              <span className="text-sm text-gray-500">{withdrawalRequests.length} recent requests</span>
            </div>

            {withdrawalRequests.length === 0 ? (
              <p className="text-sm text-gray-500">No payout requests found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b">
                      <th className="py-2 pr-4">Date</th>
                      <th className="py-2 pr-4">Amount</th>
                      <th className="py-2 pr-4">Destination</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Bank Ref</th>
                      <th className="py-2 pr-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawalRequests.map((request) => {
                      const payout = request.metadata?.payoutDestination || {};
                      const approval = request.metadata?.approval || {};
                      return (
                        <tr key={request._id} className="border-b last:border-b-0">
                          <td className="py-2 pr-4 text-gray-700">{new Date(request.createdAt).toLocaleString('en-IN')}</td>
                          <td className="py-2 pr-4 font-semibold text-gray-900">₹{Number(request.amount || 0).toLocaleString('en-IN')}</td>
                          <td className="py-2 pr-4 text-gray-700">
                            <div>{payout.bankName || '-'}</div>
                            <div className="text-xs text-gray-500">{payout.accountNumberMasked || '-'}</div>
                          </td>
                          <td className="py-2 pr-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                request.status === 'completed'
                                  ? 'bg-green-100 text-green-700'
                                  : request.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {request.status}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-xs text-gray-600">
                            {approval.bankReferenceNumber || '-'}
                            <br />
                            {approval.bankUtrNumber || '-'}
                          </td>
                          <td className="py-2 pr-4">
                            {request.status === 'pending' ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleProcessRequest(request, 'approve')}
                                  disabled={processingRequestId === request._id}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-600 text-white disabled:opacity-60"
                                >
                                  <FiCheck size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => handleProcessRequest(request, 'reject')}
                                  disabled={processingRequestId === request._id}
                                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                                >
                                  <FiX size={14} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Processed</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="bg-white p-6 mb-6"
            style={{
              borderRadius: roleTokens.radius.card,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiActivity className="text-xl" style={{ color: roleTokens.primaryColor }} />
              <h2 className="text-lg font-poppins font-bold">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {(analytics.recentActivity || []).length > 0 ? (
                analytics.recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id || index}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    {activity.amount ? (
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{activity.amount.toLocaleString('en-IN')}
                      </span>
                    ) : null}
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No recent activity to display</p>
              )}
            </div>
          </motion.div>

          {/* System Health Metrics */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            {[
              { label: 'Success Rate', value: '98.5%', icon: FiCheckCircle, color: '#10B981' },
              { label: 'Avg. Response Time', value: '1.2s', icon: FiClock, color: '#3B82F6' },
              { label: 'Active Issues', value: '3', icon: FiAlertCircle, color: '#F59E0B' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                className="bg-white p-5"
                style={{
                  borderRadius: roleTokens.radius.card,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.55 + index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${metric.color}15` }}
                  >
                    <metric.icon style={{ color: metric.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowWithdrawModal(false)}>
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">Withdraw Platform Commission</h3>
            <p className="text-sm text-gray-600 mb-4">Requestable: ₹{Number(treasury.availableToRequest || 0).toLocaleString('en-IN')}</p>
            <div className="space-y-3">
              <input
                type="number"
                placeholder="Amount"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Account Holder Name"
                value={payoutDestination.accountHolderName}
                onChange={(e) => setPayoutDestination((prev) => ({ ...prev, accountHolderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Bank Name"
                value={payoutDestination.bankName}
                onChange={(e) => setPayoutDestination((prev) => ({ ...prev, bankName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Account Number"
                  value={payoutDestination.accountNumber}
                  onChange={(e) => setPayoutDestination((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="IFSC Code"
                  value={payoutDestination.ifscCode}
                  onChange={(e) => setPayoutDestination((prev) => ({ ...prev, ifscCode: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select
                  value={payoutDestination.accountType}
                  onChange={(e) => setPayoutDestination((prev) => ({ ...prev, accountType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                </select>
                <input
                  type="text"
                  placeholder="Branch Name (optional)"
                  value={payoutDestination.branchName}
                  onChange={(e) => setPayoutDestination((prev) => ({ ...prev, branchName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Destination Reference (optional)"
                value={payoutDestination.destinationReference}
                onChange={(e) => setPayoutDestination((prev) => ({ ...prev, destinationReference: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Payout Purpose (optional)"
                value={payoutDestination.payoutPurpose}
                onChange={(e) => setPayoutDestination((prev) => ({ ...prev, payoutPurpose: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Note (optional)"
                value={withdrawNote}
                onChange={(e) => setWithdrawNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setShowWithdrawModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Cancel</button>
              <button
                onClick={handleWithdrawCommission}
                disabled={withdrawing}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-60"
              >
                {withdrawing ? 'Processing...' : 'Confirm Withdraw'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminAnalytics;
