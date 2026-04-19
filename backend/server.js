// backend/server.js

require('dotenv').config(); // Load env FIRST

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./Routes/auth.routes');
const postRoutes = require('./Routes/post.routes');
const commentRoutes = require('./Routes/comment.routes');
const adminRoutes = require('./Routes/admin.routes');
const messageRoutes = require('./Routes/messages');

const app = express();

// ── CONNECT DATABASE ─────────────────────────────
connectDB();

// ── MIDDLEWARE ───────────────────────────────────

// ⚡ Production-safe CORS (Vercel + localhost + Render)
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON
app.use(express.json());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── ROUTES ────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// ── HEALTH CHECK ROUTE ────────────────────────────
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ── GLOBAL ERROR HANDLER ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// ── START SERVER ──────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});