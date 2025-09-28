import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
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
  const [roomName, setRoomName] = useState('Room');
  const [roomInfo, setRoomInfo] = useState({ capacity: '—', price: '—' });
  const [hasRoom, setHasRoom] = useState(false);
  const [bookings, setBookings] = useState([]); // today's bookings for this room
  const [userId, setUserId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE;
  useEffect(() => {
    let cancelled = false;
    const stored = (() => {
      try { return sessionStorage.getItem('selectedRoom'); } catch { return null; }
    })();
  if (stored) { setRoomName(stored); setHasRoom(true); }
    // load user id
    try {
      const rawUser = localStorage.getItem('user');
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        if (parsed && parsed.id) setUserId(parsed.id);
      }
    } catch {}
    (async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/rooms`);
        if (cancelled) return;
        if (Array.isArray(data)) {
          const match = data.find(r => (r.room_number || '').toLowerCase() === (stored || '').toLowerCase());
          if (match) {
            setRoomInfo({
              capacity: match.number_people ? `Room for ${match.number_people} people` : '—',
              price: match.price ? `${parseFloat(match.price).toFixed(0)} THB` : '—'
            });
          }
        }
      } catch (e) {
        // silent; keep defaults
      }
    })();
    return () => { cancelled = true; };
  }, [API_BASE]);

  // Fetch today's bookings via new REST endpoint /bookings/today/:room_number
  useEffect(() => {
    if (!hasRoom || !roomName) return;
    let abort = false;
    (async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const encoded = encodeURIComponent(roomName);
        const { data } = await axios.get(`${API_BASE}/bookings/today/${encoded}`, { headers });
        if (!abort && Array.isArray(data)) setBookings(data);
      } catch (e) {
        // silently ignore; bookings remain empty
      }
    })();
    return () => { abort = true; };
  }, [API_BASE, hasRoom, roomName]);

  // Derive user's own booked slot labels (assuming each booking has startTime/endTime HH:MM:SS)
  const userBookedSlots = useMemo(() => {
    if (!userId) return new Set();
    const set = new Set();
    bookings.filter(b => b.person_id === userId).forEach(b => {
      if (b.startTime && b.endTime) {
        // convert times to HH:MM
        const start = b.startTime.slice(0,5); // HH:MM
        const end = b.endTime.slice(0,5);
        // We assume bookings are exactly 1 hour or align to our slot boundaries; create label like 'HH:MM - HH+1:MM' if matches
        const label = `${start} - ${end}`;
        set.add(label);
      }
    });
    return set;
  }, [bookings, userId]);

  const toggleTime = (slot) => {
    setSelectedSlot(slot);
  };

  return (
    <section className="relative min-h-screen flex flex-1 items-center justify-center font-sans" style={{ backgroundColor: "#F6F3ED" }}>

      <div className="!w-160 !ml-6 ">
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

        {!hasRoom && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8 p-10 text-center">
            <h2 className="text-xl font-semibold text-amber-800 mb-4">No room selected</h2>
            <p className="text-sm text-amber-700 mb-6">Please go back and choose a room before selecting a time slot.</p>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 rounded-xl bg-amber-700 text-white hover:bg-amber-800 transition"
            >
              Go to Choose Room
            </button>
          </div>
        )}

        {hasRoom && (
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
                  <h3 className="text-lg font-medium">{roomName}</h3>
                  <div className="flex items-center gap-1 text-xs opacity-90">
                    <Users className="w-3 h-3" />
                    <span>{roomInfo.capacity}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">{roomInfo.price}</div>
                  <div className="text-xs opacity-75">/ Hour</div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Slots */}
          <div className="flex justify-center p-0 !mt-10 ">
            <div className="grid grid-cols-3 gap-6 !w-130 !mb-10 ">
              {timeSlots.map((slot) => {
                const allowed = userBookedSlots.size === 0 ? false : userBookedSlots.has(slot);
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!allowed}
                    onClick={() => allowed && toggleTime(slot)}
                    className={`!w-full !mt-2 rounded-xl border !h-15 text-sm transition-transform 
                      ${allowed ? (isSelected ? 'bg-brown-600 text-white shadow-lg shadow-amber-200 scale-105' : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50') : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
  </div>
  )}

        {/* Continue Button */}
        {hasRoom && (
          <div className="flex justify-center">
            <button className="!w-110 bg-darkBrown-700 !mt-10 text-white font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 !mb-20">
              <span>Continue</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        )}

        {/* Quick Info */}

      </div>

    </section>
  );
};

export default RoomBookingSchedule;