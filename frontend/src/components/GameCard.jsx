import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Sword, Hammer, TreePine, Heart, Cloud } from 'lucide-react';

const iconMap = {
  bed: Sword,
  cloud: Cloud,
  hammer: Hammer,
  tree: TreePine,
  heart: Heart
};

const GameCard = ({ game, isExpanded, onHover }) => {
  const Icon = iconMap[game.icon] || Sword;

  const getBadgeClass = (badge) => {
    const lower = badge.toLowerCase();
    if (lower.includes('nouveau') || lower.includes('new')) return 'badge-new';
    if (lower.includes('compétitif') || lower.includes('competitive')) return 'badge-competitive';
    if (lower.includes('populaire') || lower.includes('popular')) return 'badge-popular';
    return 'bg-white/20';
  };

  return (
    <motion.div
      data-testid={`game-card-${game.id}`}
      className="game-card relative h-[400px] md:h-[500px] cursor-pointer overflow-hidden rounded-3xl"
      style={{ 
        flex: isExpanded ? 2 : 1,
        minWidth: isExpanded ? '300px' : '100px'
      }}
      onMouseEnter={() => onHover(game.id)}
      onMouseLeave={() => onHover(null)}
      layout
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
        style={{ 
          backgroundImage: `url(${game.image_url})`,
          transform: isExpanded ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      {/* Overlay Gradient */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: isExpanded 
            ? `linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 40%, ${game.color}40 100%)`
            : 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Glow Effect when expanded */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
          style={{
            boxShadow: `inset 0 0 100px ${game.color}30`
          }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Icon & Title - Always visible */}
        <div className={`flex items-center gap-3 mb-2 ${!isExpanded ? 'flex-col' : ''}`}>
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: `${game.color}40` }}
          >
            <Icon className="w-6 h-6" style={{ color: game.color }} />
          </div>
          <h3 
            className={`font-unbounded font-bold text-white ${
              isExpanded ? 'text-2xl' : 'text-sm writing-mode-vertical rotate-180'
            }`}
            style={{ 
              writingMode: !isExpanded ? 'vertical-rl' : 'horizontal-tb',
              textOrientation: !isExpanded ? 'mixed' : 'unset'
            }}
          >
            {game.name}
          </h3>
        </div>

        {/* Expanded Content */}
        <motion.div
          className="game-card-content"
          initial={false}
          animate={{
            opacity: isExpanded ? 1 : 0,
            y: isExpanded ? 0 : 20
          }}
          transition={{ duration: 0.3, delay: isExpanded ? 0.1 : 0 }}
        >
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {game.badges.map((badge, index) => (
              <span 
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getBadgeClass(badge)}`}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Players Online */}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/70">
              <span className="text-green-400 font-bold">{game.players_online}</span> joueurs en ligne
            </span>
          </div>
        </motion.div>
      </div>

      {/* Vertical indicator line when collapsed */}
      {!isExpanded && (
        <div 
          className="absolute left-1/2 -translate-x-1/2 bottom-6 w-1 h-20 rounded-full opacity-50"
          style={{ background: `linear-gradient(180deg, transparent, ${game.color})` }}
        />
      )}
    </motion.div>
  );
};

export default GameCard;
