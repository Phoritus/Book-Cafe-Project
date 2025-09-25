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

function RequireRole({ role, children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
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
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterPage />} />
              {/* Public routes that don't require authentication */}
            <Route path="/choose-room" element={<ChooseRoom />} />
            <Route path="/fill-book-room" element={<FillBookRoompage />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/room-booking" element={<RoomBooking />} />
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
