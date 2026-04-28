import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheck, FiX, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';
import { getRoleTokens } from '../../utils/designTokens';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

const NotificationDropdown = () => {
  const { user } = useAuth();
  const { isConnected, liveNotifications } = useSocket();
  const roleTokens = getRoleTokens(user?.role || 'farmer');
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const normalizeNotification = (notification) => {
    const fallbackId = `${notification.type || 'info'}-${notification.title || 'notification'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const normalizedTimestamp = notification.timestamp ? new Date(notification.timestamp) : new Date();

    return {
      ...notification,
      id: notification.id || notification._id || fallbackId,
      read: Boolean(notification.read),
      timestamp: Number.isNaN(normalizedTimestamp.getTime()) ? new Date() : normalizedTimestamp,
    };
  };

  const dropdownRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Merge live notifications from socket with existing ones
  useEffect(() => {
    if (liveNotifications.length > 0) {
      setNotifications(prev => {
        const normalizedIncoming = liveNotifications.map(normalizeNotification);
        const existingIds = new Set(prev.map(n => n.id));
        const newNotifications = normalizedIncoming.filter(n => !existingIds.has(n.id));
        return [...newNotifications, ...prev];
      });
    }
  }, [liveNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'warning':
        return <FiAlertCircle className="text-yellow-500" />;
      case 'info':
        return <FiInfo className="text-blue-500" />;
      default:
        return <FiBell className="text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const parsed = timestamp instanceof Date ? timestamp : new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return 'just now';

    const diff = now - parsed;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
        style={{ borderRadius: roleTokens.radius.card }}
        title={isConnected ? 'Connected (Live updates)' : 'Disconnected'}
      >
        <FiBell className="w-6 h-6 text-gray-700" />
        
        {/* Connection Status Indicator */}
        <span
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-gray-400'
          }`}
          title={isConnected ? 'Live' : 'Offline'}
        />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center"
            style={{ backgroundColor: roleTokens.primaryColor }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50"
            style={{ borderRadius: roleTokens.radius.card }}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div 
              className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"
              style={{ backgroundColor: `${roleTokens.primaryColor}10` }}
            >
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm font-medium hover:underline"
                  style={{ color: roleTokens.primaryColor }}
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span 
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                              style={{ backgroundColor: roleTokens.primaryColor }}
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Mark as read"
                          >
                            <FiCheck className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete"
                        >
                          <FiX className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-3 bg-gray-50 text-center">
                <button
                  className="text-sm font-medium hover:underline"
                  style={{ color: roleTokens.primaryColor }}
                  onClick={() => {
                    setIsOpen(false);
                    // Navigate to notifications page (future enhancement)
                  }}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
