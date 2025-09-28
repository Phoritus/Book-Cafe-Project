import React, { useEffect, useState, useCallback } from 'react';
import logo from "../assets/Coffee.svg";
import QRCode from 'react-qr-code';
import axios from 'axios';

function formatDate(isoDate) {
  if (!isoDate) return '-';
  // Accept both pure date (YYYY-MM-DD) and full ISO strings.
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) {
    // Attempt manual slice if backend sends unexpected format
    const plain = String(isoDate).split('T')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(plain)) {
      const [yy, mm, dd] = plain.split('-');
      return `${dd} / ${mm} / ${yy}`;
    }
    return '-';
  }
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd} / ${mm} / ${yyyy}`;
}

function diffMinutesFromNow(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    const dt = new Date(`${dateStr}T${timeStr}`);
    return Math.round((dt - Date.now()) / 60000);
}

function Upcoming() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [within30, setWithin30] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;
  const ENDPOINT = `${API_BASE}/bookings/upcoming`;

  const fetchUpcoming = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError('');
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('You must be logged in.');
        if (isRefresh) setRefreshing(false); else setLoading(false);
        return;
      }
      const { data } = await axios.get(ENDPOINT, { headers: { Authorization: `Bearer ${token}` } });
      if (data?.booking) {
        setBooking(data.booking);
        setWithin30(!!data.meta?.within30Minutes);
      } else {
        setBooking(null);
      }
    } catch (e) {
      if (!isRefresh) setError(e?.response?.data?.message || 'Failed to load upcoming booking');
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  }, [ENDPOINT]);

  useEffect(() => {
    fetchUpcoming(false);
  }, [fetchUpcoming]);

  useEffect(() => {
    if (!autoRefresh) return;
    let intervalId;
    function start() {
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible') {
          fetchUpcoming(true);
        }
      }, 60000);
    }
    start();
    const visHandler = () => {
      if (document.visibilityState === 'visible') {
        fetchUpcoming(true);
      }
    };
    document.addEventListener('visibilitychange', visHandler);
    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', visHandler);
    };
  }, [autoRefresh, fetchUpcoming]);

  // Derived values
  const totalHours = React.useMemo(() => {
    if (!booking) return '-';
    if (booking.startTime && booking.endTime) {
        const [sh, sm] = booking.startTime.split(':').map(Number);
        const [eh, em] = booking.endTime.split(':').map(Number);
        return ((eh*60+em) - (sh*60+sm)) / 60;
    }
    // Fallback: date difference +1? Keep simple as 1
    return 1;
  }, [booking]);

  const minutesLeft = booking?.startTime ? diffMinutesFromNow(booking.checkIn, booking.startTime) : null;

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#FBF7F3] p-4" style={{ backgroundColor: '#F6F3ED' }}>
      {/* Auto-refresh toggle */}
      <div className="w-full max-w-sm flex justify-end mb-2 text-xs text-[#53311C] gap-2 items-center">
        <label className="flex items-center gap-1 cursor-pointer select-none">
          <input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
          Auto Refresh
        </label>
        {refreshing && <span className="text-[10px] text-[#B37E32] animate-pulse">Refreshing...</span>}
      </div>

      <header className="flex !mt-10 flex-col items-center gap-4 mb-6 mt-3 justify-center ">
        <img src={logo} alt="Logo" className="h-16 w-16 text-brown-500 mb-1 animate-bounce-subtle !mb-4" />
        <h1 className="title text-2xl sm:text-3xl md:text-4xl font-bold text-[#53311C] text-center font-crimson !-mb-0">Upcoming Booking</h1>
        <p className={`text-md text-center font-sans ${within30 ? 'text-red-600 animate-pulse' : 'text-[#B37E32]' }`}>
          Check in with staff within 30 minutes of your booking start,<br/> or your booking will be cancelled
        </p>
        {minutesLeft !== null && minutesLeft >= 0 && (
          <p className={`text-xs ${minutesLeft <= 30 ? 'text-red-600' : 'text-[#53311C]'}`}>Starts in {minutesLeft} minute{minutesLeft===1?'':'s'}</p>
        )}
      </header>

      {loading && <p className="text-[#53311C] mt-10">Loading...</p>}
      {!loading && error && <p className="text-red-600 mt-10 text-sm">{error}</p>}
      {!loading && !error && !booking && (
        <p className="text-[#53311C] mt-10 text-sm">No upcoming booking found.</p>
      )}
      {!loading && !error && booking && (
        <div className="bg-white rounded-2xl shadow-md p-6 mt-4 w-full max-w-sm mx-auto flex flex-col items-center font-Inter">
          <h2 className="text-3xl text-[#53311C] mb-6">Room {booking.room_number}</h2>
          <div className="grid grid-cols-2 gap-y-10 gap-x-12 mb-6 text-sm text-[#B37E32]  w-full">
            <div>
              <div className=" mb-4">Date</div>
              <div className=" pb-4 mb-4 text-[#3C2415]">{formatDate(booking.checkIn)}</div>
              <div className="pt-2 border-b border-[#B37E32]"></div>
            </div>
            <div>
              <div className=" mb-4">Total Time</div>
              <div className=" pb-4 mb-4 text-[#3C2415]">{totalHours}</div>
              <div className="pt-2 border-b border-[#B37E32]"></div>
            </div>
            <div>
              <div className=" mb-4">Start Time</div>
              <div className="pb-4 mb-4  text-[#3C2415]">{booking.startTime?.slice(0,5) || '-'}</div>
              <div className="pt-2 border-b border-[#B37E32]"></div>
            </div>
            <div>
              <div className="  mb-4">End Time</div>
              <div className=" pb-4 mb-4  text-[#3C2415]">{booking.endTime?.slice(0,5) || '-'}</div>
              <div className="pt-2 border-b border-[#B37E32]"></div>
            </div>
          </div>
          <div className="flex flex-col items-center mb-6 mt-4 ">
            <QRCode value={booking.qrCode || `booking-${booking.booking_id}`} style={{ height: 'auto', width: '45%' }} />
            <p className="text-sm text-[#53311C] mt-2 text-center max-w-xs">
              Present your QR code and ID card at check-in
            </p>
          </div>
          <div className="flex flex-col items-center w-full">
            <p className="text-lg text-[#BB8F6E] font-semibold mb-4">
              Price <span className="text-[#53311C] ">{booking.totalPrice} THB</span>
            </p>
            <button style={{ height: 'auto', width: '45%' }} className="w-full bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600 transition duration-300 mt-2" onClick={() => window.history.back()}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upcoming;
