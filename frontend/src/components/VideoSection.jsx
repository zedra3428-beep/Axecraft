import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player/youtube';
import { Play, Volume2, VolumeX } from 'lucide-react';

const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  const handlePlay = () => {
    setIsPlaying(true);
    setShowOverlay(false);
  };

  return (
    <section data-testid="video-section" className="relative z-20 py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-unbounded text-3xl md:text-4xl font-bold text-white mb-4">
            Découvre <span className="text-cyan-400">Axecraft</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Plonge dans l'univers d'Axecraft avec notre vidéo de présentation
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass-strong"
          style={{ aspectRatio: '16/9' }}
        >
          {/* Video Player */}
          <ReactPlayer
            url="https://youtu.be/gojb7k4AD5I"
            playing={isPlaying}
            muted={isMuted}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0
                }
              }
            }}
          />

          {/* Play Overlay */}
          {showOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer"
              onClick={handlePlay}
            >
              {/* Thumbnail Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=675&fit=crop)'
                }}
              />
              <div className="absolute inset-0 bg-black/40" />

              {/* Play Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-pink-500 flex items-center justify-center glow-cyan"
                data-testid="video-play-button"
              >
                <Play className="w-10 h-10 text-white ml-1" fill="white" />
              </motion.button>

              {/* Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white font-unbounded font-bold text-xl"
              >
                Regarder la vidéo
              </motion.p>
            </motion.div>
          )}

          {/* Controls */}
          {!showOverlay && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-full glass hover:bg-white/20 transition-colors"
                data-testid="video-mute-button"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          )}

          {/* Decorative Border */}
          <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
};

export default VideoSection;
