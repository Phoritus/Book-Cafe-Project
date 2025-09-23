import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BookBorrowingDashboard = () => {
  const [categoryData, setCategoryData] = useState([]);
  const [topBooksData, setTopBooksData] = useState([]);

  // ดึงข้อมูลจาก API ทุก 5 วิ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await fetch("/api/borrowings/category");
        const res2 = await fetch("/api/borrowings/top5");

        const category = await res1.json();
        const topBooks = await res2.json();

        setCategoryData(category);
        setTopBooksData(topBooks);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData(); // โหลดครั้งแรก
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-container">
      <section className="relative min-h-screen flex flex-1 items-center justify-center">
        {/* ปุ่ม Back */}
        <div
          className="absolute left-6 top-6 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={48} color="#86422A" />
        </div>

        <div className="flex flex-col items-center w-full max-w-4xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-darkBrown-500 mb-8 text-center">
            Book Borrowing Dashboard
          </h1>

          {/* กราฟ By Category */}
          <div className="card w-full mb-8 p-6">
            <h2 className="text-xl font-semibold text-darkBrown-500 mb-4">
              By Category
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrowings" fill="#86422A" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* กราฟ Top 5 Borrowed Books */}
          <div className="card w-full p-6">
            <h2 className="text-xl font-semibold text-darkBrown-500 mb-4">
              Top 5 Borrowed Books
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topBooksData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="borrowings" fill="#86422A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookBorrowingDashboard;
