import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUser, FiLock, FiSave, FiArrowLeft, FiCreditCard, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getBankDetails, updateBankDetails } from '../services/bankService';
import authService from '../services/authService';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { getRoleTokens } from '../utils/designTokens';

const Settings = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const roleTokens = getRoleTokens(user?.role || 'farmer');
  
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    companyName: user?.companyName || '',
    farmSize: user?.farmSize || '',
    profilePic: user?.profilePic || '',
  });
  const [profileImagePreview, setProfileImagePreview] = useState(user?.profilePic || '');
  const [profileImageChanged, setProfileImageChanged] = useState(false);
  const [profileImageLoadFailed, setProfileImageLoadFailed] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: '',
    accountType: 'Savings',
    upiId: '',
    panNumber: '',
  });
  
  const [bankDetails, setBankDetails] = useState(null);
  const [loadingBank, setLoadingBank] = useState(false);
  
  const [errors, setErrors] = useState({});
  
  // Fetch bank details on mount (for farmer and buyer)
  useEffect(() => {
    if (user?.role === 'farmer' || user?.role === 'buyer') {
      fetchBankDetails();
    }
  }, [user?.role]);
  
  const fetchBankDetails = async () => {
    try {
      const response = await getBankDetails();
      if (response.bankDetails) {
        setBankDetails(response.bankDetails);
        // Populate form with existing data (use full account number for editing)
        const details = response.bankDetails;
        setBankData({
          accountHolderName: details.accountHolderName || '',
          accountNumber: details.accountNumberFull || '',
          ifscCode: details.ifscCode || '',
          bankName: details.bankName || '',
          branchName: details.branchName || '',
          accountType: details.accountType || 'Savings',
          upiId: details.upiId || '',
          panNumber: details.panNumber || '',
        });
      }
    } catch (error) {
      console.error('Error fetching bank details:', error);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, or WEBP images are allowed');
      return;
    }

    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setProfileData((prev) => ({ ...prev, profilePic: base64 }));
      setProfileImagePreview(base64);
      setProfileImageChanged(true);
      setProfileImageLoadFailed(false);
      updateUser({ ...user, profilePic: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankData({
      ...bankData,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateProfile = () => {
    const newErrors = {};
    
    if (!profileData.name || profileData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    
    if (!profileData.phone || !/^\d{10}$/.test(profileData.phone)) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }
    
    if (user?.role === 'buyer' && profileData.companyName && profileData.companyName.length > 100) {
      newErrors.companyName = 'Company name cannot exceed 100 characters';
    }
    
    if (user?.role === 'farmer' && profileData.farmSize && (isNaN(profileData.farmSize) || profileData.farmSize < 0)) {
      newErrors.farmSize = 'Farm size must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateBankDetails = () => {
    const newErrors = {};
    
    if (!bankData.accountHolderName || bankData.accountHolderName.trim() === '') {
      newErrors.accountHolderName = 'Account holder name is required';
    }
    
    if (!bankData.accountNumber || bankData.accountNumber.length < 9 || bankData.accountNumber.length > 18) {
      newErrors.accountNumber = 'Account number must be between 9 and 18 digits';
    }
    
    if (!bankData.ifscCode || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(bankData.ifscCode.toUpperCase())) {
      newErrors.ifscCode = 'Invalid IFSC code format (e.g., SBIN0001234)';
    }
    
    if (!bankData.bankName || bankData.bankName.trim() === '') {
      newErrors.bankName = 'Bank name is required';
    }
    
    if (bankData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(bankData.panNumber.toUpperCase())) {
      newErrors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    if (!validateProfile()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        companyName: profileData.companyName,
        farmSize: profileData.farmSize,
      };

      if (profileImageChanged && profileData.profilePic) {
        payload.profilePic = profileData.profilePic;
      }

      const response = await authService.updateProfile(payload);
      updateUser({ ...response.user, profilePic: response.user?.profilePic || profileImagePreview });
      await refreshUser();
      setProfileData((prev) => ({ ...prev, profilePic: response.user?.profilePic || prev.profilePic }));
      setProfileImagePreview(response.user?.profilePic || profileImagePreview);
      setProfileImageChanged(false);
      setProfileImageLoadFailed(false);
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);
    
    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      toast.success('Password changed successfully!');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveBankDetails = async (e) => {
    e.preventDefault();
    
    if (!validateBankDetails()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoadingBank(true);
    
    try {
      const response = await updateBankDetails(bankData);
      toast.success(response.message || 'Bank details updated successfully!');
      
      // Refresh bank details
      await fetchBankDetails();
    } catch (error) {
      console.error('Error updating bank details:', error);
      toast.error(error || 'Failed to update bank details');
    } finally {
      setLoadingBank(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
        >
          <FiArrowLeft /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <FiUser 
            className="text-2xl"
            style={{ color: roleTokens.primaryColor }}
          />
          <h1 className="text-2xl font-poppins font-bold text-gray-900">Account Settings</h1>
        </div>
        <p className="text-gray-600 font-inter">Manage your profile and password</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <motion.div
          className="bg-white rounded-xl p-6"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FiUser className="text-xl" style={{ color: roleTokens.primaryColor }} />
            <h2 className="text-xl font-bold">Profile Information</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
              <div className="rounded-xl border border-gray-200 p-4 bg-gray-50/70">
                <div className="flex flex-col items-center text-center gap-4">
                  {(profileImagePreview || user?.profilePic) && !profileImageLoadFailed ? (
                    <img
                      src={profileImagePreview || user?.profilePic}
                      alt="Profile"
                      className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow"
                      onError={() => {
                        setProfileImageLoadFailed(true);
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center text-gray-600 text-3xl font-semibold">
                      {profileData.name ? profileData.name.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                  )}

                  <div className="w-full max-w-sm">
                    <label className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-sm font-medium cursor-pointer transition-colors">
                      Choose New Image
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleProfileImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-xs text-gray-500">JPG, PNG, WEBP | Max 2MB | Best result: square photo</p>
                    {profileImageChanged ? (
                      <p className="mt-1 text-xs text-emerald-600">New image selected. Click Save Changes to upload.</p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className={`input-field ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Your full name"
                required
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email (Disabled) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={profileData.email}
                className="input-field bg-gray-50 cursor-not-allowed"
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className={`input-field ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="10-digit phone number"
                maxLength="10"
                required
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Buyer-specific field */}
            {user?.role === 'buyer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleProfileChange}
                  className={`input-field ${errors.companyName ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Your company name (optional)"
                />
                {errors.companyName && (
                  <p className="mt-1 text-xs text-red-600">{errors.companyName}</p>
                )}
              </div>
            )}

            {/* Farmer-specific field */}
            {user?.role === 'farmer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Farm Size (acres)
                </label>
                <input
                  type="number"
                  name="farmSize"
                  value={profileData.farmSize}
                  onChange={handleProfileChange}
                  className={`input-field ${errors.farmSize ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Your farm size in acres (optional)"
                  min="0"
                  step="0.1"
                />
                {errors.farmSize && (
                  <p className="mt-1 text-xs text-red-600">{errors.farmSize}</p>
                )}
              </div>
            )}

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: roleTokens.primaryColor,
                borderRadius: roleTokens.radius.card,
              }}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Change Password */}
        <motion.div
          className="bg-white rounded-xl p-6"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <FiLock className="text-xl" style={{ color: roleTokens.primaryColor }} />
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password *
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className={`input-field ${errors.currentPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter current password"
              />
              {errors.currentPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password *
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`input-field ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter new password (min 6 characters)"
              />
              {errors.newPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.newPassword}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`input-field ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Security Tips */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">Password Requirements:</p>
              <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                <li>At least 6 characters long</li>
                <li>Use a mix of letters, numbers, and symbols</li>
                <li>Don't use common words or personal info</li>
              </ul>
            </div>

            {/* Change Password Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                backgroundColor: roleTokens.primaryColor,
                borderRadius: roleTokens.radius.card,
              }}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                  Changing...
                </>
              ) : (
                <>
                  <FiLock className="w-5 h-5" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Bank Details Section (Farmers and Buyers) */}
      {(user?.role === 'farmer' || user?.role === 'buyer') && (
        <motion.div
          className="bg-white rounded-xl p-6 mt-6"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FiCreditCard className="text-xl" style={{ color: roleTokens.primaryColor }} />
              <h2 className="text-xl font-bold">Bank Details</h2>
            </div>
            {bankDetails && (
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                bankDetails.isVerified 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {bankDetails.isVerified ? (
                  <><FiCheckCircle className="w-4 h-4" /> Verified</>
                ) : (
                  <><FiAlertCircle className="w-4 h-4" /> Pending Verification</>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSaveBankDetails} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                name="accountHolderName"
                value={bankData.accountHolderName}
                onChange={handleBankChange}
                className={`input-field ${errors.accountHolderName ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Full name as per bank"
                required
              />
              {errors.accountHolderName && (
                <p className="mt-1 text-xs text-red-600">{errors.accountHolderName}</p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                name="accountNumber"
                value={bankData.accountNumber}
                onChange={handleBankChange}
                className={`input-field ${errors.accountNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Bank account number"
                required
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.accountNumber}</p>
              )}
            </div>

            {/* IFSC Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code *
              </label>
              <input
                type="text"
                name="ifscCode"
                value={bankData.ifscCode}
                onChange={handleBankChange}
                className={`input-field uppercase ${errors.ifscCode ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="SBIN0001234"
                maxLength="11"
                required
              />
              {errors.ifscCode && (
                <p className="mt-1 text-xs text-red-600">{errors.ifscCode}</p>
              )}
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Name *
              </label>
              <input
                type="text"
                name="bankName"
                value={bankData.bankName}
                onChange={handleBankChange}
                className={`input-field ${errors.bankName ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="State Bank of India"
                required
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-red-600">{errors.bankName}</p>
              )}
            </div>

            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name
              </label>
              <input
                type="text"
                name="branchName"
                value={bankData.branchName}
                onChange={handleBankChange}
                className="input-field"
                placeholder="Branch location (optional)"
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type *
              </label>
              <select
                name="accountType"
                value={bankData.accountType}
                onChange={handleBankChange}
                className="input-field"
                required
              >
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                name="upiId"
                value={bankData.upiId}
                onChange={handleBankChange}
                className="input-field lowercase"
                placeholder="yourname@paytm (optional)"
              />
            </div>

            {/* PAN Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PAN Number
              </label>
              <input
                type="text"
                name="panNumber"
                value={bankData.panNumber}
                onChange={handleBankChange}
                className={`input-field uppercase ${errors.panNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="ABCDE1234F (optional)"
                maxLength="10"
              />
              {errors.panNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.panNumber}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="md:col-span-2">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">📌 Important Information:</p>
                <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
                  <li>Bank details are required to receive payment for contracts</li>
                  <li>Admin verification required before withdrawals</li>
                  <li>Minimum withdrawal amount: ₹100</li>
                  <li>Ensure all details match your bank records</li>
                </ul>
              </div>
            </div>

            {/* Save Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loadingBank}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  backgroundColor: roleTokens.primaryColor,
                  borderRadius: roleTokens.radius.card,
                }}
              >
                {loadingBank ? (
                  <>
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    Save Bank Details
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </DashboardLayout>
  );
};

export default Settings;
