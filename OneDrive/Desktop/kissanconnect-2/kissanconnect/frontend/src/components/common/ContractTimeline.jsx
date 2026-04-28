import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCircle, FiClock, FiFileText, FiCheck, FiTruck, FiAward } from 'react-icons/fi';
import { getRoleTokens } from '../../utils/designTokens';

const ContractTimeline = ({ contract, userRole = 'farmer' }) => {
  const roleTokens = getRoleTokens(userRole);

  // Define timeline stages
  const stages = [
    {
      id: 1,
      status: 'Created',
      label: 'Contract Created',
      icon: FiFileText,
      description: 'Contract proposal initiated',
      timestamp: contract.createdAt,
      completed: true,
    },
    {
      id: 2,
      status: 'Pending',
      label: 'Awaiting Approval',
      icon: FiClock,
      description: 'Waiting for farmer to review and accept',
      timestamp: contract.createdAt,
      completed: contract.status !== 'Pending',
    },
    {
      id: 3,
      status: 'Accepted',
      label: 'Contract Accepted',
      icon: FiCheck,
      description: 'Both parties have agreed to terms',
      timestamp: contract.acceptedAt || null,
      completed: ['Accepted', 'In Progress', 'Completed'].includes(contract.status),
    },
    {
      id: 4,
      status: 'In Progress',
      label: 'In Progress',
      icon: FiTruck,
      description: 'Contract is being fulfilled',
      timestamp: contract.inProgressAt || null,
      completed: ['In Progress', 'Completed'].includes(contract.status),
    },
    {
      id: 5,
      status: 'Completed',
      label: 'Completed',
      icon: FiAward,
      description: 'Contract successfully completed',
      timestamp: contract.completedAt || null,
      completed: contract.status === 'Completed',
    },
  ];

  // Handle rejected contracts
  if (contract.status === 'Rejected') {
    return (
      <div className="py-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
          >
            <FiCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Contract Rejected</h3>
          <p className="text-gray-600 mb-4">This contract was not accepted</p>
          {contract.rejectionReason && (
            <div className="p-4 bg-red-50 rounded-lg max-w-md">
              <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason:</p>
              <p className="text-sm text-red-600">{contract.rejectionReason}</p>
            </div>
          )}
          {contract.rejectedAt && (
            <p className="text-xs text-gray-400 mt-3">
              Rejected on {new Date(contract.rejectedAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="py-6">
      {/* Timeline Container */}
      <div className="relative">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = contract.status === stage.status;
          const isCompleted = stage.completed;
          const isLast = index === stages.length - 1;

          return (
            <motion.div
              key={stage.id}
              className="relative pb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {/* Vertical Line */}
              {!isLast && (
                <div
                  className="absolute left-4 top-8 w-0.5 h-full -ml-px"
                  style={{
                    backgroundColor: isCompleted ? roleTokens.primaryColor : '#E5E7EB',
                  }}
                />
              )}

              {/* Timeline Item */}
              <div className="flex items-start gap-4">
                {/* Icon Circle */}
                <motion.div
                  className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'ring-4 ring-opacity-20'
                      : 'bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: isCompleted ? roleTokens.primaryColor : undefined,
                    ringColor: isCompleted ? `${roleTokens.primaryColor}40` : undefined,
                  }}
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isActive ? Infinity : 0,
                    repeatType: 'reverse',
                  }}
                >
                  {isCompleted ? (
                    <FiCheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon 
                      className="w-4 h-4 text-gray-400"
                      style={{ color: isActive ? roleTokens.primaryColor : undefined }}
                    />
                  )}
                </motion.div>

                {/* Content */}
                <div className="flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-semibold ${
                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {stage.label}
                    </h4>
                    {stage.timestamp && (
                      <span className="text-xs text-gray-400 ml-2">
                        {formatDate(stage.timestamp)}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isCompleted ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {stage.description}
                  </p>

                  {/* Notes/Messages for specific stages */}
                  {isActive && stage.status === 'Pending' && (
                    <motion.div
                      className="mt-3 p-3 rounded-lg"
                      style={{ backgroundColor: `${roleTokens.primaryColor}10` }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <p className="text-sm font-medium" style={{ color: roleTokens.primaryColor }}>
                        ⏳ Action Required: {userRole === 'farmer' ? 'Review and accept this contract' : 'Waiting for farmer approval'}
                      </p>
                    </motion.div>
                  )}

                  {contract.buyerNotes && stage.status === 'Created' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 mb-1">Buyer's Message:</p>
                      <p className="text-sm text-blue-600">{contract.buyerNotes}</p>
                    </div>
                  )}

                  {contract.farmerNotes && stage.status === 'Accepted' && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs font-medium text-green-700 mb-1">Farmer's Note:</p>
                      <p className="text-sm text-green-600">{contract.farmerNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Card */}
      <motion.div
        className="mt-6 p-4 rounded-xl"
        style={{ 
          backgroundColor: `${roleTokens.primaryColor}08`,
          borderLeft: `4px solid ${roleTokens.primaryColor}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700">Current Status</p>
            <p className="text-lg font-bold" style={{ color: roleTokens.primaryColor }}>
              {contract.status}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="text-sm text-gray-600">
              {formatDate(contract.updatedAt || contract.createdAt)}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContractTimeline;
