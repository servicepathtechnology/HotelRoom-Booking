import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, Mail, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      let sbUser = null;
      let sbErrorMsg = null;

      // 1. Try Supabase Auth
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          
          if (error) {
              sbErrorMsg = error.message;
              if (error.message.includes("Email not confirmed")) {
                  sbErrorMsg = "Email not confirmed. Please click the verification link sent to your email, or disable 'Confirm email' in Supabase Auth settings.";
              }
              console.warn("Supabase Auth failed, falling back locally:", sbErrorMsg);
          } else if (data?.user) {
              sbUser = data.user;
          }
        } catch (sbEx) {
            console.warn("Supabase exception, falling back locally:", sbEx.message);
            sbErrorMsg = sbEx.message;
        }
      }
      
      // 2. Success via Supabase
      if (sbUser) {
        const userObj = {
          id: sbUser.id,
          name: sbUser.user_metadata?.full_name || 'User',
          email: sbUser.email,
          role: 'guest'
        };
        localStorage.setItem('user', JSON.stringify(userObj));
        window.dispatchEvent(new Event('storage'));
        navigate('/dashboard');
        return;
      } 
      
      // 3. Fallback to Local FastAPI
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const resData = await res.json();
      
      if (!res.ok) {
        // If local also fails, throw the most helpful error
        throw new Error(sbErrorMsg || resData.detail || 'Login failed Check your credentials.');
      }
      
      localStorage.setItem('user', JSON.stringify(resData.user));
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
            <h2>Welcome back</h2>
            <p>Log in to your account</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input 
                  type="email" 
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
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
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  required 
                />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
