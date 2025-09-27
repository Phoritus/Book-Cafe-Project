import React, { useState } from 'react';
import logo from "../assets/Coffee.svg";
import { ArrowLeft } from 'lucide-react';

function ChangeEmail() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success หรือ error
  
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
    setMessageType("success");
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
      setMessageType("success");
    } else {
      setMessage("Some details are incorrect. Please check and try again.");
      setMessageType("error");
    }
  };

  const baseInputStyle = {
    width: '100%',
    padding: '10px 18px',
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

  const errorInputStyle = {
    ...baseInputStyle,
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
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        position: 'relative'
      }}>
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
              Change Email
            </h1>
            <p style={{
              color: '#bc956b',
              fontSize: '1rem',
              margin: '0'
            }} className='font-sans'>
              Enter your email before clicking "Send Code"
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
            {/* Current Email */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px',
              }}>
                Current Email Address *
              </label>
              <input
                className="email-input"
                type="text"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                placeholder="Enter your current email"
                style={errors.currentEmail ? errorInputStyle : baseInputStyle}
              />
              {errors.currentEmail && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {errors.currentEmail}
                </p>
              )}
            </div>

            {/* New Email */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px',
              }}>
                New Email Address *
              </label>
              <input
                className="email-input"
                type="text"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Enter your new email"
                style={errors.newEmail ? errorInputStyle : baseInputStyle}
              />
              {errors.newEmail && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {errors.newEmail}
                </p>
              )}
            </div>

            {/* Verify Code */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.95rem',
                fontWeight: '500',
                color: '#8b7355',
                marginBottom: '8px',
              }}>
                Verify Code *
              </label>
              <div style={{
                position: 'relative',
                width: '100%',
                display: 'flex'
              }}>
                <input
                  className="email-input"
                  type="text"
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter Verify Code"
                  style={{
                    ...(errors.verifyCode ? errorInputStyle : baseInputStyle),
                    paddingRight: '100px'
                  }}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    height: '100%',
                    backgroundColor: '#f8f6f4',
                    color: '#86422A',
                    border: '1px solid #86422A',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#eae6e3';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#f8f6f4';
                  }}
                >
                  Send Code
                </button>
              </div>
              {errors.verifyCode && (
                <p style={{
                  marginTop: '8px',
                  fontSize: '0.875rem',
                  color: '#dc2626',
                }}>
                  {errors.verifyCode}
                </p>
              )}
            </div>

            {/* Result Message */}
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
              }} className='font-sans'>
                <p style={{ margin: '0' }}>{message}</p>
              </div>
            )}

            {/* Change Email Button */}
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
              }} className='font-sans'
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
              Change Email
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeEmail;
