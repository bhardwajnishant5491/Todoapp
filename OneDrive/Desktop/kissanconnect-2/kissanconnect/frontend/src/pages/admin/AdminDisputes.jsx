import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiUser,
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiEye,
  FiRefreshCw,
  FiDownload,
} from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAllDisputes, assignDispute, updateDisputeStatus, resolveDispute, getAuditLogs } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { exportDisputesToCSV } from '../../utils/exportUtils';

const AdminDisputes = () => {
  const { user } = useAuth();
  const roleTokens = getRoleTokens('admin');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [disputes, setDisputes] = useState([]);
  const [filteredDisputes, setFilteredDisputes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    investigating: 0,
    resolved: 0,
    closed: 0,
    highPriority: 0,
    unassigned: 0,
  });

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolutionText, setResolutionText] = useState('');
  const [processing, setProcessing] = useState(false);
  const [timelineLogs, setTimelineLogs] = useState([]);

  useEffect(() => {
    fetchDisputes();
  }, []);

  useEffect(() => {
    filterDisputes();
  }, [disputes, statusFilter, priorityFilter, typeFilter, searchQuery]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const filters = {};
      const response = await getAllDisputes(filters);
      setDisputes(response.disputes || []);
      setStats(response.stats || {});
    } catch (error) {
      console.error('Error fetching disputes:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load disputes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterDisputes = () => {
    let filtered = [...disputes];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(d => d.priority === priorityFilter);
    }

    // Filter by type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(d => d.type === typeFilter);
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(d =>
        d.title?.toLowerCase().includes(query) ||
        d.raisedBy?.name?.toLowerCase().includes(query) ||
        d.against?.name?.toLowerCase().includes(query)
      );
    }

    setFilteredDisputes(filtered);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDisputes();
  };

  const loadTimeline = async (disputeId) => {
    try {
      const response = await getAuditLogs({ entityType: 'dispute', entityId: disputeId, limit: 30 });
      setTimelineLogs(response.logs || []);
    } catch (error) {
      setTimelineLogs([]);
    }
  };

  const handleExportDisputes = () => {
    if (!filteredDisputes.length) {
      toast.info('No disputes available to export for current filters');
      return;
    }

    exportDisputesToCSV(filteredDisputes);
    toast.success(`Exported ${filteredDisputes.length} dispute records`);
  };

  const handleAssignToMe = async (disputeId) => {
    try {
      setProcessing(true);
      await assignDispute(disputeId, user._id);
      toast.success('Dispute assigned to you');
      fetchDisputes();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to assign dispute');
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateStatus = async (disputeId, newStatus) => {
    try {
      setProcessing(true);
      await updateDisputeStatus(disputeId, newStatus);
      toast.success('Status updated successfully');
      fetchDisputes();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to update status');
    } finally {
      setProcessing(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!resolutionText.trim()) {
      toast.error('Please provide resolution details');
      return;
    }

    if (!selectedDispute?._id) {
      toast.error('No dispute selected');
      return;
    }

    try {
      setProcessing(true);
      console.log('Resolving dispute:', selectedDispute._id, 'with resolution:', resolutionText);
      const result = await resolveDispute(selectedDispute._id, resolutionText);
      console.log('Resolve result:', result);
      toast.success('Dispute resolved successfully');
      setShowResolveModal(false);
      setSelectedDispute(null);
      setResolutionText('');
      fetchDisputes();
    } catch (error) {
      console.error('Error in handleResolveDispute:', error);
      toast.error(typeof error === 'string' ? error : (error.message || 'Failed to resolve dispute'));
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-700',
      investigating: 'bg-blue-100 text-blue-700',
      resolved: 'bg-green-100 text-green-700',
      closed: 'bg-gray-100 text-gray-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type) => {
    const labels = {
      quality: 'Quality Issue',
      quantity: 'Quantity Issue',
      delivery: 'Delivery Issue',
      payment: 'Payment Issue',
      other: 'Other',
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiAlertTriangle className="text-3xl" style={{ color: roleTokens.primaryColor }} />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-900">
                Dispute Resolution
              </h1>
              <p className="text-gray-600 font-inter">Manage and resolve platform disputes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDisputes}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FiDownload /> Export CSV
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <FiRefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: roleTokens.primaryColor },
          { label: 'Open', value: stats.open, color: '#FFA726' },
          { label: 'Investigating', value: stats.investigating, color: '#2196F3' },
          { label: 'Resolved', value: stats.resolved, color: '#4CAF50' },
          { label: 'Closed', value: stats.closed, color: '#9E9E9E' },
          { label: 'High Priority', value: stats.highPriority, color: '#EF4444' },
          { label: 'Unassigned', value: stats.unassigned, color: '#FF9800' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white p-4 rounded-xl"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">{stat.label}</p>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white p-4 rounded-xl mb-6"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="all">All Types</option>
            <option value="quality">Quality Issue</option>
            <option value="quantity">Quantity Issue</option>
            <option value="delivery">Delivery Issue</option>
            <option value="payment">Payment Issue</option>
            <option value="other">Other</option>
          </select>
        </div>
      </motion.div>

      {/* Disputes List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading disputes...</p>
        </div>
      ) : filteredDisputes.length === 0 ? (
        <motion.div
          className="bg-white rounded-xl p-12 text-center"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <FiAlertTriangle className="text-5xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No disputes found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || typeFilter !== 'all'
              ? 'No disputes match your filters'
              : 'No disputes have been raised yet'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredDisputes.map((dispute, index) => (
            <motion.div
              key={dispute._id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title and Type */}
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{dispute.title}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {getTypeLabel(dispute.type)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {dispute.description}
                  </p>

                  {/* Parties */}
                  <div className="flex items-center gap-6 text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      <span>
                        <strong>Raised by:</strong> {dispute.raisedBy?.name} ({dispute.raisedBy?.role})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiUser className="text-gray-400" />
                      <span>
                        <strong>Against:</strong> {dispute.against?.name} ({dispute.against?.role})
                      </span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <FiClock />
                      {new Date(dispute.createdAt).toLocaleDateString()}
                    </span>
                    {dispute.messages?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FiMessageSquare />
                        {dispute.messages.length} messages
                      </span>
                    )}
                    {dispute.assignedTo && (
                      <span className="flex items-center gap-1">
                        <FiUser />
                        Assigned to: {dispute.assignedTo.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded ${getStatusColor(dispute.status)}`}>
                      {dispute.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded ${getPriorityColor(dispute.priority)}`}>
                      {dispute.priority.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {!dispute.assignedTo && (
                      <button
                        onClick={() => handleAssignToMe(dispute._id)}
                        disabled={processing}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        Assign to Me
                      </button>
                    )}
                    {dispute.status !== 'resolved' && dispute.status !== 'closed' && (
                      <button
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowResolveModal(true);
                        }}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setShowDetailsModal(true);
                        loadTimeline(dispute._id);
                      }}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      <FiEye /> Details
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <FiCheckCircle className="text-2xl text-green-600" />
              <h3 className="text-xl font-bold">Resolve Dispute</h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Dispute:</strong> {selectedDispute?.title}
              </p>
              <p className="text-xs text-gray-500">
                <strong>ID:</strong> {selectedDispute?._id}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Details <span className="text-red-500">*</span>
              </label>
              <textarea
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="5"
                placeholder="Explain how the dispute was resolved..."
                disabled={processing}
              />
              <p className="text-xs text-gray-500 mt-1">
                {resolutionText.length} characters (minimum 10 required)
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setResolutionText('');
                }}
                disabled={processing}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveDispute}
                disabled={processing || resolutionText.trim().length < 10}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title={resolutionText.trim().length < 10 ? 'Please provide at least 10 characters' : 'Click to resolve'}
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Resolving...
                  </span>
                ) : (
                  'Resolve Dispute'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDispute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailsModal(false)}>
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedDispute.title}</h2>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 text-xs font-medium rounded ${getStatusColor(selectedDispute.status)}`}>
                    {selectedDispute.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 text-xs font-medium rounded ${getPriorityColor(selectedDispute.priority)}`}>
                    {selectedDispute.priority.toUpperCase()} PRIORITY
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {getTypeLabel(selectedDispute.type)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            {/* Parties Involved */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 mb-1">RAISED BY</p>
                <p className="font-bold text-gray-900">{selectedDispute.raisedBy?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{selectedDispute.raisedBy?.email || 'N/A'}</p>
                <p className="text-xs text-blue-600 mt-1">
                  Role: {selectedDispute.raisedBy?.role?.toUpperCase() || 'N/A'}
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-xs font-semibold text-red-600 mb-1">AGAINST</p>
                <p className="font-bold text-gray-900">{selectedDispute.against?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{selectedDispute.against?.email || 'N/A'}</p>
                <p className="text-xs text-red-600 mt-1">
                  Role: {selectedDispute.against?.role?.toUpperCase() || 'N/A'}
                </p>
              </div>
            </div>

            {/* Contract Info */}
            {selectedDispute.contractId && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-600 mb-2">CONTRACT DETAILS</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Contract ID:</span>{' '}
                    <span className="font-medium">{selectedDispute.contractId._id?.slice(-8) || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>{' '}
                    <span className="font-medium">{selectedDispute.contractId.status || 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">DESCRIPTION</h3>
              <p className="text-gray-700 whitespace-pre-wrap border-l-4 border-purple-500 pl-4 py-2 bg-gray-50">
                {selectedDispute.description}
              </p>
            </div>

            {/* Assigned To */}
            {selectedDispute.assignedTo && (
              <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs font-semibold text-purple-600 mb-1">ASSIGNED TO</p>
                <p className="font-bold text-gray-900">{selectedDispute.assignedTo?.name || 'Unassigned'}</p>
                <p className="text-sm text-gray-600">{selectedDispute.assignedTo?.email || ''}</p>
              </div>
            )}

            {/* Resolution */}
            {selectedDispute.resolution && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs font-semibold text-green-600 mb-2">RESOLUTION</p>
                <p className="text-gray-700">{selectedDispute.resolution}</p>
                {selectedDispute.resolvedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    Resolved on: {new Date(selectedDispute.resolvedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Messages */}
            {selectedDispute.messages && selectedDispute.messages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <FiMessageSquare /> MESSAGES ({selectedDispute.messages.length})
                </h3>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedDispute.messages.map((msg, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-gray-900">
                          {msg.sender?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
              <p><strong>Created:</strong> {new Date(selectedDispute.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedDispute.updatedAt).toLocaleString()}</p>
            </div>

            {/* Audit Timeline */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">AUDIT TIMELINE</h3>
              {timelineLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No audit events found.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {timelineLogs.map((log) => (
                    <div key={log._id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                      <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600">By: {log.actor?.name || 'System'} • {new Date(log.createdAt).toLocaleString()}</p>
                      {log.reason ? <p className="text-sm text-gray-700 mt-1">Reason: {log.reason}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              {!selectedDispute.assignedTo && (
                <button
                  onClick={() => {
                    handleAssignToMe(selectedDispute._id);
                    setShowDetailsModal(false);
                  }}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  Assign to Me
                </button>
              )}
              {selectedDispute.status !== 'resolved' && selectedDispute.status !== 'closed' && (
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setShowResolveModal(true);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Resolve Dispute
                </button>
              )}
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminDisputes;
