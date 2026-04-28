import Contract from '../models/Contract.js';
import Crop from '../models/Crop.js';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { emitContractUpdate, emitNotification } from '../utils/socketUtils.js';
import { generateContractHash, verifyContractHash } from '../utils/hashGenerator.js';
import {
  sendContractProposalEmail,
  sendContractAcceptedEmail,
  sendContractRejectedEmail,
  sendPaymentReleasedEmail,
  sendContractCompletedEmail,
} from '../utils/emailService.js';

// @desc    Create new contract proposal
// @route   POST /api/contracts
// @access  Private (Buyer only)
export const createContract = async (req, res) => {
  try {
    const {
      cropId,
      quantity,
      pricePerUnit,
      deliveryDate,
      deliveryAddress,
      terms,
      paymentTerms,
      buyerNotes,
    } = req.body;

    // Verify crop exists and is available
    const crop = await Crop.findById(cropId).populate('farmerId');
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found',
      });
    }

    if (crop.status !== 'Available') {
      return res.status(400).json({
        success: false,
        message: 'Crop is not available for contract',
      });
    }

    // Check if buyer is trying to contract their own crop
    if (crop.farmerId._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot create a contract for your own crop',
      });
    }

    // Validate quantity
    if (quantity > crop.quantity) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity (${quantity}) exceeds available quantity (${crop.quantity})`,
      });
    }

    const finalPricePerUnit = Number(pricePerUnit || crop.pricePerUnit);
    const totalAmount = Number(quantity) * finalPricePerUnit;

    // Ensure buyer can fund escrow before allowing proposal creation.
    const buyer = await User.findById(req.user._id);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        message: 'Buyer not found',
      });
    }

    const availableBalance = buyer.getAvailableBalance();
    if (availableBalance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient wallet balance to create proposal. Available: ₹${availableBalance}, Required: ₹${totalAmount}`,
      });
    }

    // Create contract
    const contract = await Contract.create({
      cropId,
      farmerId: crop.farmerId._id,
      buyerId: req.user._id,
      quantity,
      unit: crop.unit,
      pricePerUnit: finalPricePerUnit,
      totalAmount,
      deliveryDate,
      deliveryAddress,
      terms,
      paymentTerms,
      buyerNotes,
    });

    // Populate contract details
    const populatedContract = await Contract.findById(contract._id)
      .populate('farmerId', 'name phone email')
      .populate('buyerId', 'name phone email companyName')
      .populate('cropId', 'cropType quality location');

    // Send email to farmer
    try {
      const farmer = await User.findById(crop.farmerId._id).select('name email');
      const buyer = await User.findById(req.user._id).select('name email companyName');
      await sendContractProposalEmail(farmer, buyer, populatedContract, crop);
    } catch (emailError) {
      console.error('Email error (proposal):', emailError.message);
    }

    // Emit real-time notification to farmer
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      
      if (io && connectedUsers) {
        // Notify farmer about new contract proposal
        emitNotification(io, connectedUsers, crop.farmerId._id.toString(), {
          id: Date.now(),
          type: 'info',
          title: 'New Contract Proposal',
          message: `${req.user.name} sent you a contract proposal for ${quantity} ${crop.unit} of ${crop.cropType}`,
          timestamp: new Date(),
          read: false,
          contractId: contract._id,
        });

        // Emit contract update event
        emitContractUpdate(io, connectedUsers, populatedContract);
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
      // Don't fail the request if socket fails
    }

    res.status(201).json({
      success: true,
      message: 'Contract proposal sent successfully',
      contract: populatedContract,
    });
  } catch (error) {
    console.error('❌ Create contract error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create contract',
    });
  }
};

// @desc    Get all contracts (with filters)
// @route   GET /api/contracts
// @access  Private
export const getAllContracts = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build filter based on user role
    const filter = {};
    
    if (req.user.role === 'farmer') {
      filter.farmerId = req.user._id;
    } else if (req.user.role === 'buyer') {
      filter.buyerId = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const contracts = await Contract.find(filter)
      .sort('-createdAt')
      .limit(limitNum)
      .skip(skip)
      .populate('farmerId', 'name phone email')
      .populate('buyerId', 'name phone email companyName')
      .populate('cropId', 'cropType quantity unit quality location');

    const total = await Contract.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: contracts.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      contracts,
    });
  } catch (error) {
    console.error('❌ Get contracts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contracts',
    });
  }
};

