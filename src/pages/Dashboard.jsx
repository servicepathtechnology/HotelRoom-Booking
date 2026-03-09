import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Star, Sparkles, MapPin } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    
    fetchDashboardData(userData.id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      const [recRes, bookRes] = await Promise.all([
        fetch(`http://localhost:8000/api/ai/recommendations/${userId}`),
        fetch(`http://localhost:8000/api/bookings/user/${userId}`)
      ]);
      
      if (recRes.ok) {
          const recData = await recRes.json();
          setRecommendations(recData);
      }
      if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBookings(Array.isArray(bookData) ? bookData : []);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading-state container">Loading your experience...</div>;

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <div className="user-welcome">
          <div className="user-avatar-large">
            <User size={32} />
          </div>
          <div>
            <h1>Welcome back, {user?.name}!</h1>
            <p>Your personalized stay awaits.</p>
          </div>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>Log out</button>
      </div>

      <div className="dashboard-grid">
        {/* Main Column */}
        <div className="dashboard-main">
          {/* AI Recommendations Panel */}
          <section className="dashboard-panel ai-panel">
            <div className="panel-header">
              <h2><Sparkles className="text-purple-500" /> Recommendations</h2>
            </div>
            <div className="panel-body">
              <p className="ai-insight-text">
                Based on your past stays, we have customized your experience.
              </p>
              
              <div className="recommendation-cards">
                <div className="rec-card">
                  <Star className="rec-icon" />
                  <h4>Preferred Room</h4>
                  <p>{recommendations?.recommended_room}</p>
                </div>
                <div className="rec-card">
                  <MapPin className="rec-icon text-orange-500" />
                  <h4>Dining Profile</h4>
                  <p>{recommendations?.food}</p>
                </div>
              </div>
              
              <div className="ai-offers">
                <h4>Special Offers for You</h4>
                <ul>
                  {recommendations?.offers?.map((offer, idx) => (
                    <li key={idx}>🎁 {offer}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Bookings History */}
          <section className="dashboard-panel mt-6">
            <div className="panel-header">
              <h2><Calendar /> Your Bookings</h2>
            </div>
            <div className="panel-body">
              {bookings.length === 0 ? (
                <div className="empty-state">
                  <p>You have no upcoming bookings.</p>
                  <button className="btn btn-primary mt-4" onClick={() => navigate('/rooms')}>Book a Room</button>
                </div>
              ) : (
                <div className="booking-list">
                  {bookings.map(booking => (
                    <div key={booking.id} className="booking-item card-hover">
                      <div className="booking-info">
                        <h3>Room #{booking.room_id}</h3>
                        <p className="booking-dates">
                          {booking.check_in} to {booking.check_out}
                        </p>
                        <span className={`status-badge ${booking.status.toLowerCase()}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="booking-price">
                        ${booking.total_price}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="dashboard-sidebar">
           <section className="dashboard-panel bg-primary text-white">
             <h3>Quick Automations</h3>
             <ul className="action-list mt-4">
               <li><button className="action-btn">Request Late Checkout</button></li>
               <li><button className="action-btn">Order Room Service Menu</button></li>
               <li><button className="action-btn">Control Room Temp</button></li>
             </ul>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
