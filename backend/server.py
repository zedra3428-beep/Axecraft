from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# ========== MODELS ==========

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class ServerStats(BaseModel):
    model_config = ConfigDict(extra="ignore")
    online_players: int
    max_players: int
    server_ip: str
    status: str
    uptime_percentage: float

class MiniGame(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    players_online: int
    badges: List[str]
    color: str
    icon: str
    image_url: str

class StaffMember(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    role: str
    avatar_url: str
    discord: Optional[str] = None
    joined_date: str

class ShopItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    description: str
    price: float
    currency: str
    category: str
    features: List[str]
    color: str
    popular: bool = False

class PlayerReview(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    username: str
    avatar_url: str
    rating: int
    comment: str
    date: str

class LeaderboardEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    rank: int
    username: str
    avatar_url: str
    score: int
    game: str
    wins: int
    kills: int

class Rule(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    description: str
    category: str
    severity: str

class ReviewCreate(BaseModel):
    username: str
    rating: int
    comment: str

# ========== MOCK DATA ==========

MOCK_MINIGAMES = [
    {
        "id": "bedwars",
        "name": "BedWars",
        "description": "Protège ton lit et détruis celui de tes ennemis ! Collecte des ressources et améliore ton équipement.",
        "players_online": 2,
        "badges": ["Populaire", "Compétitif", "4vs4"],
        "color": "#EF4444",
        "icon": "bed",
        "image_url": "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&h=800&fit=crop"
    },
    {
        "id": "skywars",
        "name": "SkyWars",
        "description": "Combat sur des îles flottantes ! Récupère le loot et élimine tous tes adversaires.",
        "players_online": 1,
        "badges": ["Solo", "Duo", "1vs1"],
        "color": "#3B82F6",
        "icon": "cloud",
        "image_url": "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&h=800&fit=crop"
    },
    {
        "id": "buildbattle",
        "name": "Build Battle",
        "description": "Montre tes talents de constructeur ! Construis selon le thème et gagne des votes.",
        "players_online": 0,
        "badges": ["Créatif", "Nouveau"],
        "color": "#10B981",
        "icon": "hammer",
        "image_url": "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=600&h=800&fit=crop"
    },
    {
        "id": "survival",
        "name": "Survival",
        "description": "Survie classique avec des améliorations ! Claims, économie et événements.",
        "players_online": 1,
        "badges": ["Classique", "PvE"],
        "color": "#22D3EE",
        "icon": "tree",
        "image_url": "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=800&fit=crop"
    },
    {
        "id": "uhc",
        "name": "UHC",
        "description": "Ultra Hardcore ! Pas de régénération naturelle, que le meilleur gagne.",
        "players_online": 0,
        "badges": ["Hardcore", "Compétitif"],
        "color": "#F472B6",
        "icon": "heart",
        "image_url": "https://images.unsplash.com/photo-1509515837298-2c67a3933321?w=600&h=800&fit=crop"
    }
]

MOCK_STAFF = [
    {
        "id": "1",
        "username": "AxeMaster",
        "role": "Fondateur",
        "avatar_url": "https://mc-heads.net/avatar/MHF_Steve/100",
        "discord": "axemaster#0001",
        "joined_date": "2023-01-15"
    },
    {
        "id": "2",
        "username": "CraftQueen",
        "role": "Admin",
        "avatar_url": "https://mc-heads.net/avatar/MHF_Alex/100",
        "discord": "craftqueen#0002",
        "joined_date": "2023-03-20"
    },
    {
        "id": "3",
        "username": "BlockBuilder",
        "role": "Modérateur",
        "avatar_url": "https://mc-heads.net/avatar/Notch/100",
        "discord": "blockbuilder#0003",
        "joined_date": "2023-06-10"
    },
    {
        "id": "4",
        "username": "DiamondHunter",
        "role": "Modérateur",
        "avatar_url": "https://mc-heads.net/avatar/jeb_/100",
        "discord": "diamondhunter#0004",
        "joined_date": "2023-09-01"
    }
]

MOCK_SHOP_ITEMS = [
    {
        "id": "vip",
        "name": "VIP",
        "description": "Accès aux avantages VIP sur tous les modes de jeu",
        "price": 4.99,
        "currency": "EUR",
        "category": "grades",
        "features": ["Préfixe [VIP]", "Accès prioritaire", "Kit VIP", "2x XP"],
        "color": "#22D3EE",
        "popular": False
    },
    {
        "id": "vip_plus",
        "name": "VIP+",
        "description": "Tous les avantages VIP avec des bonus exclusifs",
        "price": 9.99,
        "currency": "EUR",
        "category": "grades",
        "features": ["Préfixe [VIP+]", "Accès prioritaire", "Kit VIP+", "3x XP", "Particules exclusives"],
        "color": "#10B981",
        "popular": True
    },
    {
        "id": "mvp",
        "name": "MVP",
        "description": "Le grade ultime avec tous les avantages",
        "price": 19.99,
        "currency": "EUR",
        "category": "grades",
        "features": ["Préfixe [MVP]", "Accès prioritaire", "Kit MVP", "5x XP", "Particules exclusives", "Pet exclusif", "Accès Beta"],
        "color": "#F472B6",
        "popular": False
    },
    {
        "id": "coins_pack_1",
        "name": "Pack 1000 Coins",
        "description": "1000 coins pour la boutique en jeu",
        "price": 2.99,
        "currency": "EUR",
        "category": "coins",
        "features": ["1000 Coins", "Utilisable sur tous les modes"],
        "color": "#FBBF24",
        "popular": False
    },
    {
        "id": "coins_pack_2",
        "name": "Pack 5000 Coins",
        "description": "5000 coins + 500 bonus !",
        "price": 9.99,
        "currency": "EUR",
        "category": "coins",
        "features": ["5000 Coins", "+500 Bonus", "Utilisable sur tous les modes"],
        "color": "#FBBF24",
        "popular": True
    }
]

MOCK_REVIEWS = [
    {
        "id": "1",
        "username": "MinecraftPro",
        "avatar_url": "https://mc-heads.net/avatar/Dream/100",
        "rating": 5,
        "comment": "Meilleur serveur FR ! La communauté est incroyable et les mini-jeux sont super bien faits.",
        "date": "2024-12-01"
    },
    {
        "id": "2",
        "username": "BuilderKing",
        "avatar_url": "https://mc-heads.net/avatar/Technoblade/100",
        "rating": 5,
        "comment": "J'adore le Build Battle ! Les thèmes sont originaux et les juges sont justes.",
        "date": "2024-11-28"
    },
    {
        "id": "3",
        "username": "PvPMaster",
        "avatar_url": "https://mc-heads.net/avatar/Sapnap/100",
        "rating": 4,
        "comment": "Le PvP est smooth, pas de lag. Par contre j'aimerais plus de maps sur BedWars.",
        "date": "2024-11-25"
    },
    {
        "id": "4",
        "username": "CasualGamer",
        "avatar_url": "https://mc-heads.net/avatar/GeorgeNotFound/100",
        "rating": 5,
        "comment": "Parfait pour jouer avec des amis ! Le staff est réactif et sympa.",
        "date": "2024-11-20"
    }
]

MOCK_LEADERBOARD = [
    {"rank": 1, "username": "xXDragonSlayerXx", "avatar_url": "https://mc-heads.net/avatar/Dream/100", "score": 15420, "game": "BedWars", "wins": 342, "kills": 2156},
    {"rank": 2, "username": "ProGamer2024", "avatar_url": "https://mc-heads.net/avatar/Technoblade/100", "score": 14850, "game": "BedWars", "wins": 318, "kills": 1987},
    {"rank": 3, "username": "NinjaBuilder", "avatar_url": "https://mc-heads.net/avatar/Sapnap/100", "score": 13200, "game": "BedWars", "wins": 289, "kills": 1756},
    {"rank": 4, "username": "CraftMaster", "avatar_url": "https://mc-heads.net/avatar/GeorgeNotFound/100", "score": 12100, "game": "BedWars", "wins": 267, "kills": 1534},
    {"rank": 5, "username": "BlockWarrior", "avatar_url": "https://mc-heads.net/avatar/BadBoyHalo/100", "score": 11500, "game": "BedWars", "wins": 245, "kills": 1423},
    {"rank": 6, "username": "SkyFighter", "avatar_url": "https://mc-heads.net/avatar/Skeppy/100", "score": 10800, "game": "SkyWars", "wins": 234, "kills": 1356},
    {"rank": 7, "username": "DiamondKing", "avatar_url": "https://mc-heads.net/avatar/AntVenom/100", "score": 9950, "game": "SkyWars", "wins": 212, "kills": 1234},
    {"rank": 8, "username": "BuildPro", "avatar_url": "https://mc-heads.net/avatar/CaptainSparklez/100", "score": 9200, "game": "Build Battle", "wins": 198, "kills": 0},
    {"rank": 9, "username": "SurvivalExpert", "avatar_url": "https://mc-heads.net/avatar/SSundee/100", "score": 8700, "game": "Survival", "wins": 187, "kills": 876},
    {"rank": 10, "username": "UHCChampion", "avatar_url": "https://mc-heads.net/avatar/Mumbo/100", "score": 8100, "game": "UHC", "wins": 176, "kills": 943}
]

MOCK_RULES = [
    {"id": "1", "title": "Respect des joueurs", "description": "Tout comportement irrespectueux, insultes, harcèlement ou discrimination est strictement interdit.", "category": "Comportement", "severity": "high"},
    {"id": "2", "title": "Pas de triche", "description": "L'utilisation de hacks, mods interdits, ou tout logiciel donnant un avantage déloyal est bannie.", "category": "Jeu", "severity": "high"},
    {"id": "3", "title": "Pas de spam", "description": "Évitez de spammer le chat, les commandes ou les messages privés.", "category": "Chat", "severity": "medium"},
    {"id": "4", "title": "Pas de pub", "description": "La publicité pour d'autres serveurs ou sites non autorisés est interdite.", "category": "Chat", "severity": "medium"},
    {"id": "5", "title": "Constructions appropriées", "description": "Les constructions offensantes ou inappropriées seront supprimées.", "category": "Construction", "severity": "medium"},
    {"id": "6", "title": "Utilisation du nom", "description": "Les noms de joueurs offensants ou usurpant l'identité du staff sont interdits.", "category": "Compte", "severity": "low"},
    {"id": "7", "title": "Bug exploit", "description": "Exploiter des bugs au lieu de les signaler peut entraîner des sanctions.", "category": "Jeu", "severity": "high"},
    {"id": "8", "title": "Échanges sécurisés", "description": "Les arnaques et échanges frauduleux sont sanctionnés. Utilisez les systèmes officiels.", "category": "Économie", "severity": "medium"}
]

# ========== ROUTES ==========

@api_router.get("/")
async def root():
    return {"message": "Bienvenue sur l'API Axecraft !"}

@api_router.get("/stats", response_model=ServerStats)
async def get_server_stats():
    """Get real-time server statistics"""
    return ServerStats(
        online_players=4,
        max_players=100,
        server_ip="play.axecraft.fr",
        status="online",
        uptime_percentage=99.8
    )

@api_router.get("/minigames", response_model=List[MiniGame])
async def get_minigames():
    """Get all available minigames"""
    return [MiniGame(**game) for game in MOCK_MINIGAMES]

@api_router.get("/minigames/{game_id}", response_model=MiniGame)
async def get_minigame(game_id: str):
    """Get a specific minigame by ID"""
    for game in MOCK_MINIGAMES:
        if game["id"] == game_id:
            return MiniGame(**game)
    raise HTTPException(status_code=404, detail="Mini-jeu non trouvé")

@api_router.get("/staff", response_model=List[StaffMember])
async def get_staff():
    """Get all staff members"""
    return [StaffMember(**member) for member in MOCK_STAFF]

@api_router.get("/shop", response_model=List[ShopItem])
async def get_shop_items():
    """Get all shop items"""
    return [ShopItem(**item) for item in MOCK_SHOP_ITEMS]

@api_router.get("/shop/{category}", response_model=List[ShopItem])
async def get_shop_items_by_category(category: str):
    """Get shop items by category"""
    items = [item for item in MOCK_SHOP_ITEMS if item["category"] == category]
    return [ShopItem(**item) for item in items]

@api_router.get("/reviews", response_model=List[PlayerReview])
async def get_reviews():
    """Get player reviews"""
    # First try to get reviews from database
    db_reviews = await db.reviews.find({}, {"_id": 0}).to_list(100)
    if db_reviews:
        return [PlayerReview(**review) for review in db_reviews]
    return [PlayerReview(**review) for review in MOCK_REVIEWS]

@api_router.post("/reviews", response_model=PlayerReview)
async def create_review(review: ReviewCreate):
    """Create a new review"""
    new_review = {
        "id": str(uuid.uuid4()),
        "username": review.username,
        "avatar_url": f"https://mc-heads.net/avatar/{review.username}/100",
        "rating": min(5, max(1, review.rating)),
        "comment": review.comment,
        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d")
    }
    await db.reviews.insert_one(new_review)
    return PlayerReview(**new_review)

@api_router.get("/leaderboard", response_model=List[LeaderboardEntry])
async def get_leaderboard(game: Optional[str] = None, limit: int = 10):
    """Get leaderboard entries"""
    entries = MOCK_LEADERBOARD
    if game:
        entries = [e for e in entries if e["game"].lower() == game.lower()]
    return [LeaderboardEntry(**entry) for entry in entries[:limit]]

@api_router.get("/rules", response_model=List[Rule])
async def get_rules():
    """Get all server rules"""
    return [Rule(**rule) for rule in MOCK_RULES]

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
