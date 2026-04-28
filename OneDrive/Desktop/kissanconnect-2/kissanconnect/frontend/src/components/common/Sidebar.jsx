import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiHome, 
  FiShoppingBag, 
  FiFileText, 
  FiSettings,
  FiUsers,
  FiBarChart2,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiPackage,
  FiShield,
  FiAlertTriangle,
  FiCreditCard,
  FiMessageCircle,
  FiDatabase
} from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { getRoleTokens } from '../../utils/designTokens';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const roleTokens = getRoleTokens(user?.role);

  // Role-based menu items (clean, essential only)
  const getMenuItems = () => {
    if (user?.role === 'farmer') {
      return [
        { name: 'Dashboard', path: '/farmer/dashboard', icon: FiHome },
        { name: 'My Crops', path: '/farmer/crops', icon: GiWheat },
        { name: 'Add Crop', path: '/farmer/add-crop', icon: FiPlus },
        { name: 'Contracts', path: '/farmer/contracts', icon: FiFileText },
        { name: 'My Disputes', path: '/farmer/disputes', icon: FiAlertTriangle },
        { name: 'Messages', path: '/chat', icon: FiMessageCircle },
        { name: 'Wallet', path: '/wallet', icon: FiCreditCard },
        { name: 'Settings', path: '/settings', icon: FiSettings },
      ];
    } else if (user?.role === 'buyer') {
      return [
        { name: 'Dashboard', path: '/buyer/dashboard', icon: FiHome },
        { name: 'Browse Crops', path: '/buyer/browse-crops', icon: GiWheat },
        { name: 'Contracts', path: '/buyer/contracts', icon: FiFileText },
        { name: 'Orders', path: '/buyer/orders', icon: FiPackage },
        { name: 'My Disputes', path: '/buyer/disputes', icon: FiAlertTriangle },
        { name: 'Messages', path: '/chat', icon: FiMessageCircle },
        { name: 'Wallet', path: '/wallet', icon: FiCreditCard },
        { name: 'Settings', path: '/settings', icon: FiSettings },
      ];
    } else if (user?.role === 'admin') {
      return [
        { name: 'Dashboard', path: '/admin/dashboard', icon: FiHome },
        { name: 'Users', path: '/admin/users', icon: FiUsers },
        { name: 'Contracts', path: '/admin/contracts', icon: FiFileText },
        { name: 'Withdrawals', path: '/admin/withdrawals', icon: FiCreditCard },
        { name: 'Disputes', path: '/admin/disputes', icon: FiAlertTriangle },
        { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart2 },
        { name: 'Data Integrity', path: '/admin/data-integrity', icon: FiDatabase },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: FiShield },
        { name: 'Settings', path: '/admin/settings', icon: FiSettings },
      ];
    }
    return [];
  };

  const menuItems = getMenuItems();

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: isCollapsed ? '80px' : '240px'
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="fixed left-0 top-[64px] bottom-0 border-r border-gray-200 z-30 overflow-hidden"
      style={{ 
        backgroundColor: roleTokens.sidebar.bg,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.04)'
      }}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 z-10"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <FiChevronRight className="text-gray-600 text-sm" />
        ) : (
          <FiChevronLeft className="text-gray-600 text-sm" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="h-full overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg
                  transition-all duration-200 group relative
                  ${isActive 
                    ? 'font-medium' 
                    : 'hover:bg-gray-50'
                  }
                `}
                style={{
                  backgroundColor: isActive ? roleTokens.sidebar.activeBg : 'transparent',
                  color: isActive ? roleTokens.sidebar.activeText : '#6B7280'
                }}
                title={isCollapsed ? item.name : ''}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full"
                    style={{ backgroundColor: roleTokens.primaryColor }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
                
                {/* Icon */}
                <div className="flex-shrink-0 flex items-center justify-center w-6">
                  <item.icon 
                    className="text-xl"
                    style={{ 
                      color: isActive 
                        ? roleTokens.sidebar.activeText 
                        : '#9CA3AF'
                    }}
                  />
                </div>
                
                {/* Label */}
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-inter text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
