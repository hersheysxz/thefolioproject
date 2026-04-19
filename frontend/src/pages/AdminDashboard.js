// frontend/src/pages/AdminDashboard.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalMessages: 0 });
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/home');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, postsRes, messagesRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/posts'),
        API.get('/messages/admin/all')
      ]);
      setUsers(usersRes.data || []);
      setPosts(postsRes.data || []);
      setMessages(messagesRes.data || []);
      setStats({
        totalUsers: (usersRes.data || []).length,
        totalPosts: (postsRes.data || []).length,
        totalMessages: (messagesRes.data || []).length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      alert('Error loading dashboard data: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    try {
      const { data } = await API.put(`/admin/users/${id}/status`);
      setUsers(users.map(u => u._id === id ? { ...u, status: data.user.status } : u));
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      alert('Error updating user status');
    }
  };

  const removePost = async (id) => {
    if (!window.confirm('Are you sure you want to remove this post?')) return;
    try {
      await API.delete(`/posts/${id}`);
      setPosts(posts.filter(p => p._id !== id));
      alert('Post removed successfully');
    } catch (error) {
      console.error('Failed to remove post:', error);
      alert('Error removing post');
    }
  };

  if (loading) return <div className="admin-loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🎨 Admin Dashboard</h1>
        <p className="welcome-text">Welcome back, {user?.name}</p>
      </div>

      {/* STATS CARDS */}
      <div className="stats-grid">
        <div className="stat-card users-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card posts-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Posts</h3>
            <p className="stat-number">{stats.totalPosts}</p>
          </div>
        </div>
        <div className="stat-card messages-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Messages</h3>
            <p className="stat-number">{stats.totalMessages}</p>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION */}
      <div className="admin-tabs-nav">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          💬 Messages
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="admin-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <h2>Platform Overview</h2>
            <div className="overview-grid">
              <div className="overview-item">
                <h3>Recent Users</h3>
                <ul className="recent-list">
                  {users.slice(0, 5).map(u => (
                    <li key={u._id}>
                      <span className="list-name">{u.name}</span>
                      <span className={`list-status status-${u.status}`}>{u.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="overview-item">
                <h3>Recent Posts</h3>
                <ul className="recent-list">
                  {posts.slice(0, 5).map(p => (
                    <li key={p._id}>
                      <span className="list-name">{p.title}</span>
                      <span className="list-author">by {p.author?.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            {users.length === 0 ? (
              <p className="no-data">No users found</p>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td><span className="badge-role">{u.role}</span></td>
                        <td><span className={`status-badge status-${u.status}`}>{u.status}</span></td>
                        <td>
                          <button 
                            className={`action-btn ${u.status === 'active' ? 'deactivate' : 'activate'}`}
                            onClick={() => toggleUserStatus(u._id, u.status)}
                          >
                            {u.status === 'active' ? '🔒 Deactivate' : '✅ Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="posts-section">
            <h2>Post Management</h2>
            <div className="posts-grid">
              {posts.map(p => (
                <div key={p._id} className="post-card-admin">
                  <div className="post-header-admin">
                    <h3>{p.title}</h3>
                    <button 
                      className="btn-remove"
                      onClick={() => removePost(p._id)}
                    >
                      ❌ Remove
                    </button>
                  </div>
                  <p className="post-excerpt">{p.body.substring(0, 100)}...</p>
                  <div className="post-meta">
                    <span>📝 {p.author?.name}</span>
                    <span>📅 {new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <h2>All Messages</h2>
            {messages.length === 0 ? (
              <p className="no-data">No messages yet</p>
            ) : (
              <div className="messages-list-admin">
                {messages.map(m => (
                  <div key={m._id} className="message-card-admin">
                    <div className="message-header-admin">
                      <h4>{m.subject}</h4>
                      <span className="message-time">{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="message-from">From: <strong>{m.sender?.name || 'Unknown'}</strong> ({m.sender?.email || 'N/A'})</p>
                    <p className="message-to">To: <strong>{m.recipient?.name || 'Unknown'}</strong></p>
                    <p className="message-body">{m.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
