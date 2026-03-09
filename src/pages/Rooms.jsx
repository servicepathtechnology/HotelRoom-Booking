import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ChevronDown, Check, Info } from 'lucide-react';
import './Rooms.css';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [priceFilters, setPriceFilters] = useState([]);
  const [sortOption, setSortOption] = useState('popularity');

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

    // Apply Price Filters
    if (priceFilters.length > 0) {
      result = result.filter(room => {
        return priceFilters.some(range => {
          if (range === '0-50') return room.price <= 50;
          if (range === '50-100') return room.price > 50 && room.price <= 100;
          if (range === '100-200') return room.price > 100 && room.price <= 200;
          if (range === '200+') return room.price > 200;
          return false;
        });
      });
    }

    // Apply Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }
    // 'popularity' could just leave as default fetched order or we can sort by id

    setFilteredRooms(result);
  }, [priceFilters, sortOption, rooms]);

  const handlePriceToggle = (range) => {
    setPriceFilters(prev => 
      prev.includes(range) ? prev.filter(r => r !== range) : [...prev, range]
    );
  };

  const handleBook = (roomId) => {
    navigate('/login');
  };

  return (
    <div className="rooms-page">
      <div className="search-header-bar">
        <div className="container">
          <h2>Hotels and more in Goa</h2>
          <p>{filteredRooms.length} properties found</p>
        </div>
      </div>

      <div className="container rooms-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-box">
            <h3>Search Filters</h3>
            
            <div className="filter-group">
              <label className="filter-title">Price Range per night</label>
              <div className="checkbox-row">
                <input type="checkbox" checked={priceFilters.includes('0-50')} onChange={() => handlePriceToggle('0-50')} /> <span>$0 - $50</span>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={priceFilters.includes('50-100')} onChange={() => handlePriceToggle('50-100')} /> <span>$50 - $100</span>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={priceFilters.includes('100-200')} onChange={() => handlePriceToggle('100-200')} /> <span>$100 - $200</span>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" checked={priceFilters.includes('200+')} onChange={() => handlePriceToggle('200+')} /> <span>$200+</span>
              </div>
            </div>

            <div className="filter-group border-top">
              <label className="filter-title">Star Category</label>
              <div className="checkbox-row"><input type="checkbox"/> <span>5 Star</span></div>
              <div className="checkbox-row"><input type="checkbox"/> <span>4 Star</span></div>
              <div className="checkbox-row"><input type="checkbox"/> <span>3 Star</span></div>
            </div>

            <div className="filter-group border-top">
              <label className="filter-title">Popular Filters</label>
              <div className="checkbox-row"><input type="checkbox"/> <span>Breakfast Included</span></div>
              <div className="checkbox-row"><input type="checkbox"/> <span>Free Cancellation</span></div>
              <div className="checkbox-row"><input type="checkbox"/> <span>Pool</span></div>
              <div className="checkbox-row"><input type="checkbox"/> <span>Spa</span></div>
            </div>
          </div>
        </aside>

        {/* Listings */}
        <main className="listings-area">
          <div className="sort-bar">
            <span>Sort by: 
              <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
                <option value="popularity">Popularity</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </span>
          </div>

          {loading ? (
            <div className="loading-state">Loading properties...</div>
          ) : (
            <div className="hotel-list">
              {filteredRooms.map(room => (
                <div key={room.id} className="hotel-card-ota">
                  <div className="hotel-image-col">
                    <img src={room.image_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={room.type} />
                  </div>
                  
                  <div className="hotel-details-col">
                    <div className="hotel-header-flex">
                      <div>
                        <h2>{room.type}</h2>
                        <div className="hotel-rating">
                          {[...Array(5)].map((_, i) => <Star key={i} size={14} className="star-fill"/>)}
                          <span className="rating-text">4.8 (1,245 Ratings) • Excellent</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="hotel-location"><MapPin size={14}/> South Goa, Goa • 2.5 km from center</p>
                    
                    <div className="hotel-features-list">
                      <span className="hf-pill">Couples Friendly</span>
                      <span className="hf-pill">Safe & Hygienic</span>
                    </div>

                    <ul className="hotel-amenities">
                      {room.features.slice(0, 3).map((feat, i) => (
                        <li key={i}><Check size={14} className="text-green-600"/> {feat}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="hotel-price-col">
                    <div className="price-top">
                      <div className="discount-badge">Save 20%</div>
                      <p className="original-price">${(room.price * 1.25).toFixed(0)}</p>
                      <h3 className="final-price">${room.price}</h3>
                      <p className="tax-info">+ $15 taxes and fees</p>
                      <p className="per-night-text">Per Night</p>
                    </div>
                    <div className="price-bottom">
                      <button className="ota-book-btn" onClick={() => handleBook(room.id)}>Book Now</button>
                      <p className="cancellation-text"><Info size={12}/> Free Cancellation</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Rooms;
