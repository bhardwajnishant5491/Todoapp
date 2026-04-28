import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  FiDollarSign,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiCreditCard,
  FiRefreshCw,
  FiDownload,
  FiEye,
} from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getRoleTokens } from '../../utils/designTokens';
import { getAllWithdrawals, processWithdrawal } from '../../services/walletService';
import { Card, Button, Badge, Modal, Spinner } from '../../components/ui';
import { exportWithdrawalsToCSV } from '../../utils/exportUtils';
import { getAuditLogs } from '../../services/adminService';

const AdminWithdrawals = () => {
  const { user } = useAuth();
  const roleTokens = getRoleTokens(user?.role || 'admin');

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState(''); // 'approve' or 'reject'
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all'); // all, pending, completed, failed
  const [searchQuery, setSearchQuery] = useState('');
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineLogs, setTimelineLogs] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    completed: 0,
    failed: 0,
    totalPendingAmount: 0,
  });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    // Filter withdrawals when filter or search changes
    filterWithdrawals();
  }, [withdrawals, statusFilter, searchQuery]);

  const filterWithdrawals = () => {
    let filtered = [...withdrawals];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(w => w.status === statusFilter);
    }

    // Filter by search query (user name or email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.user?.name?.toLowerCase().includes(query) ||
        w.user?.email?.toLowerCase().includes(query)
      );
    }

    setFilteredWithdrawals(filtered);
  };

  const fetchWithdrawals = async () => {
    try {
      // Fetch all withdrawal transactions from all users (Admin endpoint)
      const response = await getAllWithdrawals({ status: 'all', limit: 100 });
      
      setWithdrawals(response.withdrawals || []);

      // Use stats from backend
      if (response.stats) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast.error(error || 'Failed to load withdrawals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWithdrawals();
  };

  const handleExportWithdrawals = () => {
    if (!filteredWithdrawals.length) {
      toast.info('No withdrawal records available to export for current filters');
      return;
    }

    exportWithdrawalsToCSV(filteredWithdrawals);
    toast.success(`Exported ${filteredWithdrawals.length} withdrawal records`);
  };

  const openActionModal = (withdrawal, type) => {
    setSelectedWithdrawal(withdrawal);
    setActionType(type);
    setNotes('');
    setShowActionModal(true);
  };

  const openTimelineModal = async (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowTimelineModal(true);
    try {
      const response = await getAuditLogs({ entityType: 'withdrawal', entityId: withdrawal._id, limit: 30 });
      setTimelineLogs(response.logs || []);
    } catch (error) {
      setTimelineLogs([]);
    }
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal) return;

    setProcessing(true);

    try {
      const status = actionType === 'approve' ? 'completed' : 'failed';
      const response = await processWithdrawal(selectedWithdrawal._id, status, notes);

      toast.success(response.message || `Withdrawal ${status} successfully!`);
      setShowActionModal(false);
      setSelectedWithdrawal(null);
      fetchWithdrawals();
    } catch (error) {
      console.error('Process withdrawal error:', error);
      toast.error(error || 'Failed to process withdrawal');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

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
            <FiDollarSign className="text-3xl" style={{ color: roleTokens.primaryColor }} />
            <div>
              <h1 className="text-2xl font-poppins font-bold text-gray-900">
                Withdrawal Management
              </h1>
              <p className="text-gray-600 font-inter">Review and process user withdrawals</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportWithdrawals}
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending</span>
              <FiClock className="text-xl text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            <p className="text-xs text-gray-500 mt-1">₹{stats.totalPendingAmount?.toLocaleString('en-IN') || '0'}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Completed</span>
              <FiCheck className="text-xl text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Failed/Rejected</span>
              <FiX className="text-xl text-red-600" />
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Requests</span>
              <FiDollarSign className="text-xl" style={{ color: roleTokens.primaryColor }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: roleTokens.primaryColor }}>
              {withdrawals.length}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Withdrawals Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <h3 className="text-lg font-bold mb-4">
            Withdrawal Requests 
            {statusFilter !== 'all' && ` - ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`}
            {searchQuery && ` (${filteredWithdrawals.length} results)`}
          </h3>

          {filteredWithdrawals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchQuery || statusFilter !== 'all' 
                ? 'No withdrawal requests match your filters' 
                : 'No withdrawal requests found'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Bank Details
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <FiUser className="text-gray-600" />
                          <div>
                            <div className="text-sm font-medium">
                              {withdrawal.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {withdrawal.user?.email || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-lg font-bold text-gray-900">
                          ₹{withdrawal.amount?.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {withdrawal.metadata?.bankDetails ? (
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <FiCreditCard className="w-3 h-3" />
                              <span>{withdrawal.metadata.bankDetails.accountNumber}</span>
                            </div>
                            <div>{withdrawal.metadata.bankDetails.bankName}</div>
                            <div>{withdrawal.metadata.bankDetails.ifscCode}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">No details</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          color={
                            withdrawal.status === 'completed'
                              ? 'green'
                              : withdrawal.status === 'pending'
                              ? 'yellow'
                              : 'red'
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 items-center">
                        {withdrawal.status === 'pending' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => openActionModal(withdrawal, 'approve')}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openActionModal(withdrawal, 'reject')}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {withdrawal.status === 'completed' ? 'Processed' : 'Closed'}
                          </span>
                        )}
                          <button
                            onClick={() => openTimelineModal(withdrawal)}
                            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors flex items-center gap-1"
                          >
                            <FiEye /> Timeline
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Action Modal */}
      <Modal
        isOpen={showActionModal}
        onClose={() => !processing && setShowActionModal(false)}
        title={actionType === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
        icon={actionType === 'approve' ? <FiCheck /> : <FiX />}
      >
        <div className="space-y-4">
          {selectedWithdrawal && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Withdrawal Details:</p>
              <div className="space-y-1 text-sm">
                <p>
                  <strong>Amount:</strong> ₹{selectedWithdrawal.amount?.toLocaleString('en-IN')}
                </p>
                <p>
                  <strong>User:</strong> {selectedWithdrawal.user?.name || 'Unknown'}
                </p>
                {selectedWithdrawal.metadata?.bankDetails && (
                  <>
                    <p>
                      <strong>Account:</strong>{' '}
                      {selectedWithdrawal.metadata.bankDetails.accountNumber}
                    </p>
                    <p>
                      <strong>Bank:</strong> {selectedWithdrawal.metadata.bankDetails.bankName}
                    </p>
                    <p>
                      <strong>IFSC:</strong> {selectedWithdrawal.metadata.bankDetails.ifscCode}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes {actionType === 'reject' && '*'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={
                actionType === 'approve'
                  ? 'Optional notes (e.g., transaction ID)'
                  : 'Required: Reason for rejection'
              }
              rows={3}
              disabled={processing}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleProcessWithdrawal}
              variant="primary"
              disabled={processing || (actionType === 'reject' && !notes.trim())}
              className="flex-1"
              style={{
                backgroundColor:
                  actionType === 'approve' ? '#10B981' : '#EF4444',
              }}
            >
              {processing
                ? 'Processing...'
                : actionType === 'approve'
                ? 'Confirm Approval'
                : 'Confirm Rejection'}
            </Button>
            <Button onClick={() => setShowActionModal(false)} variant="secondary" disabled={processing}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showTimelineModal}
        onClose={() => setShowTimelineModal(false)}
        title="Withdrawal Audit Timeline"
        icon={<FiClock />}
      >
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {selectedWithdrawal ? (
            <div className="text-sm text-gray-700 p-3 bg-gray-50 rounded border border-gray-200">
              <p><strong>Request ID:</strong> {selectedWithdrawal._id}</p>
              <p><strong>User:</strong> {selectedWithdrawal.user?.name || 'Unknown'}</p>
              <p><strong>Amount:</strong> ₹{selectedWithdrawal.amount?.toLocaleString('en-IN')}</p>
            </div>
          ) : null}

          {timelineLogs.length === 0 ? (
            <p className="text-sm text-gray-500">No audit entries available.</p>
          ) : (
            timelineLogs.map((log) => (
              <div key={log._id} className="p-3 rounded border border-gray-200 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900">{log.action}</p>
                <p className="text-xs text-gray-600">By: {log.actor?.name || 'System'} • {new Date(log.createdAt).toLocaleString()}</p>
                {log.reason ? <p className="text-sm text-gray-700 mt-1">Reason: {log.reason}</p> : null}
              </div>
            ))
          )}
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default AdminWithdrawals;
