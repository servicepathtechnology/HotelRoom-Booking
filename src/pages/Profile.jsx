import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CreditCard, Settings, Camera } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if logged in via our mock backend locally or via Supabase Auth
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    let currentUser = null;

    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        currentUser = {
            id: session.user.id,
            name: session.user.user_metadata?.full_name || 'Guest User',
            email: session.user.email,
            role: 'guest'
        };
      }
    }
    
    // Fallback to local storage (mock backend)
    if (!currentUser) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            currentUser = JSON.parse(userStr);
        }
    }

    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return <div className="loading-state container">Loading your profile...</div>;

  return (
    <div className="profile-page container">
      <div className="profile-header">
        <h1>Your Profile</h1>
        <p>Manage your real-time data, connected to {supabase ? 'Supabase' : 'FastAPI'}</p>
      </div>

      <div className="profile-grid">
        <div className="profile-sidebar">
           <div className="profile-card">
              <div className="profile-photo-wrapper">
                 <div className="profile-photo placeholder">
                    {user?.name?.charAt(0) || 'U'}
                 </div>
                 <button className="photo-edit-btn"><Camera size={16}/></button>
              </div>
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-role badge">{user?.role}</p>
              
              <div className="profile-nav">
                  <button className="nav-item active"><User size={18}/> Personal Info</button>
                  <button className="nav-item"><CreditCard size={18}/> Payment Methods</button>
                  <button className="nav-item"><Settings size={18}/> Settings</button>
              </div>
           </div>
        </div>
        
        <div className="profile-main">
            <div className="profile-content-card">
                <h3>Personal Information</h3>
                <hr className="divider" />
                
                <form className="profile-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <div className="input-wrapper disabled">
                            <User className="input-icon" size={18} />
                            <input type="text" value={user?.name || ''} readOnly />
                        </div>
                    </div>
                    
                    <div className="form-group mt-4">
                        <label>Email Address</label>
                        <div className="input-wrapper disabled">
                            <Mail className="input-icon" size={18} />
                            <input type="email" value={user?.email || ''} readOnly />
                        </div>
                    </div>

                    <div className="auth-status mt-6">
                        <p className="status-text">
                            <strong>Authentication System:</strong> 
                            {supabase ? (
                                <span className="status-badge supabase-badge">Supabase Live DB</span>
                            ) : (
                                <span className="status-badge mock-badge">Local Persistent DB Fallback</span>
                            )}
                        </p>
                    </div>
                </form>

                <div className="danger-zone mt-8">
                    <h4>Danger Zone</h4>
                    <button className="btn btn-outline" onClick={handleLogout}>Sign Out Completely</button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
