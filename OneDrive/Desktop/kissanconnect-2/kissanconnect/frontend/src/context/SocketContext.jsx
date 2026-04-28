import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !user) {
      // Disconnect if socket exists and user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get socket URL from environment or use localhost
    // Important: Socket URL should NOT include /api path
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

    // Initialize socket connection
    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;
    setSocket(socket);

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      
      // Join user to their personal room
      socket.emit('join', user._id);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Listen for new notifications
    socket.on('new_notification', (notification) => {
      console.log('📬 New notification received:', notification);
      setLiveNotifications((prev) => [notification, ...prev]);
      
      // Optional: Show browser notification if permitted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    // Listen for contract updates
    socket.on('contract_update', (data) => {
      console.log('📝 Contract update:', data);
      // Trigger custom event for contract pages to listen
      window.dispatchEvent(new CustomEvent('contractUpdate', { detail: data }));
    });

    // Listen for new crop listings
    socket.on('new_crop', (data) => {
      console.log('🌾 New crop listed:', data);
      // Trigger custom event for crop browser to listen
      window.dispatchEvent(new CustomEvent('newCrop', { detail: data }));
    });

    // Listen for system messages
    socket.on('system_message', (data) => {
      console.log('📢 System message:', data);
      // Could show a toast or banner
      window.dispatchEvent(new CustomEvent('systemMessage', { detail: data }));
    });

    // Listen for chat messages
    socket.on('new_message', (data) => {
      console.log('💬 New chat message:', data);
      // Trigger custom event for chat components to listen
      window.dispatchEvent(new CustomEvent('newChatMessage', { detail: data }));
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      // Trigger custom event for chat UI
      window.dispatchEvent(new CustomEvent('userTyping', { detail: data }));
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('new_notification');
        socket.off('contract_update');
        socket.off('new_crop');
        socket.off('system_message');
        socket.off('new_message');
        socket.off('user_typing');
        socket.disconnect();
      }
      setSocket(null);
    };
  }, [isAuthenticated, user]);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const value = {
    socket,
    isConnected,
    liveNotifications,
    clearLiveNotifications: () => setLiveNotifications([]),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
