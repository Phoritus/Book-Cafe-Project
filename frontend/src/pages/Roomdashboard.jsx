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

  // เก็บค่า filter
  const [dailyFilter, setDailyFilter] = useState("today");
  const [monthlyFilter, setMonthlyFilter] = useState("month");

  const fetchData = async () => {
    try {
      setLoading(true);

      // API Daily
      const resDaily = await fetch(
        `http://localhost:4000/api/daily?range=${dailyFilter}`
      );
      const daily = await resDaily.json();
      setDailyData(daily);

      // API Monthly
      const resMonthly = await fetch(
        `http://localhost:4000/api/monthly?range=${monthlyFilter}`
      );
      const monthly = await resMonthly.json();
      setMonthlyData(monthly);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dailyFilter, monthlyFilter]); // โหลดใหม่เมื่อ filter เปลี่ยน

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col font-sans">
      {/* Content */}
      <main className="flex-1 px-8 py-6 flex flex-col items-center gap-10">
        {/* Back Arrow */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#7B3F00] font-medium hover:opacity-80 transition self-start"
        >
          <ArrowLeft className="w-10 h-10 mr-5" />
        </button>

        {/* Title + Description */}
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
                {/* Filter Selector */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-[#7B3F00]">
                    Filter :
                  </label>
                  <select
                    value={dailyFilter}
                    onChange={(e) => setDailyFilter(e.target.value)}
                    className="text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-48
                               focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                               bg-white text-black cursor-pointer"
                  >
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                  </select>
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
                {/* Filter Selector */}
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium text-[#7B3F00]">
                    Filter :
                  </label>
                  <select
                    value={monthlyFilter}
                    onChange={(e) => setMonthlyFilter(e.target.value)}
                    className="text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-48
                               focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                               bg-white text-black cursor-pointer"
                  >
                    <option value="today">Today</option>
                    <option value="month">This Month</option>
                  </select>
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