import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gamepad2, Users, ShoppingBag, Trophy, BookOpen, MessageCircle, Twitter, Youtube, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { label: 'Accueil', path: '/', icon: Gamepad2 },
        { label: 'Jeux', path: '/jeux', icon: Gamepad2 },
        { label: 'Règles', path: '/regles', icon: BookOpen },
        { label: 'Staff', path: '/staff', icon: Users }
      ]
    },
    {
      title: 'Communauté',
      links: [
        { label: 'Boutique', path: '/boutique', icon: ShoppingBag },
        { label: 'Classement', path: '/classement', icon: Trophy }
      ]
    }
  ];

  const socialLinks = [
    { icon: MessageCircle, label: 'Discord', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' }
  ];

  return (
    <footer data-testid="footer" className="relative z-20 mt-20">
      {/* Background with giant logo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <motion.h2 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 font-unbounded text-[200px] md:text-[300px] font-black text-white/[0.02] whitespace-nowrap select-none pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          AXECRAFT
        </motion.h2>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src="https://customer-assets.emergentagent.com/job_54b6345b-423a-49ea-bf1f-8a8d2a7b8112/artifacts/c6eh7b7g_149gWZj%20-%20Imgur.png" 
                alt="Axecraft Logo" 
                className="w-14 h-14 rounded-xl"
              />
              <div>
                <h3 className="font-unbounded text-2xl font-bold text-white">Axecraft</h3>
                <p className="text-white/50 text-sm">Serveur Minecraft Français</p>
              </div>
            </Link>
            <p className="text-white/60 max-w-md mb-6">
              Rejoins la meilleure communauté Minecraft francophone ! BedWars, SkyWars, Survival et bien plus encore t'attendent.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-white/70" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-unbounded font-bold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="flex items-center gap-2 text-white/60 hover:text-cyan-400 transition-colors"
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Axecraft. Tous droits réservés.
            </p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              Fait avec <Heart className="w-4 h-4 text-pink-500" fill="currentColor" /> par la team Axecraft
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
