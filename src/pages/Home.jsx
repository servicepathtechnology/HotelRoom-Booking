import React from 'react';
import { Calendar, Users, Search, MapPin, Building2, Briefcase } from 'lucide-react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* GoIbibo / MMT Style Hero Header */}
      <section className="ota-hero">
        <div className="ota-hero-bg"></div>
        
        <div className="container ota-hero-content">
          <div className="ota-promos">
            <span className="ota-tag">Great Offers</span>
            <span className="ota-welcome">Book Hotels & Homestays</span>
          </div>
          
          <h1 className="ota-hero-title">
            Find your next stay
          </h1>
          <p className="ota-hero-subtitle">Search low prices on hotels, homes and much more...</p>
        </div>

        {/* Global Search Container overlaying the hero */}
        <div className="container">
          <div className="ota-search-widget">
            
            {/* Search Top Toggle */}
            <div className="search-tabs">
              <button className="tab-btn active"><Building2 size={16}/> Hotels</button>
              <button className="tab-btn"><Building2 size={16}/> Homestays & Villas</button>
              <button className="tab-btn"><Briefcase size={16}/> Corporates</button>
            </div>

            <div className="search-inputs-grid">
              
              <div className="search-field interactive-field">
                <label>CITY, PROPERTY NAME OR LOCATION</label>
                <div className="field-value">
                  <span className="primary-val">Goa</span>
                  <span className="secondary-val">India</span>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field interactive-field">
                <label>CHECK-IN</label>
                <div className="field-value">
                  <span className="primary-val">12 Nov <span className="text-sm font-normal">Tue</span></span>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field interactive-field">
                <label>CHECK-OUT</label>
                <div className="field-value">
                   <span className="primary-val">15 Nov <span className="text-sm font-normal">Fri</span></span>
                </div>
              </div>

              <div className="search-divider"></div>

              <div className="search-field interactive-field">
                <label>ROOMS & GUESTS</label>
                <div className="field-value">
                   <span className="primary-val">1 Room, 2 Adults</span>
                </div>
              </div>

            </div>

            <button className="ota-search-btn" onClick={() => navigate('/rooms')}>
               SEARCH
            </button>
          </div>
        </div>
      </section>

      {/* Featured Offers Section */}
      <section className="offers-section container">
        <div className="section-head">
          <h2>Offers Selected For You</h2>
        </div>
        
        <div className="offers-grid">
          <div className="offer-card c-blue">
            <div className="offer-content">
               <span className="offer-pill">DOMESTIC HOTELS</span>
               <h3>Grab FLAT 12% OFF* on Hotels</h3>
               <p>Enjoy a luxurious staycation</p>
               <button className="btn-book-now">Book Now</button>
            </div>
          </div>

          <div className="offer-card c-purple">
            <div className="offer-content">
               <span className="offer-pill">VILLAS & MORE</span>
               <h3>Stayed in a Villa Yet?</h3>
               <p>Explore gorgeous properties up to 40% OFF</p>
               <button className="btn-book-now">Book Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="features-section container">
        <h2 className="text-center mb-section">Why Book With TravelStay?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-blue-100">
              <span className="feature-emoji">🛡️</span>
            </div>
            <h3>100% Secure Payments</h3>
            <p>Moving your card details to a secure trust-backed system.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-green-100">
              <span className="feature-emoji">⭐</span>
            </div>
            <h3>Millions of Reviews</h3>
            <p>Read verified reviews from millions of happy travelers globally.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrapper bg-purple-100">
              <span className="feature-emoji">📞</span>
            </div>
            <h3>24/7 Customer Support</h3>
            <p>Our dedicated support team is available via chat, email, or phone.</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
