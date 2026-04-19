// frontend/src/pages/AdminProfile.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import '../styles/AdminProfile.css';

const AdminProfile = () => {
  const { user, setUser } = useAuth();

  // Use backend URL from env (safe for Vercel/Render)
  const API_BASE = process.env.REACT_APP_API_URL || '';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const [profilePic, setProfilePic] = useState(null);

  const [previewPic, setPreviewPic] = useState(
    user?.profilePic ? `${API_BASE}/uploads/${user.profilePic}` : null
  );

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // HANDLE INPUT CHANGE (PROFILE)
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // HANDLE PASSWORD INPUT
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // PROFILE PICTURE PREVIEW
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProfilePic(file);

    const reader = new FileReader();
    reader.onload = (event) => setPreviewPic(event.target.result);
    reader.readAsDataURL(file);
  };

  // UPDATE PROFILE
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
      setMessage(
        '❌ ' +
          (error.response?.data?.message || 'Error updating profile')
      );
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PASSWORD
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
      setMessage(
        '❌ ' +
          (error.response?.data?.message || 'Error changing password')
      );
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

        {/* LEFT SIDE */}
        <div className="profile-left">

          <div className="profile-pic-section">
            <div className="profile-pic-wrapper">

              <img
                src={
                  previewPic ||
                  (user?.profilePic
                    ? `${API_BASE}/uploads/${user.profilePic}`
                    : '/default-avatar.png')
                }
                alt="Profile"
                className="profile-pic-large"
              />

              <label className="pic-label">
                📷 Change Photo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleProfilePicChange}
                />
              </label>

            </div>
          </div>

          <div className="profile-info-box">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> Admin</p>
            <p><strong>Name:</strong> {user?.name}</p>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">

          {/* EDIT PROFILE */}
          <form onSubmit={updateProfile} className="profile-form">

            <h2>📝 Edit Profile</h2>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Full Name"
              required
            />

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Bio"
              rows={4}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Profile'}
            </button>

          </form>

          {/* CHANGE PASSWORD */}
          <form onSubmit={updatePassword} className="profile-form">

            <h2>🔐 Change Password</h2>

            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Current Password"
              required
            />

            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="New Password"
              required
            />

            <input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm Password"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Updating...' : '🔒 Update Password'}
            </button>

          </form>

        </div>

      </div>
    </div>
  );
};

export default AdminProfile;