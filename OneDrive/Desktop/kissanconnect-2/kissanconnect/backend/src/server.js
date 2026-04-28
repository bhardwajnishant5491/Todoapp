import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import config from './config/env.js';
import connectDB from './config/db.js';

// ═══════════════════════════════════════════════════════════════
// Digital Fingerprint - Developer Signature (Hidden in Code)
// ═══════════════════════════════════════════════════════════════
const _dev_signature = Buffer.from('ShivrajSinghChundawat_LPU_2022-2026_singhshivraj1408@gmail.com').toString('base64');
const _project_id = 'KISAN_CONNECT_LPU_CAPSTONE_2026';
const _author_hash = '4a3e9c2b1f8d7e6a5c4b3a2d1e0f9a8b7c6d5e4f3a2b1c0d';
// ═══════════════════════════════════════════════════════════════

// Connect to Database
connectDB();

// Create HTTP server and attach Socket.IO
const PORT = config.port;
const httpServer = createServer(app);

// Initialize Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: config.frontend.url || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'authorization'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Store connected users
const connectedUsers = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins with their user ID
  socket.on('join', (userId) => {
    connectedUsers.set(userId, socket.id);
    socket.userId = userId;
    console.log(`👤 User ${userId} joined with socket ${socket.id}`);
  });

  // User disconnects
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      console.log(`👋 User ${socket.userId} disconnected`);
    }
  });
});

// Make io accessible throughout the app
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// Start Server
httpServer.listen(PORT, () => {
  console.log('');
  console.log('\x1b[32m╔══════════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[32m║\x1b[0m         🌾 KISANCONNECT - Backend API Server              \x1b[32m║\x1b[0m');
  console.log('\x1b[32m╠══════════════════════════════════════════════════════════════╣\x1b[0m');
  console.log('\x1b[36m║  Developer: Shivraj Singh Chundawat                         ║\x1b[0m');
  console.log('\x1b[36m║  Email: singhshivraj1408@gmail.com                          ║\x1b[0m');
  console.log('\x1b[36m║  Institution: Lovely Professional University                ║\x1b[0m');
  console.log('\x1b[36m║  Batch: 2022-2026                                           ║\x1b[0m');
  console.log('\x1b[36m║  Project: B.Tech Capstone - Smart Contract Farming         ║\x1b[0m');
  console.log('\x1b[32m╠══════════════════════════════════════════════════════════════╣\x1b[0m');
  console.log(`\x1b[33m║  🚀 Server Mode: ${config.nodeEnv.padEnd(43)}║\x1b[0m`);
  console.log(`\x1b[33m║  🌐 API URL: http://localhost:${PORT.toString().padEnd(38)}║\x1b[0m`);
  console.log(`\x1b[33m║  📡 Health: http://localhost:${PORT}/health${' '.repeat(31)}║\x1b[0m`);
  console.log(`\x1b[33m║  🔌 WebSocket: ws://localhost:${PORT.toString().padEnd(33)}║\x1b[0m`);
  console.log('\x1b[32m╠══════════════════════════════════════════════════════════════╣\x1b[0m');
  console.log('\x1b[31m║  © 2026 All Rights Reserved                                 ║\x1b[0m');
  console.log('\x1b[31m║  ⚠️  Unauthorized use is prohibited                          ║\x1b[0m');
  console.log('\x1b[32m╚══════════════════════════════════════════════════════════════╝\x1b[0m');
  console.log('');
  console.log('⏳ Waiting for requests...');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.log('🛑 Shutting down server...');
  process.exit(1);
});
