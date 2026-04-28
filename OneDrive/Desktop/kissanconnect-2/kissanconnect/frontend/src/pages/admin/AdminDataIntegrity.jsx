import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiDatabase, FiSearch, FiShield, FiCheckCircle, FiXCircle, FiClock, FiEye } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import { getAdminContracts, verifyContractIntegrity } from '../../services/adminService';

const statusOptions = ['all', 'Pending', 'Accepted', 'In Progress', 'Delivered', 'Completed', 'Rejected', 'Cancelled'];

const AdminDataIntegrity = () => {
  const roleTokens = getRoleTokens('admin');
  const [loading, setLoading] = useState(true);
  const [contracts, setContracts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [verifyingId, setVerifyingId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, [statusFilter, search]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await getAdminContracts({ status: statusFilter, search, page: 1, limit: 100 });
      setContracts(response.contracts || []);
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const integrityStats = useMemo(() => {
    const total = contracts.length;
    const hashed = contracts.filter((c) => !!c.contractHash).length;
    const unHashed = total - hashed;
    const locked = contracts.filter((c) => c.isLocked).length;
    return { total, hashed, unHashed, locked };
  }, [contracts]);

  const handleVerify = async (contract) => {
    if (!contract.contractHash) {
      toast.warn('This contract has no hash yet. Hash is generated only when a farmer accepts the contract.');
      return;
    }
    try {
      setVerifyingId(contract._id);
      const response = await verifyContractIntegrity(contract._id);
      setVerificationResult(response.verification || null);
      if (response.verification?.isValid) {
        toast.success('Contract hash verified — no tampering detected ✅');
      } else {
        toast.error('Hash mismatch detected — contract may have been tampered ❌');
      }
    } catch (error) {
      const msg = typeof error === 'string' ? error : error?.message || 'Failed to verify integrity';
      toast.error(msg);
      setVerificationResult(null);
    } finally {
      setVerifyingId('');
    }
  };

  return (
    <DashboardLayout>
      <motion.div className="mb-6" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <FiDatabase className="text-2xl" style={{ color: roleTokens.primaryColor }} />
          <h1 className="text-2xl font-bold text-gray-900">Data Integrity</h1>
        </div>
        <p className="text-gray-600">Verify contract SHA-256 signatures and detect tampering signals.</p>
      </motion.div>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Total Contracts</p>
          <p className="text-2xl font-bold text-gray-900">{integrityStats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Has Hash</p>
          <p className="text-2xl font-bold text-green-600">{integrityStats.hashed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">No Hash</p>
          <p className="text-2xl font-bold text-yellow-600">{integrityStats.unHashed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-xs text-gray-500 uppercase">Locked</p>
          <p className="text-2xl font-bold" style={{ color: roleTokens.primaryColor }}>{integrityStats.locked}</p>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">Loading contracts...</div>
        ) : contracts.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No contracts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Contract</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Parties</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Hash</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Lock</th>
                  <th className="text-left px-4 py-3 text-sm text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{String(contract._id).slice(-8)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div>F: {contract.farmerId?.name || 'N/A'}</div>
                      <div>B: {contract.buyerId?.name || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{contract.status}</td>
                    <td className="px-4 py-3 text-sm">
                      {contract.contractHash ? (
                        <span className="inline-flex items-center gap-1 text-green-700"><FiCheckCircle /> Present</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-yellow-700"><FiClock /> Missing</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {contract.isLocked ? (
                        <span className="inline-flex items-center gap-1 text-blue-700"><FiShield /> Locked</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-600">Unlocked</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleVerify(contract)}
                        disabled={verifyingId === contract._id}
                        title={!contract.contractHash ? 'No hash available — contract not yet accepted' : 'Verify SHA-256 integrity'}
                        className={`px-3 py-1.5 text-xs rounded text-white flex items-center gap-1 disabled:opacity-60 ${
                          !contract.contractHash
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                        }`}
                      >
                        <FiEye /> {verifyingId === contract._id ? 'Verifying...' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {verificationResult && (
        <motion.div className="mt-5 bg-white rounded-xl p-5 shadow-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h3 className="text-base font-semibold mb-3">Latest Verification Result</h3>
          <div className="flex items-start gap-3 mb-3">
            {verificationResult.isValid ? (
              <FiCheckCircle className="text-2xl text-green-600 mt-0.5" />
            ) : (
              <FiXCircle className="text-2xl text-red-600 mt-0.5" />
            )}
            <div>
              <p className={`font-semibold ${verificationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                {verificationResult.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">Generated: {verificationResult.hashGeneratedAt ? new Date(verificationResult.hashGeneratedAt).toLocaleString() : 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-gray-50 border border-gray-200">
              <p className="font-semibold text-gray-700 mb-1">Stored Hash</p>
              <p className="break-all text-gray-600">{verificationResult.storedHash || 'N/A'}</p>
            </div>
            <div className="p-3 rounded bg-gray-50 border border-gray-200">
              <p className="font-semibold text-gray-700 mb-1">Current Hash</p>
              <p className="break-all text-gray-600">{verificationResult.currentHash || 'N/A'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default AdminDataIntegrity;
