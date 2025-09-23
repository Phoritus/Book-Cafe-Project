import React, { useState } from 'react';
import './ChangeEmail.css';
import logo from "../assets/Coffee.svg";

function ChangeEmail() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // ✅ success หรือ error

  const handleSendCode = () => {
    if (!newEmail.trim()) {
      setErrors({ newEmail: 'Please enter your new email first' });
      setMessage('');
      setMessageType('');
      return;
    }
    setErrors({});
    console.log("Send verification code to:", newEmail);
    setMessage("Verification code sent to your new email.");
    setMessageType("success"); // ✅ ส่งโค้ดสำเร็จ
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setMessage('');
    setMessageType('');

    if (!currentEmail.trim()) {
      newErrors.currentEmail = 'Please enter your current email';
    }
    if (!newEmail.trim()) {
      newErrors.newEmail = 'Please enter your new email';
    }
    if (!verifyCode.trim()) {
      newErrors.verifyCode = 'Please enter the verification code';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Change email attempt:", { currentEmail, newEmail, verifyCode });
      setMessage("Your email has been changed successfully.");
      setMessageType("success"); // ✅ success
    } else {
      setMessage("Please check your email.");
      setMessageType("error"); // ❌ error
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo */}
        <div className="animate-fade-in">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle"
          />
        </div>

        {/* Title */}
        <div className="welcome-container">
          <h1 className="welcome-title">Change Email</h1>
          <p className="welcome-subtitle">Enter your email before clicking "Send Code"</p>
        </div>

        {/* Form */}
        <div className="form-container">
          {/* Current Email */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>Current Email Address *</label>
            <input
              type="text"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              placeholder="Enter your current email"
              className={`form-input ${errors.currentEmail ? 'error' : ''}`}
            />
            {errors.currentEmail && <p className="error-message">{errors.currentEmail}</p>}
          </div>

          {/* New Email */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>New Email Address *</label>
            <input
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter your new email"
              className={`form-input ${errors.newEmail ? 'error' : ''}`}
            />
            {errors.newEmail && <p className="error-message">{errors.newEmail}</p>}
          </div>

          {/* Verify Code */}
          <div className="form-group">
            <label className="form-label"style={{ color: '#8b7355' }}>Verify Code</label>
            <div className="verify-input-wrapper">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter Verify Code"
                className={`form-input ${errors.verifyCode ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="sendcode-inside-button"
              >
                Send Code
              </button>
            </div>
            {errors.verifyCode && <p className="error-message">{errors.verifyCode}</p>}
          </div>

          {/* Result Message */}
          {message && (
            <div className={`message-box ${messageType}`}>
              <p>{message}</p>
            </div>
          )}

          {/* Change Email Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="signin-button"
          >
            Change Email
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChangeEmail;
