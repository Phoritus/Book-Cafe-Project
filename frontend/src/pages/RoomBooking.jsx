import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import roomImage from '../assets/10p_room.jpg';

const timeSlots = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

const RoomBookingSchedule = () => {
  const [selectedSlot, setSelectedSlot] = useState('09:00 - 10:00');

  const toggleTime = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <section className="relative min-h-screen flex flex-1 items-center justify-center font-sans" style={{ backgroundColor: "#F6F3ED" }}>

      <div className="!w-160 mx-auto">
        <div
          className="absolute left-6 top-6 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={48} color="#86422A" />
        </div>
        {/* Header Bar */}

        {/* Title */}
        <div className="!text-center !mb-10 !mt-10">
          <h1 className="md:text-4xl font-crimson font-bold text-darkBrown-500 mb-2 text-shadow">Room Booking Schedule</h1>
          <p className="text-sm text-brown-600">Please select your preferred time for booking</p>
        </div>

        {/* Room Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Room Image */}
          <div className="relative bg-gray-200 !h-60">
            {/* Simple room mockup */}
            <div className="absolute inset-0">
              <img src={roomImage} alt="Room" className="!w-full !h-full object-cover object-[10%_90%]" />
            </div>

            {/* Room info overlay */}
            <div className="absolute !bottom-0 !left-0 !right-0 !bg-gradient-to-t !from-black/80 !to-transparent  !p-3">
              <div className="flex justify-between items-end text-white">
                <div>
                  <h3 className="text-lg font-medium">Room 4</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <Users className="w-3 h-3" />
                    <span>Room for 5-10 people</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">50 THB</div>
                  <div className="text-xs opacity-75">/ Hour</div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="flex justify-center p-0 !mt-10 ">
            <div className="grid grid-cols-3 gap-6 !w-130 !mb-10 ">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTime(slot)}
                    disabled={slot === "17:00 - 18:00"}
                    className={`
                       !w-full !mt-2 rounded-xl  text-sm transition-transform 
                         ${slot === "17:00 - 18:00"
                        ? '!bg-[#F6F3ED] !text-amber-800 '
                        : isSelected  
                          ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200 scale-105'
                          : 'bg-white border-amber-200 !text-amber-800 hover:border-amber-400 hover:bg-amber-50 '
                      }
                      `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button className="!w-110 bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 !mb-20">
          <span>Continue</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>

        {/* Quick Info */}

      </div>

    </section>
  );
};

export default RoomBookingSchedule;