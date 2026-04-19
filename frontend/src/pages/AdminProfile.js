// frontend/src/pages/AdminProfile.js
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(
    user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : null
  );
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
      setUser(data);
      setProfilePic(null);
      setMessage('✅ Profile updated successfully!');
    } catch (error) {
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
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <h1>⚙️ Admin Profile Settings</h1>
        <p>Manage your admin account and preferences</p>
      </div>

      {message && (
        <div className={`message-alert ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="profile-container">
        {/* LEFT SIDE - PROFILE INFO */}
        <div className="profile-left">
          <div className="profile-pic-section">
            <div className="profile-pic-wrapper">
              <img 
                src={previewPic || (user?.profilePic ? `http://localhost:5000/uploads/${user.profilePic}` : '/default-avatar.png')} 
                alt="Profile" 
                className="profile-pic-large"
              />
              <div className="pic-overlay">
                <label className="pic-label">
                  📷 Change Photo
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePicChange}
                    hidden
                  />
                </label>
              </div>
            </div>
            <div className="profile-badge">
              <span className="badge-admin">👑 Admin</span>
              <span className="badge-status">Active</span>
            </div>
          </div>

          <div className="profile-info-box">
            <h3>Account Information</h3>
            <div className="info-item">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-item">
              <label>Role</label>
              <p className="role-admin">Administrator</p>
            </div>
            <div className="info-item">
              <label>Member Since</label>
              <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - FORMS */}
        <div className="profile-right">
          {/* EDIT PROFILE FORM */}
          <form onSubmit={updateProfile} className="profile-form">
            <div className="form-section">
              <h2>📝 Edit Profile</h2>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : '💾 Save Profile'}
              </button>
            </div>
          </form>

          {/* CHANGE PASSWORD FORM */}
          <form onSubmit={updatePassword} className="profile-form">
            <div className="form-section">
              <h2>🔐 Change Password</h2>
              
              <div className="form-group">
                <label>Current Password *</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password *</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-secondary"
                disabled={loading}
              >
                {loading ? 'Updating...' : '🔒 Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
