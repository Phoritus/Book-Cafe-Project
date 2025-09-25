import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './ChooseRoom.css';
import roomImage from '../assets/10p_room.jpg'; // ใช้รูปภาพที่ส่งมา
import { useNavigate } from 'react-router-dom';

function ChooseRoom() {
    const navigate = useNavigate();
    const handleRoomSchedule = (room) => {
        navigate('/room-booking', { state: { room } });
    };
    const rooms = [
        {
            id: 1,
            name: "Room 1",
            capacity: "Fit for 6 people",
            price: "50 THB",
            status: "Booked",
            available: false,
            image: roomImage
        },
        {
            id: 2,
            name: "Room 2",
            capacity: "Fit for 6 people",
            price: "50 THB",
            status: "Booked",
            available: false,
            image: roomImage
        },
        {
            id: 3,
            name: "Room 3",
            capacity: "Fit for 10 people",
            price: "50 THB",
            status: "Occupied",
            available: false,
            image: roomImage
        },
        {
            id: 4,
            name: "Room 4",
            capacity: "Fit for 10 people",
            price: "50 THB",
            status: "Available",
            available: true,
            image: roomImage
        },
    ];


    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'available':
                return (
                    <div className="status-icon available">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#10B981" />
                            <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                );
            case 'occupied':
                return (
                    <div className="status-icon occupied">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#EF4444" />
                            <circle cx="8" cy="8" r="2" fill="white" />
                        </svg>
                    </div>
                );
            case 'booked':
                return (
                    <div className="status-icon booked">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                            <circle cx="8" cy="8" r="6" fill="#F59E0B" />
                            <rect x="5" y="4" width="6" height="7" rx="1" fill="white" />
                            <rect x="6" y="6" width="4" height="1" fill="#F59E0B" />
                            <rect x="6" y="8" width="4" height="1" fill="#F59E0B" />
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
                    {rooms.map((room) => (
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

                                <button key={room.id} onClick={() => handleRoomSchedule(room)}>
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