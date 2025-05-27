import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth';
import AuthLayout from './components/auth/AuthLayout';
import InstagramSearch from './components/instagram/InstagramSearch';
import YouTubeSearch from './components/youtube/YouTubeSearch';
import FavoritesPage from './components/FavoritesPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/instagram" replace />} />
            <Route path="/instagram" element={<InstagramSearch />} />
            <Route path="/youtube" element={<YouTubeSearch />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </AuthLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;