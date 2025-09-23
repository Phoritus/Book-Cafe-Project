import React, { useState } from "react";
import { Mail, Phone, User, ArrowLeft, MoreHorizontal, CreditCard } from "lucide-react";
import successIcon from "../assets/Success.svg";
const CheckIn = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const data = {
    title: "Ms.",
    firstName: "Alice",
    lastName: "Wonderman",
    nationalId: "1-2345-67890-12-3",
    email: "demo@example.com",
    phone: "080-000-0000",
    date: "11 / 09 / 2025",
    totalTime: 3,
    startTime: "9:00",
    endTime: "12:00",
    price: 150,
  };

  const handleCheckIn = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  return (
    <div className="page-container">
      {showSuccess && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40"></div>
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg w-[320px] h-[200px] z-50 flex flex-col items-center justify-center animate-fade-in">
            <img src={successIcon} alt="success" className="h-30 w-30 mb-4" />
            <h2 className="text-xl font-bold text-darkBrown-500 text-center">
              Check-in successful
            </h2>
          </div>
        </>
      )}

      <section className="relative min-h-screen flex flex-1 items-center justify-center">
        <div
          className="absolute left-6 top-6 cursor-pointer left-30"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={48} color="#86422A" />
        </div>
        <div className="flex flex-col items-center">
  
          <h1 className="text-4xl font-bold text-darkBrown-500 mb-4 text-center">
            Room 4
          </h1>
          {/* Main card */}

          <div className="card w-[450px] mx-auto p-4 space-y-2 ">
            {/* Title */}

            {/* Title / First / Last */}
            <div className="flex items-center gap-10 p-4 mb-20 pb-4 border-b border-cream-300">
              <MoreHorizontal size={0} color="#C3A15E" className="mr-3" />
              <div className="flex gap-12 flex-1">
                <div>
                  <div className="text-sm text-brown-600 mb-1">Title</div>
                  <div className="text-darkBrown-500 text-sm">{data.title}</div>
                </div>
                <div>
                  <div className="text-sm text-brown-600 mb-1">First Name</div>
                  <div className="text-darkBrown-500 text-sm">{data.firstName}</div>
                </div>
                <div>
                  <div className="text-sm text-brown-600 mb-1">Last Name</div>
                  <div className="text-darkBrown-500 text-sm">{data.lastName}</div>
                </div>
              </div>
            </div>

            {/* National ID */}
            <div className="flex items-center gap-10 p-4 mb-4 pb-4 border-b border-cream-300">
              <CreditCard size={30} color="#C3A15E" className="mr-3" />
              <div className="flex-1">
                <div className="text-sm text-brown-600 mb-1">National ID</div>
                <div className="text-darkBrown-500 text-sm">{data.nationalId}</div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center p-4 gap-10 mb-4 pb-4 border-b border-cream-300">
              <Mail size={30} color="#C3A15E" className="mr-3" />
              <div className="flex-1">
                <div className="text-sm text-brown-600 mb-1">Email</div>
                <div className="text-darkBrown-500 text-sm">{data.email}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center p-4 gap-10 mb-5 pb-4 border-b border-cream-300">
              <Phone size={30} color="#C3A15E"  className="mr-3 rotate-270" />
              <div className="flex-1">
                <div className="text-sm text-brown-600 mb-1">Phone</div>
                <div className="text-darkBrown-500 text-sm">{data.phone}</div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="flex gap-6 p-4 mb-4">
              <div className="flex-1 pb-4 border-b border-cream-300">
                <div className="text-sm text-brown-600 mb-1">Date</div>
                <div className="text-darkBrown-500 text-sm">{data.date}</div>
              </div>
              <div className="flex-1 pb-4 border-b border-cream-300 text-right">
                <div className="text-sm text-brown-600 mb-1 text-left">Total Time</div>
                <div className="text-darkBrown-500 text-sm text-left">{data.totalTime}</div>
              </div>
            </div>

            <div className="flex gap-6 p-4 mb-6">
              <div className="flex-1 pb-4 border-b border-cream-300">
                <div className="text-sm text-brown-600 mb-1">Start Time</div>
                <div className="text-darkBrown-500 text-sm">{data.startTime}</div>
              </div>
              <div className="flex-1 pb-4 border-b border-cream-300 text-right">
                <div className="text-sm text-brown-600 mb-1 text-left">End Time</div>
                <div className="text-darkBrown-500 text-sm text-left">{data.endTime}</div>
              </div>
            </div>

            {/* Price */}
            <div className="text-center mb-2">
              <div className="text-sm text-brown-600 mb-2">Price</div>
              <div className="text-lg font-semibold text-darkBrown-500">
                {data.price} THB
              </div>
            </div>

            {/* Button */}
            <button onClick={handleCheckIn} className="btn-primary w-full">
              Check in
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckIn;
