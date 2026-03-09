import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Rooms from './pages/Rooms';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import DemoWorkflow from './pages/DemoWorkflow';
import Profile from './pages/Profile';
import Chatbot from './components/Chatbot';
import BookingFlow from './pages/BookingFlow';

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="app-container">
      {!isAdmin && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/book/:roomId" element={<BookingFlow />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/workflow" element={<DemoWorkflow />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      {!isAdmin && <Chatbot />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
