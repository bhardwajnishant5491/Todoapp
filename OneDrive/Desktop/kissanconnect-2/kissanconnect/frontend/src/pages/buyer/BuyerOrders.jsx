import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import contractService from '../../services/contractService';
import ratingService from '../../services/ratingService';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiPackage, 
  FiTruck, 
  FiCheck, 
  FiClock,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMessageCircle,
  FiStar
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import ChatWarningModal from '../../components/common/ChatWarningModal';
import RatingModal from '../../components/common/RatingModal';
import UserRatingDisplay from '../../components/common/UserRatingDisplay';

const BuyerOrders = () => {
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('buyer');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [actionLoading, setActionLoading] = useState(null);
  const [showChatWarning, setShowChatWarning] = useState(false);
  const [pendingChatData, setPendingChatData] = useState(null);
  const [farmerStats, setFarmerStats] = useState({});
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const [ratedContracts, setRatedContracts] = useState(new Set());

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await contractService.getAllContracts();
      
      if (result.success) {
        // Filter only accepted contracts (actual orders)
        const orderContracts = result.contracts.filter(
          contract => ['Accepted', 'In Progress', 'Delivered', 'Completed'].includes(contract.status)
        );
        setOrders(orderContracts);
        
        // Fetch farmer stats for all orders
        fetchFarmerStats(orderContracts);
        
        // Check which contracts have been rated
        checkRatedContracts(orderContracts);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('An error occurred while loading orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerStats = async (ordersList) => {
    const uniqueFarmers = [...new Set(ordersList.map(o => o.farmerId).filter(Boolean))];
    const statsPromises = uniqueFarmers.map(farmerId =>
      ratingService.getUserStats(farmerId)
    );
    
    const statsResults = await Promise.all(statsPromises);
    const statsMap = {};
    uniqueFarmers.forEach((farmerId, index) => {
      if (statsResults[index].success) {
        statsMap[farmerId] = statsResults[index].stats;
      }
    });
    setFarmerStats(statsMap);
  };

  const checkRatedContracts = async (ordersList) => {
    const completedOrders = ordersList.filter(o => o.status === 'Completed');
    const ratingCheckPromises = completedOrders.map(order =>
      ratingService.canRateContract(order._id)
    );
    
    const results = await Promise.all(ratingCheckPromises);
    const rated = new Set();
    completedOrders.forEach((order, index) => {
      if (results[index].success && !results[index].canRate && results[index].reason === 'Already rated') {
        rated.add(order._id);
      }
    });
    setRatedContracts(rated);
  };

  const handleConfirmReceipt = async (orderId) => {
    if (!window.confirm('Confirm that you have received this order? Payment will be released to the farmer.')) return;

    try {
      setActionLoading(orderId);
      const result = await contractService.updateContractStatus(orderId, 'Completed');
      
      if (result.success) {
        toast.success('✅ Order confirmed! Payment released to farmer.');
        await fetchOrders();
        
        // Check if already rated, if not show rating modal automatically
        const hasRated = await ratingService.canRateContract(orderId);
        if (hasRated.success && hasRated.canRate) {
          // Find the order to pass to rating modal
          const completedOrder = orders.find(o => o._id === orderId);
          if (completedOrder) {
            setSelectedOrderForRating(completedOrder);
            setShowRatingModal(true);
          }
        }
      } else {
        toast.error(result.message || 'Failed to confirm receipt');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast.error(error || 'An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRateOrder = (order) => {
    setSelectedOrderForRating(order);
    setShowRatingModal(true);
  };

  const handleRatingSubmitSuccess = () => {
    fetchOrders();
    setSelectedOrderForRating(null);
  };

  // Filter orders
  const activeOrders = orders.filter(o => ['Accepted', 'In Progress', 'Delivered'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'Completed');
  
  const filteredOrders = filter === 'active' ? activeOrders : completedOrders;

  const getStatusInfo = (status) => {
    const statusMap = {
      'Accepted': {
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: <FiCheck className="w-5 h-5" />,
        label: 'Order Confirmed',
        description: 'Farmer has accepted. Preparing for delivery.'
      },
      'In Progress': {
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: <FiTruck className="w-5 h-5" />,
        label: 'In Transit',
        description: 'Order is being delivered to you.'
      },
      'Delivered': {
        color: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: <FiPackage className="w-5 h-5" />,
        label: 'Delivered',
        description: 'Awaiting your confirmation to release payment.'
      },
      'Completed': {
        color: 'bg-gray-100 text-gray-700 border-gray-200',
        icon: <FiCheck className="w-5 h-5" />,
        label: 'Completed',
        description: 'Order completed successfully.'
      }
    };
    return statusMap[status] || statusMap['Accepted'];
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
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
          <FiPackage className="text-2xl" style={{ color: roleTokens.primaryColor }} />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">My Orders</h1>
        </div>
        <p className="text-gray-600 font-inter">Track your crop orders and deliveries</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Orders</p>
              <p className="text-3xl font-bold text-gray-900">{activeOrders.length}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
            >
              <FiTruck className="text-xl" style={{ color: roleTokens.primaryColor }} />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivered</p>
              <p className="text-3xl font-bold text-purple-600">
                {orders.filter(o => o.status === 'Delivered').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FiPackage className="text-xl text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FiCheck className="text-xl text-green-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('active')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            filter === 'active'
              ? 'text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          style={filter === 'active' ? { backgroundColor: roleTokens.primaryColor } : {}}
        >
          Active Orders ({activeOrders.length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            filter === 'completed'
              ? 'bg-green-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Completed ({completedOrders.length})
        </button>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          className="card text-center py-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div 
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
          >
            <FiPackage className="text-4xl" style={{ color: roleTokens.primaryColor }} />
          </div>
          <h3 className="text-xl font-bold mb-2">No {filter} orders</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'active' 
              ? "You don't have any active orders at the moment."
              : "You haven't completed any orders yet."}
          </p>
          {filter === 'active' && (
            <button
              onClick={() => navigate('/buyer/browse-crops')}
              className="btn-primary"
            >
              Browse Crops
            </button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => {
            const statusInfo = getStatusInfo(order.status);
            const totalAmount = order.quantity * order.pricePerUnit;

            return (
              <motion.div
                key={order._id}
                className="card hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Order Header */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
                    >
                      <GiWheat className="text-xl" style={{ color: roleTokens.primaryColor }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{order.cropId?.cropType || 'N/A'}</h3>
                      <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div 
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${statusInfo.color}`}
                  >
                    {statusInfo.icon}
                    <span className="font-medium text-sm">{statusInfo.label}</span>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  {/* Left Column */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Quantity</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {order.quantity} {order.cropId?.unit || 'units'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Amount</p>
                      <p className="text-2xl font-bold" style={{ color: roleTokens.primaryColor }}>
                        {formatCurrency(totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(order.pricePerUnit)}/{order.cropId?.unit || 'unit'}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Expected Delivery</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <FiClock className="w-4 h-4" />
                        {formatDate(order.deliveryDate)}
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Farmer</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        {order.cropId?.farmerName || 'N/A'}
                      </p>
                      
                      {/* Farmer Rating & Stats */}
                      {farmerStats[order.farmerId] && (
                        <div className="mt-1">
                          <UserRatingDisplay 
                            stats={farmerStats[order.farmerId]} 
                            size="small"
                          />
                        </div>
                      )}
                      
                      {/* Show phone only for Delivered/Completed, else show Message button */}
                      {(order.status === 'Delivered' || order.status === 'Completed') ? (
                        <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <FiPhone className="w-3 h-3" />
                          {order.cropId?.farmerPhone || 'N/A'}
                        </p>
                      ) : (
                        <button
                          onClick={() => {
                            setPendingChatData({
                              userId: order.farmerId,
                              contractId: order._id,
                              userName: order.cropId?.farmerName || 'Farmer',
                              userRole: 'Farmer'
                            });
                            setShowChatWarning(true);
                          }}
                          className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                          <FiMessageCircle className="w-3 h-3" />
                          Message Farmer
                        </button>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Delivery Address</p>
                      <p className="text-sm text-gray-700 flex items-start gap-2">
                        <FiMapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          {order.deliveryAddress?.address}, {order.deliveryAddress?.city},
                          {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Message */}
                <div 
                  className={`p-3 rounded-lg mb-4 ${statusInfo.color.replace('border-', 'bg-opacity-50 ')}`}
                >
                  <p className="text-sm font-medium">{statusInfo.description}</p>
                </div>

                {/* Action Button for Delivered Orders */}
                {order.status === 'Delivered' && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleConfirmReceipt(order._id)}
                      disabled={actionLoading === order._id}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                      style={{ backgroundColor: roleTokens.primaryColor }}
                    >
                      {actionLoading === order._id ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiCheck className="w-5 h-5" />
                          Confirm Receipt & Release Payment
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Completed Order Info */}
                {order.status === 'Completed' && (
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-600">
                      <FiCheck className="w-5 h-5" />
                      <span className="text-sm font-medium">Order completed on {formatDate(order.completedAt)}</span>
                    </div>
                    
                    {/* Rate Order Button */}
                    {!ratedContracts.has(order._id) ? (
                      <button
                        onClick={() => handleRateOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm"
                      >
                        <FiStar className="w-4 h-4" />
                        Rate Farmer
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <FiCheck className="w-4 h-4" />
                        <span>Already Rated</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
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
      {selectedOrderForRating && (
        <RatingModal
          isOpen={showRatingModal}
          onClose={() => {
            setShowRatingModal(false);
            setSelectedOrderForRating(null);
          }}
          contract={selectedOrderForRating}
          ratedUser={{
            _id: selectedOrderForRating.farmerId,
            name: selectedOrderForRating.cropId?.farmerName || 'Farmer',
          }}
          onSubmitSuccess={handleRatingSubmitSuccess}
        />
      )}
    </DashboardLayout>
  );
};

export default BuyerOrders;
