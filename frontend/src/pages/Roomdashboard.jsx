import React, { useState, useEffect } from "react";
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

      // เปลี่ยน URL ตาม backend ฝาก backend ใส่ให้หน่อยนะครับ
      const resDaily = await fetch("http://localhost:4000/api/daily");
      const daily = await resDaily.json();
      setDailyData(daily);
      // เปลี่ยน URL ตาม backend ฝาก backend ใส่ให้หน่อยนะครับ
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
  fetchData(); // โหลดครั้งเดียวตอนเข้าเพจ
}, []);


  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col">
      {/* Content */}
      <main className="flex-1 px-8 py-6">
        {/* Back Arrow */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#7B3F00] mb-4"
        >
        
           <ArrowLeft className="w-10 h-10 mr-5 -translate-y-[15px]" />
        </button>

        {/* Title + Description */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-[#5C2C0C] mb-2">
            Room Booking Dashboard
          </h1>
          <p className="text-[#7B3F00] text-base">
            Dashboard shows borrowed books and usage statistics
          </p>
        </div>

        {loading ? (
          <p className="text-center text-[#7B3F00]">⏳ Loading data...</p>
        ) : (
          <>
            {/* Daily Booking */}
            <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-4xl mx-auto w-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#7B3F00]">Daily Booking</h2>
                <span className="text-sm">
                  Filter: <b>Today</b>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#86422A"
                    radius={[6, 6, 0, 0]}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Most booked room */}
            <div className="bg-white rounded-xl shadow p-4 max-w-4xl mx-auto w-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold text-[#7B3F00]">
                  Most booked room
                </h2>
                <span className="text-sm">
                  Filter: <b>This month</b>
                </span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="bookings"
                    fill="#86422A"
                    radius={[6, 6, 0, 0]}
                    barSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#5C2C0C] text-white text-sm px-8 py-6 flex justify-between mt-8">
        <div>
          <p className="font-bold">Book Café</p>
          <p>Where literature meets comfort</p>
          <p className="text-xs mt-2">© 2025 Book Café. All rights reserved.</p>
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
