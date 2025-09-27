import React, { useState } from 'react';
import './ChangePassword.css';
import { Eye, EyeOff } from 'lucide-react';
import logo from "../assets/Coffee.svg";
import { ArrowLeft } from 'lucide-react';

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // state สำหรับแต่ละช่อง
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setMessage('');
    setMessageType('');

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Please enter your current password';
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = 'Please enter your new password';
    } else if (newPassword.trim().length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Change password attempt:', { currentPassword, newPassword, confirmPassword });
      setMessage('Your password has been changed successfully.');
      setMessageType('success');
    } else {
      setMessage('Please check your password.');
      setMessageType('error');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="absolute top-25 left-25 cursor-pointer z-30" onClick={() => window.history.back()}>
              <ArrowLeft size={40} color="#86422A" />
        </div>
        {/* Logo */}
        <div className="animate-fade-in">
          <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
        </div>

        {/* Title */}
        <div className="welcome-container">
          <h1 className="welcome-title">Change Password</h1>
          <p className="welcome-subtitle">Don’t forgot your password</p>
        </div>

        {/* Form */}
        <div className="form-container">
          {/* Current Password */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>Current Password *</label>
            <div className="password-container">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className={`form-input password-input ${errors.currentPassword ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="password-toggle"
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && <p className="error-message">{errors.currentPassword}</p>}
          </div>

          {/* New Password */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>New Password *</label>
            <div className="password-container">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className={`form-input password-input ${errors.newPassword ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="password-toggle"
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && <p className="error-message">{errors.newPassword}</p>}
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>Confirm New Password *</label>
            <div className="password-container">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your new password"
                className={`form-input password-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="password-toggle"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
          </div>

          {/* Message */}
          {message && (
            <div className={`message-box ${messageType}`}>
              <p>{message}</p>
            </div>
          )}

          {/* Change Password Button */}
          <button type="button" onClick={handleSubmit} className="signin-button">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
