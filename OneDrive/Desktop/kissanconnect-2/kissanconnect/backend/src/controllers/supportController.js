import Support from '../models/Support.js';
import User from '../models/User.js';

/**
 * @desc    Create a new support ticket
 * @route   POST /api/support
 * @access  Public (with optional authentication)
 */
export const createSupportTicket = async (req, res) => {
  try {
    const { name, email, phone, subject, category, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !category || !message) {
      return res.status(400).json({
        message: 'Please provide all required fields',
      });
    }

    // Create support ticket
    const ticket = await Support.create({
      userId: req.user?._id || null, // Optional - can be anonymous
      name,
      email,
      phone,
      subject,
      category,
      message,
      status: 'open',
      priority: 'medium',
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      ticket,
    });
  } catch (error) {
    console.error('Create support ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all support tickets (Admin) or user's tickets
 * @route   GET /api/support
 * @access  Private
 */
export const getAllSupportTickets = async (req, res) => {
  try {
    const { status, category, priority, assigned } = req.query;
    const isAdmin = req.user.role === 'admin';

    let query = {};

    // If not admin, only show user's own tickets
    if (!isAdmin) {
      query.$or = [
        { userId: req.user._id },
        { email: req.user.email },
      ];
    }

    // Apply filters
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (assigned === 'true') query.assignedTo = { $ne: null };
    if (assigned === 'false') query.assignedTo = null;

    const tickets = await Support.find(query)
      .populate('userId', 'name email phone role')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name role')
      .sort({ lastActivityAt: -1 });

    // Calculate stats for admin
    const stats = isAdmin
      ? {
          total: tickets.length,
          open: tickets.filter((t) => t.status === 'open').length,
          inProgress: tickets.filter((t) => t.status === 'in-progress').length,
          resolved: tickets.filter((t) => t.status === 'resolved').length,
          closed: tickets.filter((t) => t.status === 'closed').length,
          highPriority: tickets.filter((t) => t.priority === 'high').length,
          unassigned: tickets.filter((t) => !t.assignedTo).length,
        }
      : null;

    res.status(200).json({
      success: true,
      tickets,
      stats,
    });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get single support ticket
 * @route   GET /api/support/:id
 * @access  Private
 */
export const getSupportTicketById = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Support.findById(id)
      .populate('userId', 'name email phone role')
      .populate('assignedTo', 'name email')
      .populate('responses.respondedBy', 'name role email');

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Check authorization
    const isAdmin = req.user.role === 'admin';
    const isOwner =
      ticket.userId?.toString() === req.user._id.toString() ||
      ticket.email === req.user.email;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: 'You are not authorized to view this ticket',
      });
    }

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error('Get support ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Reply to support ticket
 * @route   POST /api/support/:id/reply
 * @access  Private/Admin
 */
export const replyToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const ticket = await Support.findById(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    // Add response
    ticket.responses.push({
      respondedBy: req.user._id,
      message: message.trim(),
      timestamp: new Date(),
    });

    // Update status to in-progress if it's open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
    }

    ticket.lastActivityAt = new Date();

    await ticket.save();

    // Populate the new response
    await ticket.populate('responses.respondedBy', 'name role');

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      ticket,
    });
  } catch (error) {
    console.error('Reply to ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Assign ticket to admin
 * @route   PUT /api/support/:id/assign
 * @access  Private/Admin
 */
export const assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;

    // Verify adminId is an admin user
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json({ message: 'Invalid admin user' });
    }

    const ticket = await Support.findByIdAndUpdate(
      id,
      {
        assignedTo: adminId,
        status: ticket.status === 'open' ? 'in-progress' : ticket.status,
      },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket assigned successfully',
      ticket,
    });
  } catch (error) {
    console.error('Assign ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update ticket status
 * @route   PUT /api/support/:id/status
 * @access  Private/Admin
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }
    if (status === 'closed') {
      updateData.closedAt = new Date();
    }

    const ticket = await Support.findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket status updated successfully',
      ticket,
    });
  } catch (error) {
    console.error('Update ticket status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Close ticket
 * @route   PUT /api/support/:id/close
 * @access  Private/Admin
 */
export const closeTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Support.findByIdAndUpdate(
      id,
      {
        status: 'closed',
        closedAt: new Date(),
      },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket closed successfully',
      ticket,
    });
  } catch (error) {
    console.error('Close ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete ticket (Admin only)
 * @route   DELETE /api/support/:id
 * @access  Private/Admin
 */
export const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;

    const ticket = await Support.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
