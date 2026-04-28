import Dispute from '../models/Dispute.js';
import Contract from '../models/Contract.js';
import User from '../models/User.js';
import { createAuditLog } from '../utils/auditLogger.js';
import { sendDisputeRaisedEmail, sendDisputeResolvedEmail } from '../utils/emailService.js';

/**
 * @desc    Create a new dispute
 * @route   POST /api/disputes
 * @access  Private (Farmer/Buyer)
 */
export const createDispute = async (req, res) => {
  try {
    const { contractId, against, type, title, description, evidence } = req.body;

    // Validate required fields
    if (!contractId || !against || !type || !title || !description) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Check if contract exists
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Verify user is part of the contract
    const userId = req.user._id.toString();
    const isFarmer = contract.farmerId.toString() === userId;
    const isBuyer = contract.buyerId.toString() === userId;

    if (!isFarmer && !isBuyer) {
      return res.status(403).json({ 
        message: 'You are not authorized to raise dispute for this contract' 
      });
    }

    // Verify 'against' user is the other party
    const againstId = against.toString();
    const validAgainst = isFarmer 
      ? contract.buyerId.toString() === againstId
      : contract.farmerId.toString() === againstId;

    if (!validAgainst) {
      return res.status(400).json({ 
        message: 'Dispute must be against the other party in the contract' 
      });
    }

    // Create dispute
    const dispute = await Dispute.create({
      contractId,
      raisedBy: userId,
      against,
      type,
      title,
      description,
      evidence: evidence || [],
      status: 'open',
      priority: 'medium',
    });

    // Populate fields
    await dispute.populate([
      { path: 'raisedBy', select: 'name email phone role' },
      { path: 'against', select: 'name email phone role' },
      { path: 'contractId', select: 'cropId totalAmount status' },
    ]);

    // Send dispute emails
    try {
      const raisedByUser = await User.findById(userId).select('name email');
      const againstUser = await User.findById(against).select('name email');
      await sendDisputeRaisedEmail(raisedByUser, againstUser, contract, dispute);
    } catch (emailError) {
      console.error('Email error (dispute raised):', emailError.message);
    }

    res.status(201).json({
      dispute,
    });
  } catch (error) {
    console.error('Create dispute error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all disputes (Admin) or user's disputes
 * @route   GET /api/disputes
 * @access  Private
 */
export const getAllDisputes = async (req, res) => {
  try {
    const { status, priority, type, assigned } = req.query;
    const isAdmin = req.user.role === 'admin';

    let query = {};

    // If not admin, only show disputes user is involved in
    if (!isAdmin) {
      query.$or = [
        { raisedBy: req.user._id },
        { against: req.user._id },
      ];
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if (assigned === 'true') query.assignedTo = { $ne: null };
    if (assigned === 'false') query.assignedTo = null;

    const disputes = await Dispute.find(query)
      .populate('raisedBy', 'name email phone role')
      .populate('against', 'name email phone role')
      .populate('contractId', 'cropId totalAmount status')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Calculate stats for admin
    const stats = isAdmin ? {
      total: disputes.length,
      open: disputes.filter(d => d.status === 'open').length,
      investigating: disputes.filter(d => d.status === 'investigating').length,
      resolved: disputes.filter(d => d.status === 'resolved').length,
      closed: disputes.filter(d => d.status === 'closed').length,
      highPriority: disputes.filter(d => d.priority === 'high').length,
      unassigned: disputes.filter(d => !d.assignedTo).length,
    } : null;

    res.status(200).json({
      success: true,
      disputes,
      stats,
    });
  } catch (error) {
    console.error('Get disputes error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get single dispute by ID
 * @route   GET /api/disputes/:id
 * @access  Private
 */
export const getDisputeById = async (req, res) => {
  try {
    const { id } = req.params;

    const dispute = await Dispute.findById(id)
      .populate('raisedBy', 'name email phone role wallet')
      .populate('against', 'name email phone role wallet')
      .populate('contractId')
      .populate('assignedTo', 'name email')
      .populate('messages.sender', 'name role');

    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isInvolved = 
      dispute.raisedBy._id.toString() === req.user._id.toString() ||
      dispute.against._id.toString() === req.user._id.toString();

    if (!isAdmin && !isInvolved) {
      return res.status(403).json({ 
        message: 'You are not authorized to view this dispute' 
      });
    }

    // If not admin, filter out internal messages
    if (!isAdmin) {
      dispute.messages = dispute.messages.filter(msg => !msg.isInternal);
    }

    res.status(200).json({
      success: true,
      dispute,
    });
  } catch (error) {
    console.error('Get dispute error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Assign dispute to admin
 * @route   PUT /api/disputes/:id/assign
 * @access  Private/Admin
 */
export const assignDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    // Verify adminId is an admin user
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid admin user' });
    }

    const existingDispute = await Dispute.findById(id);
    if (!existingDispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    const dispute = await Dispute.findByIdAndUpdate(
      id,
      {
        assignedTo: adminId,
        status: existingDispute.status === 'open' ? 'investigating' : existingDispute.status,
      },
      { new: true }
    )
      .populate('raisedBy', 'name email')
      .populate('against', 'name email')
      .populate('assignedTo', 'name email');

    await createAuditLog({
      entityType: 'dispute',
      entityId: dispute._id,
      action: 'admin_assign',
      reason: `Assigned to ${admin.name}`,
      actor: req.user._id,
      req,
      metadata: { adminId },
    });

    res.status(200).json({
      success: true,
      message: 'Dispute assigned successfully',
      dispute,
    });
  } catch (error) {
    console.error('Assign dispute error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update dispute status
 * @route   PUT /api/disputes/:id/status
 * @access  Private/Admin
 */
export const updateDisputeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'investigating', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'resolved' || status === 'closed') {
      updateData.resolvedAt = new Date();
    }

    const dispute = await Dispute.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate('raisedBy', 'name email')
      .populate('against', 'name email')
      .populate('assignedTo', 'name email');

    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    await createAuditLog({
      entityType: 'dispute',
      entityId: dispute._id,
      action: 'admin_status_update',
      reason: `Status changed to ${status}`,
      actor: req.user._id,
      req,
      metadata: { status },
    });

    res.status(200).json({
      success: true,
      message: 'Dispute status updated successfully',
      dispute,
    });
  } catch (error) {
    console.error('Update dispute status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Resolve dispute with resolution notes
 * @route   PUT /api/disputes/:id/resolve
 * @access  Private/Admin
 */
export const resolveDispute = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    if (!resolution || resolution.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Please provide resolution details' 
      });
    }

    const dispute = await Dispute.findByIdAndUpdate(
      id,
      {
        status: 'resolved',
        resolution,
        resolvedAt: new Date(),
      },
      { new: true }
    )
      .populate('raisedBy', 'name email')
      .populate('against', 'name email')
      .populate('assignedTo', 'name email');

    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    await createAuditLog({
      entityType: 'dispute',
      entityId: dispute._id,
      action: 'admin_resolve',
      reason: resolution,
      actor: req.user._id,
      req,
      metadata: { status: 'resolved' },
    });

    // Send resolution emails to both parties
    try {
      const raisedByUser = await User.findById(dispute.raisedBy).select('name email');
      const againstUser = await User.findById(dispute.against).select('name email');
      const contract = await Contract.findById(dispute.contractId).select('_id');
      await sendDisputeResolvedEmail(raisedByUser, contract, resolution);
      await sendDisputeResolvedEmail(againstUser, contract, resolution);
    } catch (emailError) {
      console.error('Email error (dispute resolved):', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Dispute resolved successfully',
      dispute,
    });
  } catch (error) {
    console.error('Resolve dispute error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Add message to dispute
 * @route   POST /api/disputes/:id/message
 * @access  Private
 */
export const addDisputeMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, isInternal } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const dispute = await Dispute.findById(id);
    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isInvolved = 
      dispute.raisedBy.toString() === req.user._id.toString() ||
      dispute.against.toString() === req.user._id.toString();

    if (!isAdmin && !isInvolved) {
      return res.status(403).json({ 
        message: 'You are not authorized to add message to this dispute' 
      });
    }

    // Only admins can add internal notes
    const isInternalNote = isAdmin && isInternal;

    dispute.messages.push({
      sender: req.user._id,
      message: message.trim(),
      isInternal: isInternalNote,
      timestamp: new Date(),
    });

    await dispute.save();

    // Populate the new message
    await dispute.populate('messages.sender', 'name role');

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      dispute,
    });
  } catch (error) {
    console.error('Add dispute message error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete dispute (Admin only)
 * @route   DELETE /api/disputes/:id
 * @access  Private/Admin
 */
export const deleteDispute = async (req, res) => {
  try {
    const { id } = req.params;

    const dispute = await Dispute.findByIdAndDelete(id);

    if (!dispute) {
      return res.status(404).json({ message: 'Dispute not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Dispute deleted successfully',
    });
  } catch (error) {
    console.error('Delete dispute error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
