import React, { useState, useEffect, useCallback } from "react";
import "./BookLending.css";
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { getApiBase } from '../utils/apiBase';

export default function BookLendingPage() {
  const { user } = useAuthStore();
  const token = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const API_BASE = getApiBase();

  // All books
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState('');

  // Selected (searched) book
  const [searchId, setSearchId] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  // Borrowing
  const [citizenId, setCitizenId] = useState('');
  const [citizenError, setCitizenError] = useState('');

  // Borrowed list for given citizen (shows only their current+history)
  const [borrowedList, setBorrowedList] = useState([]);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState('');

  // Modals / confirmations
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmReturnRecord, setConfirmReturnRecord] = useState(null);

  // General UI
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const authHeader = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token]);

  // Fetch all books
  const loadBooks = useCallback(async () => {
    try {
      setBooksLoading(true); setBooksError('');
      const { data } = await axios.get(`${API_BASE}/books`);
      setBooks(data);
    } catch (e) {
      setBooksError(e?.response?.data?.message || 'Failed to load books');
    } finally {
      setBooksLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  // Input typing ONLY updates value; clearing selection so user sees it must press search
  const handleSearchChange = (val) => {
    setSearchId(val);
    if (!val) setSelectedBook(null);
  };

  // Manual search action (icon click / Enter key)
  const executeSearch = () => {
    if (!searchId.trim()) { setSelectedBook(null); return; }
    const found = books.find(b => String(b.book_id) === searchId.trim());
    setSelectedBook(found || null);
  };

  // Borrowing list for citizen
  const loadBorrowingForCitizen = useCallback(async (cid) => {
    if (!cid) return;
    try {
      setBorrowLoading(true); setBorrowError('');
      // Remove membership requirement: try with auth header only if token exists
      const opt = token ? { headers: authHeader() } : undefined;
      const { data } = await axios.get(`${API_BASE}/borrowing?citizen_id=${cid}`, opt);
      setBorrowedList(data);
    } catch (e) {
      setBorrowError(e?.response?.data?.message || 'Failed to load borrowed list');
    } finally {
      setBorrowLoading(false);
    }
  }, [API_BASE, authHeader, token]);

  // All active (unreturned) borrowings across all citizens
  const loadActiveBorrowings = useCallback(async () => {
    try {
      setBorrowLoading(true); setBorrowError('');
      const { data } = await axios.get(`${API_BASE}/borrowing/active`);
      setBorrowedList(data);
    } catch (e) {
      setBorrowError(e?.response?.data?.message || 'Failed to load active borrowings');
    } finally {
      setBorrowLoading(false);
    }
  }, [API_BASE]);

  // Decide which list to refresh (filtered citizen vs global active)
  const refreshBorrowList = useCallback(() => {
    if (/^\d{13}$/.test(citizenId.trim())) {
      loadBorrowingForCitizen(citizenId.trim());
    } else {
      loadActiveBorrowings();
    }
  }, [citizenId, loadBorrowingForCitizen, loadActiveBorrowings]);

  // Borrow book (no membership required)
  const handleBorrow = async () => {
    setCitizenError(''); setActionError(''); setActionMessage('');
    if (!selectedBook) { setActionError('No book selected'); return; }
    if (!citizenId.trim()) { setCitizenError('Please enter citizen ID'); return; }
    if (!/^\d{13}$/.test(citizenId.trim())) { setCitizenError('Must be exactly 13 digits'); return; }
    if (selectedBook.book_status === 'borrowed') { setActionError('Book already borrowed'); return; }
    try {
      const body = { book_id: selectedBook.book_id, citizen_id: citizenId.trim() };
      const opt = token ? { headers: authHeader() } : undefined;
      await axios.post(`${API_BASE}/borrowing/borrow`, body, opt);
      setActionMessage('Borrowed successfully');
      await loadBooks();
      refreshBorrowList();
    } catch (e) {
      setActionError(e?.response?.data?.message || 'Borrow failed');
    }
  };

  // Return book (still optional auth; allow without login if backend permits)
  const confirmReturnBook = async () => {
    if (!confirmReturnRecord) return;
    try {
      const opt = token ? { headers: authHeader() } : undefined;
      await axios.post(`${API_BASE}/borrowing/return`, { record_id: confirmReturnRecord.record_id }, opt);
      setActionMessage('Returned successfully');
      setConfirmReturnRecord(null);
      await loadBooks();
      refreshBorrowList();
    } catch (e) {
      setActionError(e?.response?.data?.message || 'Return failed');
    }
  };

  // Delete book
  const cancelReturn = () => setConfirmReturnRecord(null);
  const cancelDelete = () => setConfirmDeleteId(null);
  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await axios.delete(`${API_BASE}/books/${confirmDeleteId}`, { headers: authHeader() });
      setActionMessage('Deleted book');
      setConfirmDeleteId(null);
      if (selectedBook && String(selectedBook.book_id) === String(confirmDeleteId)) setSelectedBook(null);
      await loadBooks();
    } catch (e) {
      setActionError(e?.response?.data?.message || 'Delete failed');
    }
  };

  // Navigate to pages
  const goAdd = () => navigate('/add-book');
  const goEdit = () => { if (selectedBook) navigate(`/edit-book?book_id=${selectedBook.book_id}`); };

  // Initial load: show all active borrowings
  useEffect(() => { loadActiveBorrowings(); }, [loadActiveBorrowings]);

  // Watch citizenId: when 13 digits -> load that citizen's active borrowings; when cleared -> show all active
  useEffect(() => {
    if (/^\d{13}$/.test(citizenId)) {
      loadBorrowingForCitizen(citizenId);
    } else if (citizenId.trim() === '') {
      loadActiveBorrowings();
    }
  }, [citizenId, loadBorrowingForCitizen, loadActiveBorrowings]);

  return (
    <div className="min-h-screen bg-[#f9f6f2] p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left column - borrow panel */}
          <aside className="md:col-span-1">
            <section className="borrow-panel">
              <div className="booklending-header" style={{ marginLeft: 0, textAlign: 'left' }}>
                <h1 style={{ textAlign: 'left' }}>Book Lending</h1>
                <div className="subheading" style={{ textAlign: 'left' }}>
                  Review members' borrowing and returning history.
                </div>
              </div>
              <div className="search-box-wrapper" style={{ marginLeft: -40 }}>
                <input
                  type="text"
                  placeholder="Book ID:"
                  className="search-box"
                  value={searchId}
                  onChange={e => handleSearchChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') executeSearch(); }}
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  className="search-icon-btn"
                  type="button"
                  onClick={executeSearch}
                  aria-label="Search Book ID"
                >
                  <svg className="search-icon-svg" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="#B37E32" strokeWidth="2" />
                    <path d="M17 17L14 14" stroke="#B37E32" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="book-card" style={{ minHeight: '70px', paddingTop: '2rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center'  }}>
                <div className="book-info" style={{ padding: 0, margin: 0, minHeight: 0, fontSize: '0.85rem', lineHeight: 1 }}>
                  <div className="book-icon">
                    {/* ...SVG icon... */}
                    <svg width="28" height="28" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* ...SVG paths... */}
                      <path fillRule="evenodd" clipRule="evenodd" d="M53.4375 16.8004V28.2642C53.4375 28.6804 53.4375 29.2767 53.5125 29.7867C53.5806 30.3115 53.7659 30.8142 54.0548 31.2576C54.3437 31.701 54.7287 32.0737 55.1813 32.3479C55.6239 32.5976 56.1144 32.7508 56.6205 32.7973C57.1265 32.8439 57.6367 32.7827 58.1175 32.6179C58.605 32.4679 59.1375 32.2129 59.535 32.0217L63.75 30.0192L67.965 32.0217C68.3625 32.2092 68.895 32.4679 69.3825 32.6217C69.8635 32.7859 70.3739 32.8464 70.8799 32.7992C71.386 32.7521 71.8764 32.5983 72.3187 32.3479C72.7706 32.0732 73.1549 31.7004 73.4431 31.257C73.7313 30.8137 73.9161 30.3111 73.9837 29.7867C74.0625 29.2767 74.0625 28.6804 74.0625 28.2642V11.3667C74.4875 11.3467 74.9025 11.3304 75.3075 11.3179C79.3275 11.1754 82.5 14.4754 82.5 18.4992V60.5367C82.5 64.7067 79.1025 68.0742 74.9438 68.3367C71.3063 68.5617 67.0387 69.0079 63.75 69.8742C59.6925 70.9467 56.2875 73.8792 51.1012 75.2592C48.7537 75.8854 46.1363 76.2229 45 76.4704V19.4029C46.2 19.1067 50.1825 18.6417 51.2775 18.0117C51.97 17.6067 52.69 17.2029 53.4375 16.8004ZM73.98 48.0679C74.0698 48.4264 74.0881 48.7991 74.0338 49.1647C73.9795 49.5303 73.8537 49.8816 73.6635 50.1986C73.4734 50.5155 73.2226 50.7918 72.9256 51.0118C72.6286 51.2317 72.2911 51.391 71.9325 51.4804L56.9325 55.2304C56.2085 55.4114 55.4422 55.2974 54.8022 54.9134C54.1622 54.5294 53.701 53.907 53.52 53.1829C53.339 52.4589 53.453 51.6926 53.837 51.0526C54.221 50.4127 54.8435 49.9514 55.5675 49.7704L70.5675 46.0204C70.926 45.9306 71.2987 45.9123 71.6643 45.9666C72.0299 46.0209 72.3812 46.1467 72.6981 46.3369C73.0151 46.527 73.2914 46.7778 73.5113 47.0748C73.7313 47.3718 73.8906 47.7093 73.98 48.0679Z" fill="#86422A" />
                      <path d="M68.4375 11.8164C66.1125 12.0902 63.825 12.4914 61.875 13.0764C60.9213 13.367 59.9826 13.7049 59.0625 14.0889V26.0214L61.875 24.6864L61.905 24.6677C62.4734 24.3632 63.1053 24.1962 63.75 24.1802C63.9275 24.1802 64.1 24.1927 64.2675 24.2177C64.9238 24.3264 65.4488 24.5927 65.595 24.6677L65.6287 24.6864L68.4375 26.0214V11.8164Z" fill="#86422A" />
                      <path opacity="0.5" d="M45 19.5525C43.7475 19.3125 41.0362 18.9487 38.5575 18.2812C33.5175 16.9312 30.1875 14.1187 26.25 13.0762C22.9237 12.1987 18.5963 11.7562 14.9325 11.5312C10.8225 11.2762 7.5 14.625 7.5 18.7425V60.54C7.5 64.7025 10.8975 68.0775 15.0562 68.3362C18.6937 68.5612 22.9613 69.0075 26.25 69.8737C28.0725 70.3575 30.81 71.49 33.2738 72.5962C37.0425 74.2875 40.9688 75.585 45 76.4737V19.5525Z" fill="#C3A15E" />
                      <path d="M16.0235 48.0678C16.1134 47.7095 16.2729 47.3724 16.4931 47.0758C16.7132 46.7792 16.9896 46.5289 17.3065 46.3391C17.6233 46.1493 17.9745 46.0238 18.3399 45.9697C18.7053 45.9157 19.0778 45.9341 19.436 46.024L34.436 49.774C35.1596 49.9555 35.7814 50.417 36.1646 51.057C36.5479 51.697 36.6613 52.463 36.4798 53.1865C36.2983 53.9101 35.8368 54.5319 35.1968 54.9152C34.5568 55.2984 33.7908 55.4118 33.0673 55.2303L18.0673 51.4803C17.709 51.3904 17.3719 51.2309 17.0753 51.0107C16.7787 50.7906 16.5284 50.5142 16.3386 50.1973C16.1488 49.8804 16.0233 49.5293 15.9692 49.1639C15.9152 48.7985 15.9336 48.426 16.0235 48.0678ZM19.4323 31.024C19.072 30.9283 18.6962 30.9051 18.3269 30.9559C17.9576 31.0067 17.6021 31.1304 17.281 31.3198C16.9599 31.5092 16.6796 31.7605 16.4566 32.0592C16.2335 32.3579 16.072 32.698 15.9815 33.0596C15.8911 33.4213 15.8734 33.7973 15.9296 34.1658C15.9857 34.5344 16.1146 34.8881 16.3086 35.2064C16.5027 35.5247 16.7581 35.8012 17.0601 36.0199C17.362 36.2386 17.7043 36.3951 18.0673 36.4803L33.0673 40.2303C33.7865 40.3991 34.5434 40.2781 35.1742 39.8935C35.8049 39.5089 36.2591 38.8915 36.4384 38.1748C36.6177 37.458 36.5078 36.6995 36.1324 36.0632C35.757 35.4269 35.1463 34.9638 34.4323 34.774L19.4323 31.024Z" fill="#86422A" />
                    </svg>
                  </div>
                  <div>
                    <div className="name-row" >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginTop: '0rem', justifyContent:'space-between' }}>
                        <p style={{ margin: 0 }}><strong className="label-strong">Name:</strong> {selectedBook ? selectedBook.book_name : '—'}</p>
                        
                      </div>
                      
                    </div>
                    <p><strong className="label-strong">ID:</strong> {selectedBook ? selectedBook.book_id : '—'}</p>
                    {selectedBook && selectedBook.category && <p><strong className="label-strong">Category:</strong> {selectedBook.category}</p>}
                  </div>
                  <span className="book-actions-inline">
                          <button disabled={!selectedBook} onClick={goEdit} className="op-btn !mb-0 !mr-4" title="Edit" >
                            <svg width="28" height="27" viewBox="0 0 28 27" fill="white" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.4336 1.65723C20.8509 1.70097 21.1853 1.88883 21.4521 2.08789C21.7337 2.298 22.0359 2.59598 22.3457 2.89844L24.7324 5.22852C25.0567 5.54511 25.3748 5.85179 25.5986 6.13867C25.8403 6.44845 26.0684 6.85192 26.0684 7.375C26.0684 7.89808 25.8403 8.30155 25.5986 8.61133C25.3748 8.89821 25.0567 9.20489 24.7324 9.52148L10.8398 23.083L10.8232 23.0996L10.8057 23.1152C10.6534 23.2647 10.4604 23.4577 10.2168 23.5928C9.95521 23.7377 9.6691 23.7996 9.45605 23.8516L3.79688 25.2324C3.6488 25.2686 3.42682 25.3248 3.23242 25.3428C3.02562 25.3618 2.57375 25.366 2.20703 24.9951C1.84035 24.6242 1.84969 24.1724 1.87109 23.9658C1.89123 23.7718 1.95047 23.551 1.98828 23.4033L3.39258 17.9199C3.44834 17.7021 3.51459 17.4089 3.66797 17.1436L3.79297 16.9561C3.92737 16.7794 4.08243 16.6354 4.20312 16.5176L18.1543 2.89844C18.4641 2.59598 18.7663 2.298 19.0479 2.08789C19.3527 1.86044 19.7457 1.64746 20.25 1.64746L20.4336 1.65723Z" stroke="#86422A" stroke-width="2" />
                              <path d="M15.875 4.81217L21.125 1.39551L26.375 6.52051L22.875 11.6455L15.875 4.81217Z" fill="#86422A" />
                            </svg>
                          </button>
                          <button disabled={!selectedBook} className="delete-btn" title="Delete" onClick={() => selectedBook && setConfirmDeleteId(selectedBook.book_id)} style={{ marginTop: 0 }}>
                            <svg width="26" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M8 2.6V1.3C8 0.955219 8.14048 0.624558 8.39052 0.380761C8.64057 0.136964 8.97971 0 9.33333 0L14.6667 0C15.0203 0 15.3594 0.136964 15.6095 0.380761C15.8595 0.624558 16 0.955219 16 1.3V2.6H21.3333C22.0406 2.6 22.7189 2.87393 23.219 3.36152C23.719 3.84912 24 4.51044 24 5.2V6.5C24 7.18956 23.719 7.85088 23.219 8.33848C22.7189 8.82607 22.0406 9.1 21.3333 9.1H21.156L20.2493 22.36C20.1817 23.3471 19.7319 24.2722 18.9909 24.948C18.25 25.6238 17.2733 25.9999 16.2587 26H7.768C6.75423 26 5.77829 25.6247 5.03748 24.9499C4.29667 24.2752 3.84627 23.3513 3.77733 22.3652L2.84933 9.1H2.66667C1.95942 9.1 1.28115 8.82607 0.781049 8.33848C0.280952 7.85088 0 7.18956 0 6.5V5.2C0 4.51044 0.280952 3.84912 0.781049 3.36152C1.28115 2.87393 1.95942 2.6 2.66667 2.6H8ZM21.3333 5.2H2.66667V6.5H21.3333V5.2ZM5.52133 9.1L6.43733 22.1884C6.46032 22.5172 6.61051 22.8252 6.85754 23.0501C7.10458 23.275 7.43 23.4001 7.768 23.4H16.2587C16.5971 23.4001 16.9229 23.2746 17.17 23.0492C17.4171 22.8237 17.567 22.515 17.5893 22.1858L18.4827 9.1H5.52133ZM9.33333 10.4C9.68696 10.4 10.0261 10.537 10.2761 10.7808C10.5262 11.0246 10.6667 11.3552 10.6667 11.7V20.8C10.6667 21.1448 10.5262 21.4754 10.2761 21.7192C10.0261 21.963 9.68696 22.1 9.33333 22.1C8.97971 22.1 8.64057 21.963 8.39052 21.7192C8.14048 21.4754 8 21.1448 8 20.8V11.7C8 11.3552 8.14048 11.0246 8.39052 10.7808C8.64048 10.537 8.97971 10.4 9.33333 10.4ZM14.6667 10.4C15.0203 10.4 15.3594 10.537 15.6095 10.7808C15.8595 11.0246 16 11.3552 16 11.7V20.8C16 21.1448 15.8595 21.4754 15.6095 21.7192C15.3594 21.963 15.0203 22.1 14.6667 22.1C14.313 22.1 13.9739 21.963 13.7239 21.7192C13.4738 21.4754 13.3333 21.1448 13.3333 20.8V11.7C13.3333 11.3552 13.4738 11.0246 13.7239 10.7808C13.9739 10.537 14.313 10.4 14.6667 10.4Z" fill="#FF5656" />
                            </svg>
                          </button>
                        </span>
                </div>
                {/* National ID input and Borrow button BELOW all text and actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.12rem', flex: 1, padding: '0.2rem 0 0.2rem 0', marginTop: 0, width: '100%' }}>
                  <span style={{ fontSize: '0.7rem', color: '#B37E32', marginLeft: '2px', marginBottom: '0.5rem', display: 'inline-block', fontWeight: 500, letterSpacing: '0.01em', lineHeight: 1 }}>National ID*</span>
                  <div className="borrow-row " style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: 0, padding: 0 }}>
                    <input
                      type="text"
                      placeholder="13-digit citizen id"
                      className="national-id"
                      value={citizenId}
                      onChange={e => { setCitizenId(e.target.value.replace(/[^0-9]/g,'')); setCitizenError(''); }}
                      style={{ marginBottom: 0 }}
                    />
                    <button disabled={!selectedBook} className="borrowi-btn !ml-4 !w-30 disabled:opacity-40" onClick={handleBorrow} style={{ fontSize: '0.92rem', height: '2.5rem', minWidth: '6.5rem', maxWidth: '7.5rem', padding: '0.55rem 1rem', margin: '0,0,0,0' }}>Borrow</button>
                  </div>
                  {citizenError && <div style={{ color:'#FF5656', fontSize:'0.85rem', marginTop:4 }}>{citizenError}</div>}
                  {actionError && <div style={{ color:'#FF5656', fontSize:'0.8rem', marginTop:4 }}>{actionError}</div>}
                  {actionMessage && <div style={{ color:'#2b6a2b', fontSize:'0.8rem', marginTop:4 }}>{actionMessage}</div>}
                </div>
              </div>
              <button className="add-btn" onClick={goAdd}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                  <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.666992 14.0003C0.666992 6.63633 6.63633 0.666992 14.0003 0.666992C21.3643 0.666992 27.3337 6.63633 27.3337 14.0003C27.3337 21.3643 21.3643 27.3337 14.0003 27.3337C6.63633 27.3337 0.666992 21.3643 0.666992 14.0003ZM14.0003 3.33366C11.1713 3.33366 8.45824 4.45747 6.45785 6.45785C4.45747 8.45824 3.33366 11.1713 3.33366 14.0003C3.33366 16.8293 4.45747 19.5424 6.45785 21.5428C8.45824 23.5432 11.1713 24.667 14.0003 24.667C16.8293 24.667 19.5424 23.5432 21.5428 21.5428C23.5432 19.5424 24.667 16.8293 24.667 14.0003C24.667 11.1713 23.5432 8.45824 21.5428 6.45785C19.5424 4.45747 16.8293 3.33366 14.0003 3.33366Z" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M15.3333 7.33333C15.3333 6.97971 15.1929 6.64057 14.9428 6.39052C14.6928 6.14048 14.3536 6 14 6C13.6464 6 13.3072 6.14048 13.0572 6.39052C12.8071 6.64057 12.6667 6.97971 12.6667 7.33333V12.6667H7.33333C6.97971 12.6667 6.64057 12.8071 6.39052 13.0572C6.14048 13.3072 6 13.6464 6 14C6 14.3536 6.14048 14.6928 6.39052 14.9428C6.64057 15.1929 6.97971 15.3333 7.33333 15.3333H12.6667V20.6667C12.6667 21.0203 12.8071 21.3594 13.0572 21.6095C13.3072 21.8595 13.6464 22 14 22C14.3536 22 14.6928 21.8595 14.9428 21.6095C15.1929 21.3594 15.3333 21.0203 15.3333 20.6667V15.3333H20.6667C21.0203 15.3333 21.3594 15.1929 21.6095 14.9428C21.8595 14.6928 22 14.3536 22 14C22 13.6464 21.8595 13.3072 21.6095 13.0572C21.3594 12.8071 21.0203 12.6667 20.6667 12.6667H15.3333V7.33333Z" fill="white" />
                  </svg>
                  <span>Add Book</span>
                </span>
              </button>
            </section>
          </aside>

          {/* Right column - borrowed list */}
          <main className="md:col-span-1 !mb-10">
            <section className="borrowed-list">
              <h3>
                {/^\d{13}$/.test(citizenId) ? `Borrowed books for ID ${citizenId}` : 'Currently borrowed books (all)'}
              </h3>
              {borrowError && <div style={{ color:'#FF5656', fontSize:'0.8rem'}}>{borrowError}</div>}
              {borrowLoading && <div>Loading borrowing history...</div>}
              {!borrowLoading && borrowedList.length === 0 && <div className="text-sm text-gray-500">No records.</div>}
              <ul>
                {borrowedList.map((record) => (
                  <li className="borrowed-item" key={record.record_id}>
                    <div className="book-icon">
                      {/* ...SVG icon... */}
                      <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M53.4375 16.8004V28.2642C53.4375 28.6804 53.4375 29.2767 53.5125 29.7867C53.5806 30.3115 53.7659 30.8142 54.0548 31.2576C54.3437 31.701 54.7287 32.0737 55.1813 32.3479C55.6239 32.5976 56.1144 32.7508 56.6205 32.7973C57.1265 32.8439 57.6367 32.7827 58.1175 32.6179C58.605 32.4679 59.1375 32.2129 59.535 32.0217L63.75 30.0192L67.965 32.0217C68.3625 32.2092 68.895 32.4679 69.3825 32.6217C69.8635 32.7859 70.3739 32.8464 70.8799 32.7992C71.386 32.7521 71.8764 32.5983 72.3187 32.3479C72.7706 32.0732 73.1549 31.7004 73.4431 31.257C73.7313 30.8137 73.9161 30.3111 73.9837 29.7867C74.0625 29.2767 74.0625 28.6804 74.0625 28.2642V11.3667C74.4875 11.3467 74.9025 11.3304 75.3075 11.3179C79.3275 11.1754 82.5 14.4754 82.5 18.4992V60.5367C82.5 64.7067 79.1025 68.0742 74.9438 68.3367C71.3063 68.5617 67.0387 69.0079 63.75 69.8742C59.6925 70.9467 56.2875 73.8792 51.1012 75.2592C48.7537 75.8854 46.1363 76.2229 45 76.4704V19.4029C46.2 19.1067 50.1825 18.6417 51.2775 18.0117C51.97 17.6067 52.69 17.2029 53.4375 16.8004ZM73.98 48.0679C74.0698 48.4264 74.0881 48.7991 74.0338 49.1647C73.9795 49.5303 73.8537 49.8816 73.6635 50.1986C73.4734 50.5155 73.2226 50.7918 72.9256 51.0118C72.6286 51.2317 72.2911 51.391 71.9325 51.4804L56.9325 55.2304C56.2085 55.4114 55.4422 55.2974 54.8022 54.9134C54.1622 54.5294 53.701 53.907 53.52 53.1829C53.339 52.4589 53.453 51.6926 53.837 51.0526C54.221 50.4127 54.8435 49.9514 55.5675 49.7704L70.5675 46.0204C70.926 45.9306 71.2987 45.9123 71.6643 45.9666C72.0299 46.0209 72.3812 46.1467 72.6981 46.3369C73.0151 46.527 73.2914 46.7778 73.5113 47.0748C73.7313 47.3718 73.8906 47.7093 73.98 48.0679Z" fill="#86422A" />
                        <path d="M68.4375 11.8164C66.1125 12.0902 63.825 12.4914 61.875 13.0764C60.9213 13.367 59.9826 13.7049 59.0625 14.0889V26.0214L61.875 24.6864L61.905 24.6677C62.4734 24.3632 63.1053 24.1962 63.75 24.1802C63.9275 24.1802 64.1 24.1927 64.2675 24.2177C64.9238 24.3264 65.4488 24.5927 65.595 24.6677L65.6287 24.6864L68.4375 26.0214V11.8164Z" fill="#86422A" />
                        <path opacity="0.5" d="M45 19.5525C43.7475 19.3125 41.0362 18.9487 38.5575 18.2812C33.5175 16.9312 30.1875 14.1187 26.25 13.0762C22.9237 12.1987 18.5963 11.7562 14.9325 11.5312C10.8225 11.2762 7.5 14.625 7.5 18.7425V60.54C7.5 64.7025 10.8975 68.0775 15.0562 68.3362C18.6937 68.5612 22.9613 69.0075 26.25 69.8737C28.0725 70.3575 30.81 71.49 33.2738 72.5962C37.0425 74.2875 40.9688 75.585 45 76.4737V19.5525Z" fill="#C3A15E" />
                        <path d="M16.0235 48.0678C16.1134 47.7095 16.2729 47.3724 16.4931 47.0758C16.7132 46.7792 16.9896 46.5289 17.3065 46.3391C17.6233 46.1493 17.9745 46.0238 18.3399 45.9697C18.7053 45.9157 19.0778 45.9341 19.436 46.024L34.436 49.774C35.1596 49.9555 35.7814 50.417 36.1646 51.057C36.5479 51.697 36.6613 52.463 36.4798 53.1865C36.2983 53.9101 35.8368 54.5319 35.1968 54.9152C34.5568 55.2984 33.7908 55.4118 33.0673 55.2303L18.0673 51.4803C17.709 51.3904 17.3719 51.2309 17.0753 51.0107C16.7787 50.7906 16.5284 50.5142 16.3386 50.1973C16.1488 49.8804 16.0233 49.5293 15.9692 49.1639C15.9152 48.7985 15.9336 48.426 16.0235 48.0678ZM19.4323 31.024C19.072 30.9283 18.6962 30.9051 18.3269 30.9559C17.9576 31.0067 17.6021 31.1304 17.281 31.3198C16.9599 31.5092 16.6796 31.7605 16.4566 32.0592C16.2335 32.3579 16.072 32.698 15.9815 33.0596C15.8911 33.4213 15.8734 33.7973 15.9296 34.1658C15.9857 34.5344 16.1146 34.8881 16.3086 35.2064C16.5027 35.5247 16.7581 35.8012 17.0601 36.0199C17.362 36.2386 17.7043 36.3951 18.0673 36.4803L33.0673 40.2303C33.7865 40.3991 34.5434 40.2781 35.1742 39.8935C35.8049 39.5089 36.2591 38.8915 36.4384 38.1748C36.6177 37.458 36.5078 36.6995 36.1324 36.0632C35.757 35.4269 35.1463 34.9638 34.4323 34.774L19.4323 31.024Z" fill="#86422A" />
                      </svg>
                    </div>
                    <div className="book-details">
                      <p><strong className="label-strong">Name:</strong> {record.book_name || record.book_id}</p>
                      <p><strong className="label-strong">ID:</strong> {record.book_id}</p>
                      <p><strong className="label-strong">National ID:</strong> {record.citizen_id}</p>
                      
    
                    </div>
                    <div className="return-btn-wrapper">
                      <button
                        className={`return-btn${record.returnTime ? ' returned-disabled' : ''}`}
                        disabled={!!record.returnTime}
                        onClick={() => { if (!record.returnTime) setConfirmReturnRecord(record); }}
                      >
                        Return
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Modal ยืนยันลบ */}
              {confirmDeleteId && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                  <div style={{ background: '#fff', borderRadius: 10, padding: '1.1rem 1.3rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', minWidth: 320, maxWidth: 400, fontSize: '0.98rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 10 }}>Confirm Delete</div>
                    <div style={{ marginBottom: 16, fontSize: '0.95rem' }}>Are you sure you want to delete this book?</div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={cancelDelete} className="modal-cancel-btn">Cancel</button>
                      <button onClick={confirmDelete} className="modal-delete-btn">Delete</button>
                    </div>
                  </div>
                </div>
              )}
              {confirmReturnRecord && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                  <div style={{ background: '#fff', borderRadius: 10, padding: '1.1rem 1.3rem', boxShadow: '0 2px 16px rgba(0,0,0,0.15)', minWidth: 320, maxWidth: 400, fontSize: '0.98rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 10 }}>Confirm Return</div>
                    <div style={{ marginBottom: 16, fontSize: '0.95rem' }}>Are you sure you want to return this book?</div>
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                      <button onClick={cancelReturn} className="modal-cancel-btn">Cancel</button>
                      <button onClick={confirmReturnBook} className="modal-return-btn">Confirm</button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}