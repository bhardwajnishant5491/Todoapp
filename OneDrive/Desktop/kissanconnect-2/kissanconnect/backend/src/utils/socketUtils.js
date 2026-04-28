/**
 * Socket.IO Utility Functions
 * Helpers for emitting real-time events to connected clients
 */

/**
 * Emit notification to specific user
 */
export const emitNotification = (io, connectedUsers, userId, notification) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit('new_notification', notification);
    console.log(`📬 Notification sent to user ${userId}`);
  }
};

/**
 * Emit contract update to both farmer and buyer
 */
export const emitContractUpdate = (io, connectedUsers, contract) => {
  const farmerId = contract.farmerId?._id || contract.farmerId;
  const buyerId = contract.buyerId?._id || contract.buyerId;

  // Notify farmer
  const farmerSocketId = connectedUsers.get(farmerId?.toString());
  if (farmerSocketId) {
    io.to(farmerSocketId).emit('contract_update', {
      contractId: contract._id,
      status: contract.status,
      message: 'Contract status updated',
      contract,
    });
  }

  // Notify buyer
  const buyerSocketId = connectedUsers.get(buyerId?.toString());
  if (buyerSocketId) {
    io.to(buyerSocketId).emit('contract_update', {
      contractId: contract._id,
      status: contract.status,
      message: 'Contract status updated',
      contract,
    });
  }

  console.log(`📝 Contract update sent for contract ${contract._id}`);
};

/**
 * Emit new crop listing to all buyers
 */
export const emitNewCrop = (io, crop) => {
  io.emit('new_crop', {
    cropId: crop._id,
    cropType: crop.cropType,
    quantity: crop.quantity,
    pricePerUnit: crop.pricePerUnit,
    location: crop.location,
    message: 'New crop listed',
    crop,
  });
  console.log(`🌾 New crop broadcast: ${crop.cropType}`);
};

/**
 * Emit crop update to interested users
 */
export const emitCropUpdate = (io, connectedUsers, crop, interestedUserIds = []) => {
  interestedUserIds.forEach((userId) => {
    const socketId = connectedUsers.get(userId);
    if (socketId) {
      io.to(socketId).emit('crop_update', {
        cropId: crop._id,
        message: 'Crop information updated',
        crop,
      });
    }
  });
};

/**
 * Emit user status change (for admin dashboard)
 */
export const emitUserStatusChange = (io, user) => {
  io.emit('user_status_change', {
    userId: user._id,
    status: user.status,
    role: user.role,
    message: 'User status changed',
  });
  console.log(`👤 User status change broadcast: ${user.name}`);
};

/**
 * Broadcast system message to all connected users
 */
export const broadcastSystemMessage = (io, message) => {
  io.emit('system_message', {
    message,
    timestamp: new Date(),
  });
  console.log(`📢 System message broadcast: ${message}`);
};

/**
 * Get count of connected users
 */
export const getConnectedUsersCount = (connectedUsers) => {
  return connectedUsers.size;
};

/**
 * Check if user is online
 */
export const isUserOnline = (connectedUsers, userId) => {
  return connectedUsers.has(userId);
};

/**
 * Emit chat message to specific user
 */
export const emitChatMessage = (io, connectedUsers, receiverId, messageData) => {
  const socketId = connectedUsers.get(receiverId);
  if (socketId) {
    io.to(socketId).emit('new_message', messageData);
    console.log(`💬 Chat message sent to user ${receiverId}`);
  }
};

/**
 * Emit typing indicator to specific user
 */
export const emitTypingIndicator = (io, connectedUsers, receiverId, senderData) => {
  const socketId = connectedUsers.get(receiverId);
  if (socketId) {
    io.to(socketId).emit('user_typing', senderData);
  }
};
