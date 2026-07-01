import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Configurations
import connectDB from './config/db.js';
import seedDatabase from './utils/seed.js';

// Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Models
import Message from './models/Message.js';

// Load ENV
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Run DB Seeder
  seedDatabase();
});

const app = express();
const server = http.createServer(app);

// Per-request CORS origin checker — strips trailing slashes before comparing
// This is immune to FRONTEND_URL env var having a trailing slash on Render
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(u => u.trim().replace(/\/$/, ''))
  : [];

const corsOriginFn = (origin, callback) => {
  // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
  if (!origin) return callback(null, true);

  // Normalise: strip trailing slash from the request origin
  const normalizedOrigin = origin.replace(/\/$/, '');

  if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS: Origin ${origin} not allowed`), false);
};

const corsOptions = {
  origin: corsOriginFn,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Socket.io initialization with CORS
const io = new Server(server, {
  cors: {
    origin: corsOriginFn,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// ESM __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if not exist
const uploadsDir = path.join(__dirname, 'uploads');
const resumesDir = path.join(__dirname, 'uploads/resumes');
const logosDir = path.join(__dirname, 'uploads/logos');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });
if (!fs.existsSync(logosDir)) fs.mkdirSync(logosDir, { recursive: true });

// Middlewares — handle preflight OPTIONS first
app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Apply rate limiter to all API endpoints
app.use('/api', apiLimiter);

// API Routing
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'CareerConnect Backend API running successfully.' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.io Real-Time Event Management
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  // console.log('Client connected:', socket.id);

  // User registration
  socket.on('register', (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      // Broadcast online status
      io.emit('online_users', Array.from(onlineUsers.keys()));
      // console.log(`User registered: ${userId} with socket ${socket.id}`);
    }
  });

  // Real-time Chat
  socket.on('private_message', async ({ senderId, receiverId, text }) => {
    try {
      if (!senderId || !receiverId || !text) return;

      const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text
      });

      // Target socket
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        // Send message
        io.to(receiverSocketId).emit('private_message', newMessage);
        // Trigger notification event
        io.to(receiverSocketId).emit('notification_received', {
          type: 'message',
          message: 'You received a new message.',
          link: '/candidate/messages'
        });
      }

      // Send back to self
      socket.emit('private_message', newMessage);
    } catch (err) {
      console.error('Socket error saving message:', err.message);
    }
  });

  // Typing indicators
  socket.on('typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('typing', { senderId });
    }
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('stop_typing', { senderId });
    }
  });

  // Disconnection handler
  socket.on('disconnect', () => {
    let disconnectedUser = null;
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUser = userId;
        onlineUsers.delete(userId);
        break;
      }
    }
    if (disconnectedUser) {
      io.emit('online_users', Array.from(onlineUsers.keys()));
      // console.log(`User offline: ${disconnectedUser}`);
    }
  });
});

// Export io so we can emit events from Express controllers (e.g. status changes, job alerts)
export { io, onlineUsers };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
