import React, { useState } from "react";
import roomImage from "../assets/10p_room.jpg";
import ArrowBack from "../assets/ArrowBack.svg";
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function RoomBooking() {
  const location = useLocation();
  const { room } = location.state || {};
  const timeSlots = [
    { time: "08:00 - 09:00", available: true },
    { time: "09:00 - 10:00", available: true },
    { time: "10:00 - 11:00", available: true },
    { time: "11:00 - 12:00", available: true },
    { time: "12:00 - 13:00", available: true },
    { time: "13:00 - 14:00", available: true },
    { time: "14:00 - 15:00", available: true },
    { time: "15:00 - 16:00", available: true },
    { time: "16:00 - 17:00", available: true },
    { time: "17:00 - 18:00", available: true },
  ];

  // Multi-select time slot logic
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const toggleTime = (timeSlot) => {
    if (!timeSlot.available) return;
    if (selectedTimeSlots.includes(timeSlot.time)) {
      setSelectedTimeSlots(selectedTimeSlots.filter((t) => t !== timeSlot.time));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, timeSlot.time]);
    }
  };

  return (
    <div className="app w-full min-h-screen bg-[#F6F3ED] px-4 py-6 flex justify-center items-center">
      <style>{`
        .app {
          min-height: 100vh;
          background-color: #F6F3ED;
          padding: 20px;
        }
        .booking-container {
          max-width: 480px;
          margin: 0 auto;
          background-color: #f5f5f5;
        }
        .header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
        }
        .back-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          color: #86422A;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 4px;
        }
        .back-button:hover {
          background-color: rgba(139, 69, 19, 0.1);
          border-radius: 4px;
        }
        .header-content {
          flex: 1;
        }
        .title {
          font-size: 36px;
          font-weight: bold;
          color: #8B4513;
          margin-bottom: 4px;
          text-align: center;
          font-family: 'Crimson Text', serif;
        }
        .subtitle {
          font-size: 16px;
          color: #BC956B;
          text-align: center;
          font-family: 'Inter', sans-serif;
        }
        .room-card {
          background-color: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }
        .room-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
          .room-info {
            position: relative;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 16px 20px;
            background: none;
          }
          .room-info-bg {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 75%;
            object-fit: cover;
            object-position: bottom;
            filter: blur(4px);
            opacity: 0.2;
            z-index: 0;
          }
          .room-info-content {
            position: relative;
            z-index: 1;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          }
        .room-name, .room-capacity, .room-price, .price {
          color: #fff;
        }
        .room-details {
          flex: 1;
        }
        .room-name {
          font-size: 16px;
          font-weight: 600;
          color: #53311C;
          margin-bottom: 4px;
        }
        .room-capacity {
          font-size: 14px;
          color: #53311C;
        }
        .room-price {
          text-align: right;
        }
        .price {
          font-size: 14px;
          color: #53311C;
          font-weight: 500;
        }
        .time-slots {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          padding: 20px;
        }
        .time-slot {
          padding: 12px 8px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: white;
          font-size: 12px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        .time-slot:hover:not(:disabled) {
          border-color: #86422A;
          background-color: #ffffffff;
          
        }
        .time-slot.selected {
          background-color: #86422A;
          color: white;
          border-color: #86422A;
        }
        .time-slot.selected:hover:not(:disabled) {
          background-color: white;
          color: #333;
          border-color: #86422A;
        }
        .time-slot.booked {
          background-color: #ccc;
          color: #666;
          border-color: #bbb;
          cursor: not-allowed;
        }
        .time-slot:disabled {
          opacity: 1;
        }
        .continue-button {
          width: 100%;
          background-color: #86422A;
          color: white;
          border: none;
          border-radius: 12px;
          padding: 16px 24px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background-color 0.2s ease;
        }
        .continue-button:hover {
          background-color: #7a3d0f;
        }
        .continue-button:active {
          transform: translateY(1px);
        }
        @media (max-width: 480px) {
          .app {
            padding: 16px;
          }
          .time-slots {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            padding: 16px;
          }
          .time-slot {
            padding: 10px 6px;
            font-size: 11px;
          }
          .title {
            font-size: 17px;
            font-weight: 600;
          }
          .subtitle {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="booking-container w-full max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6">
        <header className="header flex items-center gap-4 mb-6 relative">
          <button className="back-button" style={{ position: 'absolute', left: -100, top: 0 }} onClick={() => window.history.back()}>
            <img src={ArrowBack} alt="Back" style={{ width: 50, height: 50 }} />
          </button>
          <div className="header-content flex-1">
            <h1 className="title text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B4513] text-center font-crimson mb-1">Room Booking Schedule</h1>
            <p className="subtitle text-base sm:text-lg text-[#BC956B] text-center font-inter">Please select your preferred time for booking</p>
          </div>
        </header>

        <div className="room-card mt-4 rounded-2xl overflow-hidden shadow">
          <div className="room-image w-full h-48 sm:h-56 md:h-64 overflow-hidden">
            <img
              src={room.image}
              alt="Conference Room"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="room-info relative flex justify-between items-start px-5 py-4" style={{ background: 'none' }}>
            <img src={room.image} alt="bg" className="room-info-bg absolute left-0 top-0 w-full h-full object-cover object-bottom blur-sm opacity-20 z-0" />
            <div className="room-info-content relative z-10 w-full flex justify-between items-start">
              <div className="room-details">
                <h2 className="room-name text-base sm:text-lg font-semibold text-[#53311C] mb-1">{room.name}</h2>
                <p className="room-capacity text-sm sm:text-base text-[#53311C]">Room for 10 people</p>
              </div>
              <div className="room-price text-right">
                <span className="price text-sm sm:text-base text-[#53311C] font-medium">50 THB / Hour</span>
              </div>
            </div>
          </div>

          <div className="time-slots grid grid-cols-3 gap-3 sm:gap-4 p-4">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`time-slot px-2 py-2 sm:px-4 sm:py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors text-center ${!slot.available ? "booked" : ""
                  } ${selectedTimeSlots.includes(slot.time) ? "selected" : ""}`}
                onClick={() => toggleTime(slot)}
                disabled={!slot.available}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        <Link to="/fill-book-room" state={{ selectedTimeSlots, room }} className="continue-button w-full bg-[#86422A] text-white rounded-xl py-4 px-6 text-lg font-semibold flex items-center justify-center gap-2 mt-4 transition hover:bg-[#7a3d0f]">
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default RoomBooking;
