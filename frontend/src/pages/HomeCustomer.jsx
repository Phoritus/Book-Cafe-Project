import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import logo from "../assets/Coffee.svg";

const HomeCustomer = () => {
  const isAuthenticated = false; // ตั้งค่า default ไปก่อน

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-[#F6F3ED]"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <img
              src={logo}
              alt="Logo"
              className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle"
            />
            <h1 className="text-4xl md:text-6xl font-crimson font-bold text-darkBrown-500 mb-6 text-shadow">
              Welcome to Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a private room at our Book Café to enjoy a warm, peaceful, <br />
              and exclusive reading environment. Begin your reservation now.
            </p>

            {/* Primary CTA Buttons */}
            <div className="font-sans flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  {/* Room Booking */}
                  <Link
                    to="/choose-room"
                    className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <Calendar className="h-8 w-8 mx-auto text-brown-500 mb-4" />
                    <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                      Room Booking
                    </h3>
                    <p className="text-brown-600 text-[12.5px] leading-snug">
                      Reserve your perfect study space
                    </p>
                  </Link>


                  {/* Upcoming Booking */}
                  <Link
                    to="/upcoming"
                    className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  >
                    <Clock className="h-8 w-8 mx-auto text-brown-500 mb-4" />
                    <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                      Upcoming Booking
                    </h3>
                    <p className="text-brown-600 text-[12.5px] leading-snug">
                      Reserve your perfect study space
                    </p>
                  </Link>
                </>
              ) : (
                <Link to="/booking" className="btn-primary text-lg px-8 py-4">
                  Book a Room Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeCustomer;
