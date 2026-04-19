import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Comments.css';

const Comments = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!text.trim()) return;

    try {
      setSubmitting(true);
      await API.post(`/comments/${postId}`, { body: text.trim() });
      setText('');
      await loadComments();
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId)
      );
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="comment-input-wrapper">
            <textarea
              className="comment-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              maxLength={500}
            />
            <div className="comment-controls">
              <span className="char-count">{text.length}/500</span>
              <button
                type="submit"
                className="btn-post-comment"
                disabled={submitting || !text.trim()}
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="login-prompt">
          <Link to="/login">Log in</Link> to join the conversation.
        </div>
      )}

      {loading ? <div className="comments-loading">Loading comments...</div> : null}

      <div className="comments-list">
        {!loading && comments.length === 0 ? (
          <div className="no-comments">No comments yet. Be the first to respond.</div>
        ) : null}

        {comments.map((comment) => {
          const canDelete =
            user &&
            (comment.author?._id === user._id || user.role === 'admin');

          return (
            <div key={comment._id} className="comment-item">
              <div className="comment-header">
                <div className="comment-info">
                  <h4>{comment.author?.name || 'Anonymous'}</h4>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>
                {canDelete ? (
                  <button
                    type="button"
                    className="btn-delete-comment"
                    onClick={() => handleDelete(comment._id)}
                    aria-label="Delete comment"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
              <div className="comment-body">{comment.body}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;
