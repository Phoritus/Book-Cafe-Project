import React, { useState } from 'react';
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
      setMessage('Some details are incorrect. Please check and try again.');
      setMessageType('error');
    }
  };

  const baseInputStyle = {
    width: '100%',
    padding: '16px 18px',
    border: '2px solid #e8ddd4',
    borderRadius: '12px',
    fontSize: '1rem',
    background: '#fefcfb',
    color: '#4a3429',
    outline: 'none',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box'
  };

  const passwordInputStyle = {
    ...baseInputStyle,
  };

  const errorInputStyle = {
    ...passwordInputStyle,
    borderColor: '#f87171'
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#f7f3f0',
        position: 'relative'
      }} className='font-sans'>
        <div style={{
          width: '100%',
          maxWidth: '450px'
        }}>
          {/* Back Button */}
          <div 
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: '4px',
              color: '#86422A',
              transition: 'transform 0.2s ease-in-out, color 0.2s ease-in-out',
              zIndex: 30
            }}
            onClick={() => window.history.back()}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.color = '#5c2e1b';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.color = '#86422A';
            }}
          >
            <ArrowLeft size={40} />
          </div>

          {/* Logo */}
          <div className="animate-fade-in">
            <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
          </div>

          {/* Title */}
          <div style={{
            textAlign: 'center',
            marginBottom: '35px'
          }}>
            <h1 style={{
              fontSize: '2.2rem',
              fontWeight: '800',
              color: '#7a4f37',
              marginBottom: '8px',
              letterSpacing: '-0.5px',
              margin: '0 0 8px 0'
            }} className='font-crimson'>
              Change Password
            </h1>
            <p style={{
              color: '#bc956b',
              fontSize: '1rem',
              margin: '0'
            }}>
              Don't forgot your password
            </p>
          </div>

          {/* Form */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(139, 90, 64, 0.1)',
            border: '1px solid rgba(139, 90, 64, 0.1)',
            padding: '40px 30px'
          }} className='font-sans'>
            {/* Current Password */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px',
              }}>
                Current Password *
              </label>
              <div style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  style={errors.currentPassword ? errorInputStyle : passwordInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8b7355',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '1.1rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#8b5a40';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#8b7355';
                  }}
                >
                  {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {errors.currentPassword}
                </p>
              )}
            </div>

            {/* New Password */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px',
              }}>
                New Password *
              </label>
              <div style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  style={errors.newPassword ? errorInputStyle : passwordInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8b7355',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '1.1rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#8b5a40';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#8b7355';
                  }}
                >
                  {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.newPassword && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm New Password */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px'
              }}>
                Confirm New Password *
              </label>
              <div style={{
                position: 'relative',
                overflow: 'hidden'
              }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter your new password"
                  style={errors.confirmPassword ? errorInputStyle : passwordInputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#8b7355',
                    cursor: 'pointer',
                    padding: '4px',
                    fontSize: '1.1rem',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = '#8b5a40';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = '#8b7355';
                  }}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626'
                }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Message */}
            {message && (
              <div style={{
                marginTop: '12px',
                padding: '10px',
                marginBottom: '12px',
                borderRadius: '6px',
                fontSize : '0.875rem',
                backgroundColor: messageType === 'success' ? '#e6ffed' : '#fef2f2',
                color: messageType === 'success' ? '#28a745' : '#b91c1c',
                border: messageType === 'success' ? '1px solid #28a745' : '1px solid #d9534f'
              }}>
                <p style={{ margin: '0' }}>{message}</p>
              </div>
            )}

            {/* Change Password Button */}
            <button 
              type="button" 
              onClick={handleSubmit} 
              style={{
                width: '100%',
                padding: '16px',
                background: '#86422A',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(139, 90, 64, 0.3)',
                marginBottom: '10px',
                marginTop: '10px',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#421f07';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 16px rgba(139, 90, 64, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#86422A';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(139, 90, 64, 0.3)';
              }}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;