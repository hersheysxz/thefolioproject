// backend/server.js
require('dotenv').config(); // Load .env variables FIRST
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./Routes/auth.routes');
const postRoutes = require('./Routes/post.routes');
const commentRoutes = require('./Routes/comment.routes');
const adminRoutes = require('./Routes/admin.routes');
const messageRoutes = require('./Routes/messages');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ─────────────────────────────────────────────────
// Allow React frontend (port 3000) to call this server
app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:3001'], credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// Serve uploaded image files as public URLs
// e.g., http://localhost:5000/uploads/my-image.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// ── Default route (optional) ──────────────────────────────────
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});