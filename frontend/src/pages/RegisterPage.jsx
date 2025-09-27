import React, { useState } from "react";
import { DatePicker, Input, Button, Select, Form, message, Result } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CalendarOutlined,
} from "@ant-design/icons";
import { Eye, EyeOff} from 'lucide-react';
import "antd/dist/reset.css";
import "./RegisterPage.css";
import logo from "../assets/Coffee.svg";

const { Option } = Select;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [sendingCode, setSendingCode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [success, setSuccess] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  // cooldown timer
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleSendCode = async () => {
    try {
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('Please enter email first');
        return;
      }
      setSendingCode(true);
      const res = await fetch(`${API_BASE}/auth/register/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const err = await res.json().catch(()=>({ message: 'Error' }));
        throw new Error(err.message || 'Failed to send code');
      }
      message.success('Verification code sent');
      setCooldown(60); // 60s cooldown
    } catch (e) {
      message.error(e.message);
    } finally {
      setSendingCode(false);
    }
  };

  const submitButton = async (values) => {
    try {
      setSubmitting(true);
      // Transform to API fields
      const payload = {
        nameTitle: values.nameTitle,
        firstname: values.firstname,
        lastname: values.lastname,
        dateOfBirth: values.dateOfBirth?.format('YYYY-MM-DD'),
        citizen_id: values.citizen_id,
        phone: values.phone,
        email: values.email,
        verifyCode: values.verifyCode,
        password: values.password,
        confirmPassword: values.confirmPassword
      };
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(()=>({ message: 'Unknown response'}));
      if (!res.ok) throw new Error(data.message || 'Registration failed');
  message.success('Registration successful');
  setSuccess(true);
    } catch (e) {
      message.error(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onError = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="register-container" style={{ backgroundColor: "#F6F3ED" }}>
      <div className="header">
        <div className="animate-fade-in">
          <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
        </div>
        <h2 className="font-crimson" >Join Book Café</h2>
        <p >Create your account to access room bookings</p>
      </div>

      <div className="register-box ">
        {success ? (
          <Result
            status="success"
            title={<span style={{ fontWeight: "600", color: "#844C3B", fontFamily: "'Inter', serif" }}>
              Account created successfully </span>
            }
            subTitle={<span style={{ fontWeight: "400", fontFamily: "'Inter', serif" }}>
              You can now sign in with your credentials. </span>
            }
            extra={[
              <Button
                key="login"
                href="/login"
                style={{
                  backgroundColor: '#844C3B',
                  borderColor: '#844C3B',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  padding: '20px 30px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#723300';
                  e.currentTarget.style.borderColor = '#723300';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#844C3B';
                  e.currentTarget.style.borderColor = '#844C3B';
                }}
              >
                Go to Login
              </Button>,
            ]}
          />
        ) : (
        <Form
          form={form}
          onFinish={submitButton}
          onFinishFailed={onError}
          layout="vertical"
          requiredMark={false}
        >
          {/* ✅ Title + First + Last name */}
          <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
            {/* Title */}
            <Form.Item
              name="title"
              label={<label className="text-brown-700 font-sans font-semibold">Title *</label>}
              rules={[{ required: true, message: "Enter your title" }]}
              className="flex flex-col justify-end min-h-[90px] !w-20 sm:w-24"
            >
              <Select placeholder="---" className="!h-10.5">
                <Option value="Mr">Mr</Option>
                <Option value="Ms">Ms</Option>
                <Option value="Mrs">Mrs</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            {/* First Name */}
            <Form.Item
              name="firstname"
              label={<label className="text-brown-700 font-sans font-semibold">First Name *</label>}
              rules={[{ required: true, message: "Please enter your first name" }]}
              className="flex flex-col justify-end min-h-[90px] w-full sm:flex-1"
            >
              <Input placeholder="Enter your First Name" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastname"
              label={<label className="text-brown-700 font-sans font-semibold">Last Name *</label>}
              rules={[{ required: true, message: "Please enter your last name" }]}
              className="flex flex-col justify-end min-h-[90px] w-full sm:flex-1"
            >
              <Input placeholder="Enter your Last Name" />
            </Form.Item>
          </div>


          <Form.Item
            name="dateOfBirth"
            label={<label className="text-brown-700 font-sans font-semibold">Date of Birth *</label>}
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              placeholder="Select your Date / Month / Year of Birth"
              suffixIcon={<CalendarOutlined />}
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="citizen_id"
            label={<label className="text-brown-700 font-sans font-semibold">National ID Number *</label>}
            rules={[
              { required: true, message: 'Please enter your national ID number' },
              { pattern: /^\d{13}$/, message: 'Must be 13 digits (numbers only)' }
            ]}
          >
            <Input placeholder="e.g. 1234567890123" maxLength={13} />
          </Form.Item>

          <Form.Item
            name="phone"
            label={<label className="text-brown-700 font-sans font-semibold">Phone Number *</label>}
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[0-9\-+ ()]{7,20}$/, message: 'Invalid phone format' }
            ]}
          >
            <Input placeholder="09X-XXX-XXXX" />
          </Form.Item>

          <Form.Item
            name="email"
            label={<label className="text-brown-700 font-sans font-semibold">Email Address *</label>}
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="verifyCode"
            label={<label className="text-brown-700 font-sans font-semibold">Verify Code *</label>}
            rules={[{ required: true, message: 'Please enter verify code' }, { pattern: /^\d{6}$/, message: 'Must be 6 digits' }]}
          >
            <div className="verify-code">
              <Input placeholder="Enter Verify Code" maxLength={6} />
              <Button
                className="send-btn"
                type="default"
                onClick={handleSendCode}
                disabled={sendingCode || cooldown > 0}
                loading={sendingCode}
                style={{
                  backgroundColor: '#f8f6f4',
                  color: '#86422A',
                  borderColor: '#86422A',
                }}
                onMouseEnter={(e) => {
                  if (!(sendingCode || cooldown > 0)) {
                    e.currentTarget.style.backgroundColor = '#eae6e3';
                    e.currentTarget.style.borderColor = '#723300';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f6f4';
                  e.currentTarget.style.borderColor = '#86422A';
                }}
              >
                {cooldown > 0 ? `Resend (${cooldown})` : 'Send Code'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            label={<label className="text-brown-700 font-sans font-semibold">Password *</label>}
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'At least 8 characters' },
              { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, message: 'Need upper, lower, digit' }
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeOff size={23} /> : <Eye size={23}/>
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={<label className="text-brown-700 font-sans font-semibold">Confirm Password *</label>}
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeOff size={23} /> : <Eye size={23}/>
              }
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="submit-btn"
            loading={submitting}
            disabled={submitting}
            style={{
              backgroundColor: '#5a2a00',
              borderColor: '#5a2a00',
              color: '#fff',
              width: '100%',
              height: '54px',
              fontWeight: 500
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.currentTarget.style.backgroundColor = '#723300';
                e.currentTarget.style.borderColor = '#723300';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#5a2a00';
              e.currentTarget.style.borderColor = '#5a2a00';
            }}
          >
            {submitting ? 'Creating...' : 'Create Account'}
          </Button>

          <div className="login-link font-sans">
            Already have an account? <a href="/login">Sign in here</a>
          </div>
        </Form>
        )}
      </div>
    </div>
  );
}
