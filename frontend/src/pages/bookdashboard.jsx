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

  // 🎯 แยก filter ออกเป็น 2 ตัว //
  const [categoryFilter, setCategoryFilter] = useState("today");
  const [topBooksFilter, setTopBooksFilter] = useState("today");

  // 📌 ดึงข้อมูล Category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/borrowings/category?range=${categoryFilter}`
        );
        const category = await res.json();
        setCategoryData(category);
      } catch (err) {
        console.error("❌ Error fetching category data:", err);
      }
    };
    fetchCategory();
  }, [categoryFilter]);

  // 📌 ดึงข้อมูล Top Books
  useEffect(() => {
    const fetchTopBooks = async () => {
      try {
        const res = await fetch(
          `http://localhost:4000/api/borrowings/top5?range=${topBooksFilter}`
        );
        const topBooks = await res.json();
        setTopBooksData(topBooks);
      } catch (err) {
        console.error("❌ Error fetching top books data:", err);
      }
    };
    fetchTopBooks();
  }, [topBooksFilter]);

  // 📌 FilterSelect reusable
  const FilterSelect = ({ value, onChange }) => (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium text-[#7B3F00]">Filter :</label>
      <div className="relative w-48">
        <select
          style={{ textIndent: "12px" }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none text-sm border border-[#C9A88D] rounded-lg px-3 py-2 w-full
                     focus:outline-none focus:ring-2 focus:ring-[#7B3F00] 
                     bg-white text-black cursor-pointer pr-8"
        >
          <option value="today">Today</option>
          <option value="month">This Month</option>
        </select>
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2
               w-0 h-0 border-t-8 border-b-8 border-r-10
               border-t-transparent border-b-transparent border-r-[#7B3F00] pointer-events-none"
        />
      </div>
    </div>
  );

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
              <h2 className="text-lg font-semibold text-[#53311C]">
                By Category
              </h2>
              <p className="text-sm text-[#86422A]">Number of borrowings</p>
            </div>
            <FilterSelect value={categoryFilter} onChange={setCategoryFilter} />
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
            <FilterSelect value={topBooksFilter} onChange={setTopBooksFilter} />
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
