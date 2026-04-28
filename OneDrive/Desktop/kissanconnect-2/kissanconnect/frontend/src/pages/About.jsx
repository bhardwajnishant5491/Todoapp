import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GiWheat, GiFarmer, GiPlantSeed } from 'react-icons/gi';
import { FaTractor, FaSeedling } from 'react-icons/fa';
import { FiArrowLeft, FiCheckCircle, FiHeart, FiTrendingUp, FiShield, FiUsers, FiTarget } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FloatingElement from '../components/animations/FloatingElement';

const About = () => {
  const values = [
    {
      icon: FiHeart,
      title: 'Farmer First',
      description: 'Every decision we make prioritizes the welfare and success of our farming community',
      color: 'from-danger-400 to-danger-600',
    },
    {
      icon: FiShield,
      title: 'Trust & Transparency',
      description: 'Building lasting relationships through honest dealings and clear communication',
      color: 'from-success-400 to-success-600',
    },
    {
      icon: FiTrendingUp,
      title: 'Fair Pricing',
      description: 'Ensuring farmers get the best value for their crops without middlemen',
      color: 'from-primary-400 to-primary-600',
    },
    {
      icon: FiUsers,
      title: 'Community Driven',
      description: 'Powered by and built for the agricultural community of India',
      color: 'from-accent-400 to-accent-600',
    },
  ];

  const stats = [
    { value: '2,500+', label: 'Active Farmers', icon: GiFarmer },
    { value: '5,000+', label: 'Successful Contracts', icon: FiCheckCircle },
    { value: '₹150Cr+', label: 'Total Revenue', icon: FiTrendingUp },
    { value: '98%', label: 'Satisfaction Rate', icon: FiHeart },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-[#F9FAF7]">
        {/* Living Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#4CAF50]/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-tr from-[#C08A4A]/20 to-transparent"></div>
          </div>
          
          <motion.div
            className="absolute w-[400px] h-[400px] rounded-full opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)',
              left: '10%',
              top: '20%',
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
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
          
          <div className="absolute inset-0 pointer-events-none">
            <FloatingElement delay={0} className="absolute top-20 right-10 opacity-8">
              <GiWheat className="text-primary-500 text-5xl" />
            </FloatingElement>
            <FloatingElement delay={1.5} className="absolute bottom-20 left-10 opacity-8">
              <GiFarmer className="text-accent-500 text-4xl" />
            </FloatingElement>
            <FloatingElement delay={2} className="absolute top-40 left-1/4 opacity-6">
              <FaTractor className="text-warning-500 text-4xl" />
            </FloatingElement>
            <FloatingElement delay={0.8} className="absolute bottom-40 right-1/4 opacity-8">
              <FaSeedling className="text-success-500 text-3xl" />
            </FloatingElement>
            <FloatingElement delay={2.5} className="absolute top-1/2 right-16 opacity-6">
              <GiPlantSeed className="text-primary-400 text-3xl" />
            </FloatingElement>
          </div>
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 font-inter font-semibold group transition-colors">
              <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
          
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="primary" size="lg" className="mb-4">
              Our Story
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-[#1F2937] mb-6 leading-tight">
              Empowering India's Agricultural Community
            </h1>
            <p className="text-xl text-[#6B7280] font-inter leading-relaxed max-w-3xl mx-auto">
              KissanConnect is India's premier agricultural marketplace, connecting farmers directly with buyers 
              to ensure fair prices, transparent dealings, and sustainable growth for everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className="h-full bg-gradient-to-br from-primary-50 to-white border-2 border-primary-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg">
                    <FiTarget className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl font-poppins font-bold text-[#1F2937]">Our Mission</h2>
                </div>
                <p className="text-[#6B7280] font-inter leading-relaxed text-lg">
                  To revolutionize agricultural trade in India by eliminating middlemen, ensuring farmers receive 
                  fair compensation for their hard work, and providing buyers with direct access to quality produce. 
                  We're building a transparent, efficient, and trustworthy platform that serves the entire agricultural ecosystem.
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <Card className="h-full bg-gradient-to-br from-accent-50 to-white border-2 border-accent-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-500 to-warning-500 flex items-center justify-center shadow-lg">
                    <FiTrendingUp className="text-white text-2xl" />
                  </div>
                  <h2 className="text-2xl font-poppins font-bold text-[#1F2937]">Our Vision</h2>
                </div>
                <p className="text-[#6B7280] font-inter leading-relaxed text-lg">
                  To become India's most trusted agricultural marketplace, empowering every farmer with technology, 
                  fair market access, and sustainable income opportunities. We envision a future where agricultural 
                  trade is transparent, efficient, and beneficial for all stakeholders in the supply chain.
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-[#F9FAF7]">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="success" size="md" className="mb-4">
              Our Impact
            </Badge>
            <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-4">
              Making a Difference Together
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <stat.icon className="text-5xl mx-auto mb-3 text-primary-500" />
                  <div className="text-3xl font-poppins font-bold text-[#1F2937] mb-2">
                    {stat.value}
                  </div>
                  <p className="text-[#6B7280] font-inter font-medium text-sm">{stat.label}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" size="md" className="mb-4">
              Our Core Values
            </Badge>
            <h2 className="text-4xl font-poppins font-bold text-[#1F2937] mb-4">
              What We Stand For
            </h2>
            <p className="text-xl text-[#6B7280] font-inter max-w-2xl mx-auto">
              The principles that guide every decision we make and every action we take
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Card hoverable className="h-full group">
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center shadow-lg flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <value.icon className="text-white text-2xl" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-poppins font-semibold text-[#1F2937] mb-2 group-hover:text-primary-600 transition-colors">
                        {value.title}
                      </h3>
                      <p className="text-[#6B7280] font-inter leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-500 to-accent-500 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <filter id="about-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
            </filter>
            <rect width="100%" height="100%" filter="url(#about-noise)" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-4xl lg:text-5xl font-poppins font-bold text-white mb-6">
              Join Our Growing Community
            </h2>
            <p className="text-xl text-white/90 font-inter mb-8 max-w-2xl mx-auto">
              Be part of the agricultural revolution. Whether you're a farmer or buyer, there's a place for you here.
            </p>
            <Link 
              to="/register"
              className="inline-block bg-white text-primary-600 font-poppins font-semibold px-8 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
