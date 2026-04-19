// backend/models/Message.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: String, required: true, trim: true },
  body: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null }, // for replies
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);