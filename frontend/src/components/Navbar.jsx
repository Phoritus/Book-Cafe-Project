  // src/components/Navbar.jsx
  import React, { useState } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { HomeIcon, BookOpen, Menu, X,Book,LogOut,User } from "lucide-react";
  import logo from "../assets/Coffee.svg";
  import { useAuthStore } from "../store/authStore";
  import toast from "react-hot-toast";

  const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated, role, user, logout } = useAuthStore();

    const handleLogout = () => {
      logout();
      toast.success("Logged out successfully");
      navigate("/");
    };

    const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
    const closeMobileMenu = () => setMobileOpen(false);

    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            onClick={closeMobileMenu}
          >
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="text-3xl font-crimson text-brown-600">
              Book Café
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/Home" className="flex items-center gap-1">
              <HomeIcon className="h-4 w-4" /> Home
            </Link>
            <Link to="/Room" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" /> Room
            </Link>
            {/* แสดง Book Room เฉพาะ admin เท่านั้น */}
            {isAuthenticated && role === 'admin' && (
              <Link
                to="/booking" className=" flex items-center gap-1 ">
                <Book className="h-4 w-4" /> Book
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-brown-600 hover:text-brown-700">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-brown-500 text-white px-3 py-1 rounded hover:bg-brown-600"
                >
                  Register
                </Link>
              </>
              ) : (
              <div className="flex items-center gap-3">
                {/* User Info */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm  text-darkBrown-500">
                    <User className="h-4 w-4" />
                    <span>{user?.email || ''}</span>
                </div>
                <Link
                  onClick={handleLogout}
                  className=" flex items-center gap-1 px-3 py-1 rounded text-darkBrown-500">
                  <LogOut className="h-4 w-4" /> Logout
                </Link> 
              </div>
              </div>)}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu}>
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white shadow-lg border-t py-2">
            <Link
              to="/Home"
              className="block px-4 py-2"
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link
              to="/Room"
              className="block px-4 py-2"
              onClick={closeMobileMenu}
            >
              Room
            </Link>
            {/* แสดง Book Room ใน mobile menu เฉพาะ admin เท่านั้น */}
            {isAuthenticated && role === 'admin' && (
              <Link
                to="/booking"
                className="block px-4 py-2"
                onClick={closeMobileMenu}
              >
                Book
              </Link>
            )}

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2"
                  onClick={closeMobileMenu}
                >
                  Register
                </Link>
              </>
            ) : (
              <div>
                {/* User Info in Mobile */}
                <div className="px-4 py-2 border-b border-gray-100">
                  <div className="text-xm text-darkBrown-500">
                    {user?.email || ''}
                  </div>
                </div>
                <Link
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="text-left px-4 py-2"
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    );
  };

  export default Navbar;