import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {Coffee,LogOut,User,BookOpen,Calendar,Menu,X,CoffeeIcon,HomeIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import logo from "../assets/Coffee.svg";

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

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-cream-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-brown-600 hover:text-brown-700 transition-colors"
            onClick={closeMobileMenu}
          >
            < img src={logo} alt="Logo"className="h-8 w-8" />
            <span className="text-xl font-display font-semibold">
              Book Café
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/Home"
              className="flex items-center gap-2 text-darkBrown-500 hover:text-brown-600 transition-colors font-medium"
            >
              <HomeIcon className="h-4 w-4" />
              <span>Home</span>
            </Link>

            <Link
              to="/Room"
              className="flex items-center gap-2 text-darkBrown-500 hover:text-brown-600 transition-colors font-medium"
            >
              <BookOpen className="h-4 w-4" />
              <span>Room</span>
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-darkBrown-500 hover:text-brown-600 transition-colors font-medium"
            >
              Login
            </Link>
            <Link to="/register" className="btn-primary text-sm">
              Register
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-darkBrown-500 hover:text-brown-600 transition-colors p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-cream-300 z-40">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Navigation Links */}
              <Link
                to="/Home"
                className="flex items-center space-x-2 text-darkBrown-500 hover:text-brown-600 transition-colors font-medium py-2"
                onClick={closeMobileMenu}
              >
                <HomeIcon className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link
                to="/Room"
                className="flex items-center space-x-2 text-darkBrown-500 hover:text-brown-600 transition-colors font-medium py-2"
                onClick={closeMobileMenu}
              >
                <BookOpen className="h-4 w-4" />
                <span>Room</span>
              </Link>

              {/* Mobile Auth Links */}
              <div className="pt-4 border-t border-cream-200 space-y-3">
                <Link
                  to="/login"
                  className="block text-darkBrown-500 hover:text-brown-600 transition-colors font-medium py-2"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm inline-block"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
