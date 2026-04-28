import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import { GiWheat, GiFarmer, GiPlantSeed } from 'react-icons/gi';
import { FaTractor } from 'react-icons/fa';
import { FiArrowLeft, FiMail, FiPhone, FiMapPin, FiSend, FiMessageCircle } from 'react-icons/fi';
import Navbar from '../components/common/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import FloatingElement from '../components/animations/FloatingElement';
import 'react-toastify/dist/ReactToastify.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'support@kissanconnect.in',
      description: 'Send us an email anytime',
      color: 'from-primary-400 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-500',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+91 98765 43210',
      description: 'Mon-Sat from 9am to 6pm',
      color: 'from-success-400 to-success-600',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-500',
    },
    {
      icon: FiMapPin,
      title: 'Address',
      value: 'Delhi, India',
      description: 'Come visit our office',
      color: 'from-accent-400 to-accent-600',
      bgColor: 'bg-accent-50',
      iconColor: 'text-accent-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden bg-[#F9FAF7]">
        {/* Living Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#4CAF50]/20 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-[#C08A4A]/20 to-transparent"></div>
          </div>
          
          <motion.div
            className="absolute w-[350px] h-[350px] rounded-full opacity-10 blur-3xl"
            style={{
              background: 'radial-gradient(circle, #C08A4A 0%, transparent 70%)',
              right: '10%',
              top: '20%',
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
            }}
          />
          
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}></div>
          
          <div className="absolute inset-0 pointer-events-none">
            <FloatingElement delay={0} className="absolute top-20 left-10 opacity-8">
              <GiWheat className="text-primary-500 text-5xl" />
            </FloatingElement>
            <FloatingElement delay={1.5} className="absolute bottom-20 right-10 opacity-8">
              <GiFarmer className="text-accent-500 text-4xl" />
            </FloatingElement>
            <FloatingElement delay={2} className="absolute top-40 right-1/4 opacity-6">
              <FaTractor className="text-warning-500 text-4xl" />
            </FloatingElement>
            <FloatingElement delay={0.8} className="absolute bottom-32 left-1/4 opacity-6">
              <GiPlantSeed className="text-success-500 text-3xl" />
            </FloatingElement>
          </div>
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
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
              <FiMessageCircle className="inline mr-2" />
              Get in Touch
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-poppins font-bold text-[#1F2937] mb-6 leading-tight">
              We're Here to Help
            </h1>
            <p className="text-xl text-[#6B7280] font-inter leading-relaxed max-w-2xl mx-auto">
              Have questions or feedback? Our team is ready to assist you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-4 bg-white -mt-12 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.4 }}
              >
                <Card hoverable className="text-center group">
                  <motion.div 
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <info.icon className="text-white text-2xl" />
                  </motion.div>
                  <h3 className="text-xl font-poppins font-semibold text-[#1F2937] mb-2">
                    {info.title}
                  </h3>
                  <p className="text-primary-600 font-inter font-semibold mb-1">
                    {info.value}
                  </p>
                  <p className="text-[#6B7280] font-inter text-sm">
                    {info.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="bg-white/80 backdrop-blur-xl border-2 border-gray-100 shadow-premium">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-poppins font-bold text-[#1F2937] mb-3">
                  Send Us a Message
                </h2>
                <p className="text-[#6B7280] font-inter">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                      Your Name *
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Subject *
                  </label>
                  <input
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400"
                    placeholder="What is this regarding?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#1F2937] mb-2 font-poppins">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 font-inter text-[#1F2937] placeholder-gray-400 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 text-white font-poppins font-semibold py-4 rounded-xl shadow-lg disabled:opacity-50 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(47, 79, 28, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <>
                      Send Message
                      <FiSend className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Map or Additional Info Section */}
      <section className="py-16 px-4 bg-[#F9FAF7]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-poppins font-bold text-[#1F2937] mb-4">
              Business Hours
            </h2>
            <div className="inline-block bg-white rounded-2xl shadow-lg p-8 mt-6">
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="font-poppins font-semibold text-[#1F2937] mb-3">
                    Monday - Friday
                  </h3>
                  <p className="text-[#6B7280] font-inter">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-[#1F2937] mb-3">
                    Saturday
                  </h3>
                  <p className="text-[#6B7280] font-inter">10:00 AM - 4:00 PM</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-[#1F2937] mb-3">
                    Sunday
                  </h3>
                  <p className="text-[#6B7280] font-inter">Closed</p>
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-[#1F2937] mb-3">
                    Response Time
                  </h3>
                  <p className="text-[#6B7280] font-inter">Within 24 hours</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
