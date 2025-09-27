import React, { useState, useEffect } from 'react';
import logo from "../assets/Coffee.svg";
import { ArrowLeft } from 'lucide-react';

function ChangeEmail() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success หรือ error
  const [sendingCode, setSendingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);
  
  const handleSendCode = async () => {
    const errs = {};
    if (!currentEmail.trim()) errs.currentEmail = 'Enter current email';
    if (!newEmail.trim()) errs.newEmail = 'Enter new email';
    if (Object.keys(errs).length) {
      setErrors(errs); setMessage(''); setMessageType(''); return;
    }
    // Basic email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(currentEmail)) errs.currentEmail = 'Invalid email';
    if (!emailRegex.test(newEmail)) errs.newEmail = 'Invalid email';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    try {
      setSendingCode(true);
      setErrors({});
      setMessage('');
      setMessageType('');
      const res = await fetch(`${API_BASE}/auth/change-email/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail, newEmail })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || 'Failed to send code');
      setMessage('Verification code sent (valid 60s)');
      setMessageType('success');
      setCooldown(60);
    } catch (e) {
      setMessage(e.message);
      setMessageType('error');
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    setMessage('');
    setMessageType('');

    if (!currentEmail.trim()) newErrors.currentEmail = 'Please enter your current email';
    if (!newEmail.trim()) newErrors.newEmail = 'Please enter your new email';
    if (!verifyCode.trim()) newErrors.verifyCode = 'Please enter the verification code';
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (currentEmail && !emailRegex.test(currentEmail)) newErrors.currentEmail = 'Invalid email format';
    if (newEmail && !emailRegex.test(newEmail)) newErrors.newEmail = 'Invalid email format';
    if (verifyCode && !/^\d{6}$/.test(verifyCode)) newErrors.verifyCode = 'Code must be 6 digits';
    setErrors(newErrors);
    if (Object.keys(newErrors).length) {
      setMessage('Some details are incorrect. Please check and try again.');
      setMessageType('error');
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch(`${API_BASE}/auth/change-email/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentEmail, newEmail, code: verifyCode })
      });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.message || 'Failed to verify code');
      setMessage('Your email has been changed successfully.');
      setMessageType('success');
      // Optional: reset form after success
      // setVerifyCode('');
    } catch (e2) {
      setMessage(e2.message);
      setMessageType('error');
    } finally {
      setSubmitting(false);
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
                  disabled={sendingCode || cooldown > 0}
                  style={{
                    position: 'absolute',
                    right: '0',
                    top: '0',
                    bottom: '0',
                    height: '100%',
                    backgroundColor: sendingCode || cooldown > 0 ? '#d8d3cf' : '#f8f6f4',
                    color: '#86422A',
                    border: '1px solid #86422A',
                    borderTopLeftRadius: '6px',
                    borderBottomLeftRadius: '6px',
                    padding: '0 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: sendingCode || cooldown > 0 ? 'not-allowed' : 'pointer',
                    borderTopRightRadius: '6px',
                    borderBottomRightRadius: '6px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (!(sendingCode || cooldown > 0)) e.target.style.backgroundColor = '#eae6e3';
                  }}
                  onMouseOut={(e) => {
                    if (!(sendingCode || cooldown > 0)) e.target.style.backgroundColor = '#f8f6f4';
                  }}
                >
                  {sendingCode ? 'Sending...' : cooldown > 0 ? `Resend (${cooldown})` : 'Send Code'}
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
              disabled={submitting}
              style={{
                width: '100%',
                padding: '16px',
                background: submitting ? '#6d3a22' : '#86422A',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(139, 90, 64, 0.3)',
                marginBottom: '10px',
                marginTop: '10px',
                transition: 'all 0.3s ease'
              }} className='font-sans'
              onMouseOver={(e) => {
                if (!submitting) {
                  e.target.style.background = '#421f07';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(139, 90, 64, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!submitting) {
                  e.target.style.background = '#86422A';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(139, 90, 64, 0.3)';
                }
              }}
            >
              {submitting ? 'Processing...' : 'Change Email'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangeEmail;
