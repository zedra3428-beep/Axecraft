import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, MessageSquare, Gamepad2, Building, User, Coins, Shield, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const categoryIcons = {
  'Comportement': MessageSquare,
  'Jeu': Gamepad2,
  'Chat': MessageSquare,
  'Construction': Building,
  'Compte': User,
  'Économie': Coins
};

const severityColors = {
  high: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400', icon: 'text-red-400' },
  medium: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/50', text: 'text-yellow-400', icon: 'text-yellow-400' },
  low: { bg: 'bg-green-500/20', border: 'border-green-500/50', text: 'text-green-400', icon: 'text-green-400' }
};

const RuleCard = ({ rule, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = categoryIcons[rule.category] || Shield;
  const colors = severityColors[rule.severity] || severityColors.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`glass rounded-2xl overflow-hidden border ${colors.border} transition-all duration-300`}
      data-testid={`rule-${rule.id}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start gap-4 text-left"
      >
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
              {rule.category}
            </span>
            {rule.severity === 'high' && (
              <AlertTriangle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <h3 className="font-unbounded font-bold text-white text-lg">{rule.title}</h3>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-white/50" />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-white/70 ml-16">{rule.description}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const RulesPage = () => {
  const [rules, setRules] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get(`${API}/rules`);
        setRules(response.data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };
    fetchRules();
  }, []);

  const categories = ['all', ...new Set(rules.map(r => r.category))];
  const filteredRules = selectedCategory === 'all' 
    ? rules 
    : rules.filter(r => r.category === selectedCategory);

  return (
    <div data-testid="rules-page" className="relative z-20 min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-unbounded text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-cyan-400">Règlement</span> du Serveur
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Pour que tout le monde puisse profiter d'Axecraft, merci de respecter ces règles. Les sanctions peuvent aller de l'avertissement au bannissement permanent.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              data-testid={`category-${category}`}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'glass text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {category === 'all' ? 'Toutes' : category}
            </button>
          ))}
        </motion.div>

        {/* Rules List */}
        <div className="space-y-4">
          {filteredRules.map((rule, index) => (
            <RuleCard key={rule.id} rule={rule} index={index} />
          ))}
        </div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 p-6 glass rounded-2xl border border-cyan-500/30"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-cyan-400 flex-shrink-0" />
            <div>
              <h3 className="font-unbounded font-bold text-white mb-2">Note Importante</h3>
              <p className="text-white/60">
                Le staff se réserve le droit de sanctionner tout comportement nuisible, même si celui-ci n'est pas explicitement mentionné dans ces règles. En cas de doute, contactez un modérateur.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RulesPage;
