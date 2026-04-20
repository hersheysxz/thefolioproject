import express from "express";
import Comment from "../models/Comment.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET comments for a post
 */
router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      postId: req.params.postId,
    }).populate("user", "name profilePic");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * CREATE comment
 */
router.post("/:postId", protect, async (req, res) => {
  try {
    const comment = await Comment.create({
      postId: req.params.postId,
      user: req.user._id,
      text: req.body.text,
    });

    const populated = await comment.populate("user", "name profilePic");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE comment
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;