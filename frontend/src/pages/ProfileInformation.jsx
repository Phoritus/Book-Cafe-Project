import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProfile } from '../api/profile.js';
import './ProfileInformation.css';
import { Mail, Phone, IdCard, CalendarDays, LockKeyhole, User, Ellipsis } from 'lucide-react';

const ProfileHeader = () => (
  <div className="profile-header">
    <div className="profile-icon">
      <User size={80} color="#C2985B" />

    </div>
    <h1 className="profile-title" style={{ color: "#53311C", fontFamily: "'crimson text', sans-serif", fontWeight: "bold" }}>Profile Information</h1>
  </div>
);

const ProfileInformation = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true); setError('');
      try {
        const p = await fetchProfile();
        if (!ignore) setProfile(p);
      } catch (e) { if (!ignore) setError(e?.response?.data?.message || 'Failed to load profile'); }
      finally { if (!ignore) { setLoading(false); setTimeout(() => setIsLoaded(true), 100); } }
    })();
    return () => { ignore = true; };
  }, []);
  const HexIcon = () => (
    <Ellipsis size={36} color="#C2985B" strokeWidth={2} />
  );
  // replace alert with navigation to edit page
  const handleEditProfile = () => navigate('/customer/profile/edit');

  function fmtDate(d) {
    if (!d) return '-';
    try { const dt = new Date(d); if (!isNaN(dt.getTime())) return dt.toLocaleDateString('en-GB'); } catch (_) { }
    // fallback assume already dd/mm/yyyy or yyyy-mm-dd
    if (/\d{4}-\d{2}-\d{2}/.test(d)) { const [y, m, dd] = d.split('-'); return `${dd} / ${m} / ${y}`; }
    return d;
  }
  const profileData = [
    { label: 'Title', value: profile?.nameTitle || '-', icon: <HexIcon /> },
    { label: 'Phone', value: profile?.phone || '-', icon: <Phone size={28} color="#C2985B" strokeWidth={1.5} /> },
    { label: 'First Name', value: profile?.firstname || '-', icon: <HexIcon /> },
{ label: 'National ID', value: formatNationalId(profile?.citizen_id), icon: <IdCard size={30} color="#C2985B" strokeWidth={1.5}/> },
    { label: 'Last Name', value: profile?.lastname || '-', icon: <HexIcon /> },
    { label: 'Date of Birth', value: fmtDate(profile?.dateOfBirth), icon: <CalendarDays size={30} color="#C2985B" strokeWidth={1.5} /> },
  ];

  function formatNationalId(id) {
    if (!id) return '-';
    // ลบตัวอักษรหรือช่องว่างที่ไม่ใช่ตัวเลข
    const digits = id.replace(/\D/g, '');
    if (digits.length !== 13) return id; // ถ้าไม่ครบ 13 ตัว ให้คืนค่าเดิม

    // แยกใส่ขีดตามรูปแบบ 1-2345-67890-12-3
    return `${digits[0]}-${digits.slice(1, 5)}-${digits.slice(5, 10)}-${digits.slice(10, 12)}-${digits[12]}`;
  }

  return (
    <div className="profile-wrapper" style={{ fontFamily: "'inter', sans-serif", color: "#B37E32" }}>
      {/* Header นอกกล่อง */}
      <ProfileHeader />

      {loading && (
        <div className="profile-container loading"><div className="p-6 text-center text-sm text-[#53311C]">Loading profile...</div></div>
      )}
      {!loading && error && (
        <div className="profile-container error"><div className="p-6 text-center text-sm text-red-600">{error}</div></div>
      )}

      {/* กล่องข้อมูล */}
      {!loading && !error && (
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

            <button className="edit-btn !mt-7 !mb-7" onClick={handleEditProfile}>
              Edit Profile
            </button>

            <div className="account-settings">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Mail size={30} color="#C2985B" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="setting-title" style={{ fontFamily: "'inter', sans-serif", color: "#B37E32" }}>Email</p>
                    <p className="setting-description" style={{ fontFamily: "'inter', sans-serif", color: "#3C2415" }}>{profile?.email || '-'}</p>
                  </div>
                </div>
                <button className="change-btn" onClick={() => navigate('/customer/profile/change-email')}>Change Email</button>
              </div>
              <div className="setting-item last">
                <div className="setting-info">
                  <div className="setting-icon">
                    <LockKeyhole size={30} color="#C2985B" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="setting-title" style={{ fontFamily: "'inter', sans-serif", color: "#B37E32" }}>Password</p>
                    <p className="setting-description" style={{ fontFamily: "'inter', sans-serif", color: "#3C2415" }}>********</p>
                  </div>
                </div>
                <button className="change-btn" onClick={() => navigate('/customer/profile/change-password')}>Change Password</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInformation;