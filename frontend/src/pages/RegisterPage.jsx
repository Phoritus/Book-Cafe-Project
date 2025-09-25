import { useState } from "react";
import "./RegisterPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import {CalendarComponent} from '@syncfusion/ej2-react-calendars';

export default function RegisterPage() {
    const dateBirth = new Date(new Date().getFullYear(),new Date().getMonth(),20);

  const [title, setTitle] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
//   const [dateBirth, setDateBirth] = useState(null);
  const [nationalID, setNationalID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [comfirmPassword, setComfirmPassword] = useState("");

  const [submit, setSubmit] = useState(false);

  const isValidDateBirth = (date) => {
    return date instanceof Date && !isNaN(date);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const submitButton = (e) => {
    e.preventDefault();
    formatDate(dateBirth);
    if (!isValidDateBirth(dateBirth)) {
      alert("กรุณาเลือกวันเกิดให้ถูกต้อง");
      return;
    }
    const users = {
      id: Math.floor(Math.random() * 1000),
      title: title,
      fname: fname,
      lname: lname,
      date: dateBirth,
      nationalID: nationalID,
      phoneNumber: phoneNumber,
      email: email,
      password: password,
      comfirmPassword: comfirmPassword,
    };
    console.log(users);
    setSubmit(true);
  };

  return (
    <div className="Container">
      <div className="Reg-wrap">
        <div className="Show">
          <img src="./src/assets/Coffee.svg" alt="" />
          <h1 className="H1-show">
            <b>Join Book Café</b>
          </h1>
          <p className="P-show">Create your account to access room bookings</p>
        </div>
        {/* Form-register */}
        <div className="Reg-container">
          {/* ด้านบน   */}
          <div className="Reg-up">
            {/* Title */}
            <div>
              <label>Title *</label>
              <select
                placeholder="--"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              >
                <option value="" disabled selected hidden>
                  --
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fname */}
            <div>
              <label href="fname">First Name *</label>
              <input
                id="fname"
                placeholder="Enter your First Name"
                type="text"
                value={fname}
                onChange={(e) => {
                  setFname(e.target.value);
                }}
              />
            </div>

            {/* Lname */}
            <div>
              <label href="lname">Last Name *</label>
              <input
                id="lname"
                placeholder="Enter your Last Name"
                type="text"
                value={lname}
                onChange={(e) => {
                  setLname(e.target.value);
                }}
              />
            </div>
          </div>
          {/* ตรงกลาง */}
          <div className="Reg-body">
            {/* DateBirth */}
            <div class="exclude">
              <label>Date of Birth *</label>

              <DatePicker
                className="Date"
                selected={dateBirth}
                onChange={(e) => setDateBirth(e.target.value)}
                calendarClassName="my-custom-calendar" // <-- ตกแต่ง popup
                placeholderText="เลือกวันที่"
              />
            </div>
            {/* NationIDnumber */}
            <div>
              <label>National ID Number *</label>
              <input
                value={nationalID}
                placeholder="1-XXXX-XXXXX-XX-X"
                type="text"
                onChange={(e) => {
                  setNationalID(e.target.value);
                }}
              />
            </div>

            {/* PhoneNumber */}
            <div>
              <label>Phone Number *</label>
              <input
                value={phoneNumber}
                placeholder="09X-XXX-XXXX"
                type="text"
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
              />
            </div>

            {/* Email */}
            <div>
              <label>Email Adress *</label>
              <input
                value={email}
                placeholder="Enter your email"
                type="text"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            {/* VerifyCode */}
            <div className="sendCode">
              <label>Verify Code *</label>
              <div>
                <input
                  value={verifyCode}
                  placeholder="Enter Verify Code"
                  type="text"
                  onChange={(e) => {
                    setVerifyCode(e.target.value);
                  }}
                />
                <button>Send Code</button>
              </div>
            </div>

            <div>
              <label>Password *</label>
              <input
                value={password}
                placeholder="Enter your password"
                type="text"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div>
              <label>Confirm Password *</label>
              <input
                value={verifyCode}
                placeholder="Enter your password"
                type="text"
                onChange={(e) => {
                  setComfirmPassword(e.target.value);
                }}
              />
            </div>
          </div>

          {/* ปุ่ม */}
          <button className="button" onClick={submitButton}>
            Create Account
          </button>
          {submit && <div>Successful</div>}
          {submit && !isValidDateBirth(dateBirth) && (
            <div style={{ color: "red" }}>กรุณาเลือกวันเกิด</div>
          )}
          <div className="Login">
            <label>Already have an account?</label>
            <Link to="/Login">
              <b>Sign in here</b>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
