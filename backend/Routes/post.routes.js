const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');

const router = express.Router();

const formatPost = async (post) => {
  const commentCount = await Comment.countDocuments({ post: post._id });

  return {
    ...post.toObject(),
    likes: post.reactions.length,
    commentsCount: commentCount,
  };
};

// GET /api/posts — Public: all published posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });
    const formattedPosts = await Promise.all(posts.map(formatPost));
    res.json(formattedPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/posts/:id — Public: single published post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic');

    if (!post || post.status !== 'published') {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(await formatPost(post));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts — Member or Admin: create new post
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    const image = req.file ? req.file.filename : '';

    const post = await Post.create({
      title,
      body,
      image,
      author: req.user._id,
    });

    await post.populate('author', 'name profilePic');
    res.status(201).json(await formatPost(post));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/posts/:id/reactions — Member or Admin: toggle or change reaction
router.post('/:id/reactions', protect, memberOrAdmin, async (req, res) => {
  try {
    const { type } = req.body;

    if (!['love', 'like', 'wow', 'fire'].includes(type)) {
      return res.status(400).json({ message: 'Invalid reaction type' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const existingReaction = post.reactions.find(
      (reaction) => reaction.user.toString() === req.user._id.toString()
    );

    if (existingReaction && existingReaction.type === type) {
      post.reactions = post.reactions.filter(
        (reaction) => reaction.user.toString() !== req.user._id.toString()
      );
    } else if (existingReaction) {
      existingReaction.type = type;
    } else {
      post.reactions.push({ user: req.user._id, type });
    }

    await post.save();

    const currentReaction = post.reactions.find(
      (reaction) => reaction.user.toString() === req.user._id.toString()
    );

    res.json({
      likes: post.reactions.length,
      currentReaction: currentReaction ? currentReaction.type : null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/posts/:id — Edit: only post owner OR admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) post.image = req.file.filename;

    await post.save();
    await post.populate('author', 'name profilePic');
    res.json(await formatPost(post));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/posts/:id — Delete: only post owner OR admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
