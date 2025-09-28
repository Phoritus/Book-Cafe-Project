import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import EditBook from './pages/EditBook.jsx';
import Login from './pages/Login.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import EditProfile from './pages/EditProfile.jsx';
import HomeAdmin from './pages/HomeAdmin.jsx';
import HomeCustomer from './pages/HomeCustomer.jsx';
import FillBookRoompage from './pages/FillBookRoompage.jsx';
import Upcoming from './pages/Upcoming.jsx';
import BookLending from './pages/BookLending.jsx';
import ChooseRoom from './pages/ChooseRoom.jsx';
import RoomBooking from './pages/RoomBooking.jsx';
import Roomdashboard from './pages/RoomBoard.jsx';
import BookBorrowingDashboard from './pages/BookBorrowingDashboard.jsx';
import ResetPassword from './pages/Resetpassword.jsx';
import ProfileInformation from './pages/ProfileInformation.jsx';
import ChangeEmail from './pages/ChangeEmail';
import ChangePassword from './pages/ChangePassword';
import CheckIn from './pages/CheckIn.jsx';
import Checkout from './pages/Checkout.jsx';

function RequireRole({ role, children }) {
  // ถ้าคุณมี auth store ใช้แทน localStorage
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    // ยังไม่ล็อกอิน -> ไปหน้า login
    return <Navigate to="/login" replace />;
  }
  if (role && user.role !== role) {
    // ไม่มีสิทธิ -> ไปหน้า unauthorized หรือ home
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/edit-book" element={<EditBook />} />
            <Route
              path="/edit-profile"
              element={
                <RequireRole role="user">
                  <EditProfile />
                </RequireRole>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/register" element={<RegisterPage />} />
              {/* Public routes that don't require authentication */}
            <Route path="/choose-room" element={<ChooseRoom />} />
            <Route path="/fill-book-room" element={<FillBookRoompage />} />
            <Route path="/upcoming" element={<Upcoming />} />
            {/* Strict admin feature routes */}
            <Route
              path="/roombooking"
              element={
                <RequireRole role="admin">
                  <RoomBooking />
                </RequireRole>
              }
            />
            <Route
              path="/roombookingdashboard"
              element={
                <RequireRole role="admin">
                  <Roomdashboard />
                </RequireRole>
              }
            />
            <Route
              path="/check-in"
              element={
                <RequireRole role="admin">
                  <CheckIn />
                </RequireRole>
              }
            />
            <Route
              path="/checkout"
              element={
                <RequireRole role="admin">
                  <Checkout />
                </RequireRole>
              }
            />
            <Route
              path="/bookborrowingdashboard"
              element={
                <RequireRole role="admin">
                  <BookBorrowingDashboard />
                </RequireRole>
              }
            />
              
            {/* Role-based homes */}
            <Route
              path="/admin"
              element={
                <RequireRole role="admin">
                  <HomeAdmin />
                </RequireRole>
              }
            />
            <Route
              path="/customer"
              element={
                <RequireRole role="user">
                  <HomeCustomer />
                </RequireRole>
              }
            />
            <Route
              path="/lending"
              element={
                <RequireRole role="admin">
                  <BookLending />
                </RequireRole>
              }
            />
            <Route
              path="/customer/profile"
              element={
                <RequireRole role="user">
                  <ProfileInformation />
                </RequireRole>
              }
            />
            <Route
              path="/customer/profile/edit"
              element={
                <RequireRole role="user">
                  <EditProfile />
                </RequireRole>
              }
            />
            <Route
              path="/customer/profile/change-email"
              element={
                <RequireRole role="user">
                  <ChangeEmail />
                </RequireRole>
              }
            />
            <Route
              path="/customer/profile/change-password"
              element={
                <RequireRole role="user">
                  <ChangePassword />
                </RequireRole>
              }
            />
            {/* optional redirect from /profile */}
            <Route path="/profile" element={<Navigate to="/customer/profile" replace />} />

            {/* ถ้าเข้า path ที่ไม่เจอ -> redirect ไปหน้า HomePage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
