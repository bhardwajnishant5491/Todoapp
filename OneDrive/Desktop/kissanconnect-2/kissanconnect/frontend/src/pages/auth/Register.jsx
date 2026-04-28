import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { GiWheat, GiFarmer, GiPlantSeed, GiFruitBowl, GiCorn } from 'react-icons/gi';
import { FaTractor, FaSeedling } from 'react-icons/fa';
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import FloatingElement from '../../components/animations/FloatingElement';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalTitle, setModalTitle] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
    phone: '',
    address: {
      village: '',
      district: '',
      state: '',
      pincode: '',
    },
    // Farmer specific
    farmSize: '',
    // Buyer specific
    companyName: '',
    gstNumber: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
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

  const nextStep = () => {
    // Validate step 1
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all fields');
        return;
      }
      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const openTermsModal = () => {
    setModalTitle('Terms of Service');
    setModalContent('terms');
    setShowModal(true);
  };

  const openPrivacyModal = () => {
    setModalTitle('Privacy Policy');
    setModalContent('privacy');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent('');
    setModalTitle('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate legal acceptance
    if (!acceptTerms || !acceptPrivacy) {
      toast.error('Please accept both Terms of Service and Privacy Policy to continue');
      return;
    }
    
    setLoading(true);

    // Validate phone
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    // Validate role-specific fields
    if (formData.role === 'farmer' && !formData.farmSize) {
      toast.error('Please enter your farm size');
      setLoading(false);
      return;
    }

    if (formData.role === 'buyer' && (!formData.companyName || !formData.gstNumber)) {
      toast.error('Please enter company name and GST number');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);

      if (result.success) {
        toast.success('Registration successful! Welcome to KisanConnect!');
        
        setTimeout(() => {
          const role = result.user.role;
          navigate(`/${role}/dashboard`);
        }, 1500);
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#F9FAF7' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Living Background */}
      <div className="absolute inset-0">
        {/* Subtle Organic Gradients */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#4CAF50]/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-[#C08A4A]/20 to-transparent"></div>
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)',
            left: '5%',
            top: '15%',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #C08A4A 0%, transparent 70%)',
            right: '5%',
            bottom: '15%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingElement delay={0} className="absolute top-20 right-10 opacity-8">
            <GiWheat className="text-primary-500 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={1.5} className="absolute top-40 left-20 opacity-8">
            <GiFarmer className="text-accent-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2} className="absolute bottom-32 right-24 opacity-8">
            <FaTractor className="text-warning-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={0.8} className="absolute bottom-40 left-16 opacity-8">
            <FaSeedling className="text-success-500 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={2.5} className="absolute top-1/3 left-1/4 opacity-6">
            <GiPlantSeed className="text-primary-400 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={1.2} className="absolute bottom-1/3 right-1/4 opacity-6">
            <GiFruitBowl className="text-accent-400 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={1.8} className="absolute top-1/2 right-10 opacity-6">
            <GiCorn className="text-warning-400 text-3xl" />
          </FloatingElement>
        </div>
      </div>
      
      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 mb-4 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <GiWheat className="text-white text-4xl" />
          </motion.div>
          <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-2">
            Join KisanConnect 🌾
          </h2>
          <p className="text-[#6B7280] font-inter">
            Create your account and start connecting
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div 
          className="flex items-center justify-center space-x-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'} transition-colors duration-300`}>
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-poppins shadow-lg ${step >= 1 ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-gray-200'}`}
              animate={{ scale: step === 1 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              {step > 1 ? <FiCheckCircle className="text-xl" /> : '1'}
            </motion.div>
            <span className="ml-3 hidden sm:inline font-inter font-semibold">Basic Info</span>
          </div>
          <motion.div 
            className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-300 to-accent-300"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: step >= 2 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          ></motion.div>
          <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'} transition-colors duration-300`}>
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold font-poppins shadow-lg ${step >= 2 ? 'bg-gradient-to-br from-primary-500 to-accent-500 text-white' : 'bg-gray-200'}`}
              animate={{ scale: step === 2 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5 }}
            >
              2
            </motion.div>
            <span className="ml-3 hidden sm:inline font-inter font-semibold">Details</span>
          </div>
        </motion.div>

        {/* Registration Form */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium p-8 border border-white/20"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div 
                className="space-y-5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiUser className="text-[#6B7280] text-lg" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiMail className="text-[#6B7280] text-lg" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-3 font-poppins">
                    I am a *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'farmer' })}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        formData.role === 'farmer'
                          ? 'border-primary-500 bg-primary-50 shadow-lg'
                          : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-4xl mb-2">👨‍🌾</div>
                      <div className="font-semibold font-poppins text-[#1F2937]">Farmer</div>
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'buyer' })}
                      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                        formData.role === 'buyer'
                          ? 'border-accent-500 bg-accent-50 shadow-lg'
                          : 'border-gray-200 hover:border-accent-300 hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-4xl mb-2">🧑‍💼</div>
                      <div className="font-semibold font-poppins text-[#1F2937]">Buyer</div>
                    </motion.button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-[#6B7280] text-lg" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="At least 6 characters"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="text-[#6B7280] text-lg" />
                    </div>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-poppins font-semibold py-3.5 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center group mt-6"
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(47, 79, 28, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue
                  <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            )}

            {/* Step 2: Additional Details */}
            {step === 2 && (
              <motion.div 
                className="space-y-5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiPhone className="text-[#6B7280] text-lg" />
                    </div>
                    <input
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Address
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="address.village"
                      type="text"
                      value={formData.address.village}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="Village/City"
                    />
                    <input
                      name="address.district"
                      type="text"
                      value={formData.address.district}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="District"
                    />
                    <input
                      name="address.state"
                      type="text"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="State"
                    />
                    <input
                      name="address.pincode"
                      type="text"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="Pincode"
                      maxLength="6"
                    />
                  </div>
                </div>

                {/* Farmer Specific Fields */}
                {formData.role === 'farmer' && (
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                      Farm Size (in acres) *
                    </label>
                    <input
                      name="farmSize"
                      type="number"
                      required
                      value={formData.farmSize}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="Enter farm size"
                      min="0"
                      step="0.1"
                    />
                  </div>
                )}

                {/* Buyer Specific Fields */}
                {formData.role === 'buyer' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                        Company Name *
                      </label>
                      <input
                        name="companyName"
                        type="text"
                        required
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                        placeholder="Enter company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                        GST Number *
                      </label>
                      <input
                        name="gstNumber"
                        type="text"
                        required
                        value={formData.gstNumber}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                        placeholder="Enter GST number"
                      />
                    </div>
                  </>
                )}

                {/* Terms and Privacy Policy Acceptance */}
                <div className="mt-6 space-y-3 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl border-2 border-amber-200">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-700 font-inter">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={openTermsModal}
                        className="font-semibold text-primary-600 hover:text-primary-700 underline transition-colors"
                      >
                        Terms of Service
                      </button>
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="acceptPrivacy"
                      checked={acceptPrivacy}
                      onChange={(e) => setAcceptPrivacy(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                    <label htmlFor="acceptPrivacy" className="ml-3 text-sm text-gray-700 font-inter">
                      I accept the{' '}
                      <button
                        type="button"
                        onClick={openPrivacyModal}
                        className="font-semibold text-primary-600 hover:text-primary-700 underline transition-colors"
                      >
                        Privacy Policy
                      </button>
                      <span className="text-red-600 ml-1">*</span>
                    </label>
                  </div>

                  <p className="text-xs text-amber-800 font-inter flex items-start mt-2">
                    <span className="mr-1">⚠️</span>
                    <span>
                      By accepting, you acknowledge that all platform communications are monitored and that 
                      conducting deals outside the platform will result in account suspension or permanent ban.
                    </span>
                  </p>
                </div>

                <div className="flex space-x-3 mt-6">
                  <motion.button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 border-2 border-gray-300 text-[#1F2937] font-poppins font-semibold py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-poppins font-semibold py-3.5 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(47, 79, 28, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <span className="text-[#6B7280] font-inter">Already have an account? </span>
            <Link
              to="/login"
              className="font-semibold text-primary-600 hover:text-primary-700 transition-colors font-inter inline-flex items-center group"
            >
              Sign in
              <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/" className="text-sm text-[#6B7280] hover:text-[#1F2937] transition-colors font-inter inline-flex items-center group">
            <span className="mr-1 group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </Link>
          
          {/* Legal Links */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#6B7280]">
            <Link to="/terms" className="hover:text-primary-600 transition-colors font-inter">
              Terms of Service
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-primary-600 transition-colors font-inter">
              Privacy Policy
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Legal Document Modal */}
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-poppins font-bold text-white">{modalTitle}</h3>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition-colors text-2xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {modalContent === 'terms' ? (
                <TermsContent />
              ) : (
                <PrivacyContent />
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-poppins font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

// Terms of Service Content Component
const TermsContent = () => (
  <div className="prose prose-sm max-w-none font-inter text-gray-700">
    <p className="text-gray-600 mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
    
    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">1. ACCEPTANCE OF TERMS</h2>
    <p>By accessing or using KisanConnect ("Platform"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.</p>
    
    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">2. DEFINITIONS</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Platform:</strong> KisanConnect web application</li>
      <li><strong>User:</strong> Any person accessing the Platform</li>
      <li><strong>Farmer:</strong> User who lists crops for sale</li>
      <li><strong>Buyer:</strong> User who purchases crops</li>
      <li><strong>Contract:</strong> Agreement between Farmer and Buyer</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">3. ELIGIBILITY</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>You must be at least 18 years old</li>
      <li>You must have legal capacity to enter contracts</li>
      <li>You must be a resident of India</li>
      <li>You must not have been banned from the Platform</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">4. ACCOUNT REGISTRATION</h2>
    <p>You must provide accurate information. You are responsible for maintaining account security.</p>

    <h2 className="text-2xl font-poppins font-bold text-red-700 mt-6 mb-3">5. PLATFORM USAGE - EXCLUSIVE TRANSACTION POLICY</h2>
    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300 mb-4">
      <p className="font-bold text-red-700 mb-2">⚠️ CRITICAL - READ CAREFULLY</p>
      <p className="mb-2"><strong>ALL transactions MUST be conducted through KisanConnect.</strong></p>
      <ul className="list-disc pl-5 space-y-2">
        <li>You MUST NOT share phone numbers, WhatsApp, email, or any contact information for external deals</li>
        <li>You MUST NOT bypass the platform's escrow and payment system</li>
        <li>You MUST NOT conduct any transaction outside the platform</li>
        <li>All messages are monitored for policy violations</li>
        <li>Contact information is only shared AFTER escrow payment and only for delivery coordination</li>
      </ul>
      
      <p className="font-bold mt-3 mb-2 text-red-700">PENALTIES FOR VIOLATIONS:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>First Violation:</strong> Warning + 15-day account suspension</li>
        <li><strong>Second Violation:</strong> Permanent ban + forfeiture of locked funds</li>
      </ul>
    </div>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">6. TRANSACTIONS AND CONTRACTS</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Buyers pay through escrow system (4% platform commission)</li>
      <li>Funds released after delivery confirmation</li>
      <li>Contracts are binding once accepted</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">7. FEES AND PAYMENTS</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Platform charges 4% commission on all transactions</li>
      <li>Minimum withdrawal amount: ₹100</li>
      <li>Funds in active contracts are locked until delivery</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">8. DISPUTES AND RESOLUTION</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Disputes must be raised within 7 days</li>
      <li>Platform admin has final decision authority</li>
      <li>Decisions are binding and final</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">9. DISCLAIMERS</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Platform provided "as is" without warranties</li>
      <li>Platform not liable for user actions or product quality</li>
      <li>Users indemnify platform from claims arising from their violations</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">10. GOVERNING LAW</h2>
    <p>These Terms are governed by the laws of India. Any disputes shall be resolved in Indian courts.</p>

    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300 mt-6">
      <p className="font-bold text-amber-800 mb-2">📋 ACKNOWLEDGMENT</p>
      <p className="text-sm">By checking the acceptance box, you confirm that you have read, understood, and agree to be bound by these Terms of Service, including the Exclusive Transaction Policy and penalty structure.</p>
    </div>
  </div>
);

// Privacy Policy Content Component
const PrivacyContent = () => (
  <div className="prose prose-sm max-w-none font-inter text-gray-700">
    <p className="text-gray-600 mb-4"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
    
    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">1. INTRODUCTION</h2>
    <p>KisanConnect ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.</p>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">2. INFORMATION WE COLLECT</h2>
    <h3 className="text-lg font-semibold mt-4 mb-2">Account Information:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Name, email, phone number, password</li>
      <li>Profile photo, age, role (farmer/buyer)</li>
      <li>Address details (village, district, state, pincode)</li>
    </ul>

    <h3 className="text-lg font-semibold mt-4 mb-2">Financial Information:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Bank account details for withdrawals</li>
      <li>Transaction history and wallet balance</li>
      <li>PAN and GST numbers (if provided)</li>
    </ul>

    <h3 className="text-lg font-semibold mt-4 mb-2">Communications:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>ALL messages sent through the platform</strong></li>
      <li>Contract proposals and agreements</li>
      <li>Support tickets and feedback</li>
    </ul>

    <h3 className="text-lg font-semibold mt-4 mb-2">Usage Data:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>IP address, device type, browser information</li>
      <li>Pages visited, time spent, actions taken</li>
      <li>Cookies and analytics data</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">3. HOW WE USE YOUR INFORMATION</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Facilitate transactions and contracts</li>
      <li>Process payments and withdrawals</li>
      <li>Security, fraud prevention, and policy enforcement</li>
      <li>Platform improvement and analytics</li>
      <li>Customer support and communications</li>
      <li>Legal compliance and dispute resolution</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-red-700 mt-6 mb-3">3.1 MESSAGE MONITORING</h2>
    <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300 mb-4">
      <p className="font-bold text-red-700 mb-2">⚠️ IMPORTANT NOTICE</p>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>All messages are monitored, recorded, and stored</strong></li>
        <li>Messages are analyzed for policy violations (contact sharing, external deals)</li>
        <li>Messages may be reviewed during disputes</li>
        <li><strong>You have NO expectation of privacy</strong> in platform communications</li>
      </ul>
    </div>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">4. HOW WE SHARE YOUR INFORMATION</h2>
    <h3 className="text-lg font-semibold mt-4 mb-2">With Other Users:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Limited profile information visible to potential trading partners</li>
      <li>Phone numbers shared ONLY after escrow payment, ONLY for delivery coordination</li>
    </ul>

    <h3 className="text-lg font-semibold mt-4 mb-2">With Service Providers:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Payment processors (Razorpay, Stripe, etc.)</li>
      <li>Cloud storage providers (AWS, Google Cloud)</li>
      <li>Analytics services (Google Analytics)</li>
    </ul>

    <h3 className="text-lg font-semibold mt-4 mb-2">Legal/Compliance:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Government authorities when legally required</li>
      <li>Law enforcement with valid court orders</li>
    </ul>

    <div className="bg-green-50 p-3 rounded-lg border border-green-300 mt-3">
      <p className="font-bold text-green-700">✓ We do NOT sell your data to third parties</p>
    </div>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">5. DATA SECURITY</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>SSL/TLS encryption for data transmission</li>
      <li>AES-256 encryption for sensitive data at rest</li>
      <li>Multi-factor authentication for admin access</li>
      <li>Regular security audits and monitoring</li>
      <li>72-hour breach notification policy</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">6. DATA RETENTION</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li>Transaction records: 7 years (legal requirement under Indian law)</li>
      <li>Personal information: 90 days after account closure</li>
      <li>Communication records: Retained for dispute resolution</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">7. YOUR PRIVACY RIGHTS</h2>
    <ul className="list-disc pl-5 space-y-1">
      <li><strong>Access:</strong> Request copy of your data</li>
      <li><strong>Correction:</strong> Update inaccurate information</li>
      <li><strong>Deletion:</strong> Request account and data deletion (with exceptions)</li>
      <li><strong>Portability:</strong> Export your data (CSV/JSON format)</li>
      <li><strong>Opt-out:</strong> Unsubscribe from marketing emails</li>
    </ul>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">8. COOKIES AND TRACKING</h2>
    <p>We use cookies for authentication, preferences, and analytics. You can manage cookies through browser settings.</p>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">9. CHILDREN'S PRIVACY</h2>
    <p>Platform is for users 18+ only. We do not knowingly collect data from minors.</p>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">10. INTERNATIONAL TRANSFERS</h2>
    <p>Your data is stored on servers located in India. By using the Platform, you consent to data transfer and processing in India.</p>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">11. CHANGES TO PRIVACY POLICY</h2>
    <p>We may update this policy periodically. Continued use after changes constitutes acceptance.</p>

    <h2 className="text-2xl font-poppins font-bold text-gray-900 mt-6 mb-3">12. CONTACT US</h2>
    <p>For privacy concerns, contact us at:</p>
    <ul className="list-none pl-0 mt-2">
      <li>📧 Email: privacy@kisanconnect.com</li>
      <li>📞 Phone: +91-XXXXXXXXXX</li>
    </ul>

    <div className="bg-amber-50 p-4 rounded-lg border-2 border-amber-300 mt-6">
      <p className="font-bold text-amber-800 mb-2">📋 CONSENT</p>
      <p className="text-sm">By checking the acceptance box, you acknowledge that you have read and understood this Privacy Policy, including our message monitoring practices, and consent to the collection, use, and disclosure of your information as described.</p>
    </div>
  </div>
);

export default Register;
