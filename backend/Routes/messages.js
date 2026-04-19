// backend/routes/messages.js
const express = require('express');
const Message = require('../models/Message');

// 1. Corrected Imports: Use { protect } and { adminOnly } 
// to get the actual functions instead of the whole object.
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

const router = express.Router();

// 2. Changed 'auth' to 'protect' in all routes below
// Send a message (users to admin or admin to users)
router.post('/', protect, async (req, res) => {
  try {
    let { recipient, subject, body, parentMessage } = req.body;
    if (!recipient) {
      // If no recipient, send to admin
      const admin = await require('../models/User').findOne({ role: 'admin' });
      if (!admin) return res.status(400).json({ message: 'No admin found' });
      recipient = admin._id;
    }
    const message = new Message({
      sender: req.user.id,
      recipient,
      subject,
      body,
      parentMessage: parentMessage || null,
    });
    await message.save();
    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get inbox messages for the logged-in user
router.get('/inbox', protect, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user.id })
      .populate('sender', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get sent messages
router.get('/sent', protect, async (req, res) => {
  try {
    const messages = await Message.find({ sender: req.user.id })
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark message as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || message.recipient.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.isRead = true;
    await message.save();
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete message
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message || (message.sender.toString() !== req.user.id && message.recipient.toString() !== req.user.id)) {
      return res.status(404).json({ message: 'Message not found' });
    }
    // Changed .remove() to .deleteOne() as .remove() is deprecated in newer Mongoose
    await message.deleteOne();
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Admin: Get all messages
// Use 'adminOnly' which is the function exported in your role.middleware
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const messages = await Message.find()
      .populate('sender', 'name email')
      .populate('recipient', 'name email')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;