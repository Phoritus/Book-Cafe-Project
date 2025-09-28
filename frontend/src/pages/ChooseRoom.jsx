import React, { useEffect, useState } from 'react';
import { ArrowLeft, CircleCheckBig, CircleX,UsersRound } from 'lucide-react';
import './ChooseRoom.css';
import roomImage from '../assets/10p_room.jpg'; // ใช้รูปภาพที่ส่งมา
import roomImage2 from '../assets/6p_room.png';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import Clock from '../assets/Clock.svg';

function ChooseRoom() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const user = (() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; }
    })();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = import.meta.env.VITE_API_BASE;

    useEffect(() => {
        let cancelled = false;
        async function loadRooms() {
            try {
                setLoading(true);
                // axios version
                const { data } = await axios.get(`${API_BASE}/rooms`);
                if (cancelled) return;
                const mapped = (Array.isArray(data) ? data : []).map((r, idx) => {
                    const statusRaw = (r.room_status || '').toLowerCase();
                    const statusCap = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);
                    const roomName = r.room_number || `Room ${idx + 1}`;
                    return {
                        id: idx + 1,
                        name: roomName,
                        capacity: r.number_people ? (
                            <span className="flex items-center gap-2">
                                <UsersRound size={20} color="#BD945C" />
                                Up for {r.number_people} people
                            </span>
                        ) : (
                            '—'
                        ),
                        price: r.price ? `${parseFloat(r.price).toFixed(0)} THB` : '—',
                        status: statusCap,
                        available: statusRaw === 'available',
                        image: idx < 2 ? roomImage2 : roomImage
                    };
                });
                setRooms(mapped);
            } catch (e) {
                if (!cancelled) setError(e?.response?.data?.message || e.message || 'Error loading rooms');
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadRooms();
        return () => { cancelled = true; };
    }, []);

    const handleRoomSchedule = (roomName) => {
        if (!isAuthenticated) {
            toast.error('Please login first');
            // optional: remember where user wanted to go
            try { sessionStorage.setItem('postLoginRoom', roomName); } catch { }
            navigate(`/login?redirect=${encodeURIComponent('/choose-room')}`);
            return;
        }
        try {
            sessionStorage.setItem('selectedRoom', roomName);
        } catch (e) {
            // fallback silently
        }
        // Admin -> management schedule; User -> customer multi-select schedule
        if (user?.role === 'admin') {
            navigate('/roombooking');
        } else if (user?.role === 'user') {
            navigate('/roombookingcustomer');
        } else {
            // fallback (unknown role) -> booking form
            navigate('/fill-book-room');
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return (
                    <div className="status-icon available">
                        <CircleCheckBig color="#12D23B" />
                    </div>
                );
            case 'occupied':
                return (
                    <div className="status-icon occupied">
                        <CircleX color="#FF3C3C" />
                    </div>
                );
            case 'booked':
                return (
                    <div className="status-icon booked">
                        <img src={Clock} alt="Clock icon" className="clock-icon  w-6 h-6" />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="choose-room-page">
            {/* Back Button */}
            <button
                onClick={() => window.history.back()}
                className="back-arrow-btn"
            >
                <ArrowLeft size={32} color="#86422A" />
            </button>

            <div className="room-content">
                {/* Header */}
                <div className="room-header">
                    <h1 className="room-title">Room Availability</h1>
                    <p className="room-subtitle">Check the current status of each room and see their schedule</p>
                </div>

                {/* Room Grid 2x2 */}
                <div className="rooms-grid">
                    {loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem' }}>
                            <p className='text-2xl'>Loading rooms...</p></div>
                    )}
                    {error && !loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: 'red' }}>{error}</div>
                    )}
                    {!loading && !error && rooms.map((room) => (
                        <div key={room.id} className="room-card-item">
                            <div className="room-image-container">
                                <img src={room.image} alt={room.name} className="room-img" />
                                <div className={`room-status-badge ${room.status.toLowerCase()}`}>
                                    {getStatusIcon(room.status)}
                                    <span>{room.status}</span>
                                </div>
                            </div>

                            <div className="room-info-section">
                                <h3 className="room-name-text">{room.name}</h3>
                                <p className="room-capacity-text">{room.capacity}</p>

                                <div className="room-pricing-row">
                                    <span className="hourly-rate">Hourly Rate:</span>
                                    <span className="price-amount">{room.price}</span>
                                </div>

                                <button
                                    type="button"
                                    className={`room-schedule-btn ${room.status.toLowerCase()} ${!room.available ? 'force-clickable' : ''}`}
                                    onClick={() => handleRoomSchedule(room.name)}
                                    title={!room.available ? 'Status: ' + room.sttus : ''}
                                >
                                    {room.name} Schedule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Legend */}
                <div className="status-legend !mb-20">
                    <h3 className="legend-title">Room Status Legend</h3>
                    <div className="legend-items">
                        <div className="legend-item">
                            {getStatusIcon('available')}
                            <div className="legend-text">
                                <span className="legend-name" style={{ color: "#288F37" }}>Available</span>
                                <span className="legend-desc" style={{ color: "#16BC39" }}>Ready for booking</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            {getStatusIcon('occupied')}
                            <div className="legend-text">
                                <span className="legend-name" style={{ color: "#CA2F2F" }}>Occupied</span>
                                <span className="legend-desc" style={{ color: "#EB1A1A" }}>Currently in use</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            {getStatusIcon('booked')}
                            <div className="legend-text">
                                <span className="legend-name" style={{ color: "#B98117" }}>Booked</span>
                                <span className="legend-desc" style={{ color: "#CB9F26" }}>Already booked</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseRoom;