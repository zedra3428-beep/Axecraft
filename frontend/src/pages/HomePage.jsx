import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import IPCopyButton from '../components/IPCopyButton';
import GameCard from '../components/GameCard';
import LiveStats from '../components/LiveStats';
import VideoSection from '../components/VideoSection';
import ReviewsSection from '../components/ReviewsSection';
import { ChevronDown, Sparkles } from 'lucide-react';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const HomePage = () => {
  const [games, setGames] = useState([]);
  const [expandedGame, setExpandedGame] = useState(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API}/minigames`);
        setGames(response.data);
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };
    fetchGames();
  }, []);

  const scrollToGames = () => {
    document.getElementById('games-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div data-testid="home-page" className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 pt-24">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mb-8"
        >
          <div className="relative">
            <motion.img 
              src="https://customer-assets.emergentagent.com/job_54b6345b-423a-49ea-bf1f-8a8d2a7b8112/artifacts/c6eh7b7g_149gWZj%20-%20Imgur.png" 
              alt="Axecraft Logo" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Glow */}
            <div className="absolute inset-0 rounded-3xl bg-cyan-400/20 blur-2xl -z-10" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hero-title font-unbounded text-5xl md:text-7xl lg:text-8xl font-black text-white text-center mb-4"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-400">
            AXECRAFT
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/60 text-lg md:text-xl text-center mb-8 max-w-2xl"
        >
          Le serveur Minecraft français où chaque aventure est <span className="text-cyan-400">exceptionnelle</span>
        </motion.p>

        {/* IP Copy Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <IPCopyButton />
        </motion.div>

        {/* Features Pills */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {['BedWars', 'SkyWars', 'Survival', 'Mini-Jeux'].map((feature, i) => (
            <motion.span
              key={feature}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="px-4 py-2 rounded-full glass text-white/80 text-sm font-medium flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {feature}
            </motion.span>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.button
          onClick={scrollToGames}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer"
          data-testid="scroll-indicator"
        >
          <span className="text-sm">Découvrir</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </section>

      {/* Games Selection Section */}
      <section id="games-section" className="relative z-20 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-unbounded text-3xl md:text-4xl font-bold text-white mb-4">
              Choisis ton <span className="text-cyan-400">Aventure</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Survole une carte pour découvrir les détails du mode de jeu
            </p>
          </motion.div>

          {/* Games Accordion */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex gap-4 h-[400px] md:h-[500px] overflow-hidden"
            data-testid="games-accordion"
          >
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isExpanded={expandedGame === game.id}
                onHover={setExpandedGame}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Stats */}
      <LiveStats />

      {/* Video Section */}
      <VideoSection />

      {/* Reviews Section */}
      <ReviewsSection />
    </div>
  );
};

export default HomePage;
