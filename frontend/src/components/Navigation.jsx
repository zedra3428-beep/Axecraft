import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Gamepad2, Users, ShoppingBag, Trophy, BookOpen, Home } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { path: '/', label: 'Accueil', icon: Home },
  { path: '/jeux', label: 'Jeux', icon: Gamepad2 },
  { path: '/regles', label: 'Règles', icon: BookOpen },
  { path: '/staff', label: 'Staff', icon: Users },
  { path: '/boutique', label: 'Boutique', icon: ShoppingBag },
  { path: '/classement', label: 'Classement', icon: Trophy }
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDay, toggleTimeOfDay } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        data-testid="main-navigation"
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center gap-2 px-2 py-2 rounded-full transition-all duration-500 ${
          isScrolled ? 'glass-strong' : 'glass'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-3">
          <img 
            src="https://customer-assets.emergentagent.com/job_54b6345b-423a-49ea-bf1f-8a8d2a7b8112/artifacts/c6eh7b7g_149gWZj%20-%20Imgur.png" 
            alt="Axecraft Logo" 
            className="w-10 h-10 rounded-lg"
          />
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-cyan-500/20 rounded-full -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Day/Night Toggle */}
        <button
          onClick={toggleTimeOfDay}
          data-testid="theme-toggle"
          className="ml-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Toggle theme"
        >
          {isDay ? <Moon size={18} className="text-cyan-400" /> : <Sun size={18} className="text-yellow-400" />}
        </button>
      </motion.nav>

      {/* Mobile Navigation */}
      <motion.div
        className="fixed top-4 left-4 right-4 z-50 lg:hidden"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? 'glass-strong' : 'glass'
        }`}>
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://customer-assets.emergentagent.com/job_54b6345b-423a-49ea-bf1f-8a8d2a7b8112/artifacts/c6eh7b7g_149gWZj%20-%20Imgur.png" 
              alt="Axecraft Logo" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-unbounded font-bold text-white">Axecraft</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTimeOfDay}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle theme"
            >
              {isDay ? <Moon size={18} className="text-cyan-400" /> : <Sun size={18} className="text-yellow-400" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 glass-strong rounded-2xl overflow-hidden"
            >
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-6 py-4 transition-colors ${
                        isActive 
                          ? 'bg-cyan-500/20 text-cyan-400' 
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Navigation;
