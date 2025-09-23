import React, { useState } from 'react';
import './Login.css';
import { Eye, EyeOff, Coffee } from 'lucide-react';
import logo from "../assets/Coffee.svg";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    setLoginError('');

    if (!email.trim()) {
      newErrors.email = 'Please enter your email or phone number';
    } else if (email.trim().length < 3) {
      newErrors.email = 'Email or phone number is too short';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter your password';
    } else if (password.trim().length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Login attempt:', { email, password });
      setTimeout(() => {
        setLoginError('Incorrect email/phone or password. Please try again.');
      }, 500);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo */}
        <div className="animate-fade-in">
          <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
        </div>

        {/* Welcome Text */}
        <div className="welcome-container">
          <h1 className="welcome-title">Welcome Back</h1>
          <p className="welcome-subtitle">Sign in to your Book Café account</p>
        </div>

        {/* Login Form */}
        <div className="form-container">
          {/* Email/Phone Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address / Phone number
            </label>
            <input
              id="email"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors(prev => ({ ...prev, email: '' }));
                }
                if (loginError) {
                  setLoginError('');
                }
              }}
              placeholder="Enter your email / phone number"
              className={`form-input ${errors.email ? 'error' : ''}`}
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="password-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: '' }));
                  }
                  if (loginError) {
                    setLoginError('');
                  }
                }}
                placeholder="Enter your password"
                className={`form-input password-input ${errors.password ? 'error' : ''}`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={23} /> : <Eye size={23} />}
              </button>
            </div>
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Login Error Message */}
          {loginError && (
            <div className="login-error">
              <p className="login-error-text">{loginError}</p>
            </div>
          )}

          {/* Sign In Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className="signin-button"
          >
            Sign In
          </button>

          {/* Forgot Password Link */}
          <div className="forgot-password-container">
            <a href="#" className="forgot-password-link">
              Forgot your password? <span className="forgot-password-highlight">Reset Password</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;