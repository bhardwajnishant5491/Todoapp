import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import { GiWheat, GiFarmer, GiPlantSeed, GiFruitBowl } from 'react-icons/gi';
import { FaTractor, FaSeedling } from 'react-icons/fa';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import FloatingElement from '../../components/animations/FloatingElement';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        toast.success('Login successful! Welcome back!');
        
        // Redirect based on user role
        setTimeout(() => {
          const role = result.user.role;
          navigate(`/${role}/dashboard`);
        }, 1000);
      } else {
        toast.error(result.message || 'Login failed');
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
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#4CAF50]/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-[#C08A4A]/20 to-transparent"></div>
        </div>
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)',
            left: '5%',
            top: '10%',
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
            bottom: '10%',
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
          <FloatingElement delay={0} className="absolute top-20 left-10 opacity-8">
            <GiWheat className="text-primary-500 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={1.5} className="absolute top-40 right-20 opacity-8">
            <GiFarmer className="text-accent-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2} className="absolute bottom-20 left-20 opacity-8">
            <FaTractor className="text-warning-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={0.8} className="absolute bottom-40 right-16 opacity-8">
            <FaSeedling className="text-success-500 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={2.5} className="absolute top-1/3 right-1/4 opacity-6">
            <GiPlantSeed className="text-primary-400 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={1.2} className="absolute bottom-1/3 left-1/4 opacity-6">
            <GiFruitBowl className="text-accent-400 text-4xl" />
          </FloatingElement>
        </div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
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
            Welcome Back! 👋
          </h2>
          <p className="text-[#6B7280] font-inter">
            Sign in to access your KisanConnect account
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium p-8 border border-white/20"
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label htmlFor="email" className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiMail className="text-[#6B7280] text-lg" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                  placeholder="farmer@example.com"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <label htmlFor="password" className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLock className="text-[#6B7280] text-lg" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-poppins font-semibold py-3.5 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center group"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(47, 79, 28, 0.3)' }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#6B7280] font-inter">New to KisanConnect?</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors font-inter inline-flex items-center group"
              >
                Create an account
                <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
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
    </div>
  );
};

export default Login;
