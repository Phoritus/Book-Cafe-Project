import React, { useState, useEffect } from 'react';
import './ProfileInformation.css';

const ProfileHeader = () => (
  <div className="profile-header">
    <div className="profile-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
  <circle cx="50" cy="30" r="15" stroke="#A66A2B" stroke-width="8" fill="none"/>
  <path d="M20 80C20 65 35 55 50 55C65 55 80 65 80 80" 
        stroke="#A66A2B" stroke-width="8" fill="none" stroke-linecap="round"/>
</svg>

    </div>
    <h1 className="profile-title">Profile Information</h1>
  </div>
);

const ProfileInformation = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleEditProfile = () => alert('Edit Profile functionality would be implemented here');
  const profileData = [
    { label: 'Title', value: 'Ms.', icon: '⋯' },
    { label: 'Phone', value: '080-000-0000', icon: '📞' },
    { label: 'First Name', value: 'Alice', icon: '⋯' },
    { label: 'National ID', value: '1-2345-67890-12-3', icon: '💳' },
    { label: 'Last Name', value: 'Wonderman', icon: '⋯' },
    { label: 'Date of Birth', value: '15 / 08 / 1996', icon: '📅' },
  ];

  return (
    <div className="profile-wrapper">
      {/* Header นอกกล่อง */}
      <ProfileHeader />

      {/* กล่องข้อมูล */}
      <div className={`profile-container ${isLoaded ? 'loaded' : ''}`}>
        <div className="profile-content">
          <div className="profile-grid">
            {profileData.map((item, index) => (
              <div key={index} className="profile-item">
                <div className="dots-icon">
                  <span>{item.icon}</span>
                </div>
                <div className="item-content">
                  <div className="item-label">{item.label}</div>
                  <div className="item-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <button className="edit-btn" onClick={handleEditProfile}>
            Edit Profile
          </button>

          <div className="account-settings">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">📧</div>
                <div>
                  <p className="setting-title">Email</p>
                  <p className="setting-description">demo@example.com</p>
                </div>
              </div>
              <button className="change-btn">Change Email</button>
            </div>

            <div className="setting-item last">
              <div className="setting-info">
                <div className="setting-icon">🔒</div>
                <div>
                  <p className="setting-title">Password</p>
                  <p className="setting-description">********</p>
                </div>
              </div>
              <button className="change-btn">Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;
