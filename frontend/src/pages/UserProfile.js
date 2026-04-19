import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles/UserProfile.css';

const UserProfile = () => {
  const { user, setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(
    user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null
  );
  
  const [userPosts, setUserPosts] = useState([]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  // FIXED: Wrapped in useCallback to resolve "missing dependency" ESLint warning
  const loadUserPosts = useCallback(async () => {
    if (!user?._id) return;
    try {
      const { data } = await API.get('/posts');
      const myPosts = data.filter(p => p.author?._id === user?._id);
      setUserPosts(myPosts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }, [user?._id]);

  useEffect(() => {
    loadUserPosts();
  }, [loadUserPosts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onload = (e) => setPreviewPic(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('bio', formData.bio);
      if (profilePic) fd.append('profilePic', profilePic);

      const { data } = await API.put('/auth/profile', fd);
      
      // We spread 'user' and then 'data' to ensure 'role' and other 
      // unchanged fields are preserved if the backend doesn't return them.
      setUser({ ...user, ...data });
      
      setProfilePic(null);
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
      console.error("Update Error:", error.response?.data);
      setMessage('❌ ' + (error.response?.data?.message || 'Error updating profile'));
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setMessage('✅ Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setMessage('❌ ' + (error.response?.data?.message || 'Error changing password'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-profile-page">
      <div className="profile-header-banner">
        <div className="banner-content">
          <h1>👤 My Profile</h1>
          <p>Manage your account and view your contributions</p>
        </div>
      </div>

      {message && (
        <div className={`message-alert ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-main-container">
        <div className="profile-card">
          <div className="profile-pic-section">
            <div className="profile-pic-wrapper">
              <img 
                src={previewPic || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-pic"
              />
            </div>
            <h2>{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-role-badge">{user?.role?.toUpperCase()}</div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{userPosts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-tabs">
            <button className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>⚙️ Settings</button>
            <button className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>📝 My Posts</button>
            <button className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>🔐 Security</button>
          </div>

          {activeTab === 'profile' && (
            <div className="tab-content">
              <form onSubmit={updateProfile} className="profile-form">
                <h3>Edit Your Profile</h3>
                <div className="form-group">
                  <label>Change Profile Picture</label>
                  <div className="file-upload">
                    <label className="file-label">
                      <input type="file" accept="image/*" onChange={handleProfilePicChange} hidden />
                      <span className="upload-btn">📷 Upload Photo</span>
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="tab-content">
              <h3>📝 My Posts</h3>
              {userPosts.length === 0 ? (
                <p className="no-content">No posts found. <Link to="/write">Write one!</Link></p>
              ) : (
                <div className="posts-grid">
                  {userPosts.map(post => (
                    <div key={post._id} className="post-item">
                      <h4>{post.title}</h4>
                      <div className="post-actions">
                        <Link to={`/posts/${post._id}`} className="btn-view">View Post</Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <form onSubmit={updatePassword} className="profile-form">
                <h3>🔐 Change Password</h3>
                <div className="form-group">
                  <label>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
                </div>
                <button type="submit" className="btn-secondary" disabled={loading}>Update Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
