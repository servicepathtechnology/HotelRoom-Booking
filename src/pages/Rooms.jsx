import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, BedDouble, User, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import './Rooms.css';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortOption, setSortOption] = useState('recommended');

  useEffect(() => {
    fetch('http://localhost:8000/api/rooms/')
      .then(res => res.json())
      .then(data => {
        setRooms(data);
        setFilteredRooms(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let result = [...rooms];

    // Apply Filter
    if (typeFilter !== 'All') {
        result = result.filter(r => r.type.toLowerCase().includes(typeFilter.toLowerCase()));
    }

    // Apply Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'recommended') {
        // Mock recommended sort (e.g. bring Deluxe/Suite to top)
        result.sort((a, b) => b.price - a.price); 
    }

    setFilteredRooms(result);
  }, [typeFilter, sortOption, rooms]);


  const handleBook = (roomId) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
    } else {
      navigate(`/book/${roomId}`);
    }
  };

  return (
    <div className="rooms-page">
      <div className="rooms-hero">
        <div className="container">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rooms-hero-title"
          >
            Curated Suites & Rooms
          </motion.h1>
          <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
          >
            Experience unparalleled comfort, intelligently personalized for your stay.
          </motion.p>
        </div>
      </div>

      <div className="container rooms-layout">
        
        {/* Recommendation Banner */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="ai-recommendation-banner"
        >
            <Sparkles className="text-gold" />
            <span><strong>Aria's Recommendation:</strong> Based on your preference for ocean views and king beds, we recommend our Deluxe Rooms and Suites.</span>
        </motion.div>

        <div className="rooms-content-grid">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar glass-card">
              <div className="filter-box">
                <h3 className="flex items-center gap-2 mb-4"><Filter size={20}/> Filters</h3>
                
                <div className="filter-group">
                  <label className="filter-title">Room Type</label>
                  <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="premium-select">
                      <option value="All">All Suites & Rooms</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Suite">Suite</option>
                      <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Listings */}
            <main className="listings-area">
              <div className="sort-bar">
                <span className="results-count">{filteredRooms.length} Properties Available</span>
                <span className="sort-control">
                  Sort by: 
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="premium-select inline-select">
                    <option value="recommended">AI Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </span>
              </div>

              {loading ? (
                <div className="loading-state">Curating the perfect rooms...</div>
              ) : (
                <div className="hotel-grid">
                  {filteredRooms.map((room, idx) => (
                    <motion.div 
                        key={room.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="room-card glass-card"
                    >
                      <div className="room-image-wrapper">
                        <img src={room.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={room.type} />
                        {sortOption === 'recommended' && idx === 0 && (
                            <div className="ai-badge"><Sparkles size={14}/> Top Match</div>
                        )}
                        <div className="dynamic-price-badge">
                            ₹{room.price} <span className="per-night">/ night</span>
                        </div>
                      </div>
                      
                      <div className="room-details">
                        <div className="room-header-flex">
                          <h2>{room.type}</h2>
                          <div className="room-rating">
                            <Star size={16} className="star-fill"/> 4.9
                          </div>
                        </div>
                        
                        <div className="room-amenities">
                            <span className="amenity"><BedDouble size={16}/> {room.features[0] || 'King Bed'}</span>
                            <span className="amenity"><User size={16}/> Up to 2 Guests</span>
                        </div>

                        <ul className="room-features-list">
                          {room.features.slice(1, 4).map((feat, i) => (
                            <li key={i}>{feat}</li>
                          ))}
                        </ul>

                        <button className="btn btn-primary w-full mt-4" onClick={() => handleBook(room.id)}>
                            Reserve Suite
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </main>
        </div>
      </div>
    </div>
  );
};

export default Rooms;
