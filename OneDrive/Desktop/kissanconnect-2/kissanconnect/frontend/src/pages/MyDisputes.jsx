import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiAlertCircle, FiMessageSquare, FiClock, FiCheckCircle, FiXCircle, FiFilter, FiX } from 'react-icons/fi';
import { getMyDisputes } from '../services/disputeService';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layouts/DashboardLayout';

const MyDisputes = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchDisputes();
  }, [statusFilter]);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError('');
      const filters = statusFilter !== 'all' ? { status: statusFilter } : {};
      const response = await getMyDisputes(filters);
      setDisputes(response.disputes || []);
    } catch (err) {
      setError(err || 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FiAlertCircle className="text-yellow-600" size={20} />;
      case 'investigating':
        return <FiClock className="text-blue-600" size={20} />;
      case 'resolved':
        return <FiCheckCircle className="text-green-600" size={20} />;
      case 'closed':
        return <FiXCircle className="text-gray-600" size={20} />;
      default:
        return <FiAlertCircle className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'investigating':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type) => {
    const types = {
      quality: 'Quality',
      quantity: 'Quantity',
      delivery: 'Delivery',
      payment: 'Payment',
      contract_terms: 'Contract Terms',
      other: 'Other',
    };
    return types[type] || type;
  };

  const filteredDisputes = disputes;

  return (
    <DashboardLayout>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Disputes</h1>
          <p className="text-gray-600 mt-2">
            View and track all your dispute cases
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center gap-4">
            <FiFilter size={20} className="text-gray-400" />
            <div className="flex gap-2 flex-wrap">
              {['all', 'open', 'investigating', 'resolved', 'closed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 mt-4">Loading disputes...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Disputes List */}
        {!loading && !error && (
          <>
            {filteredDisputes.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiAlertCircle className="mx-auto text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mt-4">No Disputes Found</h3>
                <p className="text-gray-600 mt-2">
                  {statusFilter !== 'all'
                    ? `No ${statusFilter} disputes at the moment`
                    : 'You have no active disputes'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDisputes.map((dispute, index) => (
                  <motion.div
                    key={dispute._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Title & Type */}
                        <div className="flex items-start gap-3 mb-3">
                          {getStatusIcon(dispute.status)}
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {dispute.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                {getTypeLabel(dispute.type)}
                              </span>
                              <span>•</span>
                              <span>Contract ID: {dispute.contractId?._id?.slice(-8) || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                          {dispute.description}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FiMessageSquare size={16} />
                            <span>{dispute.messages?.length || 0} messages</span>
                          </div>
                          <span>•</span>
                          <span>
                            {dispute.raisedBy?._id === user?._id ? 'Raised by you' : `Raised by ${dispute.raisedBy?.name}`}
                          </span>
                          <span>•</span>
                          <span>
                            Against: {dispute.against?.name}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            dispute.status
                          )}`}
                        >
                          {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                        </span>
                        {dispute.priority && (
                          <span
                            className={`inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-medium border ${
                              dispute.priority === 'high'
                                ? 'bg-red-100 text-red-800 border-red-300'
                                : dispute.priority === 'medium'
                                ? 'bg-orange-100 text-orange-800 border-orange-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            {dispute.priority} priority
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Resolution (if resolved) */}
                    {dispute.resolution && (
                      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm font-medium text-green-900 mb-1">Resolution:</p>
                        <p className="text-sm text-green-800">{dispute.resolution}</p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedDispute(dispute);
                          setShowDetailsModal(true);
                        }}
                        className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Stats */}
            {filteredDisputes.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-600">
                Showing {filteredDisputes.length} dispute{filteredDisputes.length !== 1 ? 's' : ''}
              </div>
            )}
          </>
        )}
      </div>

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
                  <span className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                    {getTypeLabel(selectedDispute.type)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={24} />
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
                <p className="text-xs font-semibold text-purple-600 mb-1">ASSIGNED TO ADMIN</p>
                <p className="font-bold text-gray-900">{selectedDispute.assignedTo?.name || 'Unassigned'}</p>
                <p className="text-sm text-gray-600">{selectedDispute.assignedTo?.email || ''}</p>
              </div>
            )}

            {/* Resolution - PROMINENTLY DISPLAYED */}
            {selectedDispute.resolution && (
              <div className="mb-6 p-6 bg-green-50 rounded-lg border-2 border-green-300 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FiCheckCircle className="text-green-600" size={24} />
                  <p className="text-sm font-bold text-green-700 uppercase tracking-wide">Resolution</p>
                </div>
                <p className="text-gray-800 text-base leading-relaxed">{selectedDispute.resolution}</p>
                {selectedDispute.resolvedAt && (
                  <p className="text-xs text-green-600 mt-3 font-medium">
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

            {/* Close Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
    </DashboardLayout>
  );
};

export default MyDisputes;
