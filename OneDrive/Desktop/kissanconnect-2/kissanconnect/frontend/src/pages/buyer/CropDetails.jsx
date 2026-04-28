import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import cropService from '../../services/cropService';
import contractService from '../../services/contractService';
import ratingService from '../../services/ratingService';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiPackage, FiFileText, FiMapPin, FiMessageCircle } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import ChatWarningModal from '../../components/common/ChatWarningModal';
import UserRatingDisplay from '../../components/common/UserRatingDisplay';

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens('buyer');
  const [crop, setCrop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [showChatWarning, setShowChatWarning] = useState(false);
  const [pendingChatUserId, setPendingChatUserId] = useState(null);
  const [farmerStats, setFarmerStats] = useState(null);
  const [proposalData, setProposalData] = useState({
    quantity: '',
    pricePerUnit: '',
    deliveryDate: '',
    paymentTerms: 'Escrow Payment (100% Secured)',
    buyerNotes: '',
    deliveryAddress: {
      address: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCropDetails();
  }, [id]);

  const fetchCropDetails = async () => {
    try {
      setLoading(true);
      const result = await cropService.getCropById(id);
      
      if (result.success) {
        setCrop(result.crop);
        // Pre-fill proposal with crop data
        setProposalData(prev => ({
          ...prev,
          quantity: result.crop.quantity,
          pricePerUnit: result.crop.pricePerUnit,
        }));
        // Fetch farmer stats
        if (result.crop.farmerId?._id) {
          fetchFarmerStats(result.crop.farmerId._id);
        }
      } else {
        toast.error('Crop not found');
        navigate('/buyer/browse-crops');
      }
    } catch (error) {
      console.error('Error fetching crop:', error);
      toast.error('Failed to load crop details');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmerStats = async (farmerId) => {
    try {
      const result = await ratingService.getUserStats(farmerId);
      if (result.success) {
        setFarmerStats(result.stats);
      }
    } catch (error) {
      console.error('Error fetching farmer stats:', error);
    }
  };

  const handleProposalChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProposalData({
        ...proposalData,
        [parent]: {
          ...proposalData[parent],
          [child]: value,
        },
      });
    } else {
      setProposalData({
        ...proposalData,
        [name]: value,
      });
    }
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    // Check crop availability before submitting
    if (crop.status !== 'Available') {
      toast.error(`Cannot send proposal - crop is ${crop.status.toLowerCase()}`);
      setShowProposalForm(false);
      return;
    }
    
    try {
      setSubmitting(true);
      
      const contractData = {
        cropId: crop._id,
        ...proposalData,
      };
      
      const result = await contractService.createContract(contractData);
      
      if (result.success) {
        toast.success('Contract proposal sent successfully!');
        navigate('/buyer/contracts');
      } else {
        toast.error(result.message || 'Failed to send proposal');
      }
    } catch (error) {
      console.error('Error sending proposal:', error);
      toast.error(error?.message || 'Failed to send proposal');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-accent-600"></div>
            <p className="mt-4 text-gray-600 font-inter">Loading crop details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!crop) {
    return null;
  }

  const totalValue = proposalData.quantity * proposalData.pricePerUnit;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => navigate('/buyer/browse-crops')}
          className="flex items-center gap-2 text-gray-600 hover:text-accent-600 mb-3 transition-colors"
        >
          <FiArrowLeft /> Back to Browse
        </button>
        <div className="flex items-center gap-3 mb-2">
          <FiPackage className="text-2xl text-accent-600" />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">Crop Details</h1>
        </div>
        <p className="text-gray-600 font-inter">Review crop information and send contract proposal</p>
      </motion.div>
      {/* Crop Details Card */}
          <motion.div 
            className="bg-white rounded-xl p-6 mb-6"
            style={{ 
              borderRadius: roleTokens.radius.card,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Crop Image */}
            <div className="w-full h-80 rounded-xl mb-6 overflow-hidden bg-gray-100">
              {crop.images && crop.images.length > 0 && crop.images[0] !== 'https://via.placeholder.com/400x300?text=Crop+Image' ? (
                <img
                  src={crop.images[0]}
                  alt={crop.cropType}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
                  <GiWheat className="text-8xl text-primary-300" />
                </div>
              )}
            </div>

            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{crop.cropType}</h1>
                <span 
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    crop.status === 'Available' 
                      ? 'bg-green-100 text-green-700' 
                      : crop.status === 'In Contract'
                      ? 'bg-blue-100 text-blue-700'
                      : crop.status === 'Sold'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {crop.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Quality</p>
                <p className="text-lg font-semibold">{crop.quality}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Crop Information */}
              <div>
                <h3 className="font-bold text-lg mb-3">Crop Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Quantity:</span> {crop.quantity} {crop.unit}</p>
                  <p><span className="font-medium">Price:</span> ₹{crop.pricePerUnit}/{crop.unit}</p>
                  <p><span className="font-medium">Total Value:</span> ₹{(crop.quantity * crop.pricePerUnit).toLocaleString()}</p>
                  <p><span className="font-medium">Harvest Date:</span> {new Date(crop.harvestDate).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Farmer Information */}
              <div>
                <h3 className="font-bold text-lg mb-3">Farmer Information</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Name:</span> {crop.farmerId?.name}</p>
                  
                  {/* Farmer Rating & Stats */}
                  {farmerStats && (
                    <div className="my-3">
                      <UserRatingDisplay 
                        stats={farmerStats} 
                        size="medium"
                        showDetails={true}
                      />
                    </div>
                  )}
                  
                  {/* Message button instead of phone - encourage in-app communication */}
                  <button
                    onClick={() => {
                      setPendingChatUserId(crop.farmerId?._id);
                      setShowChatWarning(true);
                    }}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Message Farmer
                  </button>
                  
                  {/* Chat Warning Modal */}
                  <ChatWarningModal
                    isOpen={showChatWarning}
                    onClose={() => {
                      setShowChatWarning(false);
                      setPendingChatUserId(null);
                    }}
                    onAccept={() => {
                      setShowChatWarning(false);
                      if (pendingChatUserId) {
                        navigate(`/chat?userId=${pendingChatUserId}`);
                      }
                    }}
                    userName={crop.farmerId?.name}
                    userRole="Farmer"
                  />
                  
                  {crop.farmerId?.farmSize && (
                    <p><span className="font-medium">Farm Size:</span> {crop.farmerId.farmSize} acres</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    📍 {crop.location.village}, {crop.location.district}, {crop.location.state} - {crop.location.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {crop.description && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-2">Description</h3>
                <p className="text-gray-700">{crop.description}</p>
              </div>
            )}

            {/* Action Button */}
            {!showProposalForm && crop.status === 'Available' && (
              <motion.button
                onClick={() => setShowProposalForm(true)}
                className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold py-3 text-lg rounded-xl hover:from-accent-700 hover:to-accent-600 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                style={{ borderRadius: roleTokens.radius.card }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiFileText /> Send Contract Proposal
              </motion.button>
            )}
            
            {/* Unavailable Message */}
            {!showProposalForm && crop.status !== 'Available' && (
              <div className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
                <div className="text-gray-500 mb-2">
                  <FiFileText className="inline-block text-3xl mb-2" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  This crop is currently {crop.status.toLowerCase()}
                </h3>
                <p className="text-gray-600">
                  {crop.status === 'In Contract' && 'This crop is already under contract negotiation.'}
                  {crop.status === 'Sold' && 'This crop has already been sold to another buyer.'}
                  {crop.status === 'Unavailable' && 'This crop is currently unavailable for contract.'}
                </p>
                <button
                  onClick={() => navigate('/buyer/browse-crops')}
                  className="mt-4 px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  Browse Other Crops
                </button>
              </div>
            )}
          </motion.div>

          {/* Contract Proposal Form */}
          {showProposalForm && (
            <motion.div 
              className="bg-white rounded-xl p-8"
              style={{ 
                borderRadius: roleTokens.radius.card,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiFileText className="text-2xl text-accent-600" />
                <h2 className="text-2xl font-poppins font-bold">Send Contract Proposal</h2>
              </div>
              
              <form onSubmit={handleSubmitProposal} className="space-y-6">
                {/* Quantity and Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity ({crop.unit}) *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={proposalData.quantity}
                      onChange={handleProposalChange}
                      className="input-field"
                      max={crop.quantity}
                      min="1"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Max: {crop.quantity} {crop.unit}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price per {crop.unit} (₹) *
                    </label>
                    <input
                      type="number"
                      name="pricePerUnit"
                      value={proposalData.pricePerUnit}
                      onChange={handleProposalChange}
                      className="input-field"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Total Amount Display */}
                <div className="p-4 bg-accent-50 rounded-lg">
                  <p className="text-lg font-bold text-accent-700">
                    Total Amount: ₹{totalValue.toLocaleString()}
                  </p>
                </div>

                {/* Delivery Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Delivery Date *
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={proposalData.deliveryDate}
                    onChange={handleProposalChange}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* Payment Terms - Escrow System Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment System
                  </label>
                  <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">🔒 Secure Escrow Payment</h4>
                        <p className="text-sm text-blue-800 leading-relaxed">
                          100% payment is locked in secure escrow when farmer accepts. Funds are released to farmer only after you confirm receipt of goods.
                        </p>
                        <ul className="mt-2 text-xs text-blue-700 space-y-1">
                          <li>✓ Payment locked when farmer accepts contract</li>
                          <li>✓ Released only after you confirm delivery</li>
                          <li>✓ Platform takes 4% commission</li>
                          <li>✓ Full buyer protection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="font-semibold mb-3">Delivery Address</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      name="deliveryAddress.address"
                      value={proposalData.deliveryAddress.address}
                      onChange={handleProposalChange}
                      placeholder="Street Address"
                      className="input-field"
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="deliveryAddress.city"
                        value={proposalData.deliveryAddress.city}
                        onChange={handleProposalChange}
                        placeholder="City"
                        className="input-field"
                        required
                      />
                      <input
                        type="text"
                        name="deliveryAddress.state"
                        value={proposalData.deliveryAddress.state}
                        onChange={handleProposalChange}
                        placeholder="State"
                        className="input-field"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      name="deliveryAddress.pincode"
                      value={proposalData.deliveryAddress.pincode}
                      onChange={handleProposalChange}
                      placeholder="Pincode"
                      className="input-field"
                      pattern="[0-9]{6}"
                      required
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="buyerNotes"
                    value={proposalData.buyerNotes}
                    onChange={handleProposalChange}
                    className="input-field"
                    rows="4"
                    placeholder="Any special requirements or terms..."
                    maxLength="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">{proposalData.buyerNotes.length}/500 characters</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-accent-600 to-accent-500 text-white font-semibold py-3 rounded-xl hover:from-accent-700 hover:to-accent-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{ borderRadius: roleTokens.radius.card }}
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiFileText /> Send Proposal
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                    style={{ borderRadius: roleTokens.radius.card }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
    </DashboardLayout>
  );
};

export default CropDetails;
