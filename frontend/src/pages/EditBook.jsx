import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import logo from "../assets/Book.svg";
import arrow from "../assets/Arrowcategory.svg";
import successIcon from "../assets/Success.svg";
import { ArrowLeft } from 'lucide-react';

const EditBook = () => {
  const { user } = useAuthStore();
  const token = localStorage.getItem('accessToken');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Academic');
  const categories = ['Academic', 'Documentary', 'Novels', 'Comics', 'Other'];
  const [id, setId] = useState('');
  const [isOpen, setIsOpen] = useState(false); // state สำหรับลูกศร
  const [showSuccess, setShowSuccess] = useState(false); // state สำหรับ popup
  const [errorName, setErrorName] = useState("");
  const [errorId, setErrorId] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://api-book-cafe.onrender.com';

  // Extract book_id from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const bid = params.get('book_id');
    if (bid) {
      setId(bid);
      (async () => {
        try {
          setLoading(true);
            const { data } = await axios.get(`${API_BASE}/books/${bid}`);
            setName(data.book_name || '');
            if (data.category) setCategory(data.category);
        } catch (e) {
          setApiError(e?.response?.data?.message || 'Failed to load book');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [location.search]);

  const handleEditBook = async (e) => {
    e.preventDefault();
    setApiError("");
    let hasError = false;
    if (!name.trim()) {
      setErrorName('Book Name invalid');
      hasError = true;
    } else setErrorName('');
    if (!id.trim()) {
      setErrorId('ID invalid');
      hasError = true;
    } else setErrorId('');
    if (hasError) return;
    try {
      setLoading(true);
      await axios.patch(`${API_BASE}/books/${id.trim()}`, { book_name: name.trim(), category }, { headers: { Authorization: `Bearer ${token}` }});
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        window.history.back();
      }, 1200);
    } catch (err) {
      setApiError(err?.response?.data?.message || err.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="page-container">
      {/* Overlay + Popup */}
      {showSuccess && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40"></div>
          <div className="fixed top-1/4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg w-[320px] h-[200px] z-50 flex flex-col items-center justify-center animate-fade-in">
            <img src={successIcon} alt="success" className="h-30 w-30 mb-4" />
            <h2 className="text-xl font-bold  text-darkBrown-500 text-center" style={{ fontFamily: 'Inter, sans-serif' }} >
              Edit Book successful
            </h2>
          </div>
        </>
      )}
      <section className="relative min-h-screen flex flex-1 items-center justify-center" style={{ backgroundColor: "#F6F3ED" }}>

        <div
          className="absolute left-6 top-6 cursor-pointer left-30"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={48} color="#86422A" />
        </div>
        <div className="relative !pb-10 z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <img src={logo} alt="Logo" className="!h-28 !w-28 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
            <h1 className="text-md font-crimson md:text-4xl font-bold text-darkBrown-500 mb-4 text-shadow" >
              Edit Book
            </h1>
            <p className="text-md text-brown-600 mb-4 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select a category to get the Book ID
            </p>

            {/* Box */}
            <div className='card w-130 !mt-10 min-h-90 mb-6'>
              <div className="relative mt-6 z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-6 items-center justify-center">

                  {/* Name */}
                  <div className="flex flex-col w-full max-w-md">
                    <div className="flex items-center gap-4">
                      <label className="text-md md:text-xl text-yellow-700 w-32 text-left " style={{ fontFamily: 'Inter, sans-serif' }} >Name:</label>
                      <input
                        className={`input-field h-10 font-sans flex-1 px-3 ${errorName ? '!border-red-500' : 'border-gray-300'}`}
                        type='text'
                        placeholder='Enter Book name'
                        value={name}
                        onChange={e => setName(e.target.value)}
                      />
                    </div>
                    {errorName && (
                      <span className="text-red-500 !mr-10 text-sm mt-1">{errorName}</span>
                    )}
                  </div>


                  {/* ID */}
                  <div className="flex flex-col w-full max-w-md">
                    <div className="flex items-center gap-4">
                      <label className="text-md md:text-xl text-yellow-700  w-32 text-left " style={{ fontFamily: 'Inter, sans-serif' }}>ID:</label>
                      <input
                        className={`input-field h-10 border flex-1 px-3 font-sans ${errorName ? '!border-red-500' : 'border-gray-300'} ` }
                        type='text'
                        placeholder='Enter ID '
                        value={id}
                        onChange={e => setId(e.target.value.replace(/[^0-9]/g, ""))}
                      />
                    </div>
                    {errorId && <span className="text-red-500 text-sm mt-1 !mr-23" style={{ fontFamily: 'Inter, sans-serif' }}>{errorId}</span>}
                  </div>

                  {/* Category */}
                  <div className="flex items-center gap-4 w-full max-w-md">
                    <label className="text-md md:text-xl text-yellow-700  w-32 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>Category:</label>
                    <div className="relative flex-1">
                      <select
                        className='appearance-none input-field border border-yellow-400 w-full px-3 pr-8 bg-white leading-tight' style={{ fontFamily: 'Inter, sans-serif' }}
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setIsOpen(false)}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-yellow-700 ">
                        <img
                          src={arrow}
                          alt="arrow"
                          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-0"}`}
                        />
                      </span>
                    </div>
                  </div>

                  {/* Add Book Button */}
                  {apiError && <div className="text-red-500 text-sm -mt-2">{apiError}</div>}
                  <button disabled={loading} className="btn-primary !w-50 mt-4 disabled:opacity-60" style={{ fontFamily: 'Inter, sans-serif' }} onClick={handleEditBook}>{loading ? 'Saving...' : 'Edit Book'}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EditBook;
