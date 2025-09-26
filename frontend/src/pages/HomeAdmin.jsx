import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ChartLine, BookOpen } from "lucide-react";
import logo from "../assets/Coffee.svg";

const HomeAdmin = () => {
  const isAuthenticated = false; // ตั้งค่า default ไปก่อน

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br bg-[#F6F3ED]"></div>
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="animate-fade-in">
            <img
              src={logo}
              alt="Logo"
              className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle"
            />
            <h1 className="text-4xl md:text-6xl font-crimson font-bold text-darkBrown-500 mb-6 text-shadow">
              Book Café
            </h1>
            <p className="text-xl md:text-2xl font-sans text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Please select a system menu on this page <br />
              to continue with the operation
            </p>

            {/* Primary CTA Buttons */}
            {/* Four-card horizontal row */}
            <div className="w-full flex justify-center mt-12 font-sans">
              <div className="flex flex-col sm:flex-row gap-5 max-w-7xl w-full justify-center items-center">
                {!isAuthenticated ? (
                  <>
                    {/* Room Booking */}
                    <Link
                      to="/roombooking"
                      className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <Calendar className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                        Room Booking
                      </h3>
                      <p className="text-brown-600 text-[12.5px] leading-snug">
                        View and verify customer café<br /> room reservations
                      </p>
                    </Link>

                    {/* Dashboard */}
                    <Link
                      to="/roombookingdashboard"
                      className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <ChartLine className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                        Room Booking Dashboard
                      </h3>
                      <p className="text-brown-600 text-[12.5px] leading-snug ">
                        Dashboard shows booked rooms, today’s reservations, and usage statistics
                      </p>
                    </Link>

                    {/* Lending */}
                    <Link
                      to="/lending"
                      className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <BookOpen className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                        Book Lending
                      </h3>
                      <p className="text-brown-600 text-[12.5px] leading-snug">
                        Manage and monitor book lending records
                      </p>
                    </Link>

                    {/* Borrowing Dashboard */}
                    <Link
                      to="/bookborrowingdashboard"
                      className="card w-[270px] min-h-[175px] flex flex-col items-center text-center px-7 py-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                    >
                      <ChartLine className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-[15px] font-semibold text-darkBrown-500 mb-2 leading-snug tracking-tight">
                        Book Borrowing Dashboard
                      </h3>
                      <p className="text-brown-600 text-[12.5px] leading-snug ">
                        Dashboard shows borrowed books
                        <br />
                        and usage statistics
                      </p>
                    </Link>
                  </>
                ) : (
                  <Link to="/booking" className="btn-primary text-lg px-7 py-4">
                    Book a Room Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeAdmin;
