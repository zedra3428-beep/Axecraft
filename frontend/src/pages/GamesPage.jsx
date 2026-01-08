import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Clock, Star, Sword, Cloud, Hammer, TreePine, Heart } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const iconMap = {
  bed: Sword,
  cloud: Cloud,
  hammer: Hammer,
  tree: TreePine,
  heart: Heart
};

const GameDetailCard = ({ game, index }) => {
  const Icon = iconMap[game.icon] || Sword;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass rounded-3xl overflow-hidden group hover:border-white/20 transition-all duration-500"
      data-testid={`game-detail-${game.id}`}
    >
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${game.image_url})` }}
        />
        <div 
          className="absolute inset-0"
          style={{ background: `linear-gradient(180deg, transparent 0%, ${game.color}40 100%)` }}
        />
        
        {/* Icon Badge */}
        <div 
          className="absolute top-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl"
          style={{ background: `${game.color}40` }}
        >
          <Icon className="w-6 h-6" style={{ color: game.color }} />
        </div>

        {/* Players Online Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-white">{game.players_online} en ligne</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-unbounded text-2xl font-bold text-white mb-2">{game.name}</h3>
        <p className="text-white/60 mb-4">{game.description}</p>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {game.badges.map((badge, i) => (
            <span 
              key={i}
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ background: `${game.color}30`, border: `1px solid ${game.color}50` }}
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Users className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
            <p className="text-white/50 text-xs">Joueurs</p>
            <p className="font-unbounded font-bold text-white">{game.players_online}</p>
          </div>
          <div className="text-center">
            <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
            <p className="text-white/50 text-xs">Parties/jour</p>
            <p className="font-unbounded font-bold text-white">150+</p>
          </div>
          <div className="text-center">
            <Star className="w-5 h-5 mx-auto mb-1 text-pink-400" />
            <p className="text-white/50 text-xs">Note</p>
            <p className="font-unbounded font-bold text-white">4.8</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const GamesPage = () => {
  const [games, setGames] = useState([]);

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

  return (
    <div data-testid="games-page" className="relative z-20 min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-unbounded text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Nos <span className="text-cyan-400">Mini-Jeux</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Découvre tous les modes de jeu disponibles sur Axecraft. Du PvP intense au Build créatif, il y en a pour tous les goûts !
          </p>
        </motion.div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <GameDetailCard key={game.id} game={game} index={index} />
          ))}
        </div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h2 className="font-unbounded text-2xl font-bold text-white/50 mb-4">
            Et bientôt...
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Murder Mystery', 'Parkour', 'TNT Run', 'Hunger Games'].map((game, i) => (
              <motion.span
                key={game}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="px-6 py-3 rounded-full glass text-white/50 font-medium"
              >
                {game}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GamesPage;
