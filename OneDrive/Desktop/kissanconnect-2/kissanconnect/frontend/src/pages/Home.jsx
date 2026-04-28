import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  FiCheckCircle, 
  FiTrendingUp, 
  FiShield, 
  FiDollarSign,
  FiUsers,
  FiStar,
  FiArrowRight,
  FiPlay,
  FiSun,
  FiDroplet
} from 'react-icons/fi';
import { GiWheat, GiFarmer, GiReceiveMoney, GiPlantSeed, GiFruitBowl, GiGrainBundle } from 'react-icons/gi';
import { FaTractor, FaSeedling } from 'react-icons/fa';
import { GiCarrot, GiCorn, GiTomato } from 'react-icons/gi';
import Navbar from '../components/common/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FloatingElement from '../components/animations/FloatingElement';
import SlideIn from '../components/animations/SlideIn';
import FadeIn from '../components/animations/FadeIn';
import imgTomfisk from '../assets/images/pexels-tomfisk-4863819.jpg';
import imgNcfb from '../assets/images/pexels-nc-farm-bureau-mark-2252618.jpg';
import imgSvetlana from '../assets/images/pexels-svetlana-shemetiuk-32376-394887.jpg';
import imgRaaz from '../assets/images/pexels-the-raaz-photojourney-1615796744-35500062.jpg';
import imgAndromeda from '../assets/images/pexels-andromeda99-11053137.jpg';
import imgDibakar from '../assets/images/pexels-dibakar-roy-2432543-23985732.jpg';
import imgNatalino from '../assets/images/pexels-natalino-vieira-105126-10774405.jpg';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeHeroImage, setActiveHeroImage] = useState(0);

  // Hero images array
  const heroImages = [
    imgTomfisk,
    imgNcfb,
    imgSvetlana,
    imgRaaz,
    imgAndromeda,
    imgDibakar,
    imgNatalino,
  ];

  const stats = [
    { value: 2500, label: t('home.activeFarmers'), suffix: '+', icon: GiFarmer },
    { value: 5000, label: t('home.contractsCompleted'), suffix: '+', icon: FiCheckCircle },
    { value: 150, label: t('home.croreRevenue'), prefix: '₹', suffix: '+', icon: GiReceiveMoney },
    { value: 98, label: t('home.successRate'), suffix: '%', icon: FiTrendingUp },
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Secure Transactions',
      description: 'End-to-end encrypted payments with escrow protection for both parties',
      color: 'from-success-400 to-success-600',
    },
    {
      icon: GiWheat,
      title: 'Quality Crops',
      description: 'Premium quality crops verified by our expert team and certification system',
      color: 'from-primary-400 to-primary-600',
    },
    {
      icon: FiUsers,
      title: 'Trusted Community',
      description: 'Join thousands of verified farmers and buyers in our growing network',
      color: 'from-accent-400 to-accent-600',
    },
    {
      icon: FiDollarSign,
      title: 'Fair Pricing',
      description: 'Transparent pricing based on real-time market rates and demand',
      color: 'from-warning-400 to-warning-600',
    },
    {
      icon: FiTrendingUp,
      title: 'Market Insights',
      description: 'Access real-time analytics and trends to make informed decisions',
      color: 'from-danger-400 to-danger-600',
    },
    {
      icon: FiCheckCircle,
      title: 'Easy Process',
      description: 'Simple 3-step process to list crops or make purchases online',
      color: 'from-secondary-400 to-secondary-600',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Register & Verify',
      description: 'Create your account as a farmer or buyer and complete verification',
      icon: FiUsers,
    },
    {
      number: '02',
      title: 'List or Browse',
      description: 'Farmers list crops, buyers browse and find what they need',
      icon: GiWheat,
    },
    {
      number: '03',
      title: 'Contract & Payment',
      description: 'Create contracts, make secure payments, and complete transactions',
      icon: FiDollarSign,
    },
  ];

  const testimonials = [
    {
      name: 'Ramesh Kumar',
      role: 'Farmer from Punjab',
      image: imgNcfb,
      rating: 5,
      text: 'KissanConnect transformed my farming business. I now get fair prices and direct buyers without middlemen. Highly recommended!',
    },
    {
      name: 'Priya Sharma',
      role: 'Buyer from Delhi',
      image: imgSvetlana,
      rating: 5,
      text: 'Amazing platform! I can directly connect with farmers and get fresh produce at competitive prices. The quality is always top-notch.',
    },
    {
      name: 'Suresh Patel',
      role: 'Organic Farmer',
      image: imgRaaz,
      rating: 5,
      text: 'Being an organic farmer, finding the right buyers was challenging. This platform connected me with premium buyers instantly.',
    },
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === 'farmer') {
        navigate('/farmer/dashboard');
      } else if (user?.role === 'buyer') {
        navigate('/buyer/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#F9FAF7]">
        {/* Subtle Organic Gradients */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#4CAF50]/20 to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-[#C08A4A]/20 to-transparent"></div>
        </div>
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}></div>
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <FloatingElement delay={0} className="absolute top-20 left-10 opacity-15">
            <GiWheat className="text-primary-500 text-6xl" />
          </FloatingElement>
          <FloatingElement delay={1} className="absolute top-40 right-20 opacity-15">
            <GiFarmer className="text-accent-500 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={2} className="absolute bottom-20 left-1/4 opacity-15">
            <GiWheat className="text-success-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={1.5} className="absolute top-60 right-1/4 opacity-12">
            <FaTractor className="text-warning-500 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={0.5} className="absolute bottom-40 right-10 opacity-15">
            <GiCorn className="text-accent-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2.5} className="absolute top-1/3 left-1/3 opacity-12">
            <GiCarrot className="text-danger-500 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={1.8} className="absolute bottom-60 left-20 opacity-12">
            <GiTomato className="text-danger-400 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={0.8} className="absolute top-1/2 right-40 opacity-12">
            <FiSun className="text-warning-400 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={2.2} className="absolute bottom-1/3 left-40 opacity-15">
            <GiPlantSeed className="text-success-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={1.2} className="absolute top-80 left-1/2 opacity-12">
            <FaSeedling className="text-primary-400 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={3} className="absolute bottom-80 right-1/3 opacity-12">
            <GiFruitBowl className="text-accent-400 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={0.3} className="absolute top-1/4 right-10 opacity-15">
            <GiGrainBundle className="text-primary-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2.8} className="absolute bottom-1/4 left-10 opacity-12">
            <FiDroplet className="text-success-400 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={0.6} className="absolute top-10 right-1/3 opacity-13">
            <GiWheat className="text-accent-400 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={1.9} className="absolute bottom-10 left-1/3 opacity-15">
            <GiReceiveMoney className="text-warning-500 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2.3} className="absolute top-1/3 right-20 opacity-13">
            <FaSeedling className="text-success-500 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={1.1} className="absolute bottom-1/2 left-1/4 opacity-13">
            <GiFruitBowl className="text-primary-400 text-4xl" />
          </FloatingElement>
          <FloatingElement delay={2.7} className="absolute top-2/3 right-10 opacity-15">
            <GiCorn className="text-warning-400 text-5xl" />
          </FloatingElement>
          <FloatingElement delay={0.4} className="absolute bottom-2/3 left-20 opacity-12">
            <GiPlantSeed className="text-accent-500 text-3xl" />
          </FloatingElement>
          <FloatingElement delay={3.2} className="absolute top-96 right-1/2 opacity-13">
            <FaTractor className="text-danger-400 text-4xl" />
          </FloatingElement>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <SlideIn direction="left">
              <div className="space-y-6">
                <Badge variant="success" size="md" dot>
                  Trusted by 2500+ Farmers
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-[#1F2937] leading-tight">
                  <motion.span
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {t('home.title')}
                  </motion.span>
                </h1>
                
                <motion.p 
                  className="text-xl text-[#6B7280] font-inter leading-relaxed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {t('home.subtitle')}
                </motion.p>

                <motion.div 
                  className="flex flex-wrap gap-4 pt-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(244, 162, 97, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="gradient" 
                      size="lg"
                      onClick={handleGetStarted}
                      icon={<FiArrowRight />}
                      iconPosition="right"
                      className="shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                      {isAuthenticated ? t('nav.dashboard') : t('home.getStarted')}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => navigate('/about')}
                      icon={<FiPlay />}
                    >
                      {t('home.learnMore')}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Trust Indicators */}
                <div className="flex items-center gap-6 pt-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-primary-400 to-accent-400"></div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-warning-500">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <FiStar key={i} className="fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Rated 4.9/5 by farmers & buyers
                    </p>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* Right Content - Animated Image Carousel */}
            <SlideIn direction="right" delay={0.2}>
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-premium">
                  {/* Image Carousel */}
                  <div className="relative h-[500px]">
                    {heroImages.map((image, index) => (
                      <motion.img
                        key={index}
                        src={image}
                        alt={`Farm scene ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ 
                          opacity: index === activeHeroImage ? 1 : 0,
                          scale: index === activeHeroImage ? 1 : 1.1,
                        }}
                        transition={{ 
                          duration: 1.2, 
                          ease: "easeInOut" 
                        }}
                      />
                    ))}
                    
                    {/* Image Navigation Dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                      {heroImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveHeroImage(index)}
                          className={`transition-all duration-300 rounded-full ${
                            index === activeHeroImage 
                              ? 'bg-white w-8 h-2' 
                              : 'bg-white/50 w-2 h-2 hover:bg-white/80'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent-500 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary-500 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </SlideIn>
          </div>
        </div>
      </section>

      {/* Organic Wave Transition */}
      <div className="relative h-16" style={{ background: 'linear-gradient(135deg, #8B5E34 0%, #A67C52 50%, #C08A4A 100%)' }}>
        <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'translateY(-1px)' }}>
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#F9FAF7" opacity="1"></path>
        </svg>
      </div>

      {/* Stats Section */}
      <section className="relative py-14 overflow-hidden -mb-1">
        {/* Living Background */}
        <div className="absolute inset-0">
          {/* Animated Gradients */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundSize: '400% 400%',
            }}
            animate={{
              backgroundImage: [
                'linear-gradient(135deg, #8B5E34 0%, #2F4F1C 25%, #4CAF50 50%, #C08A4A 75%, #8B5E34 100%)',
                'linear-gradient(135deg, #2F4F1C 0%, #4CAF50 25%, #C08A4A 50%, #8B5E34 75%, #2F4F1C 100%)',
                'linear-gradient(135deg, #4CAF50 0%, #C08A4A 25%, #8B5E34 50%, #2F4F1C 75%, #4CAF50 100%)',
                'linear-gradient(135deg, #C08A4A 0%, #8B5E34 25%, #2F4F1C 50%, #4CAF50 75%, #C08A4A 100%)',
                'linear-gradient(135deg, #8B5E34 0%, #2F4F1C 25%, #4CAF50 50%, #C08A4A 75%, #8B5E34 100%)',
              ],
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ 
              backgroundImage: { duration: 15, repeat: Infinity, ease: "linear" },
              backgroundPosition: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          />
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #C08A4A 0%, transparent 70%)',
              left: '10%',
              top: '10%',
            }}
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-[320px] h-[320px] rounded-full opacity-15 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)',
              right: '10%',
              top: '20%',
            }}
            animate={{
              scale: [1, 1.25, 1],
              x: [0, -40, 0],
              y: [0, 35, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
          
          {/* Grain Texture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
            <filter id="stats-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#stats-noise)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ duration: 0.8, delay: index * 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div 
                  className="text-center text-white p-5 rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{ 
                    scale: 1.03,
                    background: 'rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: index * 0.2 + 0.3, type: 'spring', bounce: 0.4 }}
                  >
                    <stat.icon className="text-5xl mx-auto mb-3 opacity-90" />
                  </motion.div>
                  <motion.div 
                    className="text-3xl lg:text-4xl font-poppins font-bold mb-1.5"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                  >
                    {stat.prefix}
                    <CountUp end={stat.value} duration={3} separator="," enableScrollSpy scrollSpyOnce />
                    {stat.suffix}
                  </motion.div>
                  <p className="text-white/90 font-inter font-medium text-sm">{stat.label}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organic Wave Transition */}
      <div className="relative h-16 -mt-1" style={{ background: 'transparent' }}>
        <svg className="absolute top-0 w-full h-16" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'translateY(-1px)' }}>
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" fill="#ffffff"></path>
        </svg>
      </div>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="primary" size="md" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-4">
              Built for Modern Agriculture
            </h2>
            <p className="text-xl text-[#6B7280] font-inter max-w-2xl mx-auto">
              Everything you need to succeed in agricultural trading, all in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ 
                  duration: 0.9, 
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <motion.div
                  whileHover={{ 
                    y: -12, 
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Card 
                    hoverable 
                    className="h-full group overflow-hidden relative"
                    style={{ borderRadius: '24px' }}
                  >
                    <div className="relative z-10">
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                        initial={{ scale: 0, rotate: -90 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.7, 
                          delay: index * 0.15 + 0.3,
                          type: 'spring',
                          bounce: 0.5
                        }}
                        whileHover={{ 
                          rotate: [0, -10, 10, -10, 0],
                          scale: 1.15
                        }}
                      >
                        <feature.icon className="text-2xl text-white" />
                      </motion.div>
                      <motion.h3 
                        className="text-xl font-poppins font-semibold text-[#1F2937] mb-3 group-hover:text-[#2F4F1C] transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.4 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className="text-[#6B7280] font-inter leading-relaxed mb-3"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
                      >
                        {feature.description}
                      </motion.p>
                      <div className="text-sm text-primary-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn more →
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-[#F9FAF7]">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="accent" size="md" className="mb-4">
              Simple Process
            </Badge>
            <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-4">
              Get Started in 3 Easy Steps
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 70, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-150px" }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.25,
                  ease: [0.22, 1, 0.36, 1]
                }}
              >
                <div className="relative">
                  {/* Animated Connecting Line */}
                  {index < steps.length - 1 && (
                    <motion.div 
                      className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-accent-300 origin-left"
                      initial={{ scaleX: 0, opacity: 0 }}
                      whileInView={{ scaleX: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 1.2, 
                        delay: index * 0.25 + 0.5,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                    ></motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(45, 80, 22, 0.15)' }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card hoverable className="text-center relative z-10">
                      <motion.div 
                        className="relative inline-block mb-6"
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.9, 
                          delay: index * 0.25 + 0.3,
                          type: "spring",
                          bounce: 0.5
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                          <step.icon className="text-3xl text-white" />
                        </div>
                        <motion.div 
                          className="absolute -top-2 -right-2 w-12 h-12 bg-white border-4 border-white rounded-full flex items-center justify-center shadow-md"
                          initial={{ scale: 0, rotate: -90 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          viewport={{ once: true }}
                          transition={{ 
                            delay: index * 0.25 + 0.5, 
                            type: "spring", 
                            bounce: 0.6,
                            duration: 0.8
                          }}
                        >
                          <span className="text-lg font-poppins font-bold text-primary-500">
                            {step.number}
                          </span>
                        </motion.div>
                      </motion.div>
                      <motion.h3 
                        className="text-xl font-poppins font-semibold text-[#1F2937] mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.25 + 0.6 }}
                      >
                        {step.title}
                      </motion.h3>
                      <motion.p 
                        className="text-[#6B7280] font-inter"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.25 + 0.7 }}
                      >
                        {step.description}
                      </motion.p>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center mt-12">
            <Button 
              variant="gradient" 
              size="lg"
              onClick={handleGetStarted}
              icon={<FiArrowRight />}
              iconPosition="right"
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </section>

      {/* Organic Wave Transition */}
      <div className="relative h-16 bg-white">
        <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <motion.path 
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1440,40 1440,40 L1440,80 L0,80 Z" 
            fill="#F9FAF7"
            animate={{
              d: [
                "M0,40 C360,80 720,0 1080,40 C1260,60 1440,40 1440,40 L1440,80 L0,80 Z",
                "M0,50 C360,10 720,70 1080,30 C1260,20 1440,50 1440,50 L1440,80 L0,80 Z",
                "M0,40 C360,80 720,0 1080,40 C1260,60 1440,40 1440,40 L1440,80 L0,80 Z",
              ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <Badge variant="success" size="md" className="mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-4">
              Trusted by Farmers & Buyers
            </h2>
          </div>

          <Card variant="premium" padding="lg" className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
              <GiWheat className="text-primary-500 text-8xl" />
            </div>
            
            <motion.div 
              className="relative z-10"
              key={activeTestimonial}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <img 
                    src={testimonials[activeTestimonial].image} 
                    alt={testimonials[activeTestimonial].name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  {/* Verified Badge */}
                  <div className="absolute -bottom-1 -right-1 bg-success-500 rounded-full p-1.5 border-2 border-white shadow-md">
                    <FiCheckCircle className="text-white text-xs" />
                  </div>
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-poppins font-semibold text-gray-900 text-lg">
                      {testimonials[activeTestimonial].name}
                    </h4>
                    <Badge variant="success" size="sm">Verified</Badge>
                  </div>
                  <p className="text-gray-600 font-inter text-sm mb-2">
                    {testimonials[activeTestimonial].role}
                  </p>
                  <div className="flex items-center gap-1 text-warning-500">
                    {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                      >
                        <FiStar className="fill-current text-sm" />
                      </motion.div>
                    ))}
                    <span className="text-xs text-gray-500 ml-1">(5.0)</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 font-inter text-lg leading-relaxed italic relative">
                <span className="text-4xl text-primary-300 absolute -left-2 -top-2">"</span>
                <span className="relative z-10">{testimonials[activeTestimonial].text}</span>
                <span className="text-4xl text-primary-300 absolute -bottom-4 right-0">"</span>
              </p>
            </motion.div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial 
                      ? 'bg-primary-500 w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Organic Wave Transition */}
      <div className="relative h-16 bg-[#C08A4A]">
        <svg className="absolute top-0 w-full h-16" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <motion.path 
            d="M0,40 C360,0 720,80 1080,40 C1260,20 1440,40 1440,40 L1440,0 L0,0 Z" 
            fill="white"
            animate={{
              d: [
                "M0,40 C360,0 720,80 1080,40 C1260,20 1440,40 1440,40 L1440,0 L0,0 Z",
                "M0,30 C360,70 720,10 1080,50 C1260,70 1440,30 1440,30 L1440,0 L0,0 Z",
                "M0,40 C360,0 720,80 1080,40 C1260,20 1440,40 1440,40 L1440,0 L0,0 Z",
              ]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20 px-4">
        {/* Living Background */}
        <div className="absolute inset-0">
          {/* Animated Gradients */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'linear-gradient(135deg, #C08A4A 0%, #8B5E34 50%, #2F4F1C 100%)',
                'linear-gradient(135deg, #8B5E34 0%, #2F4F1C 50%, #C08A4A 100%)',
                'linear-gradient(135deg, #2F4F1C 0%, #C08A4A 50%, #8B5E34 100%)',
                'linear-gradient(135deg, #C08A4A 0%, #8B5E34 50%, #2F4F1C 100%)',
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating Orbs */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-96 h-96 rounded-full opacity-15"
              style={{
                background: 'radial-gradient(circle, #F4A261 0%, transparent 70%)',
                left: `${20 + i * 30}%`,
                top: `${30 + i * 10}%`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
          
          {/* Grain Texture */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <filter id="cta-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#cta-noise)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.h2 
            className="text-4xl lg:text-5xl font-poppins font-bold text-white mb-6"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Ready to Transform Your Agricultural Business?
          </motion.h2>
          <motion.p 
            className="text-xl text-white/90 font-inter mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            Join thousands of farmers and buyers who are already benefiting from our platform
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-150px" }}
            transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(255, 255, 255, 0.5)' }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost"
                size="lg"
                onClick={handleGetStarted}
                className="bg-white !text-[#2F4F1C] font-bold hover:bg-gray-50 shadow-2xl border-2 border-white"
              >
                Get Started Now
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(255, 255, 255, 0.3)' }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost"
                size="lg"
                onClick={() => navigate('/contact')}
                className="border-2 border-white !text-white hover:bg-white/10 backdrop-blur-sm"
              >
                Contact Sales
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GiWheat className="text-3xl text-accent-500" />
                <span className="font-poppins font-bold text-xl">KissanConnect</span>
              </div>
              <p className="text-gray-400 font-inter text-sm">
                Empowering farmers and buyers with direct, fair, and transparent agricultural trading.
              </p>
            </div>
            
            <div>
              <h4 className="font-poppins font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 font-inter text-sm">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
                <li><Link to="/farmers" className="hover:text-white transition">For Farmers</Link></li>
                <li><Link to="/buyers" className="hover:text-white transition">For Buyers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-poppins font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 font-inter text-sm">
                <li><Link to="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/refund" className="hover:text-white transition">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-poppins font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 font-inter text-sm">
                <li>Email: support@kissanconnect.in</li>
                <li>Phone: +91 98765 43210</li>
                <li>Address: Delhi, India</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 font-inter text-sm">
            <p>&copy; 2026 KissanConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
