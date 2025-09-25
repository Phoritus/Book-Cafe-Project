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

        
        .app {
          min-height: 100vh;
          background-color: #F6F3ED;
          padding: 20px;
        }
    .booking-container {
      max-width: 755px;
      margin: 0 auto;
        }
        .header {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 24px;
          margin-top: 50px;
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
          position: absolute;
          left: -200px;
          top: 0;
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
          margin-bottom: 24px;
          height: 800px; /* card total height */
        }
        .room-image {
          width: 100%;
          height: 365.63px; /* image height as requested */
          overflow: hidden;
        }
        .room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        @media (max-width: 1024px) {
          .room-image { height: 700px; }
        }
        @media (max-width: 768px) {
          .room-image { height: 520px; }
        }
        @media (max-width: 480px) {
          .room-image { height: 300px; }
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
          margin-top: 20px; /* move down */
          align-items: start;
        }

        /* align each timeslot to the start (left) of its grid cell */
        .time-slot {
          justify-self: start;
        }
        .time-slot {
          /* fixed size as requested */
          width: 173.34px;
          height: 55.19px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: white;
          font-size: 16px; /* increased text size */
          font-weight: 400; /* Inter regular */
          font-family: 'Inter', sans-serif;
          color: #333;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          padding: 0 12px; /* keep some horizontal breathing room */
          margin: 12px; /* add margin around each slot */
          box-sizing: border-box;
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
            width: 100%;
            height: 48px;
            font-size: 14px;
            padding: 0 8px;
            margin: 6px 0; /* smaller vertical margin on mobile */
          }
          .title {
            font-size: 17px;
            font-weight: 600;
          }
          .subtitle {
            font-size: 13px;
          }
        }

        /* Portrait / vertical orientation: bring back button into view and reduce size */
        @media (orientation: portrait) {
          .back-button {
            left: 0;
            top: -140; /* moved up further on vertical screens */
          }
          .back-button img {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>

      <div className="booking-header">
        <header className="header flex items-center gap-4 mb-6 relative">
          <button className="back-button" onClick={() => window.history.back()}>
            <img src={ArrowBack} alt="Back" />
          </button>
          <div className="header-content flex-1">
            <h1 className="title text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B4513] text-center font-crimson mb-1">Room Booking Schedule</h1>
            <p className="subtitle text-base sm:text-lg text-[#BC956B] text-center font-inter">Please select your preferred time for booking</p>
          </div>
        </header>
        <div className="booking-container w-full max-w-md mx-auto rounded-2xl p-4 sm:p-6">

          <div className="room-card mt-4 rounded-2xl overflow-hidden">
            <div className="room-image w-full h-48 sm:h-56 md:h-64 overflow-hidden relative rounded-t-2xl">
              <img
                src={roomImage}
                alt="Conference Room"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute left-0 bottom-0 w-full z-10" style={{ height: '25%', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '0', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '16px' }}>
                <div style={{ color: '#53311C', fontFamily: 'Inter, sans-serif' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 400, margin: 0 }}>Room 4</h2>
                  <p style={{ fontSize: '20px', margin: 0 }}>Room for 10 people</p>
                </div>
                <div style={{ color: '#53311C', textAlign: 'right', fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontSize: '20px', fontWeight: 400 }}>50 THB / Hour</span>
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
    </div>
  );
}
export default RoomBooking;
