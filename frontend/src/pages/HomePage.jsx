  import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Users, Clock, MapPin } from 'lucide-react';
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
            <img src={logo} alt="Logo" className="h-16 w-16 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
            <h1 className="text-4xl md:text-6xl font-display font-bold text-darkBrown-500 mb-6 text-shadow">
              Welcome to Book Café
            </h1>
            <p className="text-xl md:text-2xl text-brown-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Where literature meets comfort. Discover your next great read while enjoying our cozy atmosphere and premium study spaces.
            </p>
            
            {/* Primary CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    Become a Member
                  </Link>
                  <Link to="/login" className="btn-outline text-lg px-8 py-4">
                    Member Login
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
