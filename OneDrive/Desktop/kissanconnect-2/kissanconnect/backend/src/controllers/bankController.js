import User from '../models/User.js';

/**
 * @desc    Get bank details for authenticated user
 * @route   GET /api/bank
 * @access  Private
 */
export const getBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('bankDetails');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mask account number for security (show only last 4 digits)
    const bankDetails = user.bankDetails ? { ...user.bankDetails.toObject() } : null;
    if (bankDetails && bankDetails.accountNumber) {
      const accNum = bankDetails.accountNumber;
      bankDetails.accountNumber = 'XXXX' + accNum.slice(-4);
      bankDetails.accountNumberFull = accNum; // Send full for edit form
    }

    res.status(200).json({
      success: true,
      bankDetails,
    });
  } catch (error) {
    console.error('Get bank details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Add or update bank details
 * @route   PUT /api/bank
 * @access  Private (Farmers only)
 */
export const updateBankDetails = async (req, res) => {
  try {
    const {
      accountHolderName,
      accountNumber,
      ifscCode,
      bankName,
      branchName,
      accountType,
      upiId,
      panNumber,
    } = req.body;

    // Validate required fields
    if (!accountHolderName || !accountNumber || !ifscCode || !bankName) {
      return res.status(400).json({
        message: 'Please provide account holder name, account number, IFSC code, and bank name',
      });
    }

    // Validate IFSC code format (11 characters: 4 letters, 0, 6 alphanumeric)
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(ifscCode.toUpperCase())) {
      return res.status(400).json({
        message: 'Invalid IFSC code format',
      });
    }

    // Validate account number (min 9, max 18 digits)
    if (accountNumber.length < 9 || accountNumber.length > 18) {
      return res.status(400).json({
        message: 'Account number must be between 9 and 18 digits',
      });
    }

    // Validate PAN format if provided (10 characters: 5 letters, 4 digits, 1 letter)
    if (panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(panNumber.toUpperCase())) {
        return res.status(400).json({
          message: 'Invalid PAN number format',
        });
      }
    }

    // Update user bank details
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bankDetails = {
      accountHolderName: accountHolderName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.toUpperCase().trim(),
      bankName: bankName.trim(),
      branchName: branchName ? branchName.trim() : '',
      accountType: accountType || 'Savings',
      upiId: upiId ? upiId.toLowerCase().trim() : '',
      panNumber: panNumber ? panNumber.toUpperCase().trim() : '',
      isVerified: false, // Admin needs to verify
    };

    await user.save();

    // Mask account number in response
    const bankDetails = { ...user.bankDetails.toObject() };
    const accNum = bankDetails.accountNumber;
    bankDetails.accountNumber = 'XXXX' + accNum.slice(-4);

    res.status(200).json({
      success: true,
      message: 'Bank details updated successfully. Verification pending.',
      bankDetails,
    });
  } catch (error) {
    console.error('Update bank details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Verify bank details (Admin only)
 * @route   PUT /api/bank/verify/:userId
 * @access  Private/Admin
 */
export const verifyBankDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.bankDetails || !user.bankDetails.accountNumber) {
      return res.status(400).json({ message: 'User has not added bank details yet' });
    }

    user.bankDetails.isVerified = isVerified;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Bank details ${isVerified ? 'verified' : 'unverified'} successfully`,
      bankDetails: user.bankDetails,
    });
  } catch (error) {
    console.error('Verify bank details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete bank details
 * @route   DELETE /api/bank
 * @access  Private
 */
export const deleteBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.bankDetails = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bank details deleted successfully',
    });
  } catch (error) {
    console.error('Delete bank details error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
