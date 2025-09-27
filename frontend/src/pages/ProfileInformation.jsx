import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileInformation.css';
import { Mail,Phone,IdCard,CalendarDays,LockKeyhole,User,Ellipsis} from 'lucide-react';

const ProfileHeader = () => (
  <div className="profile-header">
    <div className="profile-icon">
      <User size={80} color="#C2985B" />

    </div>
    <h1 className="profile-title" style={{ color: "#53311C", fontFamily: "'crimson text', sans-serif" ,fontWeight: "bold"}}>Profile Information</h1>
  </div>
);

const ProfileInformation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);
  const HexIcon = () => (
    <Ellipsis size={36} color="#C2985B" strokeWidth={2} />
  );
  // replace alert with navigation to edit page
  const handleEditProfile = () => navigate('/customer/profile/edit');

  const profileData = [
    { label: 'Title', value: 'Ms.', icon: <HexIcon /> },
    {
      label: 'Phone', value: '080-000-0000', icon: (<Phone size={28} color="#C2985B" strokeWidth={1.5} />
      )
    },
    { label: 'First Name', value: 'Alice', icon: <HexIcon /> },
    {
      label: 'National ID', value: '1-2345-67890-12-3', icon: (<IdCard size={30} color="#C2985B" strokeWidth={1.5}/>
      )
    },
    { label: 'Last Name', value: 'Wonderman', icon: <HexIcon /> },
    {
      label: 'Date of Birth', value: '15 / 08 / 1996', icon: (<CalendarDays size={30} color="#C2985B" strokeWidth={1.5} />
      )
    },
  ];

  return (
    <div className="profile-wrapper" style={{ fontFamily: "'inter', sans-serif" , color: "#B37E32"}}>
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
                  <div className="item-label" >{item.label}</div>
                  <div className="item-value">{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <button className="edit-btn !mt-10" onClick={handleEditProfile}>
            Edit Profile
          </button>

          <div className="account-settings">
            <div className="setting-item">
              <div className="setting-info">
                <div className="setting-icon">
                  <Mail size={30} color="#C2985B" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="setting-title" style={{ fontFamily: "'inter', sans-serif" ,color: "#B37E32"}}>Email</p>
                  <p className="setting-description" style={{ fontFamily: "'inter', sans-serif" ,color: "#3C2415" }}>demo@example.com</p>
                </div>
              </div>
              <button className="change-btn" onClick={() => navigate('/customer/profile/change-email')}>Change Email</button>
            </div>
            <div className="setting-item last">
              <div className="setting-info">
                <div className="setting-icon">
                  <LockKeyhole size={30} color="#C2985B" strokeWidth={1.5}/>
                </div>
                <div>
                  <p className="setting-title" style={{ fontFamily: "'inter', sans-serif" ,color: "#B37E32"}}>Password</p>
                  <p className="setting-description" style={{ fontFamily: "'inter', sans-serif" ,color: "#3C2415"}}>********</p>
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