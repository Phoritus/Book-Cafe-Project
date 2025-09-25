import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HomeIcon, BookOpen, Menu, X, Book, LogOut, User } from "lucide-react";
import logo from "../assets/Coffee.svg";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // เพิ่ม useLocation เพื่อดู current path
  const { isAuthenticated, role, user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);
  const closeMobileMenu = () => setMobileOpen(false);

  // ฟังก์ชันสำหรับเช็คว่า path ปัจจุบันตรงกับ link หรือไม่
  const isActivePath = (path) => location.pathname === path;

  // ฟังก์ชันสำหรับกำหนด home path ตาม role
  const getHomePath = () => {
    if (isAuthenticated && role === "admin") {
      return "/admin";
    } else if (isAuthenticated && role === "user") {
      return "/customer";
    }
    return "/Home";
  };

  // ฟังก์ชันเช็ค active state สำหรับ Home (เช็คทั้ง /Home และ /HomeAdmin)
  const isHomeActive = () => {
    return (
      location.pathname === "/Home" ||
      location.pathname === "/admin" ||
      location.pathname === "/customer"
    );
  };

  // สไตล์สำหรับ active state
  const getNavLinkClass = (path, baseClass = "") => {
    const isActive = path === "home" ? isHomeActive() : isActivePath(path);
    return `${baseClass} ${
      isActive
        ? "bg-brown-500 text-white px-4 py-2 rounded-md hover:bg-brown-600"
        : "text-brown-600 hover:text-brown-700 px-4 py-2 rounded-md hover:bg-brown-50"
    }`;
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-2" onClick={closeMobileMenu}>
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-3xl font-crimson text-brown-600">
            Book Café
          </span>
        </div>

        {/* Desktop Links - ซ่อนใน mobile */}
        <div className="hidden md:flex items-center gap-6 mx-auto">
          <Link
            to={getHomePath()}
            className={getNavLinkClass("home", "flex items-center gap-1")}
          >
            <HomeIcon className="h-4 w-4" /> Home
          </Link>
          <Link
            to={isAuthenticated ? "/choose-room" : location.pathname}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                toast.error("Please login first");
              }
            }}
            className={getNavLinkClass("/choose-room", "flex items-center gap-1")}
          >
            <BookOpen className="h-4 w-4" /> Room
          </Link>
          {/* แสดง Book Room เฉพาะ admin เท่านั้น */}
          {isAuthenticated && role === "admin" && (
            <Link
              to="/booking"
              className={getNavLinkClass("/booking", "flex items-center gap-1")}
            >
              <Book className="h-4 w-4" /> Book
            </Link>
          )}
        </div>

        {/* Spacer for mobile - ผลัก hamburger ไปขวาสุด */}
        <div className="flex-1 md:hidden"></div>

        {/* Desktop Auth Buttons - ซ่อนใน mobile */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={getNavLinkClass("/login")}>
                Login
              </Link>
              <Link to="/register" className={getNavLinkClass("/register")}>
                Register
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {/* User Info */}
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-darkBrown-500">
                  <User className="h-4 w-4" />
                  <span>{user?.email || ""}</span>
                </div>
                <Link
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1 rounded text-darkBrown-500 hover:text-brown-700"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <div className="md:hidden absolute right-4 top-3 -translate-y-1/2">
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="p-2 text-brown-600 hover:text-brown-700 inline-flex items-center justify-center w-auto !shadow-none !rounded-none focus:outline-none"
            // ถ้าต้องการเอา override แบบ inline ใช้ style ด้วย (ไม่สามารถใช้ !important ใน style ได้เสมอ)
            style={{ background: "transparent", border: 0, boxShadow: "none", outline: "none", width: "auto" }}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-lg border-t py-2">
          <Link
            to={getHomePath()}
            className={`block mx-2 ${
              isHomeActive()
                ? "bg-brown-500 text-white px-4 py-2 rounded-md"
                : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"
            }`}
            onClick={closeMobileMenu}
          >
            Home
          </Link>
          <Link
            to={isAuthenticated ? "/choose-room" : location.pathname}
            className={`block mx-2 ${
              isActivePath("/choose-room")
                ? "bg-brown-500 text-white px-4 py-2 rounded-md"
                : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"
            }`}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                toast.error("Please login first");
              } else {
                closeMobileMenu();
              }
            }}
          >
            Room
          </Link>
          {/* แสดง Book Room ใน mobile menu เฉพาะ admin เท่านั้น */}
          {isAuthenticated && role === "admin" && (
            <Link
              to="/booking"
              className={`block mx-2 ${
                isActivePath("/booking")
                  ? "bg-brown-500 text-white px-4 py-2 rounded-md"
                  : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"
              }`}
              onClick={closeMobileMenu}
            >
              Book
            </Link>
          )}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={`block mx-2 ${
                  isActivePath("/login")
                    ? "bg-brown-500 text-white px-4 py-2 rounded-md"
                    : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"
                }`}
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`block mx-2 ${
                  isActivePath("/register")
                    ? "bg-brown-500 text-white px-4 py-2 rounded-md"
                    : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"
                }`}
                onClick={closeMobileMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <div>
              {/* User Info in Mobile */}
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm text-darkBrown-500">
                  {user?.email || ""}
                </div>
              </div>
              <Link
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="block text-left px-4 py-2 text-brown-600 hover:bg-gray-100"
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