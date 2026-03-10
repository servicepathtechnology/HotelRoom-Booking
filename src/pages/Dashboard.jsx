import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Star, Sparkles, MapPin, Edit3, Save, X } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(userStr);
    setUser(userData);
    setEditName(userData.name || '');
    setEditEmail(userData.email || '');
    
    fetchDashboardData(userData.id);
  }, [navigate]);

  const fetchDashboardData = async (userId) => {
    try {
      const [recRes, bookRes] = await Promise.all([
        fetch(`https://hotel-backend-coral.vercel.app/api/ai/recommendations/${userId}`),
        fetch(`https://hotel-backend-coral.vercel.app/api/bookings/user/${userId}`)
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

  const handleSaveProfile = async () => {
    try {
      setUpdateMsg('Updating...');
      const res = await fetch(`https://hotel-backend-coral.vercel.app/api/auth/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, email: editEmail })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUpdateMsg('Profile updated!');
        setTimeout(() => {
            setIsEditing(false);
            setUpdateMsg('');
        }, 1500);
      } else {
        setUpdateMsg('Failed to update.');
      }
    } catch(err) {
      setUpdateMsg('Connection error.');
    }
  };

  if (loading) return <div className="loading-state container">Loading your experience...</div>;

  return (
    <div className="dashboard-page container">
      <div className="dashboard-header">
        <div className="user-welcome">
          <div className="user-avatar-large">
             {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            {isEditing ? (
                <div className="edit-profile-form">
                    <input 
                        type="text" 
                        value={editName} 
                        onChange={e => setEditName(e.target.value)} 
                        className="premium-input mb-2"
                        placeholder="Your Name"
                    />
                    <input 
                        type="email" 
                        value={editEmail} 
                        onChange={e => setEditEmail(e.target.value)} 
                        className="premium-input"
                        placeholder="Your Email"
                    />
                    <div className="mt-2 flex gap-2">
                        <button className="btn btn-primary btn-sm" onClick={handleSaveProfile}><Save size={16}/> Save</button>
                        <button className="btn btn-outline btn-sm glass text-gray-800" onClick={() => setIsEditing(false)}><X size={16}/> Cancel</button>
                    </div>
                    {updateMsg && <span className="text-sm ml-2 text-primary">{updateMsg}</span>}
                </div>
            ) : (
                <>
                    <h1 className="flex items-center gap-3">
                        Welcome back, {user?.name}! 
                        <button onClick={() => setIsEditing(true)} className="edit-icon-btn"><Edit3 size={18}/></button>
                    </h1>
                    <p>{user?.email} • Your personalized stay awaits.</p>
                </>
            )}
          </div>
        </div>
        {!isEditing && <button className="btn btn-outline" onClick={handleLogout}>Log out</button>}
      </div>

      <div className="dashboard-grid">
        {/* Main Column */}
        <div className="dashboard-main">
          {/* Recommended for You Panel */}
          <section className="dashboard-panel ai-panel">
            <div className="panel-header">
              <h2><Sparkles className="text-purple-500" /> Recommended for You</h2>
            </div>
            <div className="panel-body">
              <p className="ai-insight-text">
                Based on your past travels, we found these deals you might like.
              </p>
              
              <div className="recommendation-cards">
                <div className="rec-card">
                  <Star className="rec-icon" />
                  <h4>Top Match</h4>
                  <p>{recommendations?.recommended_room || 'Goa Beach Resort'}</p>
                </div>
                <div className="rec-card">
                  <MapPin className="rec-icon text-orange-500" />
                  <h4>Trending Destination</h4>
                  <p>Bali, Indonesia</p>
                </div>
              </div>
              
              <div className="ai-offers">
                <h4>Exclusive Member Offers</h4>
                <ul>
                  <li>🎁 Early Bird Discount: 15% off next booking</li>
                  <li>✈️ Flight + Hotel bundles now available</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Bookings History */}
          <section className="dashboard-panel mt-6" id="bookings-section">
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
                        ₹{booking.total_price}
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
             <h3>Quick Links</h3>
             <ul className="action-list mt-4">
               <li><button className="action-btn" onClick={() => document.getElementById('bookings-section').scrollIntoView({ behavior: 'smooth' })}>Manage Bookings</button></li>
               <li><button className="action-btn" onClick={() => window.print()}>Print Itinerary</button></li>
               <li><button className="action-btn" onClick={() => window.location.href = 'mailto:support@travelstay.com'}>Contact Travel Support</button></li>
             </ul>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
