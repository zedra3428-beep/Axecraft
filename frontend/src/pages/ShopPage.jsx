import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Check, Sparkles, Coins, Crown } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const ShopCard = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`relative glass rounded-3xl p-6 flex flex-col ${
        item.popular ? 'border-2 border-cyan-500/50' : ''
      }`}
      data-testid={`shop-item-${item.id}`}
    >
      {/* Popular Badge */}
      {item.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-pink-500 text-white text-xs font-bold flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          POPULAIRE
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div 
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4"
          style={{ background: `${item.color}20` }}
        >
          {item.category === 'grades' ? (
            <Crown className="w-8 h-8" style={{ color: item.color }} />
          ) : (
            <Coins className="w-8 h-8" style={{ color: item.color }} />
          )}
        </div>
        <h3 className="font-unbounded text-xl font-bold text-white">{item.name}</h3>
        <p className="text-white/50 text-sm mt-1">{item.description}</p>
      </div>

      {/* Price */}
      <div className="text-center mb-6">
        <span className="font-unbounded text-4xl font-black text-white">{item.price}</span>
        <span className="text-white/50 ml-1">{item.currency}</span>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6 flex-1">
        {item.features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-white/70">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <button 
        className={`w-full py-3 rounded-xl font-unbounded font-bold transition-all duration-300 ${
          item.popular 
            ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white hover:opacity-90' 
            : 'glass text-white hover:bg-white/10'
        }`}
        data-testid={`buy-${item.id}`}
      >
        <span className="flex items-center justify-center gap-2">
          <ShoppingBag className="w-5 h-5" />
          Acheter
        </span>
      </button>
    </motion.div>
  );
};

const ShopPage = () => {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${API}/shop`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching shop items:', error);
      }
    };
    fetchItems();
  }, []);

  const categories = [
    { id: 'all', label: 'Tout', icon: ShoppingBag },
    { id: 'grades', label: 'Grades', icon: Crown },
    { id: 'coins', label: 'Coins', icon: Coins }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <div data-testid="shop-page" className="relative z-20 min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="font-unbounded text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="text-cyan-400">Boutique</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Améliore ton expérience avec des grades exclusifs et des bonus uniques !
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center gap-4 mb-12"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                data-testid={`shop-category-${category.id}`}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                    : 'glass text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                {category.label}
              </button>
            );
          })}
        </motion.div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <ShopCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Info Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm">
            Les achats sont non-remboursables. En achetant, vous acceptez nos conditions d'utilisation.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ShopPage;