// @desc    Get single contract by ID
// @route   GET /api/contracts/:id
// @access  Private (Contract parties only)
export const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'name phone email address')
      .populate('buyerId', 'name phone email companyName gstNumber')
      .populate('cropId');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    // Check if user is authorized to view this contract
    const isFarmer = contract.farmerId._id.toString() === req.user._id.toString();
    const isBuyer = contract.buyerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isBuyer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contract',
      });
    }

    res.status(200).json({
      success: true,
      contract,
    });
  } catch (error) {
    console.error('❌ Get contract error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contract',
    });
  }
};

// @desc    Update contract status (Accept/Reject/Complete)
// @route   PUT /api/contracts/:id/status
// @access  Private (Farmer for accept/reject, Both parties for complete)
export const updateContractStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const contract = await Contract.findById(req.params.id)
      .populate('cropId')
      .populate('farmerId', 'name')
      .populate('buyerId', 'name');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    // Check authorization based on action
    const isFarmer = contract.farmerId._id.toString() === req.user._id.toString();
    const isBuyer = contract.buyerId._id.toString() === req.user._id.toString();

    // Hard-enforce admin hold policy on backend so transitions cannot be bypassed via API tampering.
    if (contract.interventionState?.isOnHold === true) {
      return res.status(423).json({
        success: false,
        message: contract.interventionState?.lastReason
          ? `Contract is currently on admin hold: ${contract.interventionState.lastReason}`
          : 'Contract is currently on admin hold. Status transitions are blocked until hold is removed.',
      });
    }

    if (status === 'Accepted' || status === 'Rejected') {
      // Only farmer can accept/reject
      if (!isFarmer) {
        return res.status(403).json({
          success: false,
          message: 'Only the farmer can accept or reject contracts',
        });
      }

      if (contract.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Can only accept/reject pending contracts',
        });
      }

      if (status === 'Accepted') {
        // PAYMENT PROCESSING: Lock buyer's funds in escrow
        const buyer = await User.findById(contract.buyerId._id);
        
        if (!buyer) {
          return res.status(404).json({
            success: false,
            message: 'Buyer not found',
          });
        }

        // Check if buyer has sufficient balance
        const availableBalance = buyer.getAvailableBalance();
        if (availableBalance < contract.totalAmount) {
          return res.status(400).json({
            success: false,
            message: `Insufficient wallet balance. Available: ₹${availableBalance}, Required: ₹${contract.totalAmount}`,
          });
        }

        // Lock funds in buyer's wallet (Escrow)
        try {
          buyer.lockFunds(contract.totalAmount);
          await buyer.save();

          // Create escrow transaction
          const escrowTransaction = await Transaction.create({
            user: buyer._id,
            type: 'contract_advance',
            amount: contract.totalAmount,
            status: 'pending',
            description: `Escrow payment for contract ${contract._id.toString().slice(-8)} - ${contract.quantity} ${contract.unit} of ${contract.cropId.cropType}`,
            contract: contract._id,
            relatedUser: contract.farmerId._id,
            paymentGateway: 'demo',
            balanceBefore: buyer.wallet.balance,
            balanceAfter: buyer.wallet.balance,
            metadata: {
              escrowStatus: 'locked',
              platformCommission: Math.round(contract.totalAmount * 0.04),
              farmerAmount: Math.round(contract.totalAmount * 0.96),
            },
            notes: 'Funds locked in escrow until contract completion',
          });

          contract.escrowTransactionId = escrowTransaction._id;
        } catch (paymentError) {
          console.error('Payment error:', paymentError);
          return res.status(500).json({
            success: false,
            message: paymentError.message || 'Payment processing failed',
          });
        }

        // Send accepted email to buyer
        try {
          const buyer = await User.findById(contract.buyerId._id).select('name email');
          const farmer = await User.findById(contract.farmerId._id).select('name email');
          const cropDoc = await Crop.findById(contract.cropId._id).select('cropType');
          await sendContractAcceptedEmail(buyer, farmer, contract, cropDoc);
        } catch (emailError) {
          console.error('Email error (accepted):', emailError.message);
        }

        contract.status = 'Accepted';
        contract.acceptedAt = new Date();
        
        // 🔒 GENERATE SHA-256 HASH (Digital Signature)
        try {
          const hash = generateContractHash(contract);
          contract.contractHash = hash;
          contract.isLocked = true;
          contract.hashGeneratedAt = new Date();
          console.log(`🔐 Contract ${contract._id} secured with SHA-256 hash: ${hash.substring(0, 16)}...`);
        } catch (hashError) {
          console.error('Hash generation error:', hashError);
          // Don't fail contract acceptance if hash fails
          // Hash is additional security, not critical for operation
        }
        
        // Update crop status
        contract.cropId.status = 'In Contract';
        await contract.cropId.save();
      } else if (status === 'Rejected') {
        // Send rejected email to buyer
        try {
          const buyer = await User.findById(contract.buyerId._id).select('name email');
          const farmer = await User.findById(contract.farmerId._id).select('name email');
          const cropDoc = await Crop.findById(contract.cropId._id).select('cropType');
          await sendContractRejectedEmail(buyer, farmer, contract, cropDoc);
        } catch (emailError) {
          console.error('Email error (rejected):', emailError.message);
        }
        contract.status = 'Rejected';
        contract.rejectedAt = new Date();
        contract.rejectionReason = notes;
      }
      
      if (notes) {
        contract.farmerNotes = notes;
      }
    } else if (status === 'In Progress') {
      // Only farmer can start delivery
      if (!isFarmer) {
        return res.status(403).json({
          success: false,
          message: 'Only farmer can start delivery',
        });
      }
      
      if (contract.status !== 'Accepted') {
        return res.status(400).json({
          success: false,
          message: 'Contract must be accepted first',
        });
      }
      
      contract.status = 'In Progress';
      contract.inProgressAt = new Date();
    } else if (status === 'Delivered') {
      // Only farmer can mark as delivered
      if (!isFarmer) {
        return res.status(403).json({
          success: false,
          message: 'Only farmer can mark as delivered',
        });
      }
      
      if (contract.status !== 'In Progress') {
        return res.status(400).json({
          success: false,
          message: 'Contract must be in progress first',
        });
      }
      
      contract.status = 'Delivered';
      contract.deliveredAt = new Date();
      
      // Notify buyer to confirm receipt
      try {
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');
        
        if (io && connectedUsers) {
          emitNotification(io, connectedUsers, contract.buyerId._id.toString(), {
            type: 'info',
            title: 'Order Delivered',
            message: `Farmer has delivered ${contract.quantity} ${contract.unit} of ${contract.cropId.cropType}. Please confirm receipt to release payment.`,
            timestamp: new Date(),
            contractId: contract._id,
          });
        }
      } catch (socketError) {
        console.error('Socket notification error:', socketError);
      }
    } else if (status === 'Completed') {
      // Only buyer can confirm completion (after delivery)
      if (!isBuyer) {
        return res.status(403).json({
          success: false,
          message: 'Only buyer can confirm receipt and complete the contract',
        });
      }
      
      if (contract.status !== 'Delivered') {
        return res.status(400).json({
          success: false,
          message: 'Contract must be delivered first',
        });
      }
      
      // PAYMENT PROCESSING: Release escrow funds to farmer
      const buyer = await User.findById(contract.buyerId._id);
      const farmer = await User.findById(contract.farmerId._id);
      
      if (!buyer || !farmer) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Calculate amounts
      const totalAmount = contract.totalAmount;
      const platformCommission = Math.round(totalAmount * 0.04); // 4% commission
      const farmerAmount = totalAmount - platformCommission;

      try {
        // Unlock buyer's funds only if they are actually locked
        if (buyer.wallet.lockedAmount >= totalAmount) {
          buyer.unlockFunds(totalAmount);
        }
        // Deduct from buyer's wallet
        buyer.deductFromWallet(totalAmount);
        await buyer.save();

        // Add to farmer's wallet (after commission)
        farmer.addToWallet(farmerAmount);
        await farmer.save();

        // Update escrow transaction to completed
        if (contract.escrowTransactionId) {
          const escrowTx = await Transaction.findById(contract.escrowTransactionId);
          if (escrowTx) {
            escrowTx.status = 'completed';
            escrowTx.processedAt = new Date();
            escrowTx.notes = 'Escrow released - Contract completed';
            await escrowTx.save();
          }
        }

        // Create farmer payment transaction
        await Transaction.create({
          user: farmer._id,
          type: 'contract_payment',
          amount: farmerAmount,
          status: 'completed',
          description: `Payment received for contract ${contract._id.toString().slice(-8)} - ${contract.quantity} ${contract.unit} of ${contract.cropId.cropType}`,
          contract: contract._id,
          relatedUser: buyer._id,
          paymentGateway: 'demo',
          balanceBefore: farmer.wallet.balance - farmerAmount,
          balanceAfter: farmer.wallet.balance,
          gatewayTransactionId: `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          processedAt: new Date(),
          metadata: {
            grossAmount: totalAmount,
            platformCommission: platformCommission,
            netAmount: farmerAmount,
          },
        });

        // Create commission transaction for platform
        await Transaction.create({
          user: farmer._id,
          type: 'commission',
          amount: platformCommission,
          status: 'completed',
          description: `Platform commission (4%) for contract ${contract._id.toString().slice(-8)}`,
          contract: contract._id,
          relatedUser: buyer._id,
          paymentGateway: 'demo',
          balanceBefore: farmer.wallet.balance,
          balanceAfter: farmer.wallet.balance,
          processedAt: new Date(),
          metadata: {
            commissionRate: '4%',
            grossAmount: totalAmount,
          },
        });

        // Send payment emails
        try {
          const farmerUser = await User.findById(contract.farmerId._id).select('name email');
          const buyerUser = await User.findById(contract.buyerId._id).select('name email');
          await sendPaymentReleasedEmail(farmerUser, buyerUser, contract, farmerAmount, platformCommission);
          await sendContractCompletedEmail(buyerUser, farmerUser, contract);
        } catch (emailError) {
          console.error('Email error (payment):', emailError.message);
        }

        // Emit payment notifications
        const io = req.app.get('io');
        const connectedUsers = req.app.get('connectedUsers');
        
        if (io && connectedUsers) {
          // Notify farmer
          emitNotification(io, connectedUsers, farmer._id.toString(), {
            id: Date.now(),
            type: 'success',
            title: 'Payment Received',
            message: `₹${farmerAmount.toLocaleString('en-IN')} credited to your wallet (After 4% commission)`,
            timestamp: new Date(),
            read: false,
          });

          // Notify buyer
          emitNotification(io, connectedUsers, buyer._id.toString(), {
            id: Date.now() + 1,
            type: 'success',
            title: 'Payment Completed',
            message: `₹${totalAmount.toLocaleString('en-IN')} paid for contract ${contract._id.toString().slice(-8)}`,
            timestamp: new Date(),
            read: false,
          });
        }
      } catch (paymentError) {
        console.error('Payment release error:', paymentError);
        return res.status(500).json({
          success: false,
          message: paymentError.message || 'Payment processing failed',
        });
      }

      contract.status = 'Completed';
      contract.completedAt = new Date();
      
      // Update crop status to sold
      contract.cropId.status = 'Sold';
      await contract.cropId.save();
    } else if (status === 'Cancelled') {
      // Either party can cancel
      if (!isFarmer && !isBuyer) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }
      
      // PAYMENT PROCESSING: Refund locked funds if contract was accepted
      if (contract.status === 'Accepted' || contract.status === 'In Progress') {
        const buyer = await User.findById(contract.buyerId._id);
        
        if (buyer) {
          try {
            // Unlock the escrowed funds only if they are actually locked
            if (buyer.wallet.lockedAmount >= contract.totalAmount) {
              buyer.unlockFunds(contract.totalAmount);
            }
            await buyer.save();

            // Update escrow transaction to cancelled
            if (contract.escrowTransactionId) {
              const escrowTx = await Transaction.findById(contract.escrowTransactionId);
              if (escrowTx) {
                escrowTx.status = 'cancelled';
                escrowTx.processedAt = new Date();
                escrowTx.notes = `Contract cancelled - Funds unlocked and returned to buyer`;
                await escrowTx.save();
              }
            }

            // Create refund transaction record
            await Transaction.create({
              user: buyer._id,
              type: 'refund',
              amount: contract.totalAmount,
              status: 'completed',
              description: `Refund for cancelled contract ${contract._id.toString().slice(-8)}`,
              contract: contract._id,
              relatedUser: contract.farmerId._id,
              paymentGateway: 'demo',
              balanceBefore: buyer.wallet.balance,
              balanceAfter: buyer.wallet.balance,
              processedAt: new Date(),
              notes: 'Escrow funds unlocked due to contract cancellation',
            });

            // Emit refund notification
            const io = req.app.get('io');
            const connectedUsers = req.app.get('connectedUsers');
            
            if (io && connectedUsers) {
              emitNotification(io, connectedUsers, buyer._id.toString(), {
                id: Date.now(),
                type: 'info',
                title: 'Funds Unlocked',
                message: `₹${contract.totalAmount.toLocaleString('en-IN')} unlocked due to contract cancellation`,
                timestamp: new Date(),
                read: false,
              });
            }
          } catch (refundError) {
            console.error('Refund error:', refundError);
            // Don't fail the cancellation, just log the error
          }
        }
      }

      contract.status = 'Cancelled';
      contract.cancelledAt = new Date();
      
      // If crop was in contract, make it available again
      if (contract.cropId.status === 'In Contract') {
        contract.cropId.status = 'Available';
        await contract.cropId.save();
      }
    }

    await contract.save();

    // Emit real-time notifications for status updates
    try {
      const io = req.app.get('io');
      const connectedUsers = req.app.get('connectedUsers');
      
      if (io && connectedUsers) {
        // Emit contract update to both parties
        emitContractUpdate(io, connectedUsers, contract);

        // Send specific notifications based on status
        if (status === 'Accepted') {
          // Notify buyer
          emitNotification(io, connectedUsers, contract.buyerId._id.toString(), {
            id: Date.now(),
            type: 'success',
            title: 'Contract Accepted',
            message: `${contract.farmerId.name} accepted your contract! ₹${contract.totalAmount.toLocaleString('en-IN')} locked in escrow.`,
            timestamp: new Date(),
            read: false,
            contractId: contract._id,
          });
        } else if (status === 'Rejected') {
          // Notify buyer
          emitNotification(io, connectedUsers, contract.buyerId._id.toString(), {
            id: Date.now(),
            type: 'warning',
            title: 'Contract Rejected',
            message: `${contract.farmerId.name} rejected your contract proposal.`,
            timestamp: new Date(),
            read: false,
            contractId: contract._id,
          });
        } else if (status === 'Completed') {
          // Notify both parties
          const otherPartyId = isFarmer ? contract.buyerId._id.toString() : contract.farmerId._id.toString();
          const otherPartyName = isFarmer ? contract.buyerId.name : contract.farmerId.name;
          
          emitNotification(io, connectedUsers, otherPartyId, {
            id: Date.now(),
            type: 'success',
            title: 'Contract Completed',
            message: `Contract has been marked as completed by ${req.user.name}`,
            timestamp: new Date(),
            read: false,
            contractId: contract._id,
          });
        }
      }
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
      // Don't fail the request if socket fails
    }

    res.status(200).json({
      success: true,
      message: `Contract ${status.toLowerCase()} successfully`,
      contract,
    });
  } catch (error) {
    console.error('❌ Update contract status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update contract status',
    });
  }
};

// @desc    Get farmer's contract statistics
// @route   GET /api/contracts/farmer/stats
// @access  Private (Farmer only)
export const getFarmerContractStats = async (req, res) => {
  try {
    const totalContracts = await Contract.countDocuments({
      farmerId: req.user._id,
    });

    const pendingContracts = await Contract.countDocuments({
      farmerId: req.user._id,
      status: 'Pending',
    });

    const activeContracts = await Contract.countDocuments({
      farmerId: req.user._id,
      status: { $in: ['Accepted', 'In Progress'] },
    });

    const completedContracts = await Contract.countDocuments({
      farmerId: req.user._id,
      status: 'Completed',
    });

    // Calculate total earnings from completed contracts
    const completedContractsList = await Contract.find({
      farmerId: req.user._id,
      status: 'Completed',
    });

    const totalEarnings = completedContractsList.reduce(
      (sum, contract) => sum + contract.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        totalContracts,
        pendingContracts,
        activeContracts,
        completedContracts,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error('❌ Get farmer contract stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};

// @desc    Get buyer's contract statistics
// @route   GET /api/contracts/buyer/stats
// @access  Private (Buyer only)
export const getBuyerContractStats = async (req, res) => {
  try {
    const totalContracts = await Contract.countDocuments({
      buyerId: req.user._id,
    });

    const pendingContracts = await Contract.countDocuments({
      buyerId: req.user._id,
      status: 'Pending',
    });

    const activeContracts = await Contract.countDocuments({
      buyerId: req.user._id,
      status: { $in: ['Accepted', 'In Progress'] },
    });

    const completedContracts = await Contract.countDocuments({
      buyerId: req.user._id,
      status: 'Completed',
    });

    // Calculate total spending
    const contractsList = await Contract.find({
      buyerId: req.user._id,
      status: { $in: ['Accepted', 'In Progress', 'Completed'] },
    });

    const totalSpending = contractsList.reduce(
      (sum, contract) => sum + contract.totalAmount,
      0
    );

    const pendingPayments = contractsList
      .filter((c) => c.paymentStatus !== 'Completed')
      .reduce((sum, contract) => sum + (contract.totalAmount - contract.amountPaid), 0);

    res.status(200).json({
      success: true,
      stats: {
        totalContracts,
        pendingContracts,
        activeContracts,
        completedContracts,
        totalSpending,
        pendingPayments,
      },
    });
  } catch (error) {
    console.error('❌ Get buyer contract stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
    });
  }
};

// @desc    Verify contract integrity using SHA-256 hash
// @route   GET /api/contracts/:id/verify
// @access  Private (Contract parties + Admin)
export const verifyContractIntegrity = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('farmerId', 'name phone')
      .populate('buyerId', 'name companyName')
      .populate('cropId', 'cropType quantity unit');

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found',
      });
    }

    // Check authorization
    const isFarmer = contract.farmerId._id.toString() === req.user._id.toString();
    const isBuyer = contract.buyerId._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isBuyer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this contract',
      });
    }

    // Check if contract has a hash
    if (!contract.contractHash) {
      return res.status(400).json({
        success: false,
        message: 'This contract does not have a digital signature yet. Hash is generated when farmer accepts the contract.',
        hasHash: false,
      });
    }

    // Verify the hash
    const verification = verifyContractHash(contract, contract.contractHash);

    res.status(200).json({
      success: true,
      verification: {
        isValid: verification.isValid,
        message: verification.message,
        storedHash: verification.storedHash,
        currentHash: verification.currentHash,
        hashGeneratedAt: contract.hashGeneratedAt,
        isLocked: contract.isLocked,
        contractDetails: {
          contractId: contract._id,
          farmer: contract.farmerId.name,
          buyer: contract.buyerId.name || contract.buyerId.companyName,
          crop: contract.cropId.cropType,
          quantity: `${contract.quantity} ${contract.unit}`,
          totalAmount: contract.totalAmount,
          status: contract.status,
          acceptedAt: contract.acceptedAt,
        },
      },
    });
  } catch (error) {
    console.error('❌ Contract verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify contract',
      error: error.message,
    });
  }
};
