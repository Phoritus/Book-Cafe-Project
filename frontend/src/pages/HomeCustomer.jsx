import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import logo from "../assets/Coffee.svg";

const HomePage = () => {
  const isAuthenticated = false; // ตั้งค่า default ไปก่อน

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100/90 to-brown-100/90"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <img
              src={logo}
              alt="Logo"
              className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle"
            />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-darkBrown-500 mb-6 text-shadow">
              Welcome to Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Book a private room at our Book Café to enjoy a warm, peaceful, <br />
              and exclusive reading environment. Begin your reservation now.
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  {/* Room Booking */}
                  <Link
                    to="/roombooking"
                    className="block rounded-2xl shadow-md p-6 bg-white text-center hover:shadow-lg transition px-2"
                  >
                    <Calendar className="h-8 w-8 mx-auto text-brown-500 mb-1" />
                    <h3 className="text-sm font-semibold text-brown-800 mb-1">
                      Room Booking
                    </h3>
                    <p className="text-sm text-brown-600 max-w-s mx-auto leading-relaxed px-2">
                      Reserve your perfect study space
                    </p>
                  </Link>

                  {/* Upcoming Booking */}
                  <Link
                    to="/upcomingbooking"
                    className="block rounded-2xl shadow-md p-6 bg-white text-center hover:shadow-lg transition px-2"
                  >
                    <Clock className="h-8 w-8 mx-auto text-brown-500 mb-1" />
                    <h3 className="text-sm font-semibold text-brown-800 mb-1">
                      Upcoming Booking
                    </h3>
                    <p className="text-sm text-brown-600 max-w-s mx-auto leading-relaxed px-2">
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

export default HomePage;
