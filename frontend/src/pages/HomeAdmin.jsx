import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ChartLine, BookOpen, MapPin } from "lucide-react";
import logo from "../assets/Coffee.svg";

const HomeAdmin = () => {
  const isAuthenticated = false; // ตั้งค่า default ไปก่อน

  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-100/90 to-brown-100/90"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <img src={logo} alt="Logo" className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-darkBrown-500 mb-6 text-shadow">
              Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Please select a system menu on this page <br />
              to continue with the operation
            </p>

            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 max-w-3xl mx-auto">
              {!isAuthenticated ? (
                <>
                  {/* Quick Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    <Link
                      to={isAuthenticated ? "/booking" : "/register"}
                      className="card flex-1 min-w-[200px] max-w-[250px] p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <Calendar className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">
                        Room Booking
                      </h3>
                      <p className="text-brown-600 text-sm">
                        Reserve your perfect study space
                      </p>
                    </Link>

                    <Link
                      to="/bookingdashbord"
                      className="card flex-1 min-w-[200px] max-w-[250px] p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <ChartLine className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className=" text-lg font-semibold text-darkBrown-500 mb-2">
                        Room Booking Dashboard
                      </h3>
                      <p className="text-brown-600 text-sm">
                        Dashboard shows booked rooms, today’s reservations, and usage statistics
                      </p>
                    </Link>

                    <Link
                      to="/lending"
                      className="card flex-1 min-w-[200px] max-w-[250px] p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <BookOpen className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">
                        Book Lending
                      </h3>
                      <p className="text-brown-600 text-sm">
                        Manage and monitor book lending records
                      </p>
                    </Link>

                    <Link
                      to="/analytics"
                      className="card flex-1 min-w-[200px] max-w-[250px] p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    >
                      <ChartLine className="h-8 w-8 text-brown-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-darkBrown-500 mb-2">
                        Book Borrowing Dashboard
                      </h3>
                      <p className="text-brown-600 text-sm">
                        Dashboard shows <br />borrowed books and usage statistics
                      </p>
                    </Link>
                  </div>
                </>
              ) : (
                <Link to="/booking" className="btn-primary text-lg px-7 py-4">
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

export default HomeAdmin;
