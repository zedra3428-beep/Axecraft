import React, { useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

// Cherry Blossom Petals Component
const CherryPetals = () => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const createPetal = () => {
      const id = Date.now() + Math.random();
      const petal = {
        id,
        left: Math.random() * 100,
        animationDuration: 8 + Math.random() * 6,
        delay: Math.random() * 5,
        size: 8 + Math.random() * 12
      };
      
      setPetals(prev => [...prev.slice(-30), petal]);
      
      setTimeout(() => {
        setPetals(prev => prev.filter(p => p.id !== id));
      }, (petal.animationDuration + petal.delay) * 1000);
    };

    const interval = setInterval(createPetal, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {petals.map(petal => (
        <motion.div
          key={petal.id}
          className="absolute"
          initial={{ y: -50, x: 0, rotate: 0, opacity: 0.8 }}
          animate={{
            y: window.innerHeight + 100,
            x: [0, 30, -20, 40, 0],
            rotate: [0, 180, 360, 540, 720],
            opacity: [0.8, 0.9, 0.7, 0.5, 0]
          }}
          transition={{
            duration: petal.animationDuration,
            delay: petal.delay,
            ease: "linear",
            x: {
              duration: petal.animationDuration,
              ease: "easeInOut",
              repeat: 0
            }
          }}
          style={{
            left: `${petal.left}%`,
            width: petal.size,
            height: petal.size
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <path
              d="M10 0 C15 5, 20 10, 10 20 C0 10, 5 5, 10 0"
              fill="url(#petalGradient)"
            />
            <defs>
              <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#FBBF24" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// Floating Particles for Cave
const CaveParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 3 + Math.random() * 4,
    delay: Math.random() * 2
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-cyan-400"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
            boxShadow: `0 0 ${particle.size * 3}px rgba(34, 211, 238, 0.6)`
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const ParallaxBackground = () => {
  const { scrollProgress, theme, isDay } = useTheme();
  const { scrollY } = useScroll();

  // Parallax transforms
  const skyY = useTransform(scrollY, [0, 1000], [0, 200]);
  const hillsY = useTransform(scrollY, [0, 1000], [0, 300]);
  const caveOpacity = useTransform(scrollY, [200, 600], [0, 1]);
  const surfaceOpacity = useTransform(scrollY, [200, 600], [1, 0]);

  return (
    <>
      {/* Base Background Gradient */}
      <div 
        className="fixed inset-0 transition-all duration-1000 z-0"
        style={{
          background: isDay 
            ? 'linear-gradient(180deg, #87CEEB 0%, #98D8C8 30%, #10B981 60%, #065F46 100%)'
            : 'linear-gradient(180deg, #0F172A 0%, #1E3A8A 30%, #0EA5E9 60%, #065F46 100%)'
        }}
      />

      {/* Surface Layer - Plains */}
      <motion.div
        className="fixed inset-0 z-10"
        style={{ 
          opacity: surfaceOpacity,
          y: skyY
        }}
      >
        {/* Sun/Moon */}
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{
            top: '10%',
            right: '15%',
            background: isDay 
              ? 'radial-gradient(circle, #FBBF24 0%, #F59E0B 50%, transparent 70%)'
              : 'radial-gradient(circle, #F8FAFC 0%, #CBD5E1 50%, transparent 70%)',
            boxShadow: isDay
              ? '0 0 100px rgba(251, 191, 36, 0.5)'
              : '0 0 80px rgba(248, 250, 252, 0.3)'
          }}
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Clouds */}
        {isDay && (
          <>
            <motion.div
              className="absolute w-40 h-16 bg-white/60 rounded-full blur-sm"
              style={{ top: '15%', left: '10%' }}
              animate={{ x: [0, 50, 0] }}
              transition={{ duration: 20, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-56 h-20 bg-white/50 rounded-full blur-sm"
              style={{ top: '8%', left: '40%' }}
              animate={{ x: [0, -30, 0] }}
              transition={{ duration: 25, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-32 h-12 bg-white/40 rounded-full blur-sm"
              style={{ top: '20%', right: '20%' }}
              animate={{ x: [0, 40, 0] }}
              transition={{ duration: 18, repeat: Infinity }}
            />
          </>
        )}

        {/* Stars for night */}
        {!isDay && (
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 40}%`
                }}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Hills - Far */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-[40%]"
          style={{
            background: isDay
              ? 'linear-gradient(180deg, transparent 0%, #22C55E 40%, #16A34A 100%)'
              : 'linear-gradient(180deg, transparent 0%, #1E3A8A 40%, #0F172A 100%)'
          }}
        >
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path 
              fill={isDay ? '#22C55E' : '#1E3A8A'}
              d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* Hills - Near */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-[30%]"
          style={{ y: hillsY }}
        >
          <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path 
              fill={isDay ? '#16A34A' : '#0F172A'}
              d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,208C840,213,960,203,1080,181.3C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            />
          </svg>
        </motion.div>
      </motion.div>

      {/* Cave Layer */}
      <motion.div
        className="fixed inset-0 z-10"
        style={{ opacity: caveOpacity }}
      >
        {/* Cave Background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0B1120 0%, #1E293B 30%, #0F172A 60%, #0B1120 100%)'
          }}
        />

        {/* Stalactites */}
        <svg className="absolute top-0 w-full h-32" preserveAspectRatio="none" viewBox="0 0 1440 100">
          <path 
            fill="#1E293B"
            d="M0,0L60,0L60,30L30,60L0,30L0,0M120,0L180,0L180,45L150,80L120,45L120,0M240,0L300,0L300,25L270,50L240,25L240,0M360,0L420,0L420,55L390,90L360,55L360,0M480,0L540,0L540,35L510,65L480,35L480,0M600,0L660,0L660,50L630,85L600,50L600,0M720,0L780,0L780,40L750,70L720,40L720,0M840,0L900,0L900,30L870,55L840,30L840,0M960,0L1020,0L1020,60L990,95L960,60L960,0M1080,0L1140,0L1140,35L1110,65L1080,35L1080,0M1200,0L1260,0L1260,45L1230,75L1200,45L1200,0M1320,0L1380,0L1380,25L1350,50L1320,25L1320,0M1380,0L1440,0L1440,40L1410,70L1380,40L1380,0"
          />
        </svg>

        {/* Bioluminescent Glow */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.15) 0%, transparent 70%)',
              left: '10%',
              top: '30%'
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(244, 114, 182, 0.15) 0%, transparent 70%)',
              right: '15%',
              top: '40%'
            }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(34, 211, 238, 0.2) 0%, transparent 70%)',
              left: '50%',
              bottom: '20%',
              transform: 'translateX(-50%)'
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        {/* Cherry Tree on Island */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 bottom-[10%] w-[600px] h-[500px]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          {/* Water around island */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[80px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0.1) 100%)',
              boxShadow: '0 0 60px rgba(34, 211, 238, 0.3)'
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Island */}
          <div 
            className="absolute bottom-[30px] left-1/2 -translate-x-1/2 w-[250px] h-[60px] rounded-full"
            style={{
              background: 'linear-gradient(180deg, #4B5563 0%, #1F2937 100%)'
            }}
          />

          {/* Tree Trunk */}
          <div 
            className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-[30px] h-[200px]"
            style={{
              background: 'linear-gradient(90deg, #78350F 0%, #92400E 50%, #78350F 100%)',
              borderRadius: '5px'
            }}
          />

          {/* Tree Branches */}
          <motion.div 
            className="absolute bottom-[200px] left-1/2 -translate-x-1/2"
            animate={{ rotate: [-1, 1, -1] }}
            transition={{ duration: 8, repeat: Infinity }}
          >
            {/* Main foliage */}
            <div 
              className="w-[300px] h-[200px] rounded-full"
              style={{
                background: 'radial-gradient(ellipse, #F472B6 0%, #EC4899 40%, #BE185D 80%, transparent 100%)',
                filter: 'blur(3px)',
                transform: 'translateX(-50%)'
              }}
            />
            {/* Glow effect */}
            <div 
              className="absolute inset-0 w-[300px] h-[200px] rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(244, 114, 182, 0.3) 0%, transparent 70%)',
                transform: 'translateX(-50%) scale(1.2)'
              }}
            />
          </motion.div>

          {/* Vines */}
          <motion.div
            className="absolute bottom-[180px] left-[calc(50%-80px)] w-2 h-40"
            style={{
              background: 'linear-gradient(180deg, #22C55E, #16A34A)',
              borderRadius: '4px'
            }}
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-[200px] left-[calc(50%+60px)] w-2 h-32"
            style={{
              background: 'linear-gradient(180deg, #22C55E, #16A34A)',
              borderRadius: '4px'
            }}
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </motion.div>

        {/* Cave Particles */}
        <CaveParticles />
      </motion.div>

      {/* Cherry Petals - Always visible when in cave */}
      {scrollProgress > 0.15 && <CherryPetals />}

      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </>
  );
};

export default ParallaxBackground;
