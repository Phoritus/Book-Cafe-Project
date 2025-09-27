import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff} from 'lucide-react';
import logo from "../assets/Coffee.svg";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/authStore";

const API_URL = `${import.meta.env.VITE_API_BASE}/auth/login`;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const handleSubmit = async (e) => {
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

    if (Object.keys(newErrors).length > 0) return; // stop if validation errors

    setLoading(true);
    try {
      const { data } = await axios.post(API_URL, { email, password });
      // Expected shape: { token, user: { id, email, role } }
      if (!data || !data.token || !data.user) {
        throw new Error('Unexpected response format');
      }
      localStorage.setItem('accessToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      authStore.login(data.user);
      const role = data.user?.role;
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/customer', { replace: true });
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setLoginError(err.response.data.message);
      } else {
        setLoginError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Noto+Sans+Thai+Looped:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Thai:wght@100..900&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=IBM+Plex+Sans+Thai:wght@100;200;300;400;500;600;700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+Thai+Looped:wght@100;200;300;400;500;600;700;800;900&family=Noto+Sans+Thai:wght@100..900&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          .login-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: #F6F3ED;
            font-family: 'Inter', system-ui, sans-serif;
          }

          .login-wrapper {
            width: 100%;
            max-width: 450px;
          }

          .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 25px;
          }

          .logo {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .welcome-container {
            text-align: center;
            margin-bottom: 25px;
          }

          .welcome-title {
            font-size: 2.2rem;
            font-weight: bold;
            letter-spacing: -0.5px;
            font-family: 'Crimson Text', serif;
          }

          .welcome-subtitle {
            color: #BC956B;
            font-size: 1rem;
            font-family: 'Inter', system-ui, sans-serif;
            margin: 0;
          }

          .form-container {
            background: #FBFBFB;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(139, 90, 64, 0.1);
            border: 1px solid rgba(139, 90, 64, 0.1);
            padding: 40px 30px;
          }

          .form-group {
            margin-bottom: 25px;
          }

          .form-label {
            display: block;
            font-size: 0.95rem;
            font-weight: 500;
            color: #53311C;
            margin-bottom: 8px;
            font-family: 'Inter', system-ui, sans-serif;
          }

          .form-input {
            width: 100%;
            padding: 16px 18px;
            border: 2px solid #e8ddd4;
            border-radius: 12px;
            font-size: 1rem;
            background: #ffffff;
            color: #4a3429;
            outline: none;
            font-family: 'Inter', system-ui, sans-serif;
            transition: all 0.3s ease;
          }

          .form-input::placeholder {
            color: #B6B1AA;
          }

          .form-input:focus {
            border-color: #8b5a40;
            box-shadow: 0 0 0 3px rgba(139, 90, 64, 0.1);
            background: #ffffff;
          }

          .form-input.error {
            border-color: #f87171;
          }

          .password-container {
            position: relative;
          }

          .password-input {
            padding-right: 50px;
          }

          .password-toggle {
            width: auto;
            height: auto;
            position: absolute;
            right: 16px;
            top: 16%;
            transform: translateY(0%);
            background: none;
            border: none;
            color: #BC956B;
            cursor: pointer;
            padding: 4px;
            font-size: 1.1rem;
            border-radius: 4px;
            transition: color 0.2s ease;
          }

          .password-toggle:hover {
            color: #8b5a40;
          }

          .error-message {
            margin-top: 8px;
            font-size: 0.875rem;
            color: #dc2626;
            font-family: 'Inter', system-ui, sans-serif;
          }

          .login-error {
            margin-bottom: 16px;
            padding: 12px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
          }

          .login-error-text {
            font-size: 0.875rem;
            color: #b91c1c;
            font-family: 'Inter', system-ui, sans-serif;
            margin: 0;
          }

          .signin-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #86422A, #86422A);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(139, 90, 64, 0.3);
            font-family: 'Inter', system-ui, sans-serif;
            margin-top: 20px;
            margin-bottom: 20px;
            transition: all 0.3s ease;
          }

          .signin-button:hover {
            background: linear-gradient(135deg, #86422A, #86422A);
            transform: translateY(-1px);
            box-shadow: 0 6px 16px rgba(139, 90, 64, 0.4);
          }

          .signin-button:active {
            transform: translateY(0);
          }

          .forgot-password-container {
            text-align: center;
          }

          .forgot-password-link {
            padding: 1%;
            font-size: 0.95rem;
            color: #BC956B;
            text-decoration: none;
            font-family: 'Inter', system-ui, sans-serif;
            transition: color 0.2s ease;
          }

          .forgot-password-highlight:hover {
            color: #86422a;
            text-decoration: underline;
          }

          .forgot-password-highlight {
            color: #BC956B;
            font-weight: 600;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .login-container {
              padding: 15px;
            }
            .form-container {
              padding: 30px 25px;
              border-radius: 15px;
            }
            .welcome-title {
              font-size: 1.8rem;
            }
          }

          @media (max-width: 480px) {
            .form-container {
              padding: 25px 20px;
              border-radius: 12px;
            }
            .welcome-title {
              font-size: 1.6rem;
              margin-bottom: 6px;
            }
            .welcome-subtitle {
              font-size: 0.9rem;
              margin-bottom: 30px;
            }
            .form-input {
              padding: 14px 16px;
              font-size: 0.95rem;
            }
            .signin-button {
              padding: 14px;
              font-size: 1rem;
            }

            input[type="password"] {
              -webkit-appearance: none;
              -moz-appearance: none;
              appearance: none;
            }

            input[type="password"]::-ms-reveal,
            input[type="password"]::-ms-clear {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
            }

            input[type="password"]::-webkit-textfield-decoration-container {
              display: none !important;
            }

            input[type="password"]::-webkit-credentials-auto-fill-button,
            input[type="password"]::-webkit-password-toggle-button {
              display: none !important;
            }
          }
        `}
      </style>
      
      <div className="login-container">
        <div className="login-wrapper">
          {/* Logo */}
          <div className="animate-fade-in">
            <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
          </div>

          {/* Welcome Text */}
          <div className="welcome-container">
            <h1 className="welcome-title !text-[#53311c]">Welcome Back</h1>
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
              className="signin-button" style={{ backgroundColor: "#86422A" }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            {/* Forgot Password Link */}
            <div className="forgot-password-container">
              <span className="forgot-password-link">
                Forgot your password?
              </span>
              <span className='forgot-password-link'><Link to="/reset-password" className="forgot-password-highlight">Reset Password</Link></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;