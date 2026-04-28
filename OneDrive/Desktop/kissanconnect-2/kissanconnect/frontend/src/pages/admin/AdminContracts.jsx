import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiFileText, FiFilter, FiSearch, FiDownload, FiEye, FiAlertTriangle, FiPauseCircle, FiXCircle } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAdminContracts, getAuditLogs, interveneContract } from '../../services/adminService';
import { exportContractsToCSV } from '../../utils/exportUtils';

const statusOptions = ['all', 'Pending', 'Accepted', 'In Progress', 'Delivered', 'Completed', 'Rejected', 'Cancelled'];

const AdminContracts = () => {
  const roleTokens = getRoleTokens('admin');
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedContract, setSelectedContract] = useState(null);
  const [actionReason, setActionReason] = useState('');
  const [timelineLogs, setTimelineLogs] = useState([]);
  const [intervening, setIntervening] = useState(false);
  const [secondaryConfirmDelivered, setSecondaryConfirmDelivered] = useState(false);

  useEffect(() => {
    fetchContracts();
  }, [statusFilter, search]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await getAdminContracts({ status: statusFilter, search, page: 1, limit: 50 });
      setContracts(response.contracts || []);
      setStats(response.stats || null);
    } catch (error) {
      console.error('Failed to fetch admin contracts:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    if (!contracts.length) {
      toast.info('No contracts available to export');
      return;
    }

    exportContractsToCSV(contracts);
    toast.success(`Exported ${contracts.length} contracts`);
  };

  const loadTimeline = async (contractId) => {
    try {
      const response = await getAuditLogs({ entityType: 'contract', entityId: contractId, limit: 30 });
      setTimelineLogs(response.logs || []);
    } catch (error) {
      setTimelineLogs([]);
    }
  };

  const openDetails = async (contract) => {
    setSelectedContract(contract);
    setActionReason('');
    setSecondaryConfirmDelivered(false);
    await loadTimeline(contract._id);
  };

  const handleIntervention = async (action) => {
    if (!selectedContract?._id) return;
    if (!actionReason.trim() || actionReason.trim().length < 5) {
      toast.error('Please provide at least 5 characters as intervention reason');
      return;
    }

    try {
      setIntervening(true);
      await interveneContract(selectedContract._id, {
        action,
        reason: actionReason.trim(),
        secondaryConfirmation: secondaryConfirmDelivered,
      });
      toast.success(`Contract ${action.replace('_', ' ')} applied`);
      await fetchContracts();
      const refreshed = (contracts || []).find((c) => c._id === selectedContract._id);
      if (refreshed) {
        setSelectedContract(refreshed);
      }
      setActionReason('');
      await loadTimeline(selectedContract._id);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to apply intervention');
    } finally {
      setIntervening(false);
    }
  };

  const totalValue = useMemo(() => {
    if (!stats?.totalValue) return 0;
    return stats.totalValue;
  }, [stats]);

  return (
    <DashboardLayout>
      <motion.div className="mb-6" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiFileText className="text-2xl" style={{ color: roleTokens.primaryColor }} />
              <h1 className="text-2xl font-bold text-gray-900">Contract Monitor</h1>
            </div>
            <p className="text-gray-600">Monitor all contracts and transaction flow across the platform</p>
          </div>
          <button
            onClick={exportData}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Total Contracts</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats?.pending || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats?.completed || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Total Value</p>
          <p className="text-2xl font-bold" style={{ color: roleTokens.primaryColor }}>
            ₹{Number(totalValue).toLocaleString('en-IN')}
          </p>
        </div>
      </motion.div>

      <motion.div className="bg-white rounded-xl p-4 mb-4 shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by contract, crop, farmer, or buyer"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No contracts found for this filter</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Contract</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Crop</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Parties</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Created</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{String(contract._id).slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{contract.cropId?.cropType || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>F: {contract.farmerId?.name || 'N/A'}</div>
                      <div>B: {contract.buyerId?.name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">₹{Number(contract.totalAmount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">{contract.status}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{new Date(contract.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openDetails(contract)}
                        className="px-2 py-1 text-xs rounded bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-1"
                      >
                        <FiEye /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContract(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Contract Details</h2>
              <button onClick={() => setSelectedContract(null)} className="text-gray-500 hover:text-gray-700">Close</button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Contract ID:</strong> {selectedContract._id}</p>
              <p><strong>Status:</strong> {selectedContract.status}</p>
              <p><strong>Flagged:</strong> {selectedContract.interventionState?.isFlagged ? 'Yes' : 'No'}</p>
              <p><strong>On Hold:</strong> {selectedContract.interventionState?.isOnHold ? 'Yes' : 'No'}</p>
              <p><strong>Crop:</strong> {selectedContract.cropId?.cropType || 'N/A'}</p>
              <p><strong>Quantity:</strong> {selectedContract.quantity} {selectedContract.unit}</p>
              <p><strong>Price per Unit:</strong> ₹{selectedContract.pricePerUnit}</p>
              <p><strong>Total Amount:</strong> ₹{Number(selectedContract.totalAmount || 0).toLocaleString('en-IN')}</p>
              <p><strong>Farmer:</strong> {selectedContract.farmerId?.name} ({selectedContract.farmerId?.email || 'N/A'})</p>
              <p><strong>Buyer:</strong> {selectedContract.buyerId?.name} ({selectedContract.buyerId?.email || 'N/A'})</p>
              <p><strong>Payment Terms:</strong> {selectedContract.paymentTerms || 'N/A'}</p>
              <p><strong>Created:</strong> {new Date(selectedContract.createdAt).toLocaleString()}</p>
              <p><strong>Last Updated:</strong> {new Date(selectedContract.updatedAt).toLocaleString()}</p>
            </div>

            <div className="mt-5 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Intervention Reason</h3>
              <textarea
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Provide reason for audit trail..."
                disabled={intervening}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={() => handleIntervention(selectedContract.interventionState?.isFlagged ? 'unflag' : 'flag')}
                  disabled={intervening}
                  className="px-3 py-2 text-xs rounded bg-yellow-600 text-white hover:bg-yellow-700 flex items-center gap-1 disabled:opacity-60"
                >
                  <FiAlertTriangle /> {selectedContract.interventionState?.isFlagged ? 'Unflag' : 'Flag'}
                </button>
                <button
                  onClick={() => handleIntervention(selectedContract.interventionState?.isOnHold ? 'unhold' : 'hold')}
                  disabled={intervening}
                  className="px-3 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1 disabled:opacity-60"
                >
                  <FiPauseCircle /> {selectedContract.interventionState?.isOnHold ? 'Remove Hold' : 'Hold'}
                </button>
                <button
                  onClick={() => handleIntervention('force_close')}
                  disabled={intervening || ['Completed', 'Cancelled'].includes(selectedContract.status)}
                  className="px-3 py-2 text-xs rounded bg-red-600 text-white hover:bg-red-700 flex items-center gap-1 disabled:opacity-60"
                >
                  <FiXCircle /> Force Close
                </button>
              </div>

              {selectedContract.status === 'Delivered' && (
                <div className="mt-3 p-3 border border-red-200 bg-red-50 rounded-lg">
                  <label className="flex items-center gap-2 text-sm text-red-800">
                    <input
                      type="checkbox"
                      checked={secondaryConfirmDelivered}
                      onChange={(e) => setSecondaryConfirmDelivered(e.target.checked)}
                    />
                    Secondary confirmation: I acknowledge force-closing a Delivered contract is exceptional.
                  </label>
                </div>
              )}
            </div>

            <div className="mt-5 border-t pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Audit Timeline</h3>
              {timelineLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No audit events found yet.</p>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto">
                  {timelineLogs.map((log) => (
                    <div key={log._id} className="p-3 rounded border border-gray-200 bg-gray-50">
                      <p className="text-sm font-medium text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-600">By: {log.actor?.name || 'System'} • {new Date(log.createdAt).toLocaleString()}</p>
                      {log.reason ? <p className="text-sm text-gray-700 mt-1">Reason: {log.reason}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminContracts;
