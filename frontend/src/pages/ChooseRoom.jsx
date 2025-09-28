import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import './ChooseRoom.css';
import roomImage from '../assets/10p_room.jpg'; // ใช้รูปภาพที่ส่งมา
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

function ChooseRoom() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
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
                        capacity: r.number_people ? `Fit for ${r.number_people} people` : '—',
                        price: r.price ? `${parseFloat(r.price).toFixed(0)} THB` : '—',
                        status: statusCap,
                        available: statusRaw === 'available',
                        image: roomImage
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
            return;
        }
        try {
            sessionStorage.setItem('selectedRoom', roomName);
        } catch (e) {
            // fallback silently
        }
        navigate('/fill-book-room');
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'available': 
                return (
                    <div className="status-icon available">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#10B981"/>
                            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                );
            case 'occupied': 
                return (
                    <div className="status-icon occupied">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#EF4444"/>
                            <circle cx="8" cy="8" r="2" fill="white"/>
                        </svg>
                    </div>
                );
            case 'booked': 
                return (
                    <div className="status-icon booked">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#F59E0B"/>
                            <rect x="5" y="4" width="6" height="7" rx="1" fill="white"/>
                            <rect x="6" y="6" width="4" height="1" fill="#F59E0B"/>
                            <rect x="6" y="8" width="4" height="1" fill="#F59E0B"/>
                        </svg>
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
                                    className={`room-schedule-btn ${room.status.toLowerCase()}`}
                                    disabled={!room.available}
                                    aria-disabled={!room.available}
                                    onClick={() => room.available && handleRoomSchedule(room.name)}
                                >
                                    {room.name} Schedule
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Legend */}
                <div className="status-legend">
                    <h3 className="legend-title">Room Status Legend</h3>
                    <div className="legend-items">
                        <div className="legend-item">
                            {getStatusIcon('available')}
                            <div className="legend-text">
                                <span className="legend-name">Available</span>
                                <span className="legend-desc">Ready for booking</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            {getStatusIcon('occupied')}
                            <div className="legend-text">
                                <span className="legend-name">Occupied</span>
                                <span className="legend-desc">Currently in use</span>
                            </div>
                        </div>
                        <div className="legend-item">
                            {getStatusIcon('booked')}
                            <div className="legend-text">
                                <span className="legend-name">Booked</span>
                                <span className="legend-desc">Reserved for later</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChooseRoom;