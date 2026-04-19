import { useEffect, useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../styles/Reactions.css';

const reactionIcons = {
  love: '❤️',
  like: '👍',
  wow: '😮',
  fire: '🔥',
};

const Reactions = ({ postId, initialLikes = 0 }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [reactionType, setReactionType] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes]);

  useEffect(() => {
    const loadReactionState = async () => {
      try {
        const { data } = await API.get(`/posts/${postId}`);
        const currentReaction = data.reactions?.find(
          (reaction) => reaction.user === user?._id || reaction.user?._id === user?._id
        );

        setLikes(data.likes || 0);
        setReactionType(currentReaction?.type || null);
      } catch (err) {
        console.error('Failed to load reactions', err);
      }
    };

    if (user) {
      loadReactionState();
    } else {
      setReactionType(null);
    }
  }, [postId, user]);

  const handleReaction = async (type) => {
    if (!user) {
      alert('Please log in to react to this post');
      return;
    }

    try {
      setSaving(true);
      const { data } = await API.post(`/posts/${postId}/reactions`, { type });
      setLikes(data.likes);
      setReactionType(data.currentReaction);
    } catch (err) {
      console.error('Failed to react to post', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="reactions-wrapper">
      <div className="reactions-flex-container">
        {Object.keys(reactionIcons).map((type) => (
          <button
            key={type}
            type="button"
            className={`reaction-pill ${reactionType === type ? 'active' : ''}`}
            onClick={() => handleReaction(type)}
            title={reactionIcons[type]}
            disabled={saving}
          >
            <span className="emoji">{reactionIcons[type]}</span>
          </button>
        ))}
      </div>
      <div className="reaction-stats-bar">
        <span className="count-glitch">{likes}</span>
        <span className="label-text">{likes === 1 ? 'REACTION' : 'REACTIONS'}</span>
      </div>
    </div>
  );
};

export default Reactions;
