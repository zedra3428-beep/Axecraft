# Axecraft - Site Web Serveur Minecraft

## Problem Statement Original
Site web exceptionnel pour serveur Minecraft "Axecraft" avec:
- Plusieurs pages (Jeux/Mini-Jeux/Règles/Staff/Boutique/Classements)
- Arrière-plan dynamique: Surface Plaines → Grotte avec cerisier
- Cycle jour/nuit selon heure réelle
- Copie IP en un clic (play.axecraft.fr)
- Vidéo YouTube intégrée
- Stats temps réel (4 joueurs)
- Avis joueurs
- Cartes jeux interactives style sélection personnage
- Thème: Bleu et Vert

## User Personas
1. **Joueur Minecraft FR** - Veut rejoindre un serveur avec bonne communauté
2. **Visiteur Curieux** - Découvre le serveur via le site web
3. **Joueur Actif** - Consulte classements et boutique

## Core Requirements (Implemented)
- ✅ Design immersif avec parallax et cerisier animé
- ✅ Navigation fluide entre 6 pages
- ✅ Bouton copie IP avec animation
- ✅ Cartes jeux interactives (hover expand)
- ✅ Stats temps réel (simulées)
- ✅ Système d'avis joueurs
- ✅ Boutique grades VIP/VIP+/MVP
- ✅ Classement avec podium
- ✅ Page règles avec accordéon
- ✅ Page staff avec équipe

## What's Been Implemented (December 2025)

### Backend (FastAPI)
- `/api/stats` - Stats serveur (4 joueurs simulés)
- `/api/minigames` - 5 mini-jeux (BedWars, SkyWars, Build Battle, Survival, UHC)
- `/api/staff` - 4 membres staff
- `/api/shop` - 5 items boutique (grades + coins)
- `/api/reviews` - Avis joueurs
- `/api/leaderboard` - Top 10 joueurs
- `/api/rules` - 8 règles serveur

### Frontend (React + Framer Motion)
- **Page Accueil**: Hero avec logo animé, cartes jeux interactives
- **Page Jeux**: Détails mini-jeux avec stats
- **Page Règles**: Accordéon avec filtres catégories
- **Page Staff**: Cartes équipe avec rôles
- **Page Boutique**: Grades avec fonctionnalités
- **Page Classement**: Podium 3D + liste

### Design Unique
- Parallax background (surface → grotte)
- Cerisier rose animé dans la grotte
- Pétales de cerisier tombantes
- Cycle jour/nuit automatique
- Glassmorphism UI
- Animations Framer Motion

## P0/P1/P2 Features Remaining

### P0 (Critical) - Done
✅ Toutes les pages principales
✅ APIs fonctionnelles
✅ Design immersif

### P1 (Important)
- Intégration API Minecraft réelle (status serveur)
- Système de connexion joueur
- Boutique avec paiement Stripe

### P2 (Nice to have)
- Profils joueurs individuels
- Historique parties
- Système de tickets support
- Discord widget intégré

## Next Action Items
1. Connecter à une vraie API Minecraft pour stats live
2. Ajouter système d'authentification (optionnel)
3. Intégrer paiement Stripe pour la boutique
4. Ajouter page profil joueur individuel
