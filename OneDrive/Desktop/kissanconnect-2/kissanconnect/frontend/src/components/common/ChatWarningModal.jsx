import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX, FiShield, FiEye } from 'react-icons/fi';

const ChatWarningModal = ({ isOpen, onClose, onAccept, userName, userRole }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header with Warning Color */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="text-2xl" />
                </div>
                <h2 className="text-2xl font-bold">Important Warning</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition"
              >
                <FiX className="text-xl" />
              </button>
            </div>
            <p className="text-sm text-white text-opacity-90">
              Please read carefully before proceeding
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-4">
              <p className="text-gray-700 mb-3">
                You are about to start a conversation with{' '}
                <span className="font-semibold text-gray-900">{userName}</span>{' '}
                ({userRole}).
              </p>
            </div>

            {/* Warning Points */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <FiEye className="text-red-600 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">
                    🔍 Monitored Communication
                  </h4>
                  <p className="text-sm text-red-800">
                    All chat messages are monitored and recorded for platform security and dispute resolution.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <FiShield className="text-orange-600 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-900 mb-1">
                    ⚠️ Platform Protection
                  </h4>
                  <p className="text-sm text-orange-800">
                    <strong className="font-bold">DO NOT</strong> share phone numbers, email addresses, WhatsApp numbers, or any contact information for deals outside this platform.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-red-100 border-2 border-red-300 rounded-lg">
                <FiAlertTriangle className="text-red-700 text-xl flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">
                    🚫 Permanent Ban Policy
                  </h4>
                  <p className="text-sm text-red-900">
                    <strong className="font-bold uppercase">Warning:</strong> Any attempt to bypass the platform by conducting deals outside will result in{' '}
                    <span className="font-bold underline">immediate and permanent account termination</span>{' '}
                    with no refund of any locked funds.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> Phone numbers are only revealed for delivery coordination after payment is secured in escrow. All transactions must be completed through KissanConnect to ensure protection for both parties.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-600 transition shadow-lg"
              >
                I Understand, Proceed
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ChatWarningModal;
