import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./ResetPassword.css";
import logo from "../assets/Coffee.svg";
import { ArrowLeft } from 'lucide-react';
import axios from "axios";

// Backend endpoints (same base as login/register)
const API_BASE = 'https://api-book-cafe.onrender.com/auth';
const API_REQUEST_CODE = `${API_BASE}/reset-password/request`;
const API_RESET_PASSWORD = `${API_BASE}/reset-password`;

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState(""); // user input; backend expects field name 'code'
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success | error | info
  const [sendingCode, setSendingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const resetMessages = () => {
    setMessage("");
    setMessageType("");
  };

  const validateEmail = (val) => /.+@.+\..+/.test(val.trim());

  const handleSendCode = async () => {
    resetMessages();
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Please enter your email first";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    try {
      setSendingCode(true);
      await axios.post(API_REQUEST_CODE, { email: email.trim() });
      setCodeSent(true);
      setMessage("If that email exists, a code has been sent.");
      setMessageType("success");
    } catch (err) {
      console.error('[ResetPassword][sendCode]', err);
      setMessage("Failed to send code. Please try again.");
      setMessageType("error");
    } finally {
      setSendingCode(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format";
    if (!verifyCode.trim()) newErrors.verifyCode = "Please enter the verification code";
    else if (!/^\d{6}$/.test(verifyCode.trim())) newErrors.verifyCode = "Code must be 6 digits";
    if (!password.trim()) newErrors.password = "Please enter your password";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (password && password.length < 8) newErrors.password = newErrors.password || "Password must be at least 8 characters";
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetMessages();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length) {
      setMessage("Please check the form again.");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        email: email.trim(),
        code: verifyCode.trim(), // backend expects 'code'
        password,
        confirmPassword
      };
      const { data } = await axios.post(API_RESET_PASSWORD, payload);
      if (data?.success) {
        setMessage(data.message || 'Your password has been reset successfully.');
        setMessageType('success');
        // Optionally clear sensitive fields
        setPassword('');
        setConfirmPassword('');
        setVerifyCode('');
      } else {
        setMessage(data?.message || 'Failed to reset password.');
        setMessageType('error');
      }
    } catch (err) {
      console.error('[ResetPassword][submit]', err);
      const apiMsg = err?.response?.data?.message || 'Failed to reset password.';
      setMessage(apiMsg);
      setMessageType('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container" style={{ backgroundColor: "#F6F3ED" }}>
      <div className="login-wrapper">
        <div className="absolute top-25 left-25 cursor-pointer z-30" onClick={() => window.history.back()}>
          <ArrowLeft size={40} color="#86422A" />
        </div>

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
          <h1 className="welcome-title">Reset Password</h1>
          <p className="welcome-subtitle">Enter your email before clicking "Send Code"</p>
        </div>

        {/* Form */}
        <div className="form-container">
          {/* Email */}
            <div className="form-group">
              <label className="form-label" style={{ color: "#8b7355" }}>
                Email Address *
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={`form-input ${errors.email ? "error" : ""}`}
              />
              {errors.email && <p className="error-message">{errors.email}</p>}
            </div>

          {/* Verify Code */}
          <div className="form-group">
            <label className="form-label" style={{ color: "#8b7355" }}>
              Verify Code *
            </label>
            <div className="relative">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter Verify Code"
                className={`form-input !pr-28 px-3 f-1 ${errors.verifyCode ? "error" : ""}`}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || !email.trim()}
                className="sendcode-inside-button !mt-0 !w-30  right-0 top-0 bottom-0 h-fulldisabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sendingCode ? 'Sending...' : 'Send Code'}
              </button>
            </div>
            {errors.verifyCode && (
              <p className="error-message">{errors.verifyCode}</p>
            )}
            {codeSent && !errors.verifyCode && (
              <p className="text-xs mt-1" style={{ color: '#8b7355' }}>Code valid for 10 minutes.</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" style={{ color: "#8b7355" }}>
              Password *
            </label>
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={`form-input password-input ${
                  errors.password ? "error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label" style={{ color: "#8b7355" }}>
              Confirm Password *
            </label>
            <div className="password-container">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                className={`form-input password-input ${
                  errors.confirmPassword ? "error" : ""
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="password-toggle"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Result Message */}
          {message && (
            <div className={`message-box ${messageType}`}>
              <p>{message}</p>
            </div>
          )}

          {/* Reset Password Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="signin-button disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Processing...' : 'Reset Password'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
