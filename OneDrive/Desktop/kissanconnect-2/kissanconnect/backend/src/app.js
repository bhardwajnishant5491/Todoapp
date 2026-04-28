import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';

const app = express();

// CORS Configuration - Use cors package properly
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all localhost origins in development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    return callback(null, true); // Allow all origins in development
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'authorization', 'X-Requested-With', 'Accept', 'x-auth-token', 'X-Auth-Token'],
  exposedHeaders: ['Authorization', 'authorization'],
  maxAge: 86400,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging Middleware (only in development)
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'KisanConnect API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API Routes (will be added later)
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to KisanConnect API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      crops: '/api/crops',
      contracts: '/api/contracts',
      payments: '/api/payments',
      bank: '/api/bank',
      wallet: '/api/wallet',
      admin: '/api/admin'
    }
  });
});

// Import routes (placeholder - will add as we build)
import authRoutes from './routes/authRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import contractRoutes from './routes/contractRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import bankRoutes from './routes/bankRoutes.js';
import walletRoutes from './routes/walletRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import disputeRoutes from './routes/disputeRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import { protect } from './middleware/authMiddleware.js';
import { adminOnly } from './middleware/roleMiddleware.js';

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/disputes', disputeRoutes); // Accessible to farmers & buyers
app.use('/api/admin/disputes', protect, adminOnly, disputeRoutes); // Admin alias for consistency
app.use('/api/admin/support', protect, adminOnly, supportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === 'development' && { stack: err.stack })
  });
});

export default app;
