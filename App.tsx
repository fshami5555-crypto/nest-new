
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProfile } from './types';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PsychChat from './pages/PsychChat';
import Fitness from './pages/Fitness';
import Store from './pages/Store';
import Community from './pages/Community';
import SkinCare from './pages/SkinCare';
import FamilyCare from './pages/FamilyCare';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('nest_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem('nest_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nest_user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="animate-bounce">
          <img src="https://i.ibb.co/TM561d6q/image.png" className="w-20 h-20" alt="Logo" />
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-pink-50 pb-28 md:pb-8">
        {user && !user.isAdmin && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          <Route path="/" element={user ? (user.isAdmin ? <Navigate to="/admin" /> : <Dashboard user={user} />) : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!user ? <Signup onSignup={handleLogin} /> : <Navigate to="/" />} />
          
          <Route path="/psych-chat" element={user ? <PsychChat user={user} /> : <Navigate to="/login" />} />
          <Route path="/fitness" element={user ? <Fitness user={user} /> : <Navigate to="/login" />} />
          <Route path="/store" element={user ? <Store user={user} /> : <Navigate to="/login" />} />
          <Route path="/community" element={user ? <Community user={user} /> : <Navigate to="/login" />} />
          <Route path="/skincare" element={user ? <SkinCare user={user} /> : <Navigate to="/login" />} />
          <Route path="/familycare" element={user ? <FamilyCare user={user} /> : <Navigate to="/login" />} />
          
          <Route path="/admin" element={user?.isAdmin ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
        </Routes>

        {user && !user.isAdmin && <BottomNav />}
      </div>
    </Router>
  );
};

export default App;
