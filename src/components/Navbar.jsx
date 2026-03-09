import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, User, Menu } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Navbar.css';

const Navbar = () => {
  const [session, setSession] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check traditional or supabase session
    const checkState = async () => {
      let loggedUser = null;
      
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          loggedUser = { 
            name: data.session.user.user_metadata?.full_name || 'Guest',
            email: data.session.user.email 
          };
        }
      }
      
      if (!loggedUser) {
        const localUser = localStorage.getItem('user');
        if (localUser) {
          try { loggedUser = JSON.parse(localUser); } catch(e) {}
        }
      }
      
      setSession(!!loggedUser);
      setUser(loggedUser);
    };
    checkState();
    
    // Listen for auth changes
    window.addEventListener('storage', checkState);
    if (supabase) {
      supabase.auth.onAuthStateChange((event, session) => {
        checkState();
      });
    }
    
    return () => {
      window.removeEventListener('storage', checkState);
    };
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
    setDropdownOpen(false);
  };
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <Hotel className="logo-icon" />
          <span className="logo-text">TravelStay</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/rooms" className="nav-link">Rooms & Hotels</Link>
          <Link to="/workflow" className="nav-link">Workflow</Link>
          {session && <Link to="/admin" className="nav-link">Partner Dashboard</Link>}
        </div>
        
        <div className="navbar-actions">
          {session ? (
            <div className="profile-dropdown-container">
              <button 
                className="nav-profile-trigger" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="avatar-circle">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-greeting">
                  <span className="hi-text">Hi, {user?.name?.split(' ')[0] || 'User'}</span>
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="menu-header">
                    <strong>{user?.name}</strong>
                    <p>{user?.email}</p>
                  </div>
                  <hr className="menu-divider" />
                  <Link to="/profile" className="menu-item" onClick={() => setDropdownOpen(false)}>My Profile</Link>
                  <Link to="/dashboard" className="menu-item" onClick={() => setDropdownOpen(false)}>My Bookings</Link>
                  <button onClick={handleLogout} className="menu-item text-danger">Log Out</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">Log in</Link>
              <Link to="/signup" className="btn btn-primary">Sign up</Link>
            </>
          )}
          <button className="mobile-menu-btn">
            <Menu />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
