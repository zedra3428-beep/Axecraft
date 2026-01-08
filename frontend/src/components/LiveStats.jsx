import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Server, Clock, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StatCard = ({ icon: Icon, label, value, subValue, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="glass rounded-2xl p-6 flex items-center gap-4 hover:border-white/20 transition-all duration-300"
  >
    <div 
      className="w-14 h-14 rounded-2xl flex items-center justify-center"
      style={{ background: `${color}20` }}
    >
      <Icon className="w-7 h-7" style={{ color }} />
    </div>
    <div>
      <p className="text-white/50 text-sm mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="font-unbounded text-2xl font-bold text-white">{value}</span>
        {subValue && <span className="text-sm text-white/50">{subValue}</span>}
      </div>
    </div>
  </motion.div>
);

const LiveStats = () => {
  const [stats, setStats] = useState({
    online_players: 4,
    max_players: 100,
    server_ip: 'play.axecraft.fr',
    status: 'online',
    uptime_percentage: 99.8
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API}/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section data-testid="live-stats-section" className="relative z-20 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-unbounded text-3xl md:text-4xl font-bold text-white mb-4">
            Stats en <span className="text-cyan-400">Temps Réel</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Suivez l'activité du serveur en direct
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Users}
            label="Joueurs en ligne"
            value={stats.online_players}
            subValue={`/ ${stats.max_players}`}
            color="#22D3EE"
            delay={0}
          />
          <StatCard
            icon={Server}
            label="Statut serveur"
            value={stats.status === 'online' ? 'En ligne' : 'Hors ligne'}
            color={stats.status === 'online' ? '#10B981' : '#EF4444'}
            delay={0.1}
          />
          <StatCard
            icon={Clock}
            label="Uptime"
            value={`${stats.uptime_percentage}%`}
            color="#FBBF24"
            delay={0.2}
          />
          <StatCard
            icon={TrendingUp}
            label="Pic du jour"
            value="12"
            subValue="joueurs"
            color="#F472B6"
            delay={0.3}
          />
        </div>

        {/* Online Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mt-8"
        >
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-green-400 font-medium">Serveur opérationnel</span>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;
