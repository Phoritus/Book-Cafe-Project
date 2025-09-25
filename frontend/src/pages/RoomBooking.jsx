import React, { useState } from "react";
import roomImage from "../assets/10p_room.jpg";
import ArrowBack from "../assets/ArrowBack.svg";

function RoomBooking() {
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
    <div className="app w-full min-h-screen bg-[#F6F3ED] px-4 py-6 flex justify-center items-start">
      <style>{`
        .app { background-color: #F6F3ED; }
        .booking-container { max-width: 860px; margin: 0 auto; }
        .header { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 12px; }
        .back-button { background: none; border: none; cursor: pointer; padding: 8px; color: #86422A; position: absolute; left: 0; top: 0; }
        .title { font-size: 28px; font-weight: 700; color: #8B4513; text-align: center; font-family: 'Crimson Text', serif; }
        .subtitle { font-size: 13px; color: #BC956B; text-align: center; font-family: 'Inter', sans-serif; margin-top: 4px; }
        .room-card { background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
        .room-image { width: 100%; height: 280px; position: relative; }
        .room-image img { width: 100%; height: 100%; object-fit: cover; }
        .overlay { position: absolute; left: 0; right: 0; bottom: 0; background: linear-gradient(180deg, rgba(0,0,0,0) 10%, rgba(0,0,0,0.55) 85%); color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 14px 18px; }
        .room-name { font-weight: 600; font-size: 16px; }
        .room-capacity { font-size: 13px; opacity: 0.95; }
        .price { font-size: 14px; font-weight: 600; }
        .time-wrapper { padding: 18px 22px 22px; }
        .time-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .time-btn { padding: 10px 12px; border: 1px solid #C9B2A4; color: #53311C; background: #fff; border-radius: 8px; font-size: 12px; font-weight: 500; text-align: center; cursor: pointer; transition: all .15s ease; }
        .time-btn:hover { border-color: #86422A; background: #FAF7F3; }
        .time-btn.selected { background: #86422A; color: #fff; border-color: #86422A; }
        .continue { width: 240px; background: #86422A; color: #fff; border: none; border-radius: 999px; padding: 14px 22px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; margin: 18px auto 0; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
        .continue:hover { background: #7a3d0f; }
        @media (max-width: 1024px) { .booking-container { max-width: 760px; } }
        @media (max-width: 768px) { .time-grid { grid-template-columns: repeat(2, 1fr); } .room-image{ height: 220px; } .title{font-size:24px;} }
        @media (max-width: 480px) { .time-grid { grid-template-columns: 1fr; } .time-btn{font-size:11px; padding:10px 12px;} .room-image{ height: 200px; } .booking-container{padding:0 8px;} }
      `}</style>

      <div className="booking-container w-full">
        <header className="header">
          <button className="back-button" onClick={() => window.history.back()}>
            <img src={ArrowBack} alt="Back" style={{ width: 36, height: 36 }} />
          </button>
          <div>
            <h1 className="title">Room Booking Schedule</h1>
            <p className="subtitle">Please select your preferred time for booking</p>
          </div>
        </header>

        <div className="room-card">
          <div className="room-image">
            <img src={roomImage} alt="Room" />
            <div className="overlay">
              <div>
                <div className="room-name">Room 4</div>
                <div className="room-capacity">Room for 5–10 people</div>
              </div>
              <div className="price">50 THB / Hour</div>
            </div>
          </div>

          <div className="time-wrapper">
            <div className="time-grid">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  className={`time-btn ${selectedTimeSlots.includes(slot.time) ? "selected" : ""}`}
                  onClick={() => toggleTime(slot)}
                  disabled={!slot.available}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="continue">
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default RoomBooking;


