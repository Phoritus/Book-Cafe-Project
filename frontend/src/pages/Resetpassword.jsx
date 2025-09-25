import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import "./ResetPassword.css";
import logo from "../assets/Coffee.svg";
import { ArrowLeft } from 'lucide-react';

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSendCode = () => {
    if (!email.trim()) {
      setErrors({ email: "Please enter your email first" });
      setMessage("");
      setMessageType("");
      return;
    }
    setErrors({});
    console.log("Send verification code to:", email);
    setMessage("Verification code sent to your email.");
    setMessageType("success");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    setMessage("");
    setMessageType("");

    if (!email.trim()) newErrors.email = "Please enter your email";
    if (!verifyCode.trim()) newErrors.verifyCode = "Please enter the verification code";
    if (!password.trim()) newErrors.password = "Please enter your password";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Reset password attempt:", { email, verifyCode, password });
      setMessage("Your password has been reset successfully.");
      setMessageType("success");
    } else {
      setMessage("Please check the form again.");
      setMessageType("error");
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
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle"
          />
        </div>

        {/* Title */}
        <div className="welcome-container">
          <h1 className="welcome-title">Reset Password</h1>
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
            <div className="verify-input-wrapper">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder="Enter Verify Code"
                className={`form-input ${errors.verifyCode ? "error" : ""}`}
              />
              <button
                type="button"
                onClick={handleSendCode}
                className="sendcode-inside-button"
              >
                Send Code
              </button>
            </div>
            {errors.verifyCode && (
              <p className="error-message">{errors.verifyCode}</p>
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
            className="signin-button"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
