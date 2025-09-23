import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ฟังก์ชันดึงข้อมูลจาก API
  const fetchData = async () => {
    try {
      setLoading(true);

      // เปลี่ยน URL ตาม backend ของเจ้า
      const resDaily = await fetch("http://localhost:4000/api/daily");
      const daily = await resDaily.json();
      setDailyData(daily);

      const resMonthly = await fetch("http://localhost:4000/api/monthly");
      const monthly = await resMonthly.json();
      setMonthlyData(monthly);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // ดึงข้อมูลครั้งแรก
    const interval = setInterval(fetchData, 5000); // ดึงซ้ำทุก 5 วิ
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brown-700">☕ Book Café</span>
        </div>
        <nav className="flex gap-6">
          <a href="#" className="text-brown-700 font-medium">Home</a>
          <a href="#" className="text-brown-700 font-medium">Room</a>
          <a href="#" className="text-brown-700 font-medium">Book</a>
        </nav>
        <div className="flex items-center gap-4 text-sm text-brown-600">
          <span>demo@example.com</span>
          <button className="hover:underline">Logout</button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-8 py-6">
        {/* Back Arrow */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-brown-700 mb-4"
        >
          <ArrowLeft className="mr-2" /> Back
        </button>

        <h1 className="text-2xl font-bold text-brown-800 mb-1">
          Room Booking Dashboard
        </h1>
        <p className="text-brown-600 mb-6">
          Dashboard shows borrowed books and usage statistics
        </p>

        {loading ? (
          <p className="text-center text-brown-600">⏳ Loading data...</p>
        ) : (
          <>
            {/* Daily Booking */}
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-brown-700">Daily Booking</h2>
                <span className="text-sm">
                  Filter: <b>Today</b>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#86422A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Most booked room */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-brown-700">Most booked room</h2>
                <span className="text-sm">
                  Filter: <b>This month</b>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#86422A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brown-800 text-white text-sm px-8 py-6 flex justify-between mt-8">
        <div>
          <p className="font-bold">Book Café</p>
          <p>Where literature meets comfort</p>
          <p className="text-xs mt-2">
            © 2025 Book Café. All rights reserved.
          </p>
        </div>
        <div>
          <p className="font-semibold">Visit Us</p>
          <p>
            📍 123 Writers' Alley, Fiction Street,
            <br /> Imaginaire District, Bangkok 10110
          </p>
          <p>🕒 08:00 - 19:00 (Daily)</p>
        </div>
        <div>
          <p className="font-semibold">Contact info</p>
          <p>📞 020 - 123 - 4567</p>
          <p>✉️ contact@bookcafe.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
