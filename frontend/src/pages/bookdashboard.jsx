import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowLeft } from "lucide-react";

const BookBorrowingDashboard = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [topBooksData, setTopBooksData] = useState([]);
  const [filter, setFilter] = useState("today"); // ✅ new state

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch(
          `http://localhost:4000/api/borrowings/category?range=${filter}`
        );
        const res2 = await fetch(
          `http://localhost:4000/api/borrowings/top5?range=${filter}`
        );

        const category = await res1.json();
        const topBooks = await res2.json();

        setCategoryData(category);
        setTopBooksData(topBooks);
      } catch (err) {
        console.error("❌ Error fetching data:", err);
      }
    };

    fetchData();
  }, [filter]); // ✅ ดึงใหม่ทุกครั้งที่ filter เปลี่ยน

  return (
    <div className="min-h-screen bg-[#F8F4F0] flex flex-col">
      {/* Content */}
      <main className="flex-1 px-8 py-6">
        {/* Back Arrow */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-[#7B3F00] mb-4"
        >
          <ArrowLeft className="w-8 h-8 mr-2" />
        </button>

        {/* Title + Description */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-[#5C2C0C] mb-2">
            Book Borrowing Dashboard
          </h1>
          <p className="text-[#7B3F00] text-base">
            Dashboard shows borrowed books and usage statistics
          </p>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-[#7B3F00]">By Category</h2>
            {/* ✅ Filter Selector */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="today">Today</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="borrowings"
                fill="#86422A"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Borrowed Books */}
        <div className="bg-white rounded-xl shadow p-4 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-[#7B3F00]">
              Top 5 Borrowed Books
            </h2>
            {/* ✅ ใช้ filter เดียวกัน */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="today">Today</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topBooksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="borrowings"
                fill="#86422A"
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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

export default BookBorrowingDashboard;
