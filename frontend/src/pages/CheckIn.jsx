import React, { useState, useEffect, useMemo } from "react";
import { Mail, Phone, ArrowLeft, MoreHorizontal, CreditCard } from "lucide-react";
import successIcon from "../assets/Success.svg";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper to parse slot "HH:MM - HH:MM"
function parseSlot(slot) {
  if (!slot) return null;
  const [s, e] = slot.split('-').map(p => p.trim());
  return { start: s, end: e };
}

const CheckIn = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const room = params.get('room') || sessionStorage.getItem('checkInRoom') || 'Room';
  const slot = params.get('slot') || sessionStorage.getItem('checkInSlot');
  const parsedSlot = parseSlot(slot);
  const API_BASE = import.meta.env.VITE_API_BASE;

  // Role guard (only admin)
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  useEffect(() => { if (user && user.role !== 'admin') navigate('/', { replace:true }); }, [user, navigate]);

  // Fetch today's bookings for this room
  useEffect(() => {
    if (!room) return;
    let abort = false;
    (async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const encoded = encodeURIComponent(room);
        const { data } = await axios.get(`${API_BASE}/bookings/today/${encoded}`, { headers });
        if (!abort && Array.isArray(data)) setBookings(data);
      } catch (e) {
        // ignore
      } finally { if (!abort) setLoading(false); }
    })();
    return () => { abort = true; };
  }, [room, API_BASE]);

  // Filter bookings that cover the selected slot (status BOOKED)
  const slotBookings = useMemo(() => {
    if (!parsedSlot) return [];
    return bookings.filter(b => {
      if (!b.startTime || !b.endTime) return false;
      const s = b.startTime.slice(0,5); // HH:MM
      const e = b.endTime.slice(0,5);
      return s <= parsedSlot.start && e >= parsedSlot.end && b.status === 'BOOKED';
    });
  }, [bookings, parsedSlot]);

  const current = slotBookings[0];

  const durationHours = useMemo(() => {
    if (!current) return 0;
    const s = current.startTime?.slice(0,5); const e = current.endTime?.slice(0,5);
    if (!s || !e) return 0;
    const [sh] = s.split(':');
    const [eh] = e.split(':');
    return parseInt(eh) - parseInt(sh);
  }, [current]);

  const todayDisplay = useMemo(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,'0')} / ${String(d.getMonth()+1).padStart(2,'0')} / ${d.getFullYear()}`;
  }, []);

  async function handleCheckIn(e) {
    e.preventDefault();
    if (!current) return;
    try {
      setChecking(true);
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post(`${API_BASE}/bookings/${current.booking_id}/check-in`, {}, { headers });
      setShowSuccess(true);
      // Refresh bookings
      const encoded = encodeURIComponent(room);
      const { data } = await axios.get(`${API_BASE}/bookings/today/${encoded}`, { headers });
      if (Array.isArray(data)) setBookings(data);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setChecking(false);
    }
  }

  // Map booking to UI fields (fallback to '-')
  const ui = current ? {
    title: current.nameTitle || '-',
    firstName: current.firstname || '-',
    lastName: current.lastname || '-',
    nationalId: current.citizen_id || '-',
    email: current.email || '-',
    phone: current.phone || '-',
    date: todayDisplay,
    totalTime: durationHours,
    startTime: current.startTime?.slice(0,5) || '-',
    endTime: current.endTime?.slice(0,5) || '-',
    price: current.totalPrice || (current.hour_price && durationHours ? current.hour_price * durationHours : null)
  } : null;

  return (
    <div className="page-container">
      {showSuccess && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" />
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg w-[320px] h-[200px] z-50 flex flex-col items-center justify-center animate-fade-in">
            <img src={successIcon} alt="success" className="h-30 w-30 mb-4" />
            <h2 className="text-xl font-bold text-darkBrown-500 text-center">Check-in successful</h2>
          </div>
        </>
      )}

      <section className="relative min-h-screen flex flex-1 items-center justify-center font-sans" style={{ backgroundColor: "#F6F3ED" }}>
        <div className="absolute left-6 top-6 cursor-pointer" onClick={() => navigate(-1)}>
          <ArrowLeft size={48} color="#86422A" />
        </div>
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-darkBrown-500 !mb-10 !-mt-30 text-center">{room}</h1>

          {loading && (
            <div className="text-center text-[#86422A] font-sans text-base font-semibold">Loading...</div>
          )}
          {!loading && !current && (
            <div className="text-center text-[#86422A] font-sans text-base font-semibold ">No BOOKED record for this slot.</div>
          )}

          {!loading && ui && (
            <div className="card w-[450px] mx-auto !p-8 space-y-1">
              {/* Title / First / Last */}
              <div className="flex items-center gap-10 p-4 !pb-4 border-b border-cream-300">
                <MoreHorizontal size={30} color="#C3A15E" className="mr-3" />
                <div className="flex gap-12 flex-1">
                  <div>
                    <div className="text-sm text-brown-600 mb-1">Title</div>
                    <div className="text-darkBrown-500 text-sm">{ui.title}</div>
                  </div>
                  <div>
                    <div className="text-sm text-brown-600 mb-1">First Name</div>
                    <div className="text-darkBrown-500 text-sm">{ui.firstName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-brown-600 mb-1">Last Name</div>
                    <div className="text-darkBrown-500 text-sm">{ui.lastName}</div>
                  </div>
                </div>
              </div>
              {/* National ID */}
              <div className="flex items-center gap-10 p-4 !pb-4 border-b border-cream-300">
                <CreditCard size={30} color="#C3A15E" className="mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-brown-600 mb-1">National ID</div>
                  <div className="text-darkBrown-500 text-sm">{ui.nationalId}</div>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-center gap-10 p-4 !pb-4 border-b border-cream-300">
                <Mail size={30} color="#C3A15E" className="mr-3" />
                <div className="flex-1">
                  <div className="text-sm text-brown-600 mb-1">Email</div>
                  <div className="text-darkBrown-500 text-sm">{ui.email}</div>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-center gap-10 p-4 !pb-4 border-cream-300">
                <Phone size={30} color="#C3A15E" className="mr-3 rotate-270" />
                <div className="flex-1">
                  <div className="text-sm text-brown-600 mb-1">Phone</div>
                  <div className="text-darkBrown-500 text-sm">{ui.phone}</div>
                </div>
              </div>
              {/* Date & Time */}
              <div className="flex gap-6 p-4 !pb-2">
                <div className="flex-1 !pb-2 !mb border-b border-cream-300">
                  <div className="text-sm !pb-2 text-brown-600 mb-1">Date</div>
                  <div className="text-darkBrown-500 text-sm">{ui.date}</div>
                </div>
                <div className="flex-1 pb-4 border-b border-cream-300 text-right">
                  <div className="text-sm !pb-2 text-brown-600 mb-1 text-left">Total Time</div>
                  <div className="text-darkBrown-500 text-sm text-left">{ui.totalTime}</div>
                </div>
              </div>
              <div className="flex gap-4 p-4 mb-6 !pb-2">
                <div className="flex-1 !pb-2 border-b border-cream-300">
                  <div className="text-sm !pb-2 text-brown-600 mb-1">Start Time</div>
                  <div className="text-darkBrown-500 text-sm">{ui.startTime}</div>
                </div>
                <div className="flex-1 !pb-2 border-b border-cream-300 text-right">
                  <div className="text-sm !pb-2 text-brown-600 mb-1 text-left">End Time</div>
                  <div className="text-darkBrown-500 text-sm text-left">{ui.endTime}</div>
                </div>
              </div>
              {/* Price */}
              <div className="text-center mb-2">
                <div className="text-lg font-semibold font-sans">
                  <span className="text-darkBrown-600">Price </span>
                  <span className="text-darkBrown-500">{ui.price !== null ? `${ui.price} THB` : '—'}</span>
                </div>
              </div>
              {/* Button */}
              <div className="flex justify-center">
                {current.status === 'BOOKED' ? (
                  <button onClick={handleCheckIn} disabled={checking} className="btn-primary !w-40 disabled:bg-gray-300 disabled:text-gray-600">
                    {checking ? 'Checking...' : 'Check in'}
                  </button>
                ) : (
                  <span className="text-green-700 font-medium">{current.status}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CheckIn;
