// frontend/src/pages/AdminMessages.js
import { useState, useEffect } from 'react';
import API from '../api/axios';
import '../styles/AdminMessages.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [reply, setReply] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/messages/admin/all');
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!reply.trim() || !selectedMessage) return;

    try {
      await API.post('/messages', {
        recipient: selectedMessage.sender._id,
        subject: `Re: ${selectedMessage.subject}`,
        body: reply,
        parentMessage: selectedMessage._id,
      });

      setReply('');
      await loadMessages();
      alert('Reply sent successfully!');
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

  const deleteMessage = async (id) => {
    try {
      await API.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m._id !== id));
      if (selectedMessage?._id === id) setSelectedMessage(null);
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);

      setMessages(
        messages.map(m =>
          m._id === id ? { ...m, isRead: true } : m
        )
      );

      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const filteredMessages = messages.filter(m =>
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="messages-loading">Loading messages...</div>;
  }

  return (
    <div className="admin-messages-page">

      <div className="messages-header">
        <h1>💬 Messages</h1>
      </div>

      <div className="messages-container">

        {/* LEFT PANEL */}
        <div className="messages-list-panel">

          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="messages-list">
            {filteredMessages.length === 0 ? (
              <p className="no-messages">No messages found</p>
            ) : (
              filteredMessages.map(msg => (
                <div
                  key={msg._id}
                  className={`message-item ${
                    selectedMessage?._id === msg._id ? 'active' : ''
                  } ${!msg.isRead ? 'unread' : ''}`}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (!msg.isRead) markAsRead(msg._id);
                  }}
                >
                  <div className="message-item-header">
                    <h4>{msg.subject}</h4>
                    <span className="message-time">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="message-sender">
                    From: {msg.sender?.name}
                  </p>

                  <p className="message-preview">
                    {msg.body?.substring(0, 50)}...
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="message-detail-panel">

          {selectedMessage ? (
            <div className="message-detail">

              <div className="detail-header">
                <h2>{selectedMessage.subject}</h2>

                <button
                  className="btn-delete"
                  onClick={() => deleteMessage(selectedMessage._id)}
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="message-meta">
                <p>
                  <strong>From:</strong>{" "}
                  {selectedMessage.sender?.name} ({selectedMessage.sender?.email})
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="message-body">
                {selectedMessage.body}
              </div>

              <div className="reply-section">
                <h3>📬 Reply</h3>

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply here..."
                  className="reply-input"
                  rows={5}
                />

                <button
                  className="btn-send-reply"
                  onClick={handleReply}
                  disabled={!reply.trim()}
                >
                  ✉️ Send Reply
                </button>
              </div>

            </div>
          ) : (
            <div className="no-message-selected">
              <p>👈 Select a message to view details</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminMessages;