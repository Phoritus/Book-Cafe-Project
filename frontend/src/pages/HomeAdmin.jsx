import React from 'react';
import { Link } from 'react-router-dom';
import {Calendar,ChartLine,BookOpen } from 'lucide-react';
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
            <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-darkBrown-500 mb-6 text-shadow">
              Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Please select a system menu on this page <br/>to continue with the operation
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                
                  {/*Room Booking*/}
                  <Link to="/roombooking" className="block rounded-2xl shadow-md p-6 bg-white btn-primary text-center hover:shadow-lg transition px-2">
                   <Calendar className="h-8 w-8 mx-auto text-brown-500 mb-1 "/>
                    <h4 className="text-sm font-semibold text-brown-800 mb-1">
                        Room Booking 
                    </h4>
                    <p className="text-[12px] text-brown-600 max-w-s mx-auto leading-relaxed px-2">
                        View and verify customer café room reservations
                    </p>
                  </Link>
                   
                   {/*Dashboard */}
                  <Link to="/bookingdashbord" className="block rounded-2xl shadow-md p-6 bg-white btn-primary text-center hover:shadow-lg transition px-2">
                   <ChartLine className="h-8 w-8 mx-auto text-brown-500 mb-1 "/>
                    <h4 className="text-sm font-semibold text-brown-800 mb-1">
                        Room Booking Dashboard
                    </h4>
                    <p className="text-[12px] text-brown-600 max-w-s mx-auto leading-relaxed px-2">
                        Dashboard shows booked rooms, today’s reservations, and usage statistics
                    </p>
                  </Link>
                  
                  {/*Lending*/}
                  <Link to="/lending" className="block rounded-2xl shadow-md p-6 bg-white btn-primary text-center hover:shadow-lg transition px-2">
                    <BookOpen className="h-8 w-8 mx-auto text-brown-500 mb-1 "/>
                    <h3 className="text-sm font-semibold text-brown-800 mb-1">
                        Book Lending
                    </h3>
                    <p className="text-sm text-brown-600 max-w-s mx-auto leading-relaxed px-2">
                        Manage and monitor book lending records
                    </p>
                  </Link>
                  
                  {/*Borrowing Dashboard*/}
                  <Link to="/borrowdashbord" className="block rounded-2xl shadow-md p-6 bg-white  btn-primary text-center hover:shadow-lg transition px-2">
                   <ChartLine className="h-8 w-8 mx-auto text-brown-500 mb-1 "/>
                    <h4 className="text-sm font-semibold text-brown-800 mb-1 whitespace-nowrap">
                        Book Borrowing Dashboard
                    </h4>
                    <p className="text-[13px] text-brown-600 max-w-s mx-auto leading-relaxed px-2">
                         Dashboard shows <br />borrowed books and usage statistics
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
      </section>
    </div>
  );
};

export default HomeAdmin;
