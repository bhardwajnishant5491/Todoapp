import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiBell, 
  FiUser, 
  FiLogOut, 
  FiSettings,
  FiHome,
  FiShoppingBag,
  FiFileText,
  FiTrendingUp
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import NotificationDropdown from './NotificationDropdown';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: FiHome },
    { name: t('buyer.browseCrops'), path: '/buyer/browse-crops', icon: FiShoppingBag, requireAuth: true },
    { name: t('nav.about'), path: '/about', icon: FiTrendingUp },
    { name: t('nav.contact'), path: '/contact', icon: FiFileText },
  ];

  const userMenuItems = [
    { 
      name: t('nav.dashboard'), 
      path: user?.role === 'farmer' ? '/farmer/dashboard' : user?.role === 'buyer' ? '/buyer/dashboard' : '/admin/dashboard',
      icon: FiHome 
    },
    { name: t('nav.profile'), path: '/settings', icon: FiUser },
    { name: t('nav.settings'), path: '/settings', icon: FiSettings },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white shadow-md py-3' 
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-br from-primary-500 to-accent-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <GiWheat className="text-white text-2xl" />
              </div>
              <span className="font-poppins font-bold text-2xl bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                KissanConnect
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                if (link.requireAuth && !isAuthenticated) return null;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`font-inter font-medium transition-colors duration-200 relative group ${
                      isActive ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'
                    }`}
                  >
                    {link.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary-500 transition-all duration-300 ${
                      isActive ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}></span>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
              {/* Language Switcher - Always visible */}
              <LanguageSwitcher />
              
              {isAuthenticated ? (
                <>
                  {/* Real-time Notifications */}
                  <NotificationDropdown />

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
                    >
                      <Avatar 
                        src={user?.profilePic} 
                        alt={user?.name} 
                        name={user?.name}
                        size="sm"
                        status="online"
                      />
                      <div className="hidden lg:block text-left">
                        <p className="font-inter font-medium text-sm text-gray-900">{user?.name}</p>
                        <p className="font-inter text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </button>

                    {/* User Dropdown */}
                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-premium border border-gray-100 py-2 overflow-hidden"
                        >
                          {/* User Info */}
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-inter font-semibold text-gray-900">{user?.name}</p>
                            <p className="font-inter text-sm text-gray-500">{user?.email}</p>
                            <Badge variant="primary" size="sm" className="mt-2">
                              {user?.role}
                            </Badge>
                          </div>

                          {/* Menu Items */}
                          {userMenuItems.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <item.icon className="text-gray-500" />
                              <span className="font-inter text-gray-700">{item.name}</span>
                            </Link>
                          ))}

                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-danger-50 transition-colors duration-200 text-danger-500"
                            >
                              <FiLogOut />
                              <span className="font-inter">{t('common.logout')}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden md:block font-inter font-medium text-gray-700 hover:text-primary-500 transition-colors duration-200"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="hidden md:block bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-inter font-medium px-6 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    {t('common.register')}
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <FiX className="text-2xl text-gray-700" />
                ) : (
                  <FiMenu className="text-2xl text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-[72px] right-0 bottom-0 w-64 bg-white shadow-premium z-40 md:hidden overflow-y-auto"
          >
            <div className="p-4 space-y-2">
              {/* Language Switcher - Mobile */}
              <div className="pb-2 mb-2 border-b border-gray-200">
                <LanguageSwitcher />
              </div>
              
              {navLinks.map((link) => {
                if (link.requireAuth && !isAuthenticated) return null;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-500' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <link.icon className="text-xl" />
                    <span className="font-inter font-medium">{link.name}</span>
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-center font-inter font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 text-center bg-gradient-to-r from-primary-500 to-accent-500 text-white font-inter font-medium rounded-lg transition-all duration-300"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Backdrop for user menu */}
      {isUserMenuOpen && (
        <div
          onClick={() => setIsUserMenuOpen(false)}
          className="fixed inset-0 z-30"
        />
      )}
    </>
  );
};

export default Navbar;
