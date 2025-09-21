import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Coffee, LogOut, User, BookOpen, Calendar, Menu, X, CoffeeIcon, HomeIcon } from "lucide-react";
import toast from "react-hot-toast";
import logo from '../assets/Coffee.svg';


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md border-b border-cream-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-brown-600 hover:text-brown-700 transition-colors"
          >
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-display font-semibold">Book Café</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/Home"
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-1"
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              to="/Room"
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium flex items-center space-x-1"
            >
              <BookOpen className="h-4 w-4" />
              <span>Room</span>
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
              <>
                <Link
                  to="/login"
                  className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Register
                </Link>
              </>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
