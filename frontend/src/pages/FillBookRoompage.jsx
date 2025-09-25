import React, { useState } from 'react';
import ArrowBack from "../assets/ArrowBack.svg";
import roomImage from "../assets/10p_room.jpg";
import arrow from "../assets/Arrowcategory.svg";
import Success from "../assets/Success.svg";

const FillBookRoompage = () => {
  
  const money = 150;
  const [isOpenStart, setIsOpenStart] = useState(false);
  const [isOpenEnd, setIsOpenEnd] = useState(false);
  const timeStart =["09:00","10:00","11:00"]
  const timeEnd =["10:00","11:00","12:00"]
  const [timeSelectedStart, setTimeSelectedStart] = useState(timeStart[0]);
  const [timeSelectedEnd, setTimeSelectedEnd] = useState(timeEnd[2]);
  const [showModal, setShowModal] = useState(false);
  const [Task,setTask] = useState({});
  const hour = parseInt(timeSelectedEnd.split(":")[0], 10)-parseInt(timeSelectedStart.split(":")[0], 10);
  function handleConfirmBooking() {
    if (hour <= 0) {}
    else{
    try{
    setTask({date: "11/09/2025", timeStart: timeSelectedStart, timeEnd: timeSelectedEnd, room: "Room 4", price: money,hour: hour});
    setShowModal(true);
    }
  
    catch(err){
      console.error("Error setting task");
      setShowModal(false);
    }
  }
}

  return (
    <>
    {showModal && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setShowModal(false)}></div>
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg w-[320px] h-[200px] z-50 flex flex-col items-center justify-center animate-fade-in">
            <img src={Success} alt="success" className="h-30 w-30 mb-4" />
            <h2 className="text-xl font-bold text-darkBrown-500 text-center">
             Successful
            </h2>
          </div>
        </>
      )}
      <header className="header flex items-center gap-4 mb-6 relative">
        <button className="back-button" style={{ position: 'absolute', left: 0, top: 0 }} onClick={() => window.history.back()}>
          <img src={ArrowBack} alt="Back" style={{ width: 50, height: 50 }} />
        </button>
        <div className="header-content flex-1">
          <h1 className="title text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B4513] text-center font-crimson mb-1">Booking Room</h1>
        </div>
      </header>
      <div className="Fill-book-room-container text-[#53311C] w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 font-Inter">
        <div className="flex flex-row  gap-6">
          {/* Left Side (A) */}
          <div id="A" className="flex-1">
            <h1 className="room-name text-base text-sm text-[#53311C] mb-4" style={{ fontSize: '30px' }}>Room 4</h1>
            <div className=" grid grid-cols-2 mb-6 text-sm ">
              <div className="mb-2" >
                <label>Date</label>
                <input
                  type="text"
                  placeholder="11/09/2025"
                  disabled
                  style={{ color: '#E9E0D8',width: '80%', padding: '0.25rem '   }} className="block mb-2 border px-10 py-1 rounded"
                />
              </div>
              <div>
                <label>Total Time</label>
                <input type="text"  placeholder={hour}
                  disabled="true" 
                  style={{ color: '#E9E0D8',width: '80%', padding: '0.25rem '  }} className="block mb-2 border px-10 py-1 rounded"
                  />
              </div>
              <div className="relative">
                <label>Select Start Time</label>
                <select style={{ borderColor: '#B37E32',width: '80%',padding: '0.25rem ',color:'#53311C' }} className="block mb-2 border px-10 py-1 rounded focus:border-[#8b5a40] focus:shadow-[0_0_0_3px_rgba(139,90,64,0.1)] focus:bg-white"
                onChange={e => setTimeSelectedStart(e.target.value)}
                        onFocus={() => setIsOpenStart(true)}
                        onBlur={() => setIsOpenStart(false)}>
                  {timeStart.map((time)=>(<option key={time} value={time} style={{ color: '#53311C' }}>{time}</option>))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-[5%] -translate-x-[3%] text-yellow-700 ">
                  <img
                    src={arrow}
                    alt="arrow"
                    className={`h-4 w-4.5 transition-transform duration-200 ${isOpenStart ? "-rotate-90" : "rotate-0"}`}
                  />
                </span>
              </div>
              <div className="relative">
                <label>Select End Time</label>
                <select style={{ borderColor: '#B37E32',width: '80%',padding: '0.25rem ',color:'#53311C' }} className="block mb-2 border px-10 py-1 rounded focus:border-[#8b5a40] focus:shadow-[0_0_0_3px_rgba(139,90,64,0.1)] focus:bg-white"
                onChange={e => setTimeSelectedEnd(e.target.value)}
                        onFocus={() => setIsOpenEnd(true)}
                        onBlur={() => setIsOpenEnd(false)}>
                  {timeEnd.map((time)=>(<option key={time} value={time} style={{ color: '#53311C' }}>{time}</option>))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-[5%] -translate-x-[4%] text-yellow-700 ">
                  <img
                    src={arrow}
                    alt="arrow"
                    className={`h-4 w-4 transition-transform duration-200 ${isOpenEnd ? "-rotate-90" : "rotate-0"}`}
                  />
                </span>
              </div>
            </div>
            <div className="mb-2 text-center"><h1 className="text-base text-lg font-bold inline " style={{color:'#BB8F6E'}}>Total Price</h1> <h1 className="text-lg font-bold inline " style={{color:'#3C2415'}}></h1>{money} THB</div>
            <button className="w-full bg-brown-500 text-white py-2 px-4 rounded hover:bg-brown-600 transition duration-300 mt-2" onClick={() => handleConfirmBooking()}>Confirm Booking</button>
          </div>
          {/* Right Side (B) */}
          <div id="B" className="flex flex-1 flex-col items-center justify-center">
            <img src={roomImage} alt="Room" style={{ width: 'auto', height: '70%' }} className="rounded-lg" />
            <div className="mt-6 text-center text-sm text-[#53311C]">
              <p className="font-bold inline">&middot;</p> Check in within 30 minutes of your booking start, or your reservation will be cancelled.
            </div>
          </div>
        </div>
      </div>
      
    </>
  );



}



export default FillBookRoompage;