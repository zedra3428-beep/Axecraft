import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Server } from 'lucide-react';
import { toast } from 'sonner';

const IPCopyButton = ({ ip = "play.axecraft.fr" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ip);
      setCopied(true);
      toast.success('IP copiée !', {
        description: ip,
        duration: 2000
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <motion.button
      data-testid="ip-copy-button"
      onClick={handleCopy}
      className="ip-copy-btn group relative flex items-center gap-4 px-6 py-4 bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/50 rounded-2xl transition-all duration-300 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(34, 211, 238, 0.1) 0%, transparent 70%)'
        }}
      />

      {/* Server Icon */}
      <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-xl">
        <Server className="w-6 h-6 text-cyan-400" />
        {/* Online Pulse */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>

      {/* IP Address */}
      <div className="flex flex-col items-start">
        <span className="text-xs text-white/50 uppercase tracking-wider mb-1">Adresse du serveur</span>
        <span className="font-mono text-lg text-white font-medium tracking-wide">{ip}</span>
      </div>

      {/* Copy Icon */}
      <div className="ml-auto pl-4">
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="w-10 h-10 flex items-center justify-center bg-green-500/20 rounded-full"
            >
              <Check className="w-5 h-5 text-green-400" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -180 }}
              className="w-10 h-10 flex items-center justify-center bg-white/10 group-hover:bg-cyan-500/20 rounded-full transition-colors"
            >
              <Copy className="w-5 h-5 text-white/70 group-hover:text-cyan-400 transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
        }}
      />
    </motion.button>
  );
};

export default IPCopyButton;
