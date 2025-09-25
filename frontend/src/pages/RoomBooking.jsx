import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, DollarSign, Calendar } from 'lucide-react';

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Bar */}
        <div className="w-full h-2 bg-amber-700 rounded-full mb-8"></div>

        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Room Booking Schedule</h1>
          <p className="text-sm text-gray-500">Please select your preferred time for booking</p>
        </div>

        {/* Room Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          {/* Room Image */}
          <div className="relative h-32 bg-gray-200">
            {/* Simple room mockup */}
            <div className="absolute inset-0">
              {/* Wall art */}
              <div className="absolute top-3 left-4 w-8 h-6 bg-gradient-to-r from-yellow-200 to-blue-200 rounded-sm"></div>
              {/* Table */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-amber-100 rounded-full"></div>
              {/* Screen */}
              <div className="absolute top-3 right-4 w-8 h-5 bg-blue-300 rounded-sm"></div>
            </div>
            
            {/* Room info overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
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
          <div className="p-6">
            <div className="grid grid-cols-3 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleTime(slot)}
                    className={`
                      w-28 rounded-xl border px-3 py-3 text-sm font-medium transition-transform duration-200
                      ${isSelected 
                        ? 'bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200 scale-105' 
                        : 'bg-white border-amber-200 text-amber-800 hover:border-amber-400 hover:bg-amber-50'
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
        <button className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-4">
          <span>Continue</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>

        {/* Quick Info */}
        <div className="flex justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>1 Hour</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>50 THB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomBookingSchedule;