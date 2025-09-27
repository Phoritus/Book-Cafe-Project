import React, { useState } from "react";
import { DatePicker, Input, Button, Select, Form, message, Result } from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  CalendarOutlined,
} from "@ant-design/icons";
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
  const API_BASE = 'https://book-cafe-project.vercel.app';

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
        <img
          src={logo}
          alt="Logo"
          className="!h-12 !w-12 mx-auto text-brown-500 mb-5 "
        />
        <h2>Join Book Café</h2>
        <p>Create your account to access room bookings</p>
      </div>

      <div className="register-box">
        {success ? (
          <Result
            status="success"
            title="Account created successfully"
            subTitle="You can now sign in with your credentials."
            extra={[
              <Button
                key="login"
                href="/login"
                style={{
                  backgroundColor: '#844C3B',
                  borderColor: '#844C3B',
                  color: '#fff'
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
              <Button
                key="home"
                href="/Home"
                style={{
                  borderColor: '#844C3B',
                  color: '#844C3B'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3e9df';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                Back Home
              </Button>
            ]}
          />
        ) : (
        <Form
          form={form}
          onFinish={submitButton}
          onFinishFailed={onError}
          layout="vertical"
        >
          {/* ✅ Title + First + Last name */}
          <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
            {/* Title */}
            <Form.Item
              name="title"
              label="Title"
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
              label="First Name"
              rules={[{ required: true, message: "Please enter your first name" }]}
              className="flex flex-col justify-end min-h-[90px] w-full sm:flex-1"
            >
              <Input placeholder="Enter your First Name" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: "Please enter your last name" }]}
              className="flex flex-col justify-end min-h-[90px] w-full sm:flex-1"
            >
              <Input placeholder="Enter your Last Name" />
            </Form.Item>
          </div>


          <Form.Item
            name="dateOfBirth"
            label="Date of Birth"
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
            label="National ID Number"
            rules={[
              { required: true, message: 'Please enter your national ID number' },
              { pattern: /^\d{13}$/, message: 'Must be 13 digits (numbers only)' }
            ]}
          >
            <Input placeholder="e.g. 1234567890123" maxLength={13} />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              { pattern: /^[0-9\-+ ()]{7,20}$/, message: 'Invalid phone format' }
            ]}
          >
            <Input placeholder="09X-XXX-XXXX" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter your email address" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="verifyCode"
            label="Verify Code"
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
                  backgroundColor: '#5a2a00',
                  borderColor: '#5a2a00',
                  color: '#fff'
                }}
                onMouseEnter={(e) => {
                  if (!(sendingCode || cooldown > 0)) {
                    e.currentTarget.style.backgroundColor = '#723300';
                    e.currentTarget.style.borderColor = '#723300';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a2a00';
                  e.currentTarget.style.borderColor = '#5a2a00';
                }}
              >
                {cooldown > 0 ? `Resend (${cooldown})` : 'Send Code'}
              </Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 8, message: 'At least 8 characters' },
              { pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/, message: 'Need upper, lower, digit' }
            ]}
          >
            <Input.Password
              placeholder="Enter your password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
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
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
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
              height: '42px',
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

          <div className="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </div>
        </Form>
        )}
      </div>
    </div>
  );
}
