import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileInformation.css';
import { Mail } from 'lucide-react';

const ProfileHeader = () => (
  <div className="profile-header">
    <div className="profile-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="30" r="15" stroke="#A66A2B" stroke-width="8" fill="none" />
        <path d="M20 80C20 65 35 55 50 55C65 55 80 65 80 80"
          stroke="#A66A2B" stroke-width="8" fill="none" stroke-linecap="round" />
      </svg>

    </div>
    <h1 className="profile-title">Profile Information</h1>
  </div>
);

const ProfileInformation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  const HexIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 40"
      width="40"
      height="30"
      aria-hidden="true"
    >
      <defs>
        <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodColor="#000" floodOpacity="0.18" />
        </filter>
      </defs>
      <g fill="#C2985B" filter="url(#softShadow)">
        <polygon points="26,20 23,14.8 17,14.8 14,20 17,25.2 23,25.2" />
        <polygon points="66,20 63,14.8 57,14.8 54,20 57,25.2 63,25.2" />
        <polygon points="106,20 103,14.8 97,14.8 94,20 97,25.2 103,25.2" />
      </g>
    </svg>
  );
  // replace alert with navigation to edit page
  const handleEditProfile = () => navigate('/customer/profile/edit');

  const profileData = [
    { label: 'Title', value: 'Ms.', icon: <HexIcon /> },
    {
      label: 'Phone', value: '080-000-0000', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" stroke="#C2985B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.89.72 2.78a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.11-.45c.89.35 1.82.59 2.78.72A2 2 0 0 1 22 16.92z" />
      </svg>
      )
    },
    { label: 'First Name', value: 'Alice', icon: <HexIcon /> },
    {
      label: 'National ID', value: '1-2345-67890-12-3', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="35" height="40" fill="none" stroke="#C2985B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
        <line x1="3" y1="11" x2="21" y2="11" />
      </svg>
      )
    },
    { label: 'Last Name', value: 'Wonderman', icon: <HexIcon /> },
    {
      label: 'Date of Birth', value: '15 / 08 / 1996', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="none" stroke="#C2985B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      )
    },
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
                <div className="setting-icon">
                  <Mail size={36} color="#C2985B" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="setting-title">Email</p>
                  <p className="setting-description">demo@example.com</p>
                </div>
              </div>
              <button className="change-btn" onClick={() => navigate('/customer/profile/change-email')}>Change Email</button>
            </div>

            <div className="setting-item last">
              <div className="setting-info">
                <div className="setting-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" stroke="#c7a451" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                    <rect x="4" y="11" width="16" height="11" rx="2" ry="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                </div>
                <div>
                  <p className="setting-title">Password</p>
                  <p className="setting-description">********</p>
                </div>
              </div>
              <button className="change-btn" onClick={() => navigate('/customer/profile/change-password')}>Change Password</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;