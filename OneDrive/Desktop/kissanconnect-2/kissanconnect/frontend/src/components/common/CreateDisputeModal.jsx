import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { createDispute } from '../../services/disputeService';

const CreateDisputeModal = ({ isOpen, onClose, contractId, againstUserId, againstUserName, contractDetails }) => {
  const [formData, setFormData] = useState({
    type: 'quality',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const disputeTypes = [
    { value: 'quality', label: 'Quality Issues', desc: 'Product quality not as expected' },
    { value: 'quantity', label: 'Quantity Issues', desc: 'Incorrect quantity delivered' },
    { value: 'delivery', label: 'Delivery Issues', desc: 'Late delivery or not delivered' },
    { value: 'payment', label: 'Payment Issues', desc: 'Payment not received or incorrect' },
    { value: 'contract_terms', label: 'Contract Terms', desc: 'Violation of contract terms' },
    { value: 'other', label: 'Other', desc: 'Other issues not listed above' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (formData.description.length < 20) {
      setError('Description must be at least 20 characters');
      setLoading(false);
      return;
    }

    try {
      await createDispute({
        contractId,
        against: againstUserId,
        type: formData.type,
        title: formData.title,
        description: formData.description,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        window.location.reload(); // Refresh to show updated status
      }, 2000);
    } catch (err) {
      setError(err || 'Failed to create dispute. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ type: 'quality', title: '', description: '' });
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
          />

          {/* Modal Container - Fixed positioning with centering */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-6 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Raise a Dispute</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Against: <span className="font-semibold">{againstUserName}</span>
                </p>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3"
              >
                <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-green-800 font-medium">Dispute Submitted Successfully!</p>
                  <p className="text-green-700 text-sm mt-1">
                    An admin will review your dispute and contact you soon.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Contract Info */}
            {contractDetails && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Contract Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Crop:</span>{' '}
                    <span className="font-medium text-gray-900">{contractDetails.cropName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Amount:</span>{' '}
                    <span className="font-medium text-gray-900">₹{contractDetails.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Dispute Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {disputeTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative flex items-start p-3 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.type === type.value
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleChange}
                        className="mt-1 text-green-600 focus:ring-green-500"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-500">{type.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Brief summary of the issue"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={loading || success}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100 characters</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain the issue in detail. Include dates, amounts, and any relevant information..."
                  rows={6}
                  maxLength={1000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  disabled={loading || success}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.description.length}/1000 characters (min 20)</p>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Once submitted, an admin will review your dispute within 24-48 hours. 
                  You'll be able to add more details and communicate with the admin through the dispute thread.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || success}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : success ? (
                    <>
                      <FiCheckCircle size={20} />
                      Submitted
                    </>
                  ) : (
                    'Submit Dispute'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateDisputeModal;
