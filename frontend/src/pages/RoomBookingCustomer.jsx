import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Users, Clock, DollarSign, Calendar } from 'lucide-react';
import roomImage from '../assets/10p_room.jpg';
import roomImage2 from '../assets/6p_room.png';

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
  // Multiple selection of available hour slots
  const [selectedSlots, setSelectedSlots] = useState([]); // array of slot labels
  const [roomName, setRoomName] = useState('Room');
  const [roomInfo, setRoomInfo] = useState({ capacity: '—', price: '—' });
  const [hasRoom, setHasRoom] = useState(false);
  const [bookings, setBookings] = useState([]); // today's bookings for this room
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const roomConfig = {
    'Room 1': { image: roomImage2 },
    'Room 2': { image: roomImage2 },
    'Room 3': { image: roomImage },
    'Room 4': { image: roomImage }
  };
  const currentRoom = roomConfig[roomName] || roomConfig['Room 1'];

  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
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
        if (parsed) {
          if (parsed.id) setUserId(parsed.id);
          if (parsed.role) setRole(parsed.role);
        }
      }
    } catch { }
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

  // Expand booking time range into 1-hour slot labels
  function expandToHourSlots(startTime, endTime) {
    if (!startTime || !endTime) return [];
    const toMinutes = (t) => { const [hh, mm] = t.split(':'); return parseInt(hh, 10) * 60 + parseInt(mm, 10); };
    const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:00`;
    const startMin = toMinutes(startTime.slice(0, 5));
    const endMin = toMinutes(endTime.slice(0, 5));
    const slots = [];
    for (let m = startMin; m < endMin; m += 60) {
      const s = fmt(m);
      const e = fmt(m + 60);
      slots.push(`${s} - ${e}`);
    }
    return slots;
  }

  // Build set of booked (unavailable) slots (any active booking: BOOKED or CHECKED_IN)
  const bookedSlots = useMemo(() => {
    const ACTIVE = new Set(['BOOKED', 'CHECKED_IN']);
    const set = new Set();
    bookings.forEach(b => {
      if (!b.startTime || !b.endTime) return;
      if (!ACTIVE.has(b.status)) return;
      expandToHourSlots(b.startTime, b.endTime).forEach(lbl => set.add(lbl));
    });
    return set;
  }, [bookings]);

  const toggleTime = (slot) => {
    if (bookedSlots.has(slot)) return; // safety
    setSelectedSlots(prev => prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot].sort((a, b) => a.localeCompare(b)));
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
                <img src={currentRoom.image} alt="Room" className="!w-full !h-full object-cover object-[10%_90%]" />
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
                  const isBooked = bookedSlots.has(slot);
                  const isSelected = !isBooked && selectedSlots.includes(slot);
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => toggleTime(slot)}
                      className={`!w-full  !mt-2 rounded-xl border !h-15 text-sm transition-transform select-none
                      ${isBooked
                          ? 'bg-[#F6F3ED] border border-[#86422A] text-[#86422A] cursor-not-allowed'
                          : isSelected
                            ? 'bg-brown-600 text-white shadow-lg shadow-amber-200 scale-105'
                            : 'bg-white border-[#86422A] text-[#86422A] hover:bg-amber-50'}
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
            <button
              disabled={selectedSlots.length === 0}
              onClick={() => {
                if (!selectedSlots.length) return;
                // Persist selection for next booking step
                try { sessionStorage.setItem('selectedRoom', roomName); } catch { }
                try { sessionStorage.setItem('selectedSlots', JSON.stringify(selectedSlots)); } catch { }
                // Derive start/end for booking page
                const starts = selectedSlots.map(s => s.split('-')[0].trim()).sort();
                const ends = selectedSlots.map(s => s.split('-')[1].trim()).sort();
                const rangeStart = starts[0];
                const rangeEnd = ends[ends.length - 1];
                try { sessionStorage.setItem('pendingStart', rangeStart); } catch { }
                try { sessionStorage.setItem('pendingEnd', rangeEnd); } catch { }
                // Decide booking date: if selected earliest start already passed now -> tomorrow
                const now = new Date();
                const nowHM = now.toTimeString().slice(0, 5);
                const todayISO = now.toISOString().slice(0, 10);
                const tomorrowISO = new Date(now.getTime() + 86400000).toISOString().slice(0, 10);
                const bookingDate = (rangeStart <= nowHM) ? tomorrowISO : todayISO;
                try { sessionStorage.setItem('pendingDate', bookingDate); } catch { }
                navigate('/fill-book-room');
              }}
              className={`!w-110 !mt-10 font-medium py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 !mb-20 
                ${selectedSlots.length ? 'bg-darkBrown-700 text-white hover:bg-darkBrown-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
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