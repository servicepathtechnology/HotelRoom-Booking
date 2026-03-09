import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Calendar, Shield, Bot, Search, ChartBar } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Premium Hero Section */}
      <section className="hero-section">
        <div className="hero-bg-overlay"></div>
        <div className="hero-content container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              Your Stay,<br/>Reimagined by AI
            </h1>
            <p className="hero-subtitle">
              Experience the pinnacle of luxury with our intelligent concierge, dynamic room personalization, and seamless booking.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/rooms')}>
                Book Now
              </button>
              <button className="btn btn-outline glass" onClick={() => {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
              }}>
                See How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Features Section */}
      <section id="features" className="features-section container">
        <div className="section-header text-center">
          <h2 className="section-title">The Future of Hospitality</h2>
          <p className="section-desc">Discover how artificial intelligence elevates every moment of your stay.</p>
        </div>

        <div className="features-grid">
          <motion.div whileHover={{ y: -5 }} className="feature-card glass-card">
            <div className="feature-icon mb-4"><Sparkles size={32} /></div>
            <h3>Personalized Guest Experience</h3>
            <p>Our AI learns your preferences—from room temperature to pillow type—ensuring your room is perfect before you even arrive.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="feature-card glass-card">
            <div className="feature-icon mb-4"><Bot size={32} /></div>
            <h3>Intelligent Operations</h3>
            <p>Predictive housekeeping and dynamic staffing ensure immaculate service without interrupting your peace.</p>
          </motion.div>

          <motion.div whileHover={{ y: -5 }} className="feature-card glass-card">
            <div className="feature-icon mb-4"><ChartBar size={32} /></div>
            <h3>Dynamic Pricing & Analytics</h3>
            <p>Benefit from smart pricing algorithms that align with real-time demand, offering you the best value for your dates.</p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Timeline */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Seamless AI Booking Flow</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-step">
              <div className="step-number">1</div>
              <h4>Chat with Aria</h4>
              <p>Tell our AI concierge what you're looking for.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">2</div>
              <h4>Smart Matching</h4>
              <p>Get personalized room recommendations instantly.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">3</div>
              <h4>Auto-Preferences</h4>
              <p>Your room settings are configured to your profile.</p>
            </div>
            <div className="timeline-step">
              <div className="step-number">4</div>
              <h4>Seamless Arrival</h4>
              <p>Skip the desk with digital keys and smart check-in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Live AI Stats */}
      <section className="stats-section container">
        <div className="stats-grid glass-card">
          <div className="stat-item">
            <h3 className="stat-number">2,847</h3>
            <p>Bookings Automated This Month</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">98%</h3>
            <p>Guest Satisfaction Score</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">4.9/5</h3>
            <p>Average AI Concierge Rating</p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer-section">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>The Grand Aura</h3>
              <p>Redefining luxury through intelligence.</p>
            </div>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact Support</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 The Grand Aura AI Hotel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
