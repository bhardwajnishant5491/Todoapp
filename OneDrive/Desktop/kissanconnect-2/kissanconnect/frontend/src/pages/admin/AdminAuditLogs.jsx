import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiFilter, FiSearch, FiDownload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAuditLogs } from '../../services/adminService';
import { arrayToCSV, downloadCSV } from '../../utils/exportUtils';

const AdminAuditLogs = () => {
  const roleTokens = getRoleTokens('admin');
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [entityType, setEntityType] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [entityType, search]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const filters = { limit: 200 };
      if (entityType !== 'all') filters.entityType = entityType;
      if (search.trim()) filters.search = search.trim();
      const response = await getAuditLogs(filters);
      setLogs(response.logs || []);
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const exportLogs = () => {
    if (!logs.length) {
      toast.info('No logs available to export');
      return;
    }

    const csvData = logs.map((log) => ({
      id: log._id,
      entityType: log.entityType,
      entityId: log.entityId,
      action: log.action,
      reason: log.reason || '',
      actorName: log.actor?.name || 'System',
      actorEmail: log.actor?.email || '',
      actorRole: log.actor?.role || '',
      actorIp: log.actorIp || '',
      actorDeviceType: log.actorDeviceType || '',
      createdAt: new Date(log.createdAt).toLocaleString(),
    }));

    const headers = ['id', 'entityType', 'entityId', 'action', 'reason', 'actorName', 'actorEmail', 'actorRole', 'actorIp', 'actorDeviceType', 'createdAt'];
    const csv = arrayToCSV(csvData, headers);
    downloadCSV(csv, `admin-audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success(`Exported ${logs.length} audit logs`);
  };

  return (
    <DashboardLayout>
      <motion.div className="mb-6" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FiActivity className="text-2xl" style={{ color: roleTokens.primaryColor }} />
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            </div>
            <p className="text-gray-600">Central timeline across contracts, disputes, and withdrawals</p>
          </div>
          <button
            onClick={exportLogs}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search action/reason"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={entityType}
              onChange={(e) => setEntityType(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
            >
              <option value="all">All Entities</option>
              <option value="contract">Contracts</option>
              <option value="dispute">Disputes</option>
              <option value="withdrawal">Withdrawals</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No audit logs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Time</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Entity</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Action</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Reason</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Actor</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">IP / Device</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-600">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.entityType} #{String(log.entityId).slice(-8)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.action}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.reason || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{log.actor?.name || 'System'}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{log.actorIp || '-'} / {log.actorDeviceType || 'unknown'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminAuditLogs;
