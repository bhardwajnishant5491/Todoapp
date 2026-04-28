import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import chatService from '../services/chatService';
import { toast } from 'react-toastify';
import { 
  FiArrowLeft, 
  FiMessageCircle, 
  FiSend,
  FiUser,
  FiCheck,
  FiCheckCircle,
  FiSearch
} from 'react-icons/fi';
import DashboardLayout from '../layouts/DashboardLayout';
import { getRoleTokens } from '../utils/designTokens';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const roleTokens = getRoleTokens(user?.role || 'farmer');
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId');
  const initialContractId = searchParams.get('contractId');

  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    
    // Listen for real-time messages
    const handleNewMessage = (event) => {
      const messageData = event.detail;
      
      // Add message to active chat if it matches
      if (activeChat && 
          (messageData.message.senderId._id === activeChat.otherUser._id || 
           messageData.message.receiverId._id === activeChat.otherUser._id)) {
        setMessages(prev => [...prev, messageData.message]);
        scrollToBottom();
        
        // Mark as read
        chatService.markAsRead(activeChat.otherUser._id);
      }
      
      // Update conversations list
      fetchConversations();
    };

    window.addEventListener('newChatMessage', handleNewMessage);
    
    return () => {
      window.removeEventListener('newChatMessage', handleNewMessage);
    };
  }, [activeChat]);

  useEffect(() => {
    // If userId is provided in URL, load that conversation
    if (initialUserId && !loading) {
      const conversation = conversations.find(
        conv => conv.otherUser._id === initialUserId
      );
      
      if (conversation) {
        // Existing conversation found
        handleSelectConversation(conversation);
      } else {
        // New conversation - fetch user details and create chat
        if (initialContractId) {
          loadContractChat(initialContractId);
        } else {
          // Just userId provided (from crop details)
          loadNewChat(initialUserId);
        }
      }
    }
  }, [initialUserId, conversations, loading]);

  const fetchConversations = async () => {
    try {
      const result = await chatService.getAllConversations();
      if (result.success) {
        setConversations(result.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadContractChat = async (contractId) => {
    try {
      const result = await chatService.getContractParticipants(contractId);
      if (result.success) {
        setActiveChat({
          otherUser: result.data.otherUser,
          contract: result.data.contract,
        });
        
        // Load messages with this user
        const messagesResult = await chatService.getConversation(result.data.otherUser._id);
        if (messagesResult.success) {
          setMessages(messagesResult.data);
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error loading contract chat:', error);
      toast.error('Failed to load chat');
    }
  };

  const loadNewChat = async (userId) => {
    try {
      // Fetch user details
      const userResult = await chatService.getUserForChat(userId);
      if (userResult.success) {
        setActiveChat({
          otherUser: userResult.data,
          contract: null,
        });
        
        // Load any existing messages with this user (will be empty for new chat)
        const messagesResult = await chatService.getConversation(userId);
        if (messagesResult.success) {
          setMessages(messagesResult.data);
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error loading new chat:', error);
      toast.error('Failed to start conversation');
    }
  };

  const handleSelectConversation = async (conversation) => {
    setActiveChat(conversation);
    
    try {
      const result = await chatService.getConversation(conversation.otherUser._id);
      if (result.success) {
        setMessages(result.data);
        scrollToBottom();
        
        // Mark as read
        await chatService.markAsRead(conversation.otherUser._id);
        fetchConversations(); // Refresh to update unread count
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeChat) return;

    try {
      setSending(true);
      const result = await chatService.sendMessage(
        activeChat.otherUser._id,
        newMessage,
        activeChat.contract?._id
      );
      
      if (result.success) {
        setMessages(prev => [...prev, result.data]);
        setNewMessage('');
        scrollToBottom();
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
      messageInputRef.current?.focus();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-120px)]">
        {/* Header */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <FiArrowLeft /> Back
          </button>
          <div className="flex items-center gap-3">
            <FiMessageCircle className="text-2xl" style={{ color: roleTokens.primaryColor }} />
            <h1 className="text-2xl font-poppins font-bold text-gray-900">Messages</h1>
          </div>
        </motion.div>

        {/* Chat Container */}
        <div className="flex gap-4 h-full">
          {/* Conversations List */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                  style={{ focusRing: roleTokens.primaryColor }}
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Loading...</p>
                  </div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <div>
                    <FiMessageCircle className="text-4xl text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">
                      {searchQuery ? 'No conversations found' : 'No messages yet'}
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  {filteredConversations.map((conversation) => (
                    <button
                      key={conversation.conversationId}
                      onClick={() => handleSelectConversation(conversation)}
                      className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                        activeChat?.otherUser._id === conversation.otherUser._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
                        >
                          <FiUser className="text-xl" style={{ color: roleTokens.primaryColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h4>
                            <span className="text-xs text-gray-500 flex-shrink-0">
                              {formatTime(conversation.lastMessage.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.message}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span 
                                className="ml-2 px-2 py-0.5 rounded-full text-xs text-white flex-shrink-0"
                                style={{ backgroundColor: roleTokens.primaryColor }}
                              >
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            {activeChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${roleTokens.primaryColor}20` }}
                  >
                    <FiUser style={{ color: roleTokens.primaryColor }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{activeChat.otherUser.name}</h3>
                    <p className="text-xs text-gray-500 capitalize">{activeChat.otherUser.role}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isOwnMessage = message.senderId._id === user._id;
                    const showDate = index === 0 || 
                      new Date(messages[index - 1].createdAt).toDateString() !== new Date(message.createdAt).toDateString();

                    return (
                      <div key={message._id}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div 
                            className={`max-w-[70%] px-4 py-2 rounded-lg ${
                              isOwnMessage 
                                ? 'rounded-br-none' 
                                : 'rounded-bl-none'
                            }`}
                            style={{
                              backgroundColor: isOwnMessage ? roleTokens.primaryColor : '#F3F4F6',
                              color: isOwnMessage ? 'white' : '#1F2937'
                            }}
                          >
                            <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                            <div className={`flex items-center gap-1 mt-1 text-xs ${
                              isOwnMessage ? 'text-white text-opacity-80' : 'text-gray-500'
                            }`}>
                              <span>{formatTime(message.createdAt)}</span>
                              {isOwnMessage && (
                                message.isRead ? (
                                  <FiCheckCircle className="w-3 h-3" />
                                ) : (
                                  <FiCheck className="w-3 h-3" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                      style={{ focusRing: roleTokens.primaryColor }}
                      disabled={sending}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 rounded-lg text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
                      style={{ backgroundColor: roleTokens.primaryColor }}
                    >
                      {sending ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <FiSend />
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <FiMessageCircle 
                    className="text-6xl mx-auto mb-4"
                    style={{ color: `${roleTokens.primaryColor}40` }}
                  />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
