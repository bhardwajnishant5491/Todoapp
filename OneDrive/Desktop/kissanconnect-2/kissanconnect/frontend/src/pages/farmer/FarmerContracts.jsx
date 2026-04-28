import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import contractService from '../../services/contractService';
import ratingService from '../../services/ratingService';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiFileText, FiCheck, FiX, FiClock, FiDownload, FiMessageCircle, FiPhone, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import ContractTimeline from '../../components/common/ContractTimeline';
import { getRoleTokens } from '../../utils/designTokens';
import { printContractPDF } from '../../utils/exportUtils';
import ChatWarningModal from '../../components/common/ChatWarningModal';
import RatingModal from '../../components/common/RatingModal';
import CreateDisputeModal from '../../components/common/CreateDisputeModal';
import UserRatingDisplay from '../../components/common/UserRatingDisplay';

const FarmerContracts = () => {
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('farmer');
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, Pending, Accepted, In Progress, Completed, Rejected
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [showChatWarning, setShowChatWarning] = useState(false);
  const [pendingChatData, setPendingChatData] = useState(null);
  const [buyerStats, setBuyerStats] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedContractForRating, setSelectedContractForRating] = useState(null);
  const [ratedContracts, setRatedContracts] = useState(new Set());
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
        
        // Fetch buyer stats for all contracts
        fetchBuyerStats(result.contracts);
        
        // Check which contracts have been rated
        checkRatedContracts(result.contracts);
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

  const fetchBuyerStats = async (contractsList) => {
    const uniqueBuyers = [...new Set(contractsList.map(c => c.buyerId?._id).filter(Boolean))];
    const statsPromises = uniqueBuyers.map(buyerId =>
      ratingService.getUserStats(buyerId)
    );
    
    const statsResults = await Promise.all(statsPromises);
    const statsMap = {};
    uniqueBuyers.forEach((buyerId, index) => {
      if (statsResults[index].success) {
        statsMap[buyerId] = statsResults[index].stats;
      }
    });
    setBuyerStats(statsMap);
  };

  const checkRatedContracts = async (contractsList) => {
    const completedContracts = contractsList.filter(c => c.status === 'Completed');
    const ratingCheckPromises = completedContracts.map(contract =>
      ratingService.canRateContract(contract._id)
    );
    
    const results = await Promise.all(ratingCheckPromises);
    const rated = new Set();
    completedContracts.forEach((contract, index) => {
      if (results[index].success && !results[index].canRate && results[index].reason === 'Already rated') {
        rated.add(contract._id);
      }
    });
    setRatedContracts(rated);
  };

  const handleRateContract = (contract) => {
    setSelectedContractForRating(contract);
    setShowRatingModal(true);
  };

  const handleRatingSubmitSuccess = () => {
    fetchContracts();
    setSelectedContractForRating(null);
  };

  const handleRaiseDispute = (contract) => {
    setSelectedContractForDispute(contract);
    setShowDisputeModal(true);
  };

  const handleAccept = async (contractId) => {
    if (!window.confirm('Are you sure you want to accept this contract?')) return;

    try {
      setActionLoading(contractId);
      const result = await contractService.acceptContract(contractId);
      
      if (result.success) {
        toast.success('Contract accepted successfully!');
        fetchContracts();
      } else {
        toast.error(result.message || 'Failed to accept contract');
      }
    } catch (error) {
      console.error('Error accepting contract:', error);
      toast.error(error?.message || 'Failed to accept contract');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (contractId) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(contractId);
      const result = await contractService.rejectContract(contractId, reason);
      
      if (result.success) {
        toast.success('Contract rejected');
        fetchContracts();
      } else {
        toast.error(result.message || 'Failed to reject contract');
      }
    } catch (error) {
      console.error('Error rejecting contract:', error);
      toast.error(error?.message || 'Failed to reject contract');
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAsCompleted = async (contractId) => {
    if (!window.confirm('Are you sure you want to mark this contract as completed? This action cannot be undone.')) return;

    try {
      setActionLoading(contractId);
      const result = await contractService.updateContractStatus(contractId, 'Completed');
      
      if (result.success) {
        toast.success('Contract marked as completed!');
        fetchContracts();
      } else {
        toast.error(result.message || 'Failed to update contract status');
      }
    } catch (error) {
      console.error('Error updating contract:', error);
      toast.error('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredContracts = filter === 'all' 
    ? contracts 
    : contracts.filter((contract) => contract.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Accepted: 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
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
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-3 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <div className="flex items-center gap-3 mb-2">
          <FiFileText className="text-2xl text-primary-600" />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">My Contracts</h1>
        </div>
        <p className="text-gray-600 font-inter">View and manage your contract agreements</p>
      </motion.div>
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
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
            onClick={() => setFilter('Completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'Completed'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Completed ({contracts.filter((c) => c.status === 'Completed').length})
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading contracts...</p>
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="card text-center py-12">
            <h3 className="text-xl font-bold mb-4">No contracts found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'You don\'t have any contracts yet.'
                : `No contracts with status "${filter}"`}
            </p>
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
                      This contract is currently on admin hold. Status-changing actions are temporarily disabled.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Buyer Info */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Buyer Details</h4>
                    <p><span className="font-medium">Name:</span> {contract.buyerId?.name}</p>
                    <p><span className="font-medium">Company:</span> {contract.buyerId?.companyName || 'N/A'}</p>
                    
                    {/* Buyer Rating & Stats */}
                    {buyerStats[contract.buyerId?._id] && (
                      <div className="mt-2">
                        <UserRatingDisplay 
                          stats={buyerStats[contract.buyerId._id]} 
                          size="small"
                        />
                      </div>
                    )}
                    
                    {/* Show phone only for Delivered/Completed - for delivery coordination */}
                    {(contract.status === 'Delivered' || contract.status === 'Completed') ? (
                      <p><span className="font-medium">Phone:</span> {contract.buyerId?.phone}</p>
                    ) : (
                      <button
                        onClick={() => {
                          setPendingChatData({
                            userId: contract.buyerId?._id,
                            contractId: contract._id,
                            userName: contract.buyerId?.name,
                            userRole: 'Buyer'
                          });
                          setShowChatWarning(true);
                        }}
                        className="mt-2 flex items-center gap-2 text-sm text-green-600 hover:text-green-700 font-medium"
                      >
                        <FiMessageCircle className="w-4 h-4" />
                        Message Buyer
                      </button>
                    )}
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
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">💰 Payment Terms: {contract.paymentTerms || 'Escrow Payment'}</p>
                  {contract.status === 'Accepted' && (
                    <p className="text-xs text-green-700">💵 Buyer's payment is locked in escrow. Will be released after delivery confirmation.</p>
                  )}
                  {contract.status === 'Delivered' && (
                    <p className="text-xs text-green-700">⏳ Waiting for buyer to confirm receipt. Payment will be released soon.</p>
                  )}
                  {contract.status === 'Completed' && (
                    <p className="text-xs text-green-700">✅ Payment released! Check your wallet.</p>
                  )}
                </div>

                {/* Buyer Notes */}
                {contract.buyerNotes && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700 mb-1">Buyer's Message:</p>
                    <p className="text-sm text-gray-700">{contract.buyerNotes}</p>
                  </div>
                )}

                {/* Action Buttons for Pending Contracts */}
                {contract.status === 'Pending' && (
                  <motion.div 
                    className="flex gap-3 mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={() => handleAccept(contract._id)}
                      disabled={actionLoading === contract._id || contract.interventionState?.isOnHold}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-2xl hover:from-green-700 hover:to-green-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiCheck className="w-5 h-5" />
                      {actionLoading === contract._id ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Processing...
                        </>
                      ) : (
                        'Accept Contract'
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(contract._id)}
                      disabled={actionLoading === contract._id || contract.interventionState?.isOnHold}
                      className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-red-600 font-semibold rounded-2xl border-2 border-red-200 hover:bg-red-50 hover:border-red-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiX className="w-5 h-5" />
                      Reject
                    </button>
                  </motion.div>
                )}

                {/* Action Button for Accepted Contracts - Start Delivery */}
                {contract.status === 'Accepted' && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={() => contractService.updateContractStatus(contract._id, 'In Progress').then(() => {
                        toast.success('Contract moved to In Progress');
                        fetchContracts();
                      }).catch((error) => {
                        toast.error(error?.message || 'Failed to update status');
                      })}
                      disabled={actionLoading === contract._id || contract.interventionState?.isOnHold}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-blue-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiCheck className="w-5 h-5" />
                      Start Delivery / In Progress
                    </button>
                  </motion.div>
                )}

                {/* Action Button for In Progress Contracts - Mark as Delivered */}
                {contract.status === 'In Progress' && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <button
                      onClick={() => {
                        if (window.confirm('Mark this order as delivered? Buyer will need to confirm receipt.')) {
                          contractService.updateContractStatus(contract._id, 'Delivered').then(() => {
                            toast.success('Marked as delivered! Waiting for buyer confirmation.');
                            fetchContracts();
                          }).catch((error) => {
                            toast.error(error?.message || 'Failed to update status');
                          });
                        }
                      }}
                      disabled={actionLoading === contract._id}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-2xl hover:from-purple-700 hover:to-purple-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      style={{ borderRadius: roleTokens.radius.lg }}
                    >
                      <FiCheck className="w-5 h-5" />
                      {actionLoading === contract._id ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Updating...
                        </>
                      ) : (
                        'Mark as Delivered'
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Status Message for Delivered Contracts */}
                {contract.status === 'Delivered' && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl text-center">
                      <FiClock className="inline-block text-2xl text-yellow-600 mb-2" />
                      <p className="font-semibold text-yellow-800">Waiting for Buyer Confirmation</p>
                      <p className="text-sm text-yellow-700 mt-1">Order has been marked as delivered. Payment will be released once buyer confirms receipt.</p>
                    </div>
                  </motion.div>
                )}

                {/* Rating Button for Completed Contracts */}
                {contract.status === 'Completed' && (
                  <motion.div 
                    className="mt-6 pt-4 border-t border-gray-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {ratedContracts.has(contract._id) ? (
                      <div className="p-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-center">
                        <FiCheck className="inline-block text-2xl text-green-600 mb-2" />
                        <p className="font-semibold text-gray-700">Already Rated</p>
                        <p className="text-sm text-gray-500 mt-1">Thank you for your feedback!</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRateContract(contract)}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-2xl hover:from-yellow-600 hover:to-orange-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        style={{ borderRadius: roleTokens.radius.lg }}
                      >
                        <FiStar className="w-5 h-5" />
                        Rate Buyer
                      </button>
                    )}
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
                      <FiX className="w-4 h-4" />
                      Raise a Dispute
                    </button>
                  </motion.div>
                )}

                {/* Timestamps */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      <p>Created: {new Date(contract.createdAt).toLocaleString()}</p>
                      {contract.acceptedAt && <p>Accepted: {new Date(contract.acceptedAt).toLocaleString()}</p>}
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
                      <ContractTimeline contract={contract} userRole="farmer" />
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

        {/* Rating Modal */}
        {showRatingModal && selectedContractForRating && (
          <RatingModal
            isOpen={showRatingModal}
            onClose={() => {
              setShowRatingModal(false);
              setSelectedContractForRating(null);
            }}
            contract={selectedContractForRating}
            ratedUser={{
              _id: selectedContractForRating.buyerId?._id,
              name: selectedContractForRating.buyerId?.name,
              role: 'Buyer'
            }}
            onSubmitSuccess={handleRatingSubmitSuccess}
          />
        )}

        {/* Dispute Modal */}
        {showDisputeModal && selectedContractForDispute && (
          <CreateDisputeModal
            isOpen={showDisputeModal}
            onClose={() => {
              setShowDisputeModal(false);
              setSelectedContractForDispute(null);
            }}
            contractId={selectedContractForDispute._id}
            againstUserId={selectedContractForDispute.buyerId?._id}
            againstUserName={selectedContractForDispute.buyerId?.name}
            contractDetails={{
              cropName: selectedContractForDispute.cropId?.cropName,
              totalAmount: selectedContractForDispute.totalAmount,
            }}
          />
        )}
    </DashboardLayout>
  );
};

export default FarmerContracts;
