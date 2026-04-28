import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/common/Sidebar';
import NotificationDropdown from '../components/common/NotificationDropdown';
import Avatar from '../components/ui/Avatar';
import { useAuth } from '../context/AuthContext';
import { GiWheat } from 'react-icons/gi';
import { FiLogOut } from 'react-icons/fi';
import designTokens from '../utils/designTokens';

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: designTokens.colors.bg.app }}
    >
      {/* Top Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-40 border-b"
        style={{
          height: designTokens.layout.topBar.height,
          backgroundColor: designTokens.layout.topBar.bg,
          borderColor: designTokens.colors.border.light,
        }}
      >
        <div className="h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <GiWheat 
              className="text-3xl" 
              style={{ 
                color: user?.role === 'farmer' ? designTokens.colors.primary.farmer :
                       user?.role === 'buyer' ? designTokens.colors.primary.buyer :
                       designTokens.colors.primary.admin
              }}
            />
            <h1 
              className="text-xl font-poppins font-bold"
              style={{ 
                color: user?.role === 'farmer' ? designTokens.colors.primary.farmer :
                       user?.role === 'buyer' ? designTokens.colors.primary.buyer :
                       designTokens.colors.primary.admin
              }}
            >
              KissanConnect
            </h1>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {/* User Info */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50">
              <Avatar
                src={user?.profilePic}
                alt={user?.name || 'User'}
                name={user?.name}
                size="sm"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-900 capitalize font-medium">{user?.role} Account</p>
              </div>
            </div>

            {/* Notifications */}
            <NotificationDropdown />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Logout"
            >
              <FiLogOut className="text-gray-600" />
              <span className="hidden sm:inline text-sm font-medium text-gray-700">
                Logout
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />

      {/* Main Content Area */}
      <motion.main
        initial={false}
        animate={{ 
          marginLeft: isSidebarCollapsed ? '80px' : '240px',
          width: isSidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 240px)'
        }}
        transition={{ 
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="min-h-screen"
        style={{ 
          paddingTop: designTokens.layout.topBar.height,
        }}
      >
        {/* Page Content */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </motion.main>
    </div>
  );
};

export default DashboardLayout;
