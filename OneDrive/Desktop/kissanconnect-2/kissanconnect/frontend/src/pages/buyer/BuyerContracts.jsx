import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import contractService from '../../services/contractService';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiFileText, FiClock, FiDownload, FiCheck, FiPackage, FiMessageCircle, FiPhone } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import ContractTimeline from '../../components/common/ContractTimeline';
import { getRoleTokens } from '../../utils/designTokens';
import { printContractPDF } from '../../utils/exportUtils';
import ChatWarningModal from '../../components/common/ChatWarningModal';
import CreateDisputeModal from '../../components/common/CreateDisputeModal';

const BuyerContracts = () => {
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('buyer');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showChatWarning, setShowChatWarning] = useState(false);
  const [pendingChatData, setPendingChatData] = useState(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [selectedContractForDispute, setSelectedContractForDispute] = useState(null);

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const result = await contractService.getAllContracts();
      
      if (result.success) {
        setContracts(result.contracts);
      } else {
        toast.error('Failed to load contracts');
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      toast.error('An error occurred while loading contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (contractId) => {
    if (!window.confirm('Confirm that you have received the order? Payment will be released to the farmer.')) return;

    try {
      setActionLoading(contractId);
      const result = await contractService.updateContractStatus(contractId, 'Completed');
      
      if (result.success) {
        toast.success('Order confirmed! Payment released to farmer.');
        fetchContracts();
      } else {
        toast.error(result.message || 'Failed to confirm receipt');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast.error(error?.message || 'Failed to confirm receipt');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRaiseDispute = (contract) => {
    setSelectedContractForDispute(contract);
    setShowDisputeModal(true);
  };

  const filteredContracts = filter === 'all' 
    ? contracts 
    : contracts.filter((contract) => contract.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Accepted: 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      Delivered: 'bg-purple-100 text-purple-700',
      Completed: 'bg-gray-100 text-gray-700',
      Rejected: 'bg-red-100 text-red-700',
      Cancelled: 'bg-gray-100 text-gray-500',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <DashboardLayout>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/buyer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <FiFileText className="text-2xl text-gray-700" />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">My Contracts</h1>
        </div>
        <p className="text-gray-600 font-inter">Track and manage your purchase contracts</p>
      </motion.div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-accent-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All ({contracts.length})
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Pending ({contracts.filter((c) => c.status === 'Pending').length})
          </button>
          <button
            onClick={() => setFilter('Accepted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Accepted'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Accepted ({contracts.filter((c) => c.status === 'Accepted').length})
          </button>
          <button
            onClick={() => setFilter('In Progress')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'In Progress'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            In Progress ({contracts.filter((c) => c.status === 'In Progress').length})
          </button>
          <button
            onClick={() => setFilter('Delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Delivered'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Delivered ({contracts.filter((c) => c.status === 'Delivered').length})
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Completed'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({contracts.filter((c) => c.status === 'Completed').length})
          </button>
          <button
            onClick={() => setFilter('Rejected')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Rejected'
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Rejected ({contracts.filter((c) => c.status === 'Rejected').length})
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
            <p className="mt-4 text-gray-600">Loading contracts...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-4">No contracts found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? 'You haven\'t sent any contract proposals yet.'
                : `No contracts with status "${filter}"`}
            </p>
            {filter === 'all' && (
              <button
                onClick={() => navigate('/buyer/browse-crops')}
                className="btn-primary"
              >
                Browse Crops & Send Proposals
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => (
              <div key={contract._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {contract.cropId?.cropType || 'Crop'} Contract
                    </h3>
                    <p className="text-sm text-gray-500">
                      Contract ID: {contract._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {contract.interventionState?.isFlagged && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Flagged by Admin</span>
                    )}
                    {contract.interventionState?.isOnHold && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">On Hold by Admin</span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </div>

                {contract.interventionState?.isOnHold && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      This contract is currently on admin hold. Critical actions are temporarily disabled.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Farmer Info */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Farmer Details</h4>
                    <p><span className="font-medium">Name:</span> {contract.farmerId?.name}</p>
                    
                    {/* Show phone only for Delivered/Completed - for delivery coordination */}
                    {(contract.status === 'Delivered' || contract.status === 'Completed') ? (
                      <p><span className="font-medium">Phone:</span> {contract.farmerId?.phone}</p>
                    ) : (
                      <button
                        onClick={() => {
                          setPendingChatData({
                            userId: contract.farmerId?._id,
                            contractId: contract._id,
                            userName: contract.farmerId?.name,
                            userRole: 'Farmer'
                          });
                          setShowChatWarning(true);
                        }}
                        className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        Message Farmer
                      </button>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-1">
                      📍 {contract.cropId?.location?.district}, {contract.cropId?.location?.state}
                    </p>
                  </div>

                  {/* Contract Details */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Contract Details</h4>
                    <p><span className="font-medium">Quantity:</span> {contract.quantity} {contract.unit}</p>
                    <p><span className="font-medium">Price:</span> ₹{contract.pricePerUnit}/{contract.unit}</p>
                    <p><span className="font-medium">Total Amount:</span> ₹{contract.totalAmount.toLocaleString()}</p>
                    <p><span className="font-medium">Delivery:</span> {new Date(contract.deliveryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Payment Terms - Escrow Info */}
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">💰 Payment: {contract.paymentTerms || 'Escrow Payment'}</p>
                  {contract.status === 'Accepted' && (
                    <p className="text-xs text-blue-700">🔒 Your payment (₹{contract.totalAmount.toLocaleString()}) is locked in secure escrow.</p>
                  )}
                  {contract.status === 'In Progress' && (
                    <p className="text-xs text-blue-700">🔒 Payment secured in escrow. Will be released after you confirm delivery.</p>
                  )}
                  {contract.status === 'Delivered' && (
                    <p className="text-xs text-blue-700">⚡ Confirm receipt below to release payment to farmer.</p>
                  )}
                  {contract.status === 'Completed' && (
                    <p className="text-xs text-blue-700">✅ Payment released to farmer successfully.</p>
                  )}
                </div>

                {/* Your Notes */}
                {contract.buyerNotes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1">Your Message:</p>
                    <p className="text-sm text-gray-700">{contract.buyerNotes}</p>
                  </div>
                )}

                {/* Rejection Reason */}
                {contract.status === 'Rejected' && contract.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-gray-700">{contract.rejectionReason}</p>
                  </div>
                )}

                {/* Status Messages */}
                {contract.status === 'Pending' && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">⏳ Waiting for farmer to respond to your proposal</p>
                  </div>
                )}

                {contract.status === 'Accepted' && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">✅ Farmer has accepted your proposal. Payment locked in escrow.</p>
                  </div>
                )}

                {contract.status === 'In Progress' && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">🚚 Order is in progress. Farmer is preparing delivery.</p>
                  </div>
                )}

                {/* Confirm Receipt Button for Delivered Contracts */}
                {contract.status === 'Delivered' && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl mb-4">
                      <div className="flex items-start gap-3">
                        <FiPackage className="text-2xl text-purple-600 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-purple-800">Order Delivered!</p>
                          <p className="text-sm text-purple-700 mt-1">
                            Farmer has marked this order as delivered. Please confirm receipt to release payment.
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConfirmReceipt(contract._id)}
                      disabled={actionLoading === contract._id || contract.interventionState?.isOnHold}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiCheck className="w-5 h-5" />
                      {actionLoading === contract._id ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Processing...
                        </>
                      ) : (
                        'Confirm Receipt & Release Payment'
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Raise Dispute Button - For contracts that can have disputes */}
                {(contract.status === 'Accepted' || contract.status === 'In Progress' || 
                  contract.status === 'Delivered' || contract.status === 'Completed') && (
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={() => handleRaiseDispute(contract)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-600 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-all duration-200"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiPackage className="w-4 h-4" />
                      Raise a Dispute
                    </button>
                  </motion.div>
                )}

                {/* Timestamps */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <p>Sent: {new Date(contract.createdAt).toLocaleString()}</p>
                      {contract.acceptedAt && <p>Accepted: {new Date(contract.acceptedAt).toLocaleString()}</p>}
                      {contract.inProgressAt && <p>In Progress: {new Date(contract.inProgressAt).toLocaleString()}</p>}
                      {contract.deliveredAt && <p>Delivered: {new Date(contract.deliveredAt).toLocaleString()}</p>}
                      {contract.completedAt && <p>Completed: {new Date(contract.completedAt).toLocaleString()}</p>}
                      {contract.rejectedAt && <p>Rejected: {new Date(contract.rejectedAt).toLocaleString()}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => printContractPDF(contract)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: roleTokens.primaryColor }}
                      >
                        <FiDownload className="w-4 h-4" />
                        Export PDF
                      </button>
                      <button
                        onClick={() => setExpandedTimeline(expandedTimeline === contract._id ? null : contract._id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                        style={{ color: roleTokens.primaryColor }}
                      >
                        <FiClock className="w-4 h-4" />
                        {expandedTimeline === contract._id ? 'Hide Timeline' : 'View Timeline'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Timeline View */}
                <AnimatePresence>
                  {expandedTimeline === contract._id && (
                    <motion.div
                      className="mt-4 pt-4 border-t border-gray-100"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ContractTimeline contract={contract} userRole="buyer" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        )}
        
        {/* Chat Warning Modal */}
        <ChatWarningModal
          isOpen={showChatWarning}
          onClose={() => {
            setShowChatWarning(false);
            setPendingChatData(null);
          }}
          onAccept={() => {
            setShowChatWarning(false);
            if (pendingChatData) {
              navigate(`/chat?userId=${pendingChatData.userId}&contractId=${pendingChatData.contractId}`);
            }
          }}
          userName={pendingChatData?.userName}
          userRole={pendingChatData?.userRole}
        />

        {/* Dispute Modal */}
        {showDisputeModal && selectedContractForDispute && (
          <CreateDisputeModal
            isOpen={showDisputeModal}
            onClose={() => {
              setShowDisputeModal(false);
              setSelectedContractForDispute(null);
            }}
            contractId={selectedContractForDispute._id}
            againstUserId={selectedContractForDispute.farmerId?._id}
            againstUserName={selectedContractForDispute.farmerId?.name}
            contractDetails={{
              cropName: selectedContractForDispute.cropId?.cropName,
              totalAmount: selectedContractForDispute.totalAmount,
            }}
          />
        )}
    </DashboardLayout>
  );
};

export default BuyerContracts;
