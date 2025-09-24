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
  const [filter, setFilter] = useState("today");

  // 📌 ดึงข้อมูลจาก API
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
  }, [filter]);

  // 📌 UI component ของ Filter
  const FilterSelect = () => (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-[#7B3F00]">Filter :</label>
      <div className="relative">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-48
                     focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                     bg-white text-black cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="month">This Month</option>
        </select>
      </div>
    </div>
  );

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
            Book Borrowing Dashboard
          </h1>
          <p className="text-[#BB8F6E] text-base font-['Inter']">
            Dashboard shows borrowed books and usage statistics
          </p>
        </div>

        {/* By Category */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#53311C]">By Category</h2>
              <p className="text-sm text-[#86422A]">Number of borrowings</p>
            </div>
            <FilterSelect />
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="borrowings"
                  fill="#86422A"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Borrowed Books */}
        <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#53311C]">
                Top 5 Borrowed Books
              </h2>
              <p className="text-sm text-[#86422A]">Number of borrowings</p>
            </div>
            <FilterSelect />
          </div>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBooksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="borrowings"
                  fill="#86422A"
                  radius={[6, 6, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BookBorrowingDashboard;