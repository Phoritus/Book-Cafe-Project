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

  // ฟังก์ชันสำหรับเช็คว่า path ปัจจุบันตรงกับ link หรือไม่ (exact)
  const isActivePath = (path) => location.pathname === path;

  // consider profile and its sub-routes as "active"
  const isProfileActive = () =>
    role === 'user' && (
      location.pathname === '/profile' ||
      location.pathname.startsWith('/customer/profile')
    );

  const canViewProfile = isAuthenticated && role === 'user';

  // กลุ่มเส้นทาง (Room / Book) เพื่อให้ highlight เมื่ออยู่ในหน้าใดๆ ของหมวดนั้น
  const roomPaths = [
    '/choose-room',
    '/roombooking',
    '/roombookingdashboard',
    '/fill-book-room',
    '/upcoming'
  ];
  const bookPaths = [
    '/lending',
    '/bookborrowingdashboard'
  ];

  const isRoomGroupActive = () =>
    roomPaths.some(p => location.pathname.startsWith(p));
  const isBookGroupActive = () => bookPaths.some(p => location.pathname.startsWith(p));

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
      location.pathname === "/customer" ||
      location.pathname === "/profile"
    );
  };

  // สไตล์สำหรับ active state
  const getNavLinkClass = (path, baseClass = "", group = null) => {
    let active = false;
    if (path === 'home') active = isHomeActive();
    else if (path === '/customer/profile') active = isProfileActive();
    else if (group === 'room') active = isRoomGroupActive();
    else if (group === 'book') active = isBookGroupActive();
    else active = isActivePath(path);
    return `${baseClass} ${active
      ? 'bg-brown-500 text-white px-4 py-2 rounded-md hover:bg-brown-600'
      : 'text-brown-600 hover:text-brown-700 px-4 py-2 rounded-md hover:bg-brown-50'}`;
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
            to="/choose-room"
            className={getNavLinkClass("/choose-room", "flex items-center gap-1", "room")}
          >
            <BookOpen className="h-4 w-4" /> Room
          </Link>
          {/* แสดง Book Room เฉพาะ admin เท่านั้น */}
          {isAuthenticated && role === "admin" && (
            <Link
              to="/lending"
              className={getNavLinkClass("/lending", "flex items-center gap-1", 'book')}
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
            <div className="flex items-center gap-6">
              {canViewProfile ? (
                <Link
                  to="/customer/profile"
                  className={getNavLinkClass("/customer/profile", "flex items-center gap-2")}
                  title={user?.email || ""}
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate text-[15px]" title={user?.email || ''}>{user?.email || ''}</span>
                </Link>
              ) : (
                <div
                  className="flex items-center gap-2 px-4 py-2 text-brown-500/70 bg-brown-100/30 rounded-md cursor-not-allowed select-none"
                  title="Admin ไม่มีหน้าโปรไฟล์"
                >
                  <User className="h-4 w-4 shrink-0" />
                  <span className="truncate text-[15px]">{user?.email || ''}</span>
                </div>
              )}
              {/* Icon + text logout */}
              <div
                role="button"
                tabIndex={0}
                aria-label="Logout"
                onClick={handleLogout}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLogout(); } }}
                className="flex items-center gap-1 text-sm text-darkBrown-500 hover:text-brown-700 cursor-pointer transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Log out</span>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <div className="md:hidden absolute right-4 top-3 ">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
              className="p-2 text-brown-600 inline-flex items-center justify-center w-auto !shadow-none !rounded-none focus:outline-none"
              style={{ background: "transparent", border: 0, boxShadow: "none", outline: "none", width: "auto" }}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="!h-6 w-6" />}
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
            to="/choose-room"
            className={`block mx-2 ${
              isRoomGroupActive()
                ? 'bg-brown-500 text-white px-4 py-2 rounded-md'
                : 'text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md'
            }`}
            onClick={closeMobileMenu}
          >
            Room
          </Link>
          {/* แสดง Book Room ใน mobile menu เฉพาะ admin เท่านั้น */}
          {isAuthenticated && role === 'admin' && (
            <Link
              to="/lending"
              className={`block mx-2 ${
                isBookGroupActive()
                  ? 'bg-brown-500 text-white px-4 py-2 rounded-md'
                  : 'text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md'
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
            <>
              {/* User Info in Mobile */}
              {canViewProfile ? (
                <Link
                  to="/customer/profile"
                  className={`block mx-2 ${isProfileActive() ? "bg-brown-500 text-white px-4 py-2 rounded-md" : "text-brown-600 hover:bg-brown-50 px-4 py-2 rounded-md"}`}
                  onClick={closeMobileMenu}
                >
                  <div className="flex items-center gap-2 px-4 py-2">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email || ""}</span>
                  </div>
                </Link>
              ) : (
                <div
                  className="block mx-2 bg-brown-100/40 text-brown-500/70 px-4 py-2 rounded-md cursor-not-allowed select-none"
                  title="Admin ไม่มีหน้าโปรไฟล์"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="truncate">{user?.email || ""}</span>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                className="block w-full text-left px-4 py-2 text-brown-600 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;