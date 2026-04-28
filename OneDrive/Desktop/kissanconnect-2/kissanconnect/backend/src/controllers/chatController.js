import Message from '../models/Message.js';
import User from '../models/User.js';
import Contract from '../models/Contract.js';

// @desc    Send a message
// @route   POST /api/chat/send
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, message, contractId } = req.body;
    const senderId = req.user._id;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    // Generate conversation ID
    const conversationId = Message.generateConversationId(senderId, receiverId);

    // Create message
    const newMessage = await Message.create({
      conversationId,
      senderId,
      receiverId,
      contractId,
      message,
      messageType: 'text',
    });

    // Populate sender and receiver details
    await newMessage.populate([
      { path: 'senderId', select: 'name profilePic role' },
      { path: 'receiverId', select: 'name profilePic role' },
    ]);

    // Emit real-time notification via Socket.IO
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      const { emitNotification } = await import('../utils/socketUtils.js');
      
      if (io && connectedUsers) {
        const receiverSocketId = connectedUsers.get(receiverId.toString());
        
        if (receiverSocketId) {
          // Send chat message event
          io.to(receiverSocketId).emit('new_message', {
            message: newMessage,
            sender: {
              _id: req.user._id,
              name: req.user.name,
              role: req.user.role,
            },
          });
          
          // Send notification for notification dropdown
          emitNotification(io, connectedUsers, receiverId.toString(), {
            id: `${Date.now()}-${newMessage._id.toString()}`,
            type: 'message',
            title: 'New Message',
            message: `${req.user.name} sent you a message`,
            link: `/chat?userId=${req.user._id}`,
            timestamp: new Date().toISOString(),
            read: false,
          });
        }
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage,
    });
  } catch (error) {
    console.error('❌ Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send message',
    });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/chat/conversation/:userId
// @access  Private
export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Generate conversation ID
    const conversationId = Message.generateConversationId(currentUserId, userId);

    // Fetch messages
    const messages = await Message.find({ conversationId })
      .populate('senderId', 'name profilePic role')
      .populate('receiverId', 'name profilePic role')
      .sort({ createdAt: 1 });

    // Mark messages as read where current user is receiver
    await Message.updateMany(
      {
        conversationId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    console.error('❌ Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversation',
    });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/chat/conversations
// @access  Private
export const getAllConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all unique conversation IDs where user is involved
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiverId', userId] }, { $eq: ['$isRead', false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { 'lastMessage.createdAt': -1 },
      },
    ]);

    // Populate user details for each conversation
    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const lastMessage = await Message.findById(conv.lastMessage._id)
          .populate('senderId', 'name profilePic role')
          .populate('receiverId', 'name profilePic role');

        // Determine the other user in conversation
        const otherUser =
          lastMessage.senderId._id.toString() === userId.toString()
            ? lastMessage.receiverId
            : lastMessage.senderId;

        return {
          conversationId: conv._id,
          otherUser,
          lastMessage,
          unreadCount: conv.unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations,
    });
  } catch (error) {
    console.error('❌ Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch conversations',
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/chat/unread-count
// @access  Private
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count: unreadCount,
    });
  } catch (error) {
    console.error('❌ Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get unread count',
    });
  }
};

// @desc    Mark conversation as read
// @route   PUT /api/chat/mark-read/:userId
// @access  Private
export const markConversationAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const conversationId = Message.generateConversationId(currentUserId, userId);

    await Message.updateMany(
      {
        conversationId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true, readAt: new Date() },
      }
    );

    res.status(200).json({
      success: true,
      message: 'Conversation marked as read',
    });
  } catch (error) {
    console.error('❌ Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark as read',
    });
  }
};

// @desc    Get chat participants for a contract
// @route   GET /api/chat/contract/:contractId/participants
// @access  Private
export const getContractParticipants = async (req, res) => {
  try {
    const { contractId } = req.params;
    const userId = req.user._id;

    const contract = await Contract.findById(contractId)
      .populate('farmerId', 'name profilePic role phone')
      .populate('buyerId', 'name profilePic role phone');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    // Determine the other participant
    const otherUser =
      contract.farmerId._id.toString() === userId.toString()
        ? contract.buyerId
        : contract.farmerId;

    res.status(200).json({
      success: true,
      data: {
        otherUser,
        contract: {
          _id: contract._id,
          status: contract.status,
        },
      },
    });
  } catch (error) {
    console.error('❌ Get participants error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get participants',
    });
  }
};

// @desc    Get user details for chat
// @route   GET /api/chat/user/:userId
// @access  Private
export const getUserForChat = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('name profilePic role phone');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('❌ Get user for chat error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get user details',
    });
  }
};
