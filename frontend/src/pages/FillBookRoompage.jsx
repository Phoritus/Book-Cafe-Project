import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Calendar, MapPin } from 'lucide-react';
import p6Room from '../assets/6p_room.png';
import p10Room from '../assets/10p_room.jpg';

const BookingConfirmPage = () => {
  // State for booking data - would normally come from router params or global state
  const [bookingData, setBookingData] = useState({
    roomId: 'Room 4',
    date: '17/08/2025',
    startTime: '10:00',
    endTime: '12:00',
    pricePerHour: 50,
    image: 'p10Room', 
  });

  const [selectedStartTime, setSelectedStartTime] = useState(bookingData.startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(bookingData.endTime);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Room configurations
  const roomConfig = {
    'Room 1': { 
      image: p6Room, 
      pricePerHour: 50
    },
    'Room 2': { 
      image: p6Room, 
      pricePerHour: 50
    },
    'Room 3': { 
      image: p10Room, 
      pricePerHour: 50
    },
    'Room 4': { 
      image: p10Room, 
      pricePerHour: 50
    }
  };

  const currentRoom = roomConfig[bookingData.roomId] || roomConfig['Room 4'];

  // Available time slots - would come from API
  const availableStartTimes = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const availableEndTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  // Calculate hours and total price
  const calculateHours = () => {
    const start = parseInt(selectedStartTime.split(':')[0]);
    const end = parseInt(selectedEndTime.split(':')[0]);
    return Math.max(0, end - start);
  };

  const hours = calculateHours();
  const totalPrice = hours * currentRoom.pricePerHour;

  const handleConfirmBooking = () => {
    if (hours <= 0) {
      alert('Please select valid time range');
      return;
    }
    
    // Simulate API call
    console.log('Booking confirmed:', {
      ...bookingData,
      startTime: selectedStartTime,
      endTime: selectedEndTime,
      hours,
      totalPrice
    });
    
    setShowSuccessModal(true);
    
    // Auto close modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  return (
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
        rel="stylesheet"
      />

      {/* Success Modal */}
      {showSuccessModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-80 p-8 z-50 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-amber-900 mb-2 font-crimson">
              Booking Successful!
            </h2>
            <p className="text-amber-700">
              Your room has been reserved successfully.
            </p>
          </div>
        </>
      )}

      <div className="min-h-screen bg-[#F6F3ED] font-inter">
        {/* Header */}
        <div className="flex items-center justify-center relative">
          <button
            className="absolute left-6 !mt-30 !ml-10 p-2 text-amber-800 hover:text-amber-900 transition-colors"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={28} className="w-10 h-10 mr-5 color-[#86422A]" />
          </button>

          
        </div>

        <div className="text-center mb-8 !mt-10">
                  <h1 className="text-4xl !mt-30 font-bold text-[#53311C] p-7 font-crimson justify-center">
            Booking Room
          </h1>
                </div>

        {/* Main Content */}
        <div className="max-w-4xl !w- mx-auto !h-50 py-auto px-6 pb-20 font-sans">
          <div className=" bg-[#FBFBFB] rounded-3xl shadow-lg overflow-hidden !pl-8 !pr-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px]">
              {/* Left Side - Booking Details */}
              <div className="p-8 space-y-4">
                <div>
                  <h2 className="text-4xl flex items-center gap-3 mb-6 font-semibold text-[#53311C]">
                    {bookingData.roomId}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">
                      Date
                    </label>
                    <div className="flex items-center gap-2 p-3 border-2 border-[#E9E0D8] rounded-xl">
                      <Calendar size={16} className="text-[#c5bcb4]" />
                      <span className="text-[#a69f99] font-medium">
                        {bookingData.date}
                      </span>
                    </div>
                  </div>

                  {/* Total Hours */}
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">
                      Total Hours
                    </label>
                    <div className="flex items-center gap-2 p-3 border-2 border-[#E9E0D8] rounded-xl">
                      <Clock size={16} className="text-[#c5bcb4]" />
                      <span className="text-[#a69f99] font-medium">
                        {hours} hrs
                      </span>
                    </div>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">
                      Start Time
                    </label>
                    <select
                      value={selectedStartTime}
                      onChange={(e) => setSelectedStartTime(e.target.value)}
                      className="w-full p-3 border-2 border-[#E9E0D8] rounded-xl bg-white font-medium focus:border-[#8b5a40] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)] transition-colors"
                    >
                      {availableStartTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">
                      End Time
                    </label>
                    <select
                      value={selectedEndTime}
                      onChange={(e) => setSelectedEndTime(e.target.value)}
                      className="w-full p-3 border-2 border-[#E9E0D8] rounded-xl bg-white text-amber-900 font-medium focus:border-[#8b5a40] focus:shadow-[0_0_0_2px_rgba(0,0,0,0.1)]  transition-colors"
                    >
                      {availableEndTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="flex justify-center items-center text-xl space-x-3">
                  <span className="font-medium text-[#BB8F6E]">
                    Total Price
                  </span>
                  <span className="font-medium text-[#53311C]">
                    {totalPrice} THB
                  </span>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={hours <= 0}
                  className="w-full bg-gradient-to-r from-[#86422A] to-[#86422A] hover:from-[#53311C] hover:to-[#86422A] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Confirm Booking
                </button>
              </div>

              {/* Right Side - Room Image & Info */}
              <div className="relative p-8 flex flex-col !mt-13  ">
                {/* Room specific image and info */}
                <div className="rounded-2xl flex items-center justify-center">
                  <div className="text-center text-amber-700">
                    <img
                      src={currentRoom.image}
                      alt={bookingData.roomId}
                      className="w-full object-cover rounded-xl"
                    />
                  </div>
                </div>

                {/* Check-in Info */}
                <div className="rounded-xl p-4 ">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-amber-900 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm font-medium text-amber-900 leading-relaxed ">
                        Check in within 30 minutes of your booking start, or
                        your reservation will be cancelled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmPage;