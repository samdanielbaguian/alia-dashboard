# 📚 DOCUMENTATION COMPLÈTE — ALIA MARKETPLACE
<!-- markdownlint-disable MD040 MD060 MD034 -->
> **Version** : 1.0.0 &nbsp;|&nbsp; **Date** : 14 mai 2026 &nbsp;|&nbsp; **Auteur** : samdanielbaguian

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
   - 1.1 [Qu'est-ce qu'Alia ?](#11-quest-ce-qualia-)
   - 1.2 [Technologies utilisées](#12-technologies-utilisées)
   - 1.3 [Architecture globale](#13-architecture-globale)
2. [Structure du projet](#2-structure-du-projet)
   - 2.1 [Frontend (alia-dashboard/)](#21-frontend-alia-dashboard)
   - 2.2 [Backend (alia/backend/)](#22-backend-aliabackend)
3. [Installation et configuration](#3-installation-et-configuration)
   - 3.1 [Prérequis](#31-prérequis)
   - 3.2 [Clonage du projet](#32-clonage-du-projet)
   - 3.3 [Installation Frontend](#33-installation-frontend)
   - 3.4 [Installation Backend](#34-installation-backend)
   - 3.5 [Démarrage avec Docker (Recommandé)](#35-démarrage-avec-docker-recommandé)
   - 3.6 [Démarrage sans Docker](#36-démarrage-sans-docker)
4. [Rôles et permissions](#4-rôles-et-permissions)
   - 4.1 [Rôles existants](#41-rôles-existants)
   - 4.2 [Endpoints par rôle](#42-endpoints-par-rôle)
5. [API Endpoints complets](#5-api-endpoints-complets)
   - 5.1 [Authentification](#51-authentification)
   - 5.2 [Produits](#52-produits)
   - 5.3 [Commandes](#53-commandes)
   - 5.4 [Panier](#54-panier)
   - 5.5 [Marchands](#55-marchands)
   - 5.6 [Paiements](#56-paiements)
   - 5.7 [AliExpress](#57-aliexpress)
   - 5.8 [Buy Box](#58-buy-box)
6. [Base de données (MongoDB)](#6-base-de-données-mongodb)
   - 6.1 [Collections](#61-collections)
   - 6.2 [Schémas des collections](#62-schémas-des-collections)
   - 6.3 [Index recommandés](#63-index-recommandés)
   - 6.4 [Relations entre collections](#64-relations-entre-collections)
7. [Flux principaux](#7-flux-principaux)
   - 7.1 [Authentification](#71-flux-dauthentification)
   - 7.2 [Création de commande](#72-flux-de-création-de-commande)
   - 7.3 [Buy Box](#73-algorithme-buy-box)
   - 7.4 [Paiement Mobile Money](#74-flux-de-paiement-mobile-money)
8. [Frontend — Composants et pages](#8-frontend--composants-et-pages)
   - 8.1 [Contextes React](#81-contextes-react)
   - 8.2 [Hooks personnalisés](#82-hooks-personnalisés)
   - 8.3 [Layouts](#83-layouts)
   - 8.4 [Dark mode](#84-dark-mode)
   - 8.5 [Pages publiques](#85-pages-publiques)
   - 8.6 [Dashboard Marchand](#86-dashboard-marchand)
   - 8.7 [Dashboard Acheteur](#87-dashboard-acheteur)
9. [Déploiement](#9-déploiement)
   - 9.1 [Build de production](#91-build-de-production)
   - 9.2 [Variables d'environnement production](#92-variables-denvironnement-production)
10. [Dépannage (Troubleshooting)](#10-dépannage-troubleshooting)
    - 10.1 [Problèmes courants](#101-problèmes-courants)
    - 10.2 [Commandes utiles](#102-commandes-utiles)
    - 10.3 [Logs importants](#103-logs-importants)
11. [Contribution](#11-contribution)
    - 11.1 [Standards de code](#111-standards-de-code)
    - 11.2 [Convention de commits](#112-convention-de-commits)
12. [Contact et support](#12-contact-et-support)
13. [Versions et mise à jour](#13-versions-et-mise-à-jour)

---

## 1. PRÉSENTATION DU PROJET

### 1.1 Qu'est-ce qu'Alia ?

**Alia** est une marketplace B2C africaine connectant marchands locaux et acheteurs, avec les fonctionnalités suivantes :

- **Intégration AliExpress** : importation de produits et synchronisation de catalogues
- **Système Buy Box intelligent** : sélection automatique du meilleur marchand selon stock, distance et notation
- **Paiements Mobile Money** : Orange Money, MTN MoMo, Moov Money, Wave
- **Dashboard marchand** : suivi des ventes, gestion des commandes et des produits, alertes de stock
- **Dashboard acheteur** : historique de commandes, wishlist, panier, profil

L'objectif est de fournir une expérience e-commerce adaptée au marché ouest-africain, avec des mécanismes de paiement locaux et un réseau de marchands régionaux.

---

### 1.2 Technologies utilisées

| Composant        | Technologie               | Version  |
|------------------|---------------------------|----------|
| Frontend         | Next.js (App Router)      | 16.1.1   |
| UI Library       | Material-UI (MUI)         | v7.3.6   |
| State/Context    | React Context API         | 19.2.3   |
| Backend          | FastAPI                   | 0.104.1  |
| Serveur ASGI     | Uvicorn                   | 0.24.0   |
| Base de données  | MongoDB                   | 7.0      |
| ODM              | Motor (async)             | 3.3.2    |
| Validation       | Pydantic                  | v2.5.0   |
| Auth             | JWT (python-jose)         | HS256    |
| Paiements        | Simulation + Mobile Money | —        |
| Containerisation | Docker + Docker Compose   | 20.10+   |

---

### 1.3 Architecture globale

```
┌────────────────────────────────────────────────────────────────────┐
│                        ALIA PLATFORM                               │
├──────────────────────────────┬─────────────────────────────────────┤
│    FRONTEND (Next.js :3000)  │    BACKEND (FastAPI :8000)          │
├──────────────────────────────┼─────────────────────────────────────┤
│  /                           │  POST /api/auth/register            │
│    └── Vitrine publique      │  POST /api/auth/login               │
│  /login                      │  GET  /api/auth/me                  │
│  /register                   │                                     │
│  /products/[id]              │  GET/POST/PUT/DELETE /api/products  │
│                              │                                     │
│  /dashboard/merchant/*       │  GET  /api/merchants/me             │
│    ├── page.js (KPIs)        │  GET  /api/merchants/me/dashboard-overview
│    ├── products/             │  GET  /api/merchants/me/orders      │
│    ├── orders/               │  GET  /api/merchants/me/bestsellers │
│    ├── stats/                │  GET  /api/merchants/me/alerts      │
│    ├── alerts/               │                                     │
│    └── settings/             │  GET/POST /api/orders/*             │
│                              │  GET/POST/DELETE /api/cart/*        │
│  /dashboard/customer/*       │  POST /api/payments/initiate        │
│    ├── page.js               │  GET  /api/payments                 │
│    ├── orders/               │                                     │
│    ├── wishlist/             │  GET  /api/aliexpress/*             │
│    ├── cart/                 │  GET  /api/buybox/*                 │
│    ├── shops/                │                                     │
│    └── profile/              │                                     │
├──────────────────────────────┴─────────────────────────────────────┤
│                    MONGODB 7.0 (alia_db)                           │
│  users │ merchants │ products │ orders │ cart │ payments           │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. STRUCTURE DU PROJET

### 2.1 Frontend (alia-dashboard/)

```
alia-dashboard/
├── app/                            # Next.js App Router
│   ├── layout.js                   # Root layout (MUI ThemeProvider + ThemeContext)
│   ├── page.js                     # Page d'accueil / vitrine publique
│   ├── middleware.js               # Protection des routes (auth)
│   ├── dashboard/
│   │   ├── layout.js               # Guard d'auth commun (vérifie JWT)
│   │   ├── merchant/               # Dashboard marchand
│   │   │   ├── page.js             # Vue générale : KPIs, ventes, commandes récentes
│   │   │   ├── products/           # CRUD produits
│   │   │   │   ├── page.js         # Liste des produits
│   │   │   │   └── create/page.js  # Formulaire création
│   │   │   ├── orders/             # Commandes reçues
│   │   │   │   ├── page.js         # Liste et filtres
│   │   │   │   └── [id]/page.js    # Détail commande
│   │   │   ├── stats/page.js       # Statistiques avancées et graphiques
│   │   │   ├── heatmap/page.js     # Carte de chaleur géographique
│   │   │   ├── best-sellers/page.js # Meilleurs produits
│   │   │   ├── alerts/page.js      # Alertes de stock
│   │   │   ├── customers/page.js   # Gestion des clients
│   │   │   ├── export/page.js      # Export des données
│   │   │   ├── reports/page.js     # Rapports détaillés
│   │   │   ├── sellers/page.js     # Vendeurs associés
│   │   │   ├── custom-orders/page.js # Commandes personnalisées
│   │   │   └── settings/page.js    # Paramètres boutique
│   │   └── customer/               # Dashboard acheteur
│   │       ├── page.js             # Vue générale : commandes, recommandations
│   │       ├── orders/             # Historique des commandes
│   │       │   ├── page.js         # Liste
│   │       │   └── [id]/page.js    # Détail avec timeline de statut
│   │       ├── wishlist/page.js    # Liste de souhaits
│   │       ├── cart/page.js        # Panier + récapitulatif
│   │       ├── shops/page.js       # Boutiques (filtrées, paginées)
│   │       ├── profile/page.js     # Profil et préférences
│   │       └── payments/page.js    # Historique des paiements
│   ├── login/page.js               # Page connexion
│   ├── register/page.js            # Page inscription
│   ├── products/[id]/page.js       # Fiche produit publique
│   ├── test-api/page.js            # Page de test des endpoints
│   └── unauthorized/page.js        # Accès refusé
│
├── components/                     # Composants réutilisables
│   ├── ProductCard.js              # Carte produit (public + dashboard)
│   ├── ActionButton.js             # Bouton avec loader/état
│   ├── cards/                      # Cartes KPI, stats
│   ├── charts/                     # Composants graphiques SVG
│   ├── tables/                     # Tableaux de données
│   └── widgets/                    # Widgets spéciaux (heatmap, etc.)
│
├── context/
│   └── ThemeContext.js             # Provider dark/light mode (localStorage)
│
├── hooks/
│   ├── useAuth.js                  # Auth : user, token, login, logout, isLoggedIn
│   └── useGreeting.js              # Salutation dynamique selon heure
│
├── layout/                         # Layouts réutilisables
│   ├── CustomerDashboardLayout.js  # AppBar + CustomerSidebar + contenu
│   ├── CustomerSidebar.js          # Sidebar acheteur (collapsible)
│   ├── MerchantDashboardLayout.js  # AppBar + MerchantSidebar + toggle dark mode
│   ├── MerchantSidebar.js          # Sidebar marchand (collapsible)
│   ├── DashboardLayout.js          # Layout générique (Header + Sidebar basique)
│   ├── Header.js                   # AppBar générique
│   ├── Sidebar.js                  # Sidebar générique
│   └── constants.js                # DRAWER_WIDTH = 280
│
├── services/
│   └── aliexpressIntegration.js    # Mock AliExpress (getShops, import, sync)
│
├── styles/
│   ├── global.css                  # Variables CSS (dark/light), resets, overrides MUI
│   └── theme.js                    # Thème MUI (getTheme('dark'|'light'))
│
├── utils/
│   ├── api.js                      # apiGet/apiPost/apiPut/apiDelete + token
│   ├── helpers.js                  # Formatage dates, prix, statuts
│   ├── mockData.js                 # Données mockées pour dev
│   └── mockShops.js                # 100+ boutiques mockées avec SHOP_CATEGORIES
│
├── data/
│   └── mockData.js                 # Données statiques partagées
│
├── public/                         # Assets statiques (favicon, images)
├── middleware.js                   # Middleware Next.js (auth routes)
├── next.config.mjs                 # Config Next.js
├── jsconfig.json                   # Alias @ → racine du projet
├── eslint.config.mjs               # Config ESLint
└── package.json
```

---

### 2.2 Backend (alia/backend/)

```
alia/backend/
├── app/
│   ├── main.py                     # Entrée FastAPI : CORS, routes, startup/shutdown
│   ├── api/
│   │   ├── deps.py                 # Dépendances : get_db, get_current_user, get_current_merchant
│   │   └── routes/
│   │       ├── auth.py             # POST /register, POST /login, GET /me
│   │       ├── products.py         # CRUD produits
│   │       ├── orders.py           # Commandes (créer, statut, annuler)
│   │       ├── merchants.py        # Profil marchand, dashboard, KPIs, alertes
│   │       ├── payments.py         # Initiation et suivi des paiements
│   │       ├── cart.py             # Gestion du panier
│   │       ├── aliexpress.py       # Import et synchronisation AliExpress
│   │       ├── buybox.py           # Algorithme Buy Box
│   │       └── __init__.py
│   ├── core/
│   │   ├── config.py               # Settings Pydantic (chargés depuis .env)
│   │   ├── security.py             # Hashage bcrypt, création/vérification JWT
│   │   └── database.py             # Connexion Motor (async MongoDB)
│   ├── models/                     # Modèles de données internes
│   │   ├── user.py
│   │   ├── merchant.py
│   │   ├── product.py
│   │   └── order.py
│   ├── schemas/                    # Schémas Pydantic (Request / Response)
│   │   ├── auth.py                 # LoginRequest, RegisterRequest, Token
│   │   ├── user.py                 # UserResponse
│   │   ├── order.py                # OrderResponse, StatusHistoryResponse
│   │   ├── dashboard.py            # DashboardOverviewResponse, AlertsResponse, etc.
│   │   └── share.py                # MerchantShareResponse
│   └── services/                   # Logique métier
│       ├── order_service.py        # Création, validation, transitions de statut
│       ├── payment_service.py      # Initiation Mobile Money, callbacks
│       ├── buybox_service.py       # Calcul score marchand
│       └── share_service.py        # Génération liens de partage
├── tests/
│   ├── test_main.py
│   ├── test_heatmap.py
│   ├── test_merchant_dashboard.py
│   ├── test_order_service.py
│   ├── test_payment_integration.py
│   ├── test_payment_models.py
│   ├── test_phone_validator.py
│   ├── test_refund_service.py
│   └── test_simulation_service.py
├── Dockerfile
├── requirements.txt
└── .env.example
```

---

## 3. INSTALLATION ET CONFIGURATION

### 3.1 Prérequis

| Logiciel  | Version minimale | Vérification           |
|-----------|------------------|------------------------|
| Node.js   | 18.17+           | `node --version`       |
| npm       | 9.0+             | `npm --version`        |
| Python    | 3.11+            | `python --version`     |
| Docker    | 20.10+           | `docker --version`     |
| Docker Compose | 2.0+        | `docker compose version` |
| Git       | 2.30+            | `git --version`        |

> MongoDB n'est pas requis en local si Docker est utilisé.

---

### 3.2 Clonage du projet

```bash
git clone https://github.com/samdanielbaguian/alia.git
cd alia
```

Structure après clonage :

```
alia/
├── alia/                  # Backend FastAPI + docker-compose
│   ├── backend/
│   └── docker-compose.yml
└── alia-dashboard/        # Frontend Next.js
```

---

### 3.3 Installation Frontend

```bash
cd alia-dashboard
npm install
```

Créer le fichier `.env.local` :

```bash
cp .env.example .env.local
```

Contenu de `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Alia Marketplace
```

---

### 3.4 Installation Backend

```bash
cd ../alia/backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Linux/Mac)
source venv/bin/activate

# Activer (Windows PowerShell)
venv\Scripts\Activate.ps1

# Installer les dépendances
pip install -r requirements.txt
```

Créer le fichier `.env` :

```bash
cp .env.example .env
```

Contenu de `.env` :

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=alia_db
JWT_SECRET_KEY=une_cle_secrete_tres_longue_et_aleatoire_min_32_chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Optionnel — APIs externes (mock si vide)
ALIEXPRESS_API_KEY=
ALIEXPRESS_API_SECRET=
ORANGE_MONEY_API_KEY=
MOOV_MONEY_API_KEY=
WAVE_API_KEY=
```

> **Important** : `JWT_SECRET_KEY` est la seule variable obligatoire. Sans elle, FastAPI refuse de démarrer (validée par Pydantic Settings).

---

### 3.5 Démarrage avec Docker (Recommandé)

```bash
cd alia/alia
docker compose up --build
```

Services démarrés :

| Service  | Port  | URL                            |
|----------|-------|--------------------------------|
| Backend  | 8000  | http://localhost:8000/docs     |
| MongoDB  | 27017 | mongodb://localhost:27017      |

> Le frontend Next.js ne fait pas partie du `docker-compose.yml` actuel. Il se lance séparément en développement.

---

### 3.6 Démarrage sans Docker

**MongoDB** (installer localement ou utiliser MongoDB Atlas) :

```bash
mongod --dbpath /data/db
```

**Backend** :

```bash
cd alia/backend
source venv/bin/activate   # ou venv\Scripts\Activate.ps1 sous Windows
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend** :

```bash
cd alia-dashboard
npm run dev
# Accessible sur http://localhost:3000
```

---

## 4. RÔLES ET PERMISSIONS

### 4.1 Rôles existants

| Rôle      | Code       | Dashboard accessible        | Description                          |
|-----------|------------|-----------------------------|--------------------------------------|
| Marchand  | `merchant` | `/dashboard/merchant/*`     | Vendeur — gestion produits et ventes |
| Acheteur  | `buyer`    | `/dashboard/customer/*`     | Client — commandes et favoris        |
| Admin     | `admin`    | Non implémenté              | Évolution future                     |

Le rôle est stocké dans le JWT sous la clé `role` et dans MongoDB dans `users.role`.

Lors de l'inscription (`POST /api/auth/register`), le champ `role` est obligatoire et doit être `"merchant"` ou `"buyer"`.

---

### 4.2 Endpoints par rôle

**Publics (sans authentification) :**

- `GET  /api/products` — Catalogue produits
- `GET  /api/products/{id}` — Détail produit
- `POST /api/auth/login` — Connexion
- `POST /api/auth/register` — Inscription
- `GET  /api/merchants/{id}` — Profil public marchand
- `GET  /api/buybox/{product_id}` — Meilleur marchand pour un produit

**Marchand uniquement (`role: merchant`) :**

- `GET/PUT /api/merchants/me` — Son propre profil
- `GET /api/merchants/me/dashboard-overview` — KPIs agrégés
- `GET /api/merchants/me/orders` — Commandes reçues
- `GET /api/merchants/me/bestsellers` — Top produits
- `GET /api/merchants/me/alerts` — Alertes de stock
- `POST/PUT/DELETE /api/products/*` — CRUD ses produits
- `PATCH /api/orders/{id}/status` — Changement de statut
- `POST /api/orders/{id}/confirm|ship|deliver` — Transitions de commande

**Acheteur uniquement (`role: buyer`) :**

- `GET /api/orders/me` — Ses commandes
- `GET /api/orders/{id}` — Détail (propriétaire uniquement)
- `POST /api/orders/from-cart` — Créer commande depuis le panier
- `POST /api/orders/{id}/cancel` — Annuler sa commande
- `GET/POST/DELETE /api/cart/*` — Gestion panier
- `GET/POST/DELETE /api/customers/me/wishlist/*` — Wishlist
- `GET/PUT /api/customers/me` — Son profil
- `GET /api/payments` — Son historique de paiements

---

## 5. API ENDPOINTS COMPLETS

> **Base URL** : `http://localhost:8000`
> **Préfixe** : `/api`
> **Auth** : `Authorization: Bearer <jwt_token>`
> **Documentation interactive** : http://localhost:8000/docs (Swagger UI)

---

### 5.1 Authentification

| Méthode | Endpoint            | Description                    | Auth |
|---------|---------------------|--------------------------------|------|
| `POST`  | `/api/auth/register`| Inscription (merchant/buyer)   | ❌   |
| `POST`  | `/api/auth/login`   | Connexion — retourne JWT       | ❌   |
| `GET`   | `/api/auth/me`      | Profil de l'utilisateur courant| ✅   |

**Body `POST /api/auth/register` :**

```json
{
  "email": "marchand@example.com",
  "password": "motdepasse123",
  "role": "merchant",
  "shop_name": "Ma Boutique",
  "age": 30,
  "preferences": []
}
```

**Body `POST /api/auth/login` :**

```json
{
  "email": "marchand@example.com",
  "password": "motdepasse123"
}
```

**Response `Token` :**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

---

### 5.2 Produits

| Méthode  | Endpoint                  | Description              | Auth           |
|----------|---------------------------|--------------------------|----------------|
| `GET`    | `/api/products`           | Liste (pagination, filtre)| ❌             |
| `GET`    | `/api/products/{id}`      | Détail produit           | ❌             |
| `POST`   | `/api/products`           | Créer un produit         | ✅ Marchand    |
| `PUT`    | `/api/products/{id}`      | Modifier son produit     | ✅ Marchand    |
| `DELETE` | `/api/products/{id}`      | Supprimer son produit    | ✅ Marchand    |
| `GET`    | `/api/products/search?q=` | Recherche full-text      | ❌             |

**Query params `GET /api/products` :**

| Paramètre  | Type    | Défaut | Description                         |
|------------|---------|--------|-------------------------------------|
| `page`     | int     | 1      | Numéro de page                      |
| `limit`    | int     | 20     | Produits par page                   |
| `category` | string  | —      | Filtrer par catégorie               |
| `merchant_id` | string | —   | Filtrer par marchand                |
| `min_price` | float  | —      | Prix minimum                        |
| `max_price` | float  | —      | Prix maximum                        |

---

### 5.3 Commandes

| Méthode  | Endpoint                       | Description                | Auth           |
|----------|--------------------------------|----------------------------|----------------|
| `GET`    | `/api/orders`                  | Liste (filtres)            | ✅             |
| `GET`    | `/api/orders/{id}`             | Détail commande            | ✅ Propriétaire|
| `POST`   | `/api/orders/from-cart`        | Créer depuis panier        | ✅ Acheteur    |
| `PATCH`  | `/api/orders/{id}/status`      | Modifier statut            | ✅ Marchand    |
| `POST`   | `/api/orders/{id}/confirm`     | Confirmer la commande      | ✅ Marchand    |
| `POST`   | `/api/orders/{id}/ship`        | Marquer expédiée           | ✅ Marchand    |
| `POST`   | `/api/orders/{id}/deliver`     | Marquer livrée             | ✅ Marchand    |
| `POST`   | `/api/orders/{id}/cancel`      | Annuler                    | ✅             |

**Cycle de vie d'une commande :**

```
pending ──▶ confirmed ──▶ shipped ──▶ delivered
    │                                     │
    └──────────────────────▶ cancelled ◀──┘
```

---

### 5.4 Panier

| Méthode  | Endpoint                  | Description              | Auth        |
|----------|---------------------------|--------------------------|-------------|
| `GET`    | `/api/cart`               | Voir son panier          | ✅ Acheteur |
| `POST`   | `/api/cart/items`         | Ajouter un article       | ✅ Acheteur |
| `PUT`    | `/api/cart/items/{id}`    | Modifier la quantité     | ✅ Acheteur |
| `DELETE` | `/api/cart/items/{id}`    | Retirer un article       | ✅ Acheteur |
| `DELETE` | `/api/cart`               | Vider le panier          | ✅ Acheteur |

---

### 5.5 Marchands

| Méthode | Endpoint                                  | Description                      | Auth           |
|---------|-------------------------------------------|----------------------------------|----------------|
| `GET`   | `/api/merchants/{merchant_id}`            | Profil public                    | ❌             |
| `PUT`   | `/api/merchants/{merchant_id}`            | Modifier son profil              | ✅ Marchand    |
| `GET`   | `/api/merchants/me/dashboard-overview`   | KPIs : CA, commandes, taux       | ✅ Marchand    |
| `GET`   | `/api/merchants/me/orders`               | Ses commandes reçues             | ✅ Marchand    |
| `GET`   | `/api/merchants/me/bestsellers`          | Top produits par ventes          | ✅ Marchand    |
| `GET`   | `/api/merchants/me/alerts`               | Alertes stock faible             | ✅ Marchand    |
| `GET`   | `/api/merchants/me/activity`             | Activité récente                 | ✅ Marchand    |
| `GET`   | `/api/merchants/me/order-stats`          | Stats commandes par période      | ✅ Marchand    |
| `GET`   | `/api/merchants/me/export-orders`        | Export CSV/JSON commandes        | ✅ Marchand    |

**Query params `GET /api/merchants/me/dashboard-overview` :**

| Paramètre | Valeurs                             | Description         |
|-----------|-------------------------------------|---------------------|
| `period`  | `today`, `week`, `month`, `quarter` | Période d'analyse   |

---

### 5.6 Paiements

| Méthode | Endpoint                   | Description                        | Auth        |
|---------|----------------------------|------------------------------------|-------------|
| `POST`  | `/api/payments/initiate`   | Initier un paiement Mobile Money   | ✅ Acheteur |
| `GET`   | `/api/payments/{id}`       | Statut d'un paiement               | ✅          |
| `GET`   | `/api/payments`            | Historique des paiements           | ✅          |

**Body `POST /api/payments/initiate` :**

```json
{
  "order_id": "6457c8f9...",
  "method": "orange_money",
  "phone": "+22501234567",
  "amount": 15000
}
```

**Méthodes de paiement supportées :**

| Code            | Description         |
|-----------------|---------------------|
| `orange_money`  | Orange Money CI/CM  |
| `mtn_momo`      | MTN Mobile Money    |
| `moov_money`    | Moov Money          |
| `wave`          | Wave                |
| `simulation`    | Mode test (toujours OK) |

---

### 5.7 AliExpress

| Méthode | Endpoint                              | Description                        | Auth        |
|---------|---------------------------------------|------------------------------------|-------------|
| `GET`   | `/api/aliexpress/products`            | Rechercher des produits AliExpress | ✅ Marchand |
| `POST`  | `/api/aliexpress/import/{product_id}` | Importer un produit                | ✅ Marchand |
| `POST`  | `/api/aliexpress/sync/{product_id}`   | Synchroniser stock/prix            | ✅ Marchand |

> En l'absence de clés API réelles (`ALIEXPRESS_API_KEY`), ces endpoints retournent des données mockées.

---

### 5.8 Buy Box

| Méthode | Endpoint                       | Description                           | Auth |
|---------|--------------------------------|---------------------------------------|------|
| `GET`   | `/api/buybox/{product_id}`     | Meilleur marchand pour un produit     | ❌   |
| `GET`   | `/api/buybox/merchants/{id}`   | Score Buy Box d'un marchand           | ❌   |

**Réponse `GET /api/buybox/{product_id}` :**

```json
{
  "product_id": "...",
  "winner_merchant_id": "...",
  "score": 87.5,
  "breakdown": {
    "stock_score": 40,
    "distance_score": 35,
    "rating_score": 12.5
  }
}
```

---

## 6. BASE DE DONNÉES (MongoDB)

### 6.1 Collections

| Collection  | Description              | Documents estimés |
|-------------|--------------------------|-------------------|
| `users`     | Comptes utilisateurs     | ∞                 |
| `merchants` | Profils boutiques        | 1 par marchand    |
| `products`  | Catalogue produits       | ∞                 |
| `orders`    | Commandes               | ∞                 |
| `cart`      | Paniers actifs           | 1 par acheteur    |
| `payments`  | Transactions             | ∞                 |

---

### 6.2 Schémas des collections

**`users`**

```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "password_hash": "string (bcrypt)",
  "role": "merchant | buyer",
  "first_name": "string",
  "last_name": "string",
  "age": "int",
  "preferences": ["string"],
  "good_rate": "float (0-100, défaut: 50)",
  "created_at": "datetime"
}
```

**`merchants`**

```json
{
  "_id": "ObjectId",
  "user_id": "string (ref users._id)",
  "shop_name": "string",
  "description": "string",
  "location": {
    "city": "string",
    "country": "string",
    "coordinates": [float, float]
  },
  "total_sales": "float",
  "rating": "float (0-100)",
  "categories": ["string"],
  "created_at": "datetime"
}
```

**`products`**

```json
{
  "_id": "ObjectId",
  "merchant_id": "string (ref users._id)",
  "title": "string",
  "description": "string",
  "price": "float",
  "stock": "int",
  "category": "string",
  "images": ["string (URL)"],
  "aliexpress_id": "string (optionnel)",
  "tags": ["string"],
  "is_active": "bool",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**`orders`**

```json
{
  "_id": "ObjectId",
  "user_id": "string (ref users._id)",
  "merchant_id": "string (ref users._id)",
  "items": [
    {
      "product_id": "string",
      "title": "string",
      "quantity": "int",
      "unit_price": "float"
    }
  ],
  "total_amount": "float",
  "status": "pending | confirmed | shipped | delivered | cancelled",
  "status_history": [
    { "status": "string", "timestamp": "datetime", "note": "string" }
  ],
  "shipping_address": {
    "street": "string",
    "city": "string",
    "country": "string"
  },
  "payment_method": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

**`cart`**

```json
{
  "_id": "ObjectId",
  "user_id": "string (unique, ref users._id)",
  "items": [
    {
      "product_id": "string",
      "quantity": "int",
      "added_at": "datetime"
    }
  ],
  "updated_at": "datetime"
}
```

**`payments`**

```json
{
  "_id": "ObjectId",
  "order_id": "string (ref orders._id)",
  "user_id": "string",
  "amount": "float",
  "currency": "XOF",
  "method": "orange_money | mtn_momo | moov_money | wave | simulation",
  "phone": "string",
  "status": "pending | success | failed | refunded",
  "provider_transaction_id": "string",
  "created_at": "datetime",
  "completed_at": "datetime"
}
```

---

### 6.3 Index recommandés

```javascript
// À exécuter dans MongoDB Compass ou mongosh
db.users.createIndex({ email: 1 }, { unique: true })

db.merchants.createIndex({ user_id: 1 }, { unique: true })

db.products.createIndex({ merchant_id: 1 })
db.products.createIndex({ category: 1 })
db.products.createIndex({ is_active: 1 })
db.products.createIndex({ title: "text", description: "text" })  // recherche full-text

db.orders.createIndex({ user_id: 1, created_at: -1 })
db.orders.createIndex({ merchant_id: 1, created_at: -1 })
db.orders.createIndex({ status: 1 })

db.cart.createIndex({ user_id: 1 }, { unique: true })

db.payments.createIndex({ order_id: 1 })
db.payments.createIndex({ user_id: 1, created_at: -1 })
```

---

### 6.4 Relations entre collections

```
users (1) ─────────────< (n) orders
  │                              │
  │                              └──▶ merchant_id ──▶ users._id
  │
  └── (1) ──▶ merchants
                  │
                  └──< (n) products

orders (1) ──▶ (1) payments

users (1) ──▶ (1) cart ──< (n) products
```

---

## 7. FLUX PRINCIPAUX

### 7.1 Flux d'authentification

```
┌─────────┐    POST /api/auth/login     ┌────────────┐
│ Browser │ ──────────────────────────▶ │  FastAPI   │
│         │    { email, password }      │            │
│         │ ◀────────────────────────── │  Vérifie   │
│         │    { access_token }         │  bcrypt    │
└────┬────┘                             └────────────┘
     │
     │  localStorage.setItem('authToken', token)
     │  localStorage.setItem('authUser', user)
     │
     ▼
  décode role depuis JWT payload
     │
     ├── role === 'merchant' ──▶ /dashboard/merchant
     └── role === 'buyer'    ──▶ /dashboard/customer
```

**Côté frontend (`hooks/useAuth.js`) :**

```
useAuth() retourne :
  { user, token, loading, isLoggedIn, isBuyer, isMerchant, logout }
```

Le token est relu depuis `localStorage` à chaque chargement de page. Si absent ou expiré, l'utilisateur est redirigé vers `/login`.

---

### 7.2 Flux de création de commande

```
┌─────────┐   POST /api/orders/from-cart   ┌────────────┐
│ Panier  │ ───────────────────────────▶  │  Backend   │
│ acheteur│   { payment_method, address } │            │
└─────────┘                                │  1. Lit cart│
                                           │  2. Vérifie stock│
                                           │  3. Crée order   │
                                           │  4. Décrémente   │
                                           │     stock        │
                                           │  5. Vide panier  │
                                           └──────┬─────┘
                                                  │
                                           retourne order._id
                                                  │
                                    ┌─────────────▼──────────────┐
                                    │  POST /api/payments/initiate│
                                    │  { order_id, method, phone }│
                                    └─────────────────────────────┘
```

---

### 7.3 Algorithme Buy Box

L'algorithme sélectionne le marchand le plus adapté pour vendre un produit donné.

```
┌──────────────────────────────────────────────────────────────┐
│                   ALGORITHME BUY BOX                         │
│                                                              │
│  Pour chaque marchand vendant le produit :                   │
│                                                              │
│  Score final = stock_score(40%) + distance_score(35%)        │
│              + rating_score(25%)                             │
│                                                              │
│  stock_score    = min(stock / stock_max, 1) × 40             │
│  distance_score = (1 - distance / distance_max) × 35        │
│  rating_score   = (rating / 100) × 25                       │
│                                                              │
│  Le marchand avec le Score le plus élevé remporte            │
│  la Buy Box et apparaît en premier dans la fiche produit.   │
└──────────────────────────────────────────────────────────────┘
```

---

### 7.4 Flux de paiement Mobile Money

```
┌─────────┐  POST /api/payments/initiate  ┌────────────┐
│ Client  │ ───────────────────────────▶  │  Backend   │
│         │  { order_id, method, phone }  │            │
│         │                               │  Appelle   │
│         │                               │  provider  │
│         │                               │  (Orange/  │
│         │                               │  MTN/Moov) │
│         │ ◀─────────────────────────── │            │
│         │  { transaction_id, status }  │            │
└────┬────┘                               └────────────┘
     │
     │  Polling ou webhook
     │
     ▼
GET /api/payments/{transaction_id}
     │
     ├── status: "success"  ──▶ Commande confirmée
     └── status: "failed"   ──▶ Afficher erreur, réessayer
```

> En mode développement, `method: "simulation"` retourne toujours `success` immédiatement.

---

## 8. FRONTEND — COMPOSANTS ET PAGES

### 8.1 Contextes React

**`ThemeContext.js`** (`context/ThemeContext.js`)

Gère le dark mode global.

```javascript
// Usage dans n'importe quel composant :
import { useTheme } from '@/context/ThemeContext';

const { isDarkMode, toggleDarkMode, mounted } = useTheme();
```

| Propriété       | Type       | Description                                  |
|-----------------|------------|----------------------------------------------|
| `isDarkMode`    | `boolean`  | `true` si dark mode actif                    |
| `toggleDarkMode`| `function` | Bascule dark/light + persiste en localStorage|
| `mounted`       | `boolean`  | `false` côté serveur (SSR guard)             |

---

### 8.2 Hooks personnalisés

**`useAuth.js`** (`hooks/useAuth.js`)

```javascript
import { useAuth } from '@/hooks/useAuth';

const { user, token, loading, isLoggedIn, isBuyer, isMerchant, logout } = useAuth();
```

| Propriété    | Type       | Description                                  |
|--------------|------------|----------------------------------------------|
| `user`       | `object`   | Données utilisateur depuis localStorage      |
| `token`      | `string`   | JWT token                                    |
| `loading`    | `boolean`  | En cours de vérification                     |
| `isLoggedIn` | `boolean`  | Token présent et valide                      |
| `isBuyer`    | `boolean`  | `user.role === 'buyer'`                      |
| `isMerchant` | `boolean`  | `user.role === 'merchant'`                   |
| `logout`     | `function` | Efface localStorage + redirige vers /login   |

**`useGreeting.js`** (`hooks/useGreeting.js`)

Retourne une salutation contextuelle selon l'heure du jour : "Bonjour", "Bon après-midi", "Bonsoir".

---

### 8.3 Layouts

Chaque dashboard utilise son propre layout qui inclut AppBar + Sidebar.

| Layout                       | Pages concernées                    | Sidebar               |
|------------------------------|-------------------------------------|-----------------------|
| `CustomerDashboardLayout`    | `/dashboard/customer/*`             | `CustomerSidebar`     |
| `MerchantDashboardLayout`    | `/dashboard/merchant/*`             | `MerchantSidebar`     |
| `DashboardLayout`            | Générique (fallback)                | `Sidebar`             |

**Pattern d'utilisation :**

```javascript
// Dans n'importe quelle page merchant
export default function MyPage() {
  return (
    <MerchantDashboardLayout title="Titre de la page">
      {/* Contenu de la page */}
    </MerchantDashboardLayout>
  );
}
```

**Structure interne des layouts :**

- AppBar `position="fixed"` — hauteur 64px
- Contenu : `mt: '64px'` pour passer sous la AppBar fixe
- Sidebar collapsible : largeur 280px (étendue) / 72px (réduite)

---

### 8.4 Dark mode

Le dark mode utilise une double approche :

1. **CSS Variables** — définies dans `styles/global.css` sur `:root` (light) et `[data-theme="dark"]` (dark)
2. **MUI ThemeProvider** — `getTheme('dark'|'light')` dans `styles/theme.js`

L'attribut `data-theme` est positionné sur `<html>` via `document.documentElement.setAttribute('data-theme', ...)` dans `app/layout.js`.

**Variables CSS disponibles :**

| Variable                  | Light             | Dark              |
|---------------------------|-------------------|-------------------|
| `--bg-main`               | `#f0f4ff`         | `#0d1117`         |
| `--bg-paper`              | `#ffffff`         | `#161b22`         |
| `--bg-paper-subtle`       | `#f5f3ff`         | `#21262d`         |
| `--bg-merchant`           | `#f5f7fa`         | `#0d1117`         |
| `--text-title`            | `#1e1b4b`         | `#e2e8f0`         |
| `--text-body`             | `#374151`         | `#cbd5e0`         |
| `--text-secondary`        | `#6b7280`         | `#94a3b8`         |
| `--text-muted`            | `#9ca3af`         | `#6e7681`         |
| `--text-merchant-primary` | `#2c3e50`         | `#cdd9e5`         |
| `--border-main`           | `#e8eaed`         | `#30363d`         |

---

### 8.5 Pages publiques

| Route              | Fichier                    | Description                            |
|--------------------|----------------------------|----------------------------------------|
| `/`                | `app/page.js`              | Vitrine : catalogue, hero, catégories  |
| `/login`           | `app/login/page.js`        | Formulaire de connexion                |
| `/register`        | `app/register/page.js`     | Formulaire d'inscription               |
| `/products/[id]`   | `app/products/[id]/page.js`| Fiche produit avec Buy Box             |
| `/unauthorized`    | `app/unauthorized/page.js` | Accès non autorisé (role mismatch)     |

---

### 8.6 Dashboard Marchand

| Route                                | Description                                            |
|--------------------------------------|--------------------------------------------------------|
| `/dashboard/merchant`                | KPIs : CA, commandes, taux conversion + graphiques     |
| `/dashboard/merchant/products`       | Liste produits avec CRUD                               |
| `/dashboard/merchant/products/create`| Formulaire création produit                            |
| `/dashboard/merchant/orders`         | Commandes reçues, filtres par statut                   |
| `/dashboard/merchant/orders/[id]`    | Détail commande, transition de statut                  |
| `/dashboard/merchant/stats`          | Statistiques avancées, graphiques CA mensuel           |
| `/dashboard/merchant/heatmap`        | Carte de chaleur géographique des commandes            |
| `/dashboard/merchant/best-sellers`   | Top produits par ventes et revenus                     |
| `/dashboard/merchant/alerts`         | Alertes stock faible, commandes en attente             |
| `/dashboard/merchant/customers`      | Liste des clients ayant commandé                       |
| `/dashboard/merchant/export`         | Export CSV/JSON des données                            |
| `/dashboard/merchant/reports`        | Rapports périodiques (hebdo, mensuel)                  |
| `/dashboard/merchant/settings`       | Profil boutique, contact, localisation                 |

---

### 8.7 Dashboard Acheteur

| Route                                   | Description                                      |
|-----------------------------------------|--------------------------------------------------|
| `/dashboard/customer`                   | Vue générale : commandes récentes, recommandations|
| `/dashboard/customer/orders`            | Historique de toutes les commandes               |
| `/dashboard/customer/orders/[id]`       | Détail commande + timeline de statut             |
| `/dashboard/customer/wishlist`          | Liste de souhaits (ajouter / retirer)            |
| `/dashboard/customer/cart`              | Panier + total + lien checkout                   |
| `/dashboard/customer/shops`            | Boutiques (recherche, filtres catégorie, tri)    |
| `/dashboard/customer/profile`           | Profil, adresse, préférences                     |
| `/dashboard/customer/payments`          | Historique des paiements avec statuts            |

---

## 9. DÉPLOIEMENT

### 9.1 Build de production

**Frontend :**

```bash
cd alia-dashboard
npm run build
npm start
# Accessible sur http://localhost:3000
```

**Backend (avec Gunicorn) :**

```bash
cd alia/backend
pip install gunicorn
gunicorn app.main:app \
  -w 4 \
  -k uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --access-logfile - \
  --error-logfile -
```

**Docker production complet :**

```bash
cd alia/alia
docker compose -f docker-compose.yml up -d --build
```

---

### 9.2 Variables d'environnement production

**Backend (`.env` en production) :**

```env
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=alia_db
JWT_SECRET_KEY=<CHANGER_OBLIGATOIREMENT_min_64_chars_aleatoires>
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
BACKEND_CORS_ORIGINS=["https://votre-domaine.com","https://www.votre-domaine.com"]

# APIs paiement (production)
ORANGE_MONEY_API_KEY=<cle_production>
MOOV_MONEY_API_KEY=<cle_production>
WAVE_API_KEY=<cle_production>

# AliExpress
ALIEXPRESS_API_KEY=<cle_production>
ALIEXPRESS_API_SECRET=<secret_production>
```

**Frontend (`.env.production`) :**

```env
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com
NEXT_PUBLIC_APP_NAME=Alia Marketplace
```

> ⚠️ **Sécurité** : Ne jamais commiter les fichiers `.env` — ils sont dans `.gitignore`. Utiliser des secrets manager (Vault, AWS Secrets Manager, GitHub Secrets) en production.

---

## 10. DÉPANNAGE (TROUBLESHOOTING)

### 10.1 Problèmes courants

| Problème                                   | Cause probable                                    | Solution                                                    |
|--------------------------------------------|---------------------------------------------------|-------------------------------------------------------------|
| `HTTP 422` sur `/api/auth/register`        | Body JSON mal formé ou champ manquant             | Vérifier que `role`, `email`, `password` sont présents      |
| `HTTP 400 Email already registered`        | Email déjà utilisé                                | Utiliser un autre email ou supprimer l'utilisateur en base  |
| `HTTP 403` sur endpoint marchand           | Utilisateur connecté en `buyer`                   | Se connecter avec un compte `merchant`                      |
| `bestsellers.slice is not a function`      | API retourne `{ detail: "..." }` au lieu d'array  | Vérifier JWT valide, utiliser `Array.isArray()` en guard    |
| `Hydration failed`                         | Composant lit `localStorage` côté serveur (SSR)   | Conditionner avec `mounted` state ou `useEffect`            |
| AppBar recouvre le contenu de la page      | `pt: '64px'` écrasé par raccourci `p: 3`          | Utiliser `mt: '64px'` (margin, pas padding)                 |
| Dark mode ne s'applique pas sur une page   | Couleurs hardcodées `#1e1b4b` dans `sx` props     | Remplacer par `var(--text-title)` et autres variables CSS   |
| `get_current_merchant` retourne 403        | `HTTPBearer(auto_error=True)` sur route publique  | Passer à `auto_error=False` pour les routes optionnelles    |
| `ShopsPage defined multiple times`         | Double export `default` dans le même fichier      | Supprimer le doublon — garder un seul `export default`      |
| `ENETUNREACH` lors appels API              | Backend non démarré ou mauvais port               | Vérifier `NEXT_PUBLIC_API_URL` dans `.env.local`            |
| Lenteur de compilation (>2 min)            | Turbopack + MUI v7 interactions                   | Désactiver avec `next dev --no-turbopack`                   |

---

### 10.2 Commandes utiles

```bash
# ── Frontend ──────────────────────────────────────────────
# Nettoyer le cache Next.js (résout la plupart des erreurs de build)
Remove-Item -Recurse -Force .next   # PowerShell
rm -rf .next                        # Bash

# Réinstaller les dépendances proprement
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install

# Vérifier les erreurs TypeScript/ESLint
npm run lint

# ── Backend ───────────────────────────────────────────────
# Lancer les tests
cd alia/backend
pytest tests/ -v

# ── Docker ────────────────────────────────────────────────
# Reconstruire sans cache
docker compose build --no-cache

# Redémarrer uniquement le backend
docker compose restart backend

# Voir les logs en temps réel
docker compose logs backend -f
docker compose logs mongodb -f

# Reset complet de MongoDB (⚠ perte de données)
docker compose down -v
docker compose up -d

# Shell MongoDB interactif
docker exec -it alia-mongodb mongosh alia_db

# ── Diagnostic rapide ─────────────────────────────────────
# Tester si le backend répond
curl http://localhost:8000/docs

# Tester l'inscription
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","role":"buyer"}'
```

---

### 10.3 Logs importants

| Composant     | Où trouver les logs                                    |
|---------------|--------------------------------------------------------|
| Backend       | `docker compose logs backend -f`                       |
| Frontend      | Console navigateur (F12 → Console) + terminal `npm run dev` |
| MongoDB       | `docker compose logs mongodb -f`                       |
| Next.js build | Sortie de `npm run build` dans le terminal             |
| Erreurs React | Console navigateur : `Warning:` et `Error:`            |

---

## 11. CONTRIBUTION

### 11.1 Standards de code

| Langage          | Outil              | Commande                              |
|------------------|--------------------|---------------------------------------|
| JavaScript/React | ESLint (Next.js)   | `npm run lint`                        |
| Python           | Black + isort      | `black . && isort .`                  |

**Règles frontend importantes :**

- Tous les composants interactifs ont `'use client'` en première ligne
- Le composant Grid MUI v7 utilise `<Grid size={{ xs:12, md:6 }}>` (pas `item xs={12}`)
- Pour les `TextField` avec icônes, utiliser `InputProps` (pas `slotProps` en MUI v7)
- Toujours vérifier `mounted` avant d'accéder à `localStorage` (guard SSR)
- Utiliser `Array.isArray()` pour valider les réponses API avant `.map()` ou `.slice()`

**Règles backend importantes :**

- Utiliser `async/await` avec Motor pour toutes les opérations MongoDB
- Toujours valider les permissions avec `get_current_merchant` sur les routes marchands
- Les IDs MongoDB doivent être convertis avec `str(ObjectId)` avant sérialisation
- Les mots de passe doivent toujours être hachés avec bcrypt avant insertion

---

### 11.2 Convention de commits

```
type(scope): description courte en français ou anglais

Types :
  feat     → nouvelle fonctionnalité
  fix      → correction de bug
  docs     → documentation uniquement
  style    → formatage (pas de changement logique)
  refactor → restructuration sans changement de comportement
  test     → ajout ou modification de tests
  chore    → maintenance (dépendances, config)

Scopes :
  frontend, backend, auth, products, orders, payments,
  merchant, customer, buybox, aliexpress, docker

Exemples :
  feat(backend): add AliExpress product sync endpoint
  fix(frontend): resolve CustomerDashboard dark mode colors
  feat(merchant): add export CSV orders functionality
  fix(backend): use auto_error=False on optional auth deps
  chore(docker): add frontend service to docker-compose
```

---

## 12. CONTACT ET SUPPORT

| Rôle                | Contact / Lien                                     |
|---------------------|---------------------------------------------------|
| Lead Developer      | GitHub : [samdanielbaguian](https://github.com/samdanielbaguian) |
| Dépôt principal     | https://github.com/samdanielbaguian/alia           |
| Dépôt dashboard     | https://github.com/samdanielbaguian/alia-dashboard |
| Documentation API   | http://localhost:8000/docs (Swagger UI)            |
| API Reference alt.  | http://localhost:8000/redoc (ReDoc)                |

---

## 13. VERSIONS ET MISE À JOUR

| Version | Date         | Modifications principales                                    |
|---------|--------------|--------------------------------------------------------------|
| 1.0.0   | 14 mai 2026  | Version initiale — marketplace complète                      |
|         |              | Dashboard marchand : KPIs, produits, commandes, stats, alertes|
|         |              | Dashboard acheteur : commandes, wishlist, panier, boutiques  |
|         |              | Dark mode global via CSS variables + MUI ThemeProvider       |
|         |              | Intégration AliExpress (mock)                                |
|         |              | Paiement Mobile Money (Orange, MTN, Moov, Wave)              |
|         |              | Buy Box algorithmique                                        |
|         |              | Authentification JWT avec rôles merchant/buyer               |

---

> 📄 **Document généré par Alia Documentation System**
> Dernière mise à jour : **14 mai 2026**
> Mainteneur : [samdanielbaguian](https://github.com/samdanielbaguian)
