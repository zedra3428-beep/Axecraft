import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Target, Swords, Gamepad2 } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const getRankStyle = (rank) => {
  switch (rank) {
    case 1:
      return { 
        bg: 'bg-gradient-to-br from-yellow-400 to-orange-500', 
        border: 'border-yellow-500/50',
        glow: 'shadow-yellow-500/30',
        icon: <Trophy className="w-6 h-6 text-white" />,
        size: 'scale-110'
      };
    case 2:
      return { 
        bg: 'bg-gradient-to-br from-gray-300 to-gray-400', 
        border: 'border-gray-400/50',
        glow: 'shadow-gray-400/30',
        icon: <Medal className="w-6 h-6 text-white" />,
        size: 'scale-105'
      };
    case 3:
      return { 
        bg: 'bg-gradient-to-br from-amber-600 to-amber-700', 
        border: 'border-amber-600/50',
        glow: 'shadow-amber-600/30',
        icon: <Medal className="w-6 h-6 text-white" />,
        size: 'scale-100'
      };
    default:
      return { 
        bg: 'bg-white/10', 
        border: 'border-white/10',
        glow: '',
        icon: <span className="font-unbounded font-bold text-white">{rank}</span>,
        size: 'scale-100'
      };
  }
};

const LeaderboardRow = ({ entry, index }) => {
  const rankStyle = getRankStyle(entry.rank);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl p-4 flex items-center gap-4 hover:bg-white/10 transition-all duration-300 ${rankStyle.size} ${
        entry.rank <= 3 ? `border ${rankStyle.border}` : ''
      }`}
      data-testid={`leaderboard-row-${entry.rank}`}
    >
      {/* Rank Badge */}
      <div className={`w-12 h-12 rounded-xl ${rankStyle.bg} flex items-center justify-center ${rankStyle.glow} shadow-lg`}>
        {rankStyle.icon}
      </div>

      {/* Avatar */}
      <img
        src={entry.avatar_url}
        alt={entry.username}
        className="w-12 h-12 rounded-full border-2 border-white/20"
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-unbounded font-bold text-white truncate">{entry.username}</h3>
        <p className="text-white/50 text-sm">{entry.game}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="text-center">
          <p className="text-white/50 text-xs">Victoires</p>
          <p className="font-unbounded font-bold text-green-400">{entry.wins}</p>
        </div>
        <div className="text-center">
          <p className="text-white/50 text-xs">Kills</p>
          <p className="font-unbounded font-bold text-red-400">{entry.kills}</p>
        </div>
      </div>

      {/* Score */}
      <div className="text-right">
        <p className="text-white/50 text-xs">Score</p>
        <p className="font-unbounded font-bold text-xl text-cyan-400">{entry.score.toLocaleString()}</p>
      </div>
    </motion.div>
  );
};

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const url = selectedGame === 'all' 
          ? `${API}/leaderboard` 
          : `${API}/leaderboard?game=${selectedGame}`;
        const response = await axios.get(url);
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, [selectedGame]);

  const games = [
    { id: 'all', label: 'Tous', icon: Gamepad2 },
    { id: 'bedwars', label: 'BedWars', icon: Swords },
    { id: 'skywars', label: 'SkyWars', icon: Target },
    { id: 'build battle', label: 'Build Battle', icon: Trophy }
  ];

  return (
    <div data-testid="leaderboard-page" className="relative z-20 min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-unbounded text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-yellow-400">Classement</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Les meilleurs joueurs d'Axecraft. Tu as ce qu'il faut pour atteindre le sommet ?
          </p>
        </motion.div>

        {/* Game Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                data-testid={`filter-${game.id}`}
                className={`px-5 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedGame === game.id
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                    : 'glass text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {game.label}
              </button>
            );
          })}
        </motion.div>

        {/* Top 3 Podium (Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="hidden md:flex justify-center items-end gap-4 mb-12"
        >
          {/* 2nd Place */}
          {leaderboard[1] && (
            <div className="text-center">
              <div className="relative">
                <img
                  src={leaderboard[1].avatar_url}
                  alt={leaderboard[1].username}
                  className="w-20 h-20 rounded-full border-4 border-gray-400 mx-auto mb-2"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="font-unbounded font-bold text-white">2</span>
                </div>
              </div>
              <p className="font-unbounded font-bold text-white mt-3">{leaderboard[1].username}</p>
              <p className="text-gray-400 font-bold">{leaderboard[1].score.toLocaleString()}</p>
              <div className="w-24 h-24 bg-gradient-to-t from-gray-500/20 to-transparent rounded-t-lg mt-2" />
            </div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <div className="text-center -mb-8">
              <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
              <div className="relative">
                <img
                  src={leaderboard[0].avatar_url}
                  alt={leaderboard[0].username}
                  className="w-28 h-28 rounded-full border-4 border-yellow-500 mx-auto mb-2 shadow-lg shadow-yellow-500/30"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <span className="font-unbounded font-bold text-white">1</span>
                </div>
              </div>
              <p className="font-unbounded font-bold text-xl text-white mt-3">{leaderboard[0].username}</p>
              <p className="text-yellow-400 font-bold text-lg">{leaderboard[0].score.toLocaleString()}</p>
              <div className="w-28 h-32 bg-gradient-to-t from-yellow-500/20 to-transparent rounded-t-lg mt-2" />
            </div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <div className="text-center">
              <div className="relative">
                <img
                  src={leaderboard[2].avatar_url}
                  alt={leaderboard[2].username}
                  className="w-20 h-20 rounded-full border-4 border-amber-600 mx-auto mb-2"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center">
                  <span className="font-unbounded font-bold text-white">3</span>
                </div>
              </div>
              <p className="font-unbounded font-bold text-white mt-3">{leaderboard[2].username}</p>
              <p className="text-amber-600 font-bold">{leaderboard[2].score.toLocaleString()}</p>
              <div className="w-24 h-20 bg-gradient-to-t from-amber-600/20 to-transparent rounded-t-lg mt-2" />
            </div>
          )}
        </motion.div>

        {/* Leaderboard List */}
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <LeaderboardRow key={`${entry.rank}-${entry.username}`} entry={entry} index={index} />
          ))}
        </div>

        {/* Empty State */}
        {leaderboard.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/50">Aucun classement disponible pour ce mode.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
