import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [manualOverride, setManualOverride] = useState(null);

  // Determine time of day based on real time
  useEffect(() => {
    const updateTimeOfDay = () => {
      if (manualOverride) {
        setTimeOfDay(manualOverride);
        return;
      }
      
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 18) {
        setTimeOfDay('day');
      } else {
        setTimeOfDay('night');
      }
    };

    updateTimeOfDay();
    const interval = setInterval(updateTimeOfDay, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [manualOverride]);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / docHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTimeOfDay = () => {
    setManualOverride(prev => {
      if (prev === 'day') return 'night';
      if (prev === 'night') return null;
      return 'day';
    });
  };

  // Determine current theme based on scroll and time
  const getCurrentTheme = () => {
    if (scrollProgress > 0.2) {
      return 'cave';
    }
    return timeOfDay;
  };

  const theme = getCurrentTheme();

  const colors = {
    day: {
      primary: '#10B981',
      secondary: '#38BDF8',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#0F172A'
    },
    night: {
      primary: '#0EA5E9',
      secondary: '#1E3A8A',
      background: '#020617',
      surface: '#0F172A',
      text: '#F8FAFC'
    },
    cave: {
      primary: '#22D3EE',
      secondary: '#F472B6',
      background: '#0B1120',
      surface: '#1E293B',
      text: '#F8FAFC'
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      timeOfDay,
      scrollProgress,
      colors: colors[theme],
      toggleTimeOfDay,
      isDay: timeOfDay === 'day',
      isNight: timeOfDay === 'night',
      isCave: theme === 'cave'
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
