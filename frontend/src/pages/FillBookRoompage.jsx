import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Clock, Calendar } from 'lucide-react';
import p6Room from '../assets/6p_room.png';
import p10Room from '../assets/10p_room.jpg';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://book-cafe-project.vercel.app';

function todayDateStrDisplay() {
  return new Date().toLocaleDateString('en-GB');
}
function todayDateISO() { return new Date().toISOString().slice(0,10); }

// Generate hourly times between inclusive start and exclusive end
function genHours(start='08:00', end='18:00') {
  const out=[]; let h=parseInt(start.split(':')[0],10); const endH=parseInt(end.split(':')[0],10); for(;h<endH;h++){ out.push(String(h).padStart(2,'0')+':00'); }
  return out;
}
const HOURS_STARTS = genHours(); // 08:00..17:00 as potential starts
const HOURS_ENDS = genHours('09:00','19:00'); // 09:00..18:00 as potential ends

function overlaps(aStart,aEnd,bStart,bEnd){ return aStart < bEnd && bStart < aEnd; }
function hmToNum(hm){ return parseInt(hm.split(':')[0],10); }

const BookingConfirmPage = () => {
  // Assume room passed from previous page via sessionStorage / or fallback
  const initialRoom = sessionStorage.getItem('selectedRoom') || 'Room 1';
  const [roomId] = useState(initialRoom);
  const [bookingsToday,setBookingsToday]=useState([]);
  const [loading,setLoading]=useState(false); const [error,setError]=useState(null);

  const [startTime,setStartTime]=useState('09:00');
  const [endTime,setEndTime]=useState('12:00');
  const [showSuccessModal,setShowSuccessModal]=useState(false);
  const [submitting,setSubmitting]=useState(false);

  const roomConfig={
    'Room 1':{ image:p6Room, pricePerHour:50 },
    'Room 2':{ image:p6Room, pricePerHour:50 },
    'Room 3':{ image:p10Room, pricePerHour:50 },
    'Room 4':{ image:p10Room, pricePerHour:50 }
  };
  const currentRoom = roomConfig[roomId] || roomConfig['Room 1'];

  useEffect(()=>{ // fetch today's bookings for the room
    let cancel=false; (async()=>{
      setLoading(true); setError(null);
      try {
        const res = await axios.post(`${API_BASE}/bookings`, { room_number: roomId });
        const todayISO = todayDateISO();
        const data = Array.isArray(res.data)?res.data:[];
        const filtered = data.filter(b => (b.checkIn||'').startsWith(todayISO));
        if(!cancel) setBookingsToday(filtered);
      } catch(e){ if(!cancel) setError(e.response?.data?.message || e.message); } finally { if(!cancel) setLoading(false); }
    })(); return ()=>{cancel=true};
  },[roomId]);

  // Build disabled maps
  const disabledStart = useMemo(()=>{
    const map={};
    const nowHM = new Date().toTimeString().slice(0,5);
    HOURS_STARTS.forEach(s=>{ map[s]= false; });
    bookingsToday.forEach(b=>{
      if(!b.startTime||!b.endTime) return; const bs=b.startTime.slice(0,5); const be=b.endTime.slice(0,5);
      HOURS_STARTS.forEach(s=>{ const e = String(hmToNum(s)+1).padStart(2,'0')+':00'; if(overlaps(s,e,bs,be)) map[s]=true; });
    });
    // past hours
    HOURS_STARTS.forEach(s=>{ const e = String(hmToNum(s)+1).padStart(2,'0')+':00'; if(nowHM >= e) map[s]=true; });
    return map;
  },[bookingsToday]);

  const disabledEnd = useMemo(()=>{
    const map={};
    const nowHM = new Date().toTimeString().slice(0,5);
    HOURS_ENDS.forEach(e=>{ map[e]= false; });
    bookingsToday.forEach(b=>{
      if(!b.startTime||!b.endTime) return; const bs=b.startTime.slice(0,5); const be=b.endTime.slice(0,5);
      HOURS_ENDS.forEach(e=>{ const s = String(hmToNum(e)-1).padStart(2,'0')+':00'; if(overlaps(s,e,bs,be)) map[e]=true; });
    });
    HOURS_ENDS.forEach(e=>{ if(nowHM >= e) map[e]=true; });
    return map;
  },[bookingsToday]);

  // Adjust endTime if invalid
  useEffect(()=>{ if(hmToNum(endTime) <= hmToNum(startTime)) setEndTime(String(hmToNum(startTime)+1).padStart(2,'0')+':00'); },[startTime]);

  const hours = Math.max(0, hmToNum(endTime) - hmToNum(startTime));
  const totalPrice = hours * currentRoom.pricePerHour;

  async function handleConfirmBooking(){
    if(hours<=0) { alert('Select valid range'); return; }
    const conflict = bookingsToday.some(b=>{
      if(!b.startTime||!b.endTime) return false; const bs=b.startTime.slice(0,5); const be=b.endTime.slice(0,5); return overlaps(startTime,endTime,bs,be);
    });
    if(conflict){ alert('Time conflict'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      if(!token){ alert('Please login first'); setSubmitting(false); return; }
      await axios.post(`${API_BASE}/bookings`, {
        room_number: roomId,
        checkIn: todayDateISO(),
        checkOut: todayDateISO(),
        startTime: startTime+':00',
        endTime: endTime+':00',
        totalPrice
      }, { headers: { Authorization: `Bearer ${token}` }});
      setShowSuccessModal(true);
    } catch(e){ alert(e.response?.data?.message || e.message); }
    finally { setSubmitting(false); setTimeout(()=>setShowSuccessModal(false),3000); }
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet" />
      {showSuccessModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={()=>setShowSuccessModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-80 p-8 z-50 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            </div>
            <h2 className="text-xl font-bold text-amber-900 mb-2 font-crimson">Booking Successful!</h2>
            <p className="text-amber-700">Your room has been reserved successfully.</p>
          </div>
        </>
      )}

      <div className="min-h-screen bg-[#F6F3ED] font-inter">
        <div className="flex items-center justify-center relative">
          <button className="absolute left-6 !mt-30 !ml-10 p-2 text-amber-800 hover:text-amber-900" onClick={() => window.history.back()}>
            <ArrowLeft size={28} className="w-10 h-10 mr-5 color-[#86422A]" />
          </button>
        </div>
        <div className="text-center mb-8 !mt-10">
          <h1 className="text-4xl !mt-30 font-bold text-[#53311C] p-7 font-crimson">Booking Room</h1>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-20 font-sans">
          <div className="bg-[#FBFBFB] rounded-3xl shadow-lg overflow-hidden p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[440px] gap-8">

              <div className="space-y-6">
                <h2 className="text-4xl font-semibold text-[#53311C]">{roomId}</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">Date</label>
                    <div className="flex items-center gap-2 p-3 border-2 border-[#E9E0D8] rounded-xl bg-gray-50">
                      <Calendar size={16} className="text-[#c5bcb4]" />
                      <span className="text-[#a69f99] font-medium">{todayDateStrDisplay()}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">Total Hours</label>
                    <div className="flex items-center gap-2 p-3 border-2 border-[#E9E0D8] rounded-xl">
                      <Clock size={16} className="text-[#c5bcb4]" />
                      <span className="text-[#a69f99] font-medium">{hours} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">Start Time</label>
                    <select value={startTime} onChange={(e)=>setStartTime(e.target.value)} className="w-full p-3 border-2 border-[#E9E0D8] rounded-xl bg-white font-medium focus:border-[#8b5a40]">
                      {HOURS_STARTS.map(t=>{
                        const disabled = disabledStart[t];
                        return <option key={t} value={t} disabled={disabled}>{t}</option>;
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#53311C] mb-2">End Time</label>
                    <select value={endTime} onChange={(e)=>setEndTime(e.target.value)} className="w-full p-3 border-2 border-[#E9E0D8] rounded-xl bg-white font-medium focus:border-[#8b5a40]">
                      {HOURS_ENDS.filter(e=>hmToNum(e)>hmToNum(startTime)).map(t=>{
                        const disabled = disabledEnd[t];
                        return <option key={t} value={t} disabled={disabled}>{t}</option>;
                      })}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center items-center text-xl space-x-3">
                  <span className="font-medium text-[#BB8F6E]">Total Price</span>
                  <span className="font-medium text-[#53311C]">{totalPrice} THB</span>
                </div>

                <button onClick={handleConfirmBooking} disabled={hours<=0||submitting} className="w-full bg-gradient-to-r from-[#86422A] to-[#86422A] hover:from-[#53311C] hover:to-[#86422A] text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all disabled:opacity-50">
                  {submitting ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>

              <div className="relative p-2 flex flex-col">
                <div className="rounded-2xl flex items-center justify-center mb-4">
                  <img src={currentRoom.image} alt={roomId} className="w-full object-cover rounded-xl" />
                </div>
                <div className="rounded-xl p-4 bg-white/60">
                  <p className="text-sm font-medium text-amber-900 leading-relaxed">Select start and end times. Disabled times are already booked or in the past today.</p>
                  <p className="text-xs mt-2 text-amber-700">Check in within 30 minutes of your start time.</p>
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