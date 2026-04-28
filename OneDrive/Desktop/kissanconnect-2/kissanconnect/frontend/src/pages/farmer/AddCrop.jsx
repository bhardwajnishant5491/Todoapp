import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import cropService from '../../services/cropService';
import { toast } from 'react-toastify';
import { FiArrowLeft } from 'react-icons/fi';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getRoleTokens } from '../../utils/designTokens';
import ImageUpload from '../../components/ui/ImageUpload';

const AddCrop = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const roleTokens = getRoleTokens('farmer');
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    cropType: 'Wheat',
    quantity: '',
    unit: 'quintal',
    pricePerUnit: '',
    harvestDate: '',
    quality: 'Standard',
    description: '',
    image: null,
    location: {
      village: '',
      district: '',
      state: '',
      pincode: '',
    },
  });

  const cropTypes = [
    'Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Barley',
    'Soybean', 'Chickpea', 'Mustard', 'Groundnut', 'Potato',
    'Onion', 'Tomato', 'Other',
  ];

  // Fetch crop data if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCropData(id);
    }
  }, [id]);

  const fetchCropData = async (cropId) => {
    try {
      setLoading(true);
      const result = await cropService.getCropById(cropId);
      
      if (result.success) {
        const crop = result.crop;
        // Pre-fill form with existing data
        setFormData({
          cropType: crop.cropType || 'Wheat',
          quantity: crop.quantity || '',
          unit: crop.unit || 'quintal',
          pricePerUnit: crop.pricePerUnit || '',
          harvestDate: crop.harvestDate ? crop.harvestDate.split('T')[0] : '',
          quality: crop.quality || 'Standard',
          description: crop.description || '',
          image: crop.images && crop.images[0] ? crop.images[0] : null,
          location: {
            village: crop.location?.village || '',
            district: crop.location?.district || '',
            state: crop.location?.state || '',
            pincode: crop.location?.pincode || '',
          },
        });
      } else {
        toast.error('Failed to load crop details');
        navigate('/farmer/crops');
      }
    } catch (error) {
      toast.error('Error loading crop data');
      navigate('/farmer/crops');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (base64String, error) => {
    // Clear any previous image error
    setErrors(prev => ({ ...prev, image: '' }));
    
    if (error) {
      setErrors(prev => ({ ...prev, image: error }));
      setFormData({ ...formData, image: null });
    } else {
      // Store base64 string for sending to backend
      setFormData({ ...formData, image: base64String });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Quantity validation
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    // Price validation
    if (formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = 'Price must be greater than 0';
    }
    
    // Harvest date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const harvestDate = new Date(formData.harvestDate);
    if (harvestDate < today) {
      newErrors.harvestDate = 'Harvest date cannot be in the past';
    }
    
    // Location validation
    if (!formData.location.village || formData.location.village.trim() === '') {
      newErrors['location.village'] = 'Village is required';
    }
    if (!formData.location.district || formData.location.district.trim() === '') {
      newErrors['location.district'] = 'District is required';
    }
    if (!formData.location.state || formData.location.state.trim() === '') {
      newErrors['location.state'] = 'State is required';
    }
    if (!formData.location.pincode || !/^\d{6}$/.test(formData.location.pincode)) {
      newErrors['location.pincode'] = 'Valid 6-digit pincode is required';
    }
    
    // Description validation
    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description cannot exceed 500 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);

    try {
      let result;
      
      if (isEditMode) {
        // Update existing crop
        result = await cropService.updateCrop(id, formData);
      } else {
        // Create new crop
        result = await cropService.createCrop(formData);
      }
      
      if (result.success) {
        toast.success(isEditMode ? 'Crop updated successfully!' : 'Crop listed successfully!');
        navigate('/farmer/crops');
      } else {
        toast.error(result.message || (isEditMode ? 'Failed to update crop' : 'Failed to list crop'));
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate('/farmer/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 mb-4 transition-colors"
        >
          <FiArrowLeft /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-poppins font-bold text-gray-900">{isEditMode ? 'Edit Crop' : 'List Your Crop'}</h1>
        <p className="text-gray-600 font-inter mt-1">{isEditMode ? 'Update the details of your crop listing' : 'Fill in the details to list your crop for buyers'}</p>
      </motion.div>

      {/* Form */}
      <motion.div
        className="max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-8 space-y-6"
          style={{
            borderRadius: roleTokens.radius.card,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}
        >
            {/* Crop Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crop Type *
              </label>
              <select
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className="input-field"
                required
              >
                {cropTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={`input-field ${errors.quantity ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter quantity"
                  min="1"
                  required
                />
                {errors.quantity && (
                  <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="quintal">Quintal</option>
                  <option value="ton">Ton</option>
                  <option value="bag">Bag</option>
                </select>
              </div>
            </div>

            {/* Price and Quality */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Unit (₹) *
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  value={formData.pricePerUnit}
                  onChange={handleChange}
                  className={`input-field ${errors.pricePerUnit ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter price"
                  min="0"
                  required
                />
                {errors.pricePerUnit && (
                  <p className="mt-1 text-xs text-red-600">{errors.pricePerUnit}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quality *
                </label>
                <select
                  name="quality"
                  value={formData.quality}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="Premium">Premium</option>
                  <option value="Grade A">Grade A</option>
                  <option value="Grade B">Grade B</option>
                  <option value="Standard">Standard</option>
                </select>
              </div>
            </div>

            {/* Harvest Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Harvest Date *
              </label>
              <input
                type="date"
                name="harvestDate"
                value={formData.harvestDate}
                onChange={handleChange}
                className={`input-field ${errors.harvestDate ? 'border-red-500 focus:ring-red-500' : ''}`}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              {errors.harvestDate && (
                <p className="mt-1 text-xs text-red-600">{errors.harvestDate}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Location Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="location.village"
                    value={formData.location.village}
                    onChange={handleChange}
                    className={`input-field ${errors['location.village'] ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Village/City *"
                    required
                  />
                  {errors['location.village'] && (
                    <p className="mt-1 text-xs text-red-600">{errors['location.village']}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="location.district"
                    value={formData.location.district}
                    onChange={handleChange}
                    className={`input-field ${errors['location.district'] ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="District *"
                    required
                  />
                  {errors['location.district'] && (
                    <p className="mt-1 text-xs text-red-600">{errors['location.district']}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="location.state"
                    value={formData.location.state}
                    onChange={handleChange}
                    className={`input-field ${errors['location.state'] ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="State *"
                    required
                  />
                  {errors['location.state'] && (
                    <p className="mt-1 text-xs text-red-600">{errors['location.state']}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="location.pincode"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    className={`input-field ${errors['location.pincode'] ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Pincode *"
                    maxLength="6"
                    required
                  />
                  {errors['location.pincode'] && (
                    <p className="mt-1 text-xs text-red-600">{errors['location.pincode']}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                placeholder="Any additional details about your crop..."
                maxLength="500"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Crop Image */}
            <div>
              <ImageUpload
                value={formData.image}
                onChange={handleImageChange}
                label="Crop Image (Optional)"
                accept="image/jpeg,image/jpg,image/png"
                maxSize={5}
                error={errors.image}
              />
              <p className="text-sm text-gray-500 mt-2">
                Upload a clear photo of your crop. Maximum file size: 5MB. Accepted formats: JPG, PNG.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate('/farmer/dashboard')}
                className="flex-1 btn-outline py-3 text-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 text-lg disabled:opacity-50"
              >
                {loading ? (isEditMode ? 'Updating...' : 'Listing Crop...') : (isEditMode ? 'Update Crop' : 'List Crop')}
              </button>
            </div>
        </form>
      </motion.div>
    </DashboardLayout>
  );
};

export default AddCrop;
