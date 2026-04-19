const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  image: { type: String, default: '' },
  status: { type: String, default: 'published' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reactions: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      type: {
        type: String,
        enum: ['love', 'like', 'wow', 'fire'],
        required: true,
      },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
