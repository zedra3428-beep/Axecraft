import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, Shield, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const roleIcons = {
  'Fondateur': Crown,
  'Admin': Shield,
  'Modérateur': Star
};

const roleColors = {
  'Fondateur': { gradient: 'from-yellow-400 to-orange-500', glow: 'shadow-yellow-500/30' },
  'Admin': { gradient: 'from-red-400 to-pink-500', glow: 'shadow-pink-500/30' },
  'Modérateur': { gradient: 'from-cyan-400 to-blue-500', glow: 'shadow-cyan-500/30' }
};

const StaffCard = ({ member, index }) => {
  const Icon = roleIcons[member.role] || Star;
  const colors = roleColors[member.role] || roleColors['Modérateur'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="glass rounded-3xl p-6 text-center group hover:border-white/20 transition-all duration-300"
      data-testid={`staff-${member.id}`}
    >
      {/* Avatar */}
      <div className="relative mx-auto w-24 h-24 mb-4">
        <motion.div
          className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${colors.glow}`}
        />
        <img
          src={member.avatar_url}
          alt={member.username}
          className="relative w-24 h-24 rounded-full border-4 border-white/10 group-hover:border-white/30 transition-all duration-300"
        />
        {/* Role Badge */}
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Info */}
      <h3 className="font-unbounded font-bold text-xl text-white mb-1">{member.username}</h3>
      <p className={`text-transparent bg-clip-text bg-gradient-to-r ${colors.gradient} font-medium mb-3`}>
        {member.role}
      </p>

      {/* Discord */}
      {member.discord && (
        <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
          <MessageCircle className="w-4 h-4" />
          <span>{member.discord}</span>
        </div>
      )}

      {/* Join Date */}
      <p className="text-white/30 text-xs mt-2">
        Depuis {new Date(member.joined_date).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
      </p>
    </motion.div>
  );
};

const StaffPage = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${API}/staff`);
        setStaff(response.data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, []);

  // Group staff by role
  const founders = staff.filter(m => m.role === 'Fondateur');
  const admins = staff.filter(m => m.role === 'Admin');
  const moderators = staff.filter(m => m.role === 'Modérateur');

  return (
    <div data-testid="staff-page" className="relative z-20 min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-unbounded text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Notre <span className="text-cyan-400">Équipe</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Des passionnés dévoués qui travaillent chaque jour pour faire d'Axecraft la meilleure expérience Minecraft possible.
          </p>
        </motion.div>

        {/* Founders */}
        {founders.length > 0 && (
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-unbounded text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500"
            >
              Fondateurs
            </motion.h2>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                {founders.map((member, index) => (
                  <StaffCard key={member.id} member={member} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Admins */}
        {admins.length > 0 && (
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-unbounded text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-500"
            >
              Administrateurs
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {admins.map((member, index) => (
                <StaffCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Moderators */}
        {moderators.length > 0 && (
          <div>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-unbounded text-2xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            >
              Modérateurs
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {moderators.map((member, index) => (
                <StaffCard key={member.id} member={member} index={index} />
              ))}
            </div>
          </div>
        )}

        {/* Join Team CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="font-unbounded text-2xl font-bold text-white mb-4">
              Rejoins l'équipe !
            </h3>
            <p className="text-white/60 mb-6">
              Tu es motivé, actif et tu veux aider la communauté ? Les candidatures sont toujours ouvertes !
            </p>
            <button className="btn-primary px-8 py-3 rounded-xl font-unbounded font-bold text-white">
              Postuler
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffPage;
