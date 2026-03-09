import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, Mail, Lock, User } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let sbUserId = null;
      let sbErrorMsg = null;
      
      // 1. Try Supabase Auth
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
              data: { full_name: name }
          }
        });
        
        if (error) {
          console.warn("Supabase Auth limits reached or error:", error.message);
          sbErrorMsg = error.message;
        } else if (data?.user) {
          sbUserId = data.user.id;
        }
      }
      
      // 2. Fallback / Sync with Local Backend
      // We ALWAYS create the user locally so if Supabase blocks login later (e.g. email unconfirmed), local works.
      const res = await fetch('http://localhost:8000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const resData = await res.json();
      
      // If local failed AND supabase failed, throw error.
      if (!res.ok && !sbUserId) {
        throw new Error(resData.detail || sbErrorMsg || 'Signup failed');
      }
      
      // Use Supabase ID if available, otherwise local generated ID
      const userObj = {
        id: sbUserId || resData?.user?.id || Date.now(),
        name: name,
        email: email,
        role: 'guest'
      };
      
      localStorage.setItem('user', JSON.stringify(userObj));
      window.dispatchEvent(new Event('storage'));
      navigate('/dashboard');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <Hotel className="logo-icon" size={32} />
            </div>
            <h2>Create an account</h2>
            <p>Join our booking platform</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input 
                  type="text" 
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input 
                  type="password" 
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password" 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Log in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
