import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './BookingFlow.css';

const BookingFlow = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequest, setSpecialRequest] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Basic auth check
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    // Fetch room details (mocking it from all rooms for demo)
    fetch('http://localhost:8000/api/rooms/')
      .then(res => res.json())
      .then(data => {
        const found = data.find(r => r.id.toString() === roomId.toString());
        if (found) setRoom(found);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [roomId, navigate]);

  const calculateTotal = () => {
    if (!checkIn || !checkOut || !room) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * room.price : room.price;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
        setError('Please select check-in and check-out dates.');
        return;
    }
    setError('');
    setIsSubmitting(true);
    
    try {
        const localUser = JSON.parse(localStorage.getItem('user'));
        const totalPrice = calculateTotal();

        const bookingData = {
            user_id: localUser.id.toString(),
            room_id: parseInt(roomId),
            check_in: checkIn,
            check_out: checkOut,
            guests: parseInt(guests),
            special_request: specialRequest,
            total_price: totalPrice
        };

        // 1. Try pushing to Supabase directly if configured
        if (supabase) {
            try {
                const { error: sbError } = await supabase
                    .from('bookings')
                    .insert([bookingData]);
                if (sbError) console.warn('Supabase DB error:', sbError);
            } catch (err) {
                console.warn('Supabase not available or tables unconfigured.');
            }
        }

        // 2. Always sink to local API
        const res = await fetch('http://localhost:8000/api/bookings/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData)
        });

        if (!res.ok) throw new Error('Failed to create booking on server.');
        
        // redirect to dashboard to see the booking
        navigate('/dashboard');

    } catch (err) {
        console.error(err);
        setError('Booking failed. Please check your connection and try again.');
        setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state container">Preparing your booking...</div>;
  if (!room) return <div className="loading-state container">Room not found.</div>;

  return (
    <div className="booking-page">
      <div className="container booking-container">
        <h1 className="booking-title">Complete Your Reservation</h1>
        
        <div className="booking-grid">
          {/* Form */}
          <div className="booking-form-card glass-card">
            <h2>Guest Details & Stay</h2>
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleBooking}>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label><Calendar size={16}/> Check-in Date</label>
                  <input 
                    type="date" 
                    value={checkIn} 
                    onChange={e => setCheckIn(e.target.value)}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group flex-1">
                  <label><Calendar size={16}/> Check-out Date</label>
                  <input 
                    type="date" 
                    value={checkOut} 
                    onChange={e => setCheckOut(e.target.value)}
                    required
                    min={checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label><User size={16}/> Number of Guests</label>
                <select value={guests} onChange={e => setGuests(e.target.value)} required>
                  {[1,2,3,4].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>Special Requests (Optional)</label>
                <textarea 
                  rows="3" 
                  value={specialRequest} 
                  onChange={e => setSpecialRequest(e.target.value)}
                  placeholder="E.g. Early check-in, dietary requirements..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Confirming...' : 'Confirm Reservation'} <ArrowRight size={18}/>
              </button>
            </form>
          </div>

          {/* Summary */}
          <div className="booking-summary-card glass-card">
            <div className="summary-room-img">
                <img src={room.image_url} alt={room.type} />
            </div>
            <div className="summary-content">
                <h3>{room.type}</h3>
                <p className="summary-rate">₹{room.price} / night</p>
                <hr className="summary-divider"/>
                
                <div className="price-breakdown">
                    <div className="price-row">
                        <span>Base Rate</span>
                        <span>₹{room.price}</span>
                    </div>
                    <div className="price-row">
                        <span>Taxes & Fees</span>
                        <span>₹500</span>
                    </div>
                    <div className="price-row total-row">
                        <span>Total Estimate</span>
                        <span>₹{calculateTotal() > 0 ? calculateTotal() + 500 : room.price + 500}</span>
                    </div>
                </div>

                <div className="secure-badge">
                    <ShieldCheck className="text-accent" size={20} />
                    <span>Secure Booking Encryption</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;
