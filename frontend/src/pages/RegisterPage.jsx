import React from "react";
import { DatePicker, Input, Button, Select, Form } from "antd";
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

  const submitButton = (values) => {
    console.log("Success:", values);
  };

  const onError = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="register-container">
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
        <Form
          form={form}
          onFinish={submitButton}
          onFinishFailed={onError}
          layout="vertical"
        >
          {/* ✅ Title + First + Last name */}
          <div className="name-row">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please select your title" }]}
              className="name-item"
            >
              <Select placeholder="---">
                <Option value="Mr">Mr</Option>
                <Option value="Ms">Ms</Option>
                <Option value="Mrs">Mrs</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="fname"
              label="First Name"
              rules={[
                { required: true, message: "Please enter your first name" },
              ]}
              className="name-item"
            >
              <Input placeholder="Enter your First Name" />
            </Form.Item>

            <Form.Item
              name="lname"
              label="Last Name"
              rules={[
                { required: true, message: "Please enter your last name" },
              ]}
              className="name-item"
            >
              <Input placeholder="Enter your Last Name" />
            </Form.Item>
          </div>

          <Form.Item
            name="dateBirth"
            label="Date of Birth"
            rules={[
              { required: true, message: "Please select your date of birth" },
            ]}
          >
            <DatePicker
              placeholder="Select your Date / Month / Year of Birth"
              suffixIcon={<CalendarOutlined />}
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="nationalID"
            label="National ID Number"
            rules={[
              {
                required: true,
                message: "Please enter your national ID number",
              },
            ]}
          >
            <Input placeholder="1-XXXX-XXXXX-XX-X" />
          </Form.Item>

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
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
            rules={[{ required: true, message: "Please enter verify code" }]}
          >
            <div className="verify-code">
              <Input placeholder="Enter Verify Code" />
              <Button className="send-btn">Send Code</Button>
            </div>
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
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

          <Button type="primary" htmlType="submit" className="submit-btn">
            Create Account
          </Button>

          <div className="login-link">
            Already have an account? <a href="/login">Sign in here</a>
          </div>
        </Form>
      </div>
    </div>
  );
}
