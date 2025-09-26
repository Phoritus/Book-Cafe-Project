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

  // ✅ แยก filter ของแต่ละกราฟ
  const [dailyFilter, setDailyFilter] = useState("today");
  const [monthlyFilter, setMonthlyFilter] = useState("today");

  const fetchData = async () => {
    try {
      setLoading(true);

      // --- Daily API ---
      // Backend expects a concrete date=YYYY-MM-DD. Our filter uses 'today' or 'month'. If not a date, fallback to today.
      const todayStr = new Date().toISOString().slice(0,10);
      const dailyParam = dailyFilter === 'today' ? todayStr : todayStr; // simple fallback; extend later if you add a date picker
      const resDaily = await fetch(
        `https://book-cafe-project.vercel.app/dashboard/daily?date=${dailyParam}`
      );
      const dailyJson = await resDaily.json();
      const dailyRooms = Array.isArray(dailyJson.rooms)
        ? dailyJson.rooms.map(r => ({
            name: r.room_name || r.room_number,
            bookings: Number(r.bookings) || 0
          }))
        : [];
      setDailyData(dailyRooms);

      // --- Monthly / Range API --- (most-booked)
      const resMonthly = await fetch(
        `https://book-cafe-project.vercel.app/dashboard/most-booked?range=${monthlyFilter}`
      );
      const monthlyJson = await resMonthly.json();
      const monthlyRooms = Array.isArray(monthlyJson.rooms)
        ? monthlyJson.rooms.map(r => ({
            name: r.room_name || r.room_number,
            bookings: Number(r.bookings) || 0
          }))
        : [];
      setMonthlyData(monthlyRooms);
    } catch (err) {
      console.error('❌ Error fetching data:', err);
      setDailyData([]);
      setMonthlyData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dailyFilter, monthlyFilter]); // โหลดใหม่เมื่อ filter เปลี่ยน

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col font-sans">
      <main className="flex-1 px-8 py-6 flex flex-col items-center gap-10">
        {/* Back Arrow */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#7B3F00] font-medium hover:opacity-80 transition self-start"
        >
          <ArrowLeft className="w-10 h-10 mr-5" />
        </button>

        {/* Title */}
        <div className="text-center max-w-xl">
          <h1 className="text-4xl font-bold text-[#5C2C0C] mb-2 font-['Crimson_Text']">
            Room Booking Dashboard
          </h1>
          <p className="text-[#BB8F6E] text-base font-['Inter']">
            Dashboard shows borrowed books and usage statistics
          </p>
        </div>

        <>
          {/* Daily Booking */}
          <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#53311C]">
                  Daily Booking
                </h2>
                <p className="text-sm text-[#86422A]">Number of bookings</p>
              </div>
              {/* Daily Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-[#7B3F00]">
                  Filter :
                </label>
                <div className="relative w-48">
                  <select
                    style={{ textIndent: "12px" }}
                    value={dailyFilter}
                    onChange={(e) => setDailyFilter(e.target.value)}
                    className="appearance-none text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-full
                               focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                               bg-white text-black cursor-pointer pr-8"
                  >
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                  </select>
                  {/* custom arrow */}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               w-0 h-0 border-t-8 border-b-8 border-r-10
                               border-t-transparent border-b-transparent border-r-[#7B3F00] pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
          </div>

          {/* Most booked room */}
          <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[#53311C]">
                  Most booked room
                </h2>
                <p className="text-sm text-[#86422A]">Number of bookings</p>
              </div>
              {/* Monthly Filter */}
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-[#7B3F00]">
                  Filter :
                </label>
                <div className="relative w-48">
                  <select
                    style={{ textIndent: "12px" }}
                    value={monthlyFilter}
                    onChange={(e) => setMonthlyFilter(e.target.value)}
                    className="appearance-none text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-full
                               focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                               bg-white text-black cursor-pointer pr-8"
                  >
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                    
                  </select>
                  {/* custom arrow */}
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               w-0 h-0 border-t-8 border-b-8 border-r-10
                               border-t-transparent border-b-transparent border-r-[#7B3F00] pointer-events-none"
                  />
                </div>
              </div>
            </div>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </>
      </main>
    </div>
  );
};

export default Dashboard;
