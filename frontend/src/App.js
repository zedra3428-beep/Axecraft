import React from 'react';
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import ParallaxBackground from './components/ParallaxBackground';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import RulesPage from './pages/RulesPage';
import StaffPage from './pages/StaffPage';
import ShopPage from './pages/ShopPage';
import LeaderboardPage from './pages/LeaderboardPage';

function App() {
  return (
    <ThemeProvider>
      <div className="App relative min-h-screen overflow-x-hidden">
        {/* Parallax Background */}
        <ParallaxBackground />
        
        {/* Toast Notifications */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white'
            }
          }}
        />
        
        <BrowserRouter>
          {/* Navigation */}
          <Navigation />
          
          {/* Main Content */}
          <main className="relative">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jeux" element={<GamesPage />} />
              <Route path="/regles" element={<RulesPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/boutique" element={<ShopPage />} />
              <Route path="/classement" element={<LeaderboardPage />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <Footer />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
