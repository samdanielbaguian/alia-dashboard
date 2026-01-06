# Alia Merchant Dashboard

Un tableau de bord marchand complet Next.js inspiré de Bagisto, avec une structure avancée pour gérer un marketplace e-commerce.

## 🚀 Démarrage Rapide

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) pour voir l'application.

### Build

```bash
npm run build
npm start
```

## 📁 Structure du Projet

```
alia-dashboard/
├── app/                          # Pages Next.js (App Router)
│   ├── page.js                   # Page de connexion
│   ├── dashboard/                # Pages du dashboard
│   │   ├── page.js              # Redirection vers overview
│   │   ├── overview/            # Dashboard principal
│   │   ├── products/            # Gestion des produits
│   │   ├── orders/              # Gestion des commandes
│   │   ├── customers/           # Gestion des clients
│   │   ├── sellers/             # Gestion des vendeurs
│   │   ├── reports/             # Rapports et analytics
│   │   ├── settings/            # Paramètres
│   │   ├── heatmap/            # Heatmap dédiée (PRÉSERVÉE)
│   │   ├── alerts/             # Alertes système
│   │   ├── activity/           # Flux d'activité
│   │   ├── best-sellers/       # Meilleures ventes
│   │   └── export/             # Export de données
│   ├── layout.js                # Layout racine avec ThemeProvider
│   └── globals.css             # Styles globaux Next.js
│
├── components/                  # Composants réutilisables
│   ├── cards/                  # Composants de cartes
│   │   └── KPICard.js         # Carte KPI avec métriques
│   ├── charts/                 # Composants graphiques
│   │   ├── LineChart.js       # Graphique en ligne (SVG)
│   │   ├── DonutChart.js      # Graphique donut (SVG)
│   │   └── SalesHeatmap.js    # Heatmap des ventes
│   ├── tables/                 # Composants de tableaux
│   │   └── DataTable.js       # Table de données réutilisable
│   └── widgets/                # Widgets dashboard (stubs originaux)
│       ├── Overview.js
│       ├── Heatmap.js
│       ├── BestSellers.js
│       ├── Alerts.js
│       ├── Activity.js
│       └── Export.js
│
├── layout/                      # Composants de mise en page
│   ├── DashboardLayout.js      # Layout principal dashboard
│   ├── Header.js               # Barre de navigation supérieure
│   ├── Sidebar.js              # Menu latéral (navigation)
│   └── constants.js            # Constantes (DRAWER_WIDTH)
│
├── data/                        # Données mock
│   └── mockData.js             # Données réalistes pour tous les widgets
│
├── utils/                       # Utilitaires
│   ├── api.js                  # Fonctions API
│   └── helpers.js              # Fonctions helper
│
├── styles/                      # Styles et thèmes
│   ├── global.css              # Styles CSS globaux
│   └── theme.js                # Configuration thème Material UI
│
└── public/                      # Fichiers statiques

```

## 🎨 Technologies Utilisées

- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **Material UI (MUI)** - Composants UI et système de design
- **Emotion** - CSS-in-JS pour le styling

## 📦 Fonctionnalités Principales

### 🏠 Dashboard Principal (Overview)
- **6 Cartes KPI** : Chiffre d'affaires, Commandes, Clients, Vendeurs, Produits, Stock bas
- **Graphique des tendances** : Courbe des ventes sur 12 mois (SVG)
- **Graphique donut** : Distribution par catégorie (SVG)
- **Heatmap des ventes** : Activité par jour et heure (PRÉSERVÉE)
- **Tableaux** :
  - Commandes récentes avec SKU
  - Meilleures ventes avec SKU
  - Top clients

### 📦 Gestion des Produits
- Liste complète des produits avec SKU
- Stats : Total, Actifs, Stock bas, Rupture de stock
- Table avec filtrage et statuts colorés
- Bouton "Ajouter un produit"

### 🛒 Gestion des Commandes
- Liste complète des commandes avec SKU
- Stats : Total, Complétées, En traitement, En attente
- Export CSV fonctionnel
- Statuts visuels (complété, en cours, expédié, etc.)

### 👥 Gestion des Clients
- Liste des clients avec historique
- Stats : Total, VIP, Nouveaux, Actifs
- Montant total dépensé et nombre de commandes
- Statut VIP / Régulier

### 🏪 Gestion des Vendeurs
- Liste des vendeurs/marchands
- Stats : Total, Actifs, Nouveaux, En attente
- Nombre de produits, ventes totales, notation
- Date d'inscription

### 📊 Rapports & Analytics
- 4 KPI analytiques : Revenu mensuel, Panier moyen, Taux de conversion, LTV client
- Graphique de tendance des revenus
- Distribution des ventes par catégorie
- Heatmap des patterns de vente
- Export de rapport JSON

### ⚙️ Paramètres
- Paramètres généraux (nom boutique, email, devise, timezone)
- Notifications (email, alertes, rapports)
- Affichage (widgets, graphiques, SKU)
- Configuration API (clé API, webhooks)

### 🔔 Pages Additionnelles
- **Alertes** : Système d'alertes avec types (info, warning, error, success)
- **Activité** : Flux d'activité temps réel
- **Best Sellers** : Page dédiée aux meilleures ventes avec SKU
- **Export** : Centre d'export CSV pour toutes les données
- **Heatmap** : Page dédiée à la heatmap (PRÉSERVÉE de l'original)

## 🎯 Composants Réutilisables

### KPICard
```jsx
<KPICard
  title="Total Revenue"
  value="125 840,50 €"
  change={12.5}
  period="vs last month"
  icon={RevenueIcon}
  color="#1976d2"
/>
```

### LineChart
```jsx
<LineChart
  title="Sales Trend"
  data={salesChartData}
  height={300}
/>
```

### DonutChart
```jsx
<DonutChart
  title="Category Distribution"
  data={categoryDistribution}
/>
```

### SalesHeatmap
```jsx
<SalesHeatmap
  title="Sales Activity Heatmap"
  data={heatmapData}
/>
```

### DataTable
```jsx
<DataTable
  title="Recent Orders"
  columns={columns}
  data={orders}
/>
```

## 📊 Données Mock

Toutes les données sont réalistes et disponibles dans `data/mockData.js` :

- **KPI Data** : Métriques clés avec variations
- **Orders** : 10+ commandes avec SKU, clients, produits, montants, statuts
- **Products** : 5+ produits avec SKU, catégories, prix, stock, vendeurs
- **Customers** : 7+ clients avec commandes, dépenses, statuts VIP
- **Sellers** : 4+ vendeurs avec produits, ventes, notations
- **Sales Chart** : Données mensuelles sur 12 mois
- **Category Distribution** : 6 catégories avec pourcentages
- **Heatmap Data** : Activité par jour/heure (7 jours × 6 heures)
- **Alerts** : 5+ alertes système avec types et timestamps
- **Activity Feed** : 5+ événements récents

## 🎨 Thème & Design

### Palette de Couleurs (Bagisto-inspired)
- **Primaire** : `#1976d2` (Bleu)
- **Fond** : `#ffffff` (Blanc)
- **Sidebar** : `#000000` (Noir)
- **Texte** : `#000000` (Noir principal), `#666666` (Secondaire)
- **Succès** : `#4caf50` (Vert)
- **Avertissement** : `#ff9800` (Orange)
- **Erreur** : `#f44336` (Rouge)

### Navigation
- **Sidebar** : Noir avec icônes blanches, état actif en bleu
- **Header** : Blanc avec notifications et profil utilisateur
- **Active State** : Bordure bleue + fond bleu transparent

## 🔧 Fonctionnalités Avancées

### Export CSV
Tous les exports incluent les SKU et sont fonctionnels :
- Orders Export : Toutes les commandes
- Products Export : Catalogue complet
- Customers Export : Base de données clients
- Sellers Export : Informations vendeurs

### Tables Interactives
- Tri par colonnes
- Statuts colorés (complété, en cours, etc.)
- Affichage du SKU partout
- Formatage automatique (devise, nombres)

### Charts SVG Natifs
- Aucune dépendance externe de graphiques
- Charts SVG légers et performants
- Responsive et interactifs
- Hover effects sur la heatmap

## 📝 Convention de Code

- Utiliser des composants fonctionnels React
- Privilégier les hooks React
- Utiliser `'use client'` pour les composants interactifs
- Commenter les fonctions importantes
- Suivre les conventions Material UI
- Fichiers organisés par fonctionnalité

## 🔧 Configuration

### Variables d'environnement
Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Thème Material UI
Le thème est configurable dans `styles/theme.js` pour personnaliser :
- Palette de couleurs
- Typographie
- Composants

## 🚦 Navigation

### Menu Principal
1. **Dashboard** - Vue d'ensemble avec KPI et graphiques
2. **Products** - Gestion du catalogue produits
3. **Orders** - Gestion des commandes
4. **Customers** - Gestion des clients
5. **Sellers** - Gestion des vendeurs/marchands
6. **Reports** - Analytics et rapports détaillés
7. **Settings** - Configuration du dashboard

### Pages Additionnelles (accessibles via URL)
- `/dashboard/heatmap` - Heatmap dédiée
- `/dashboard/alerts` - Centre de notifications
- `/dashboard/activity` - Flux d'activité
- `/dashboard/best-sellers` - Meilleures ventes
- `/dashboard/export` - Centre d'export

## 🎯 Points Clés

✅ **Architecture complète** - Structure Bagisto-inspired avec tous les modules principaux
✅ **Données réalistes** - Mock data complètes dans tous les widgets et tableaux
✅ **SKU partout** - Affichage du SKU dans toutes les tables (commandes, produits, best sellers)
✅ **Charts natifs** - Graphiques SVG sans dépendances externes
✅ **Export CSV** - Fonctionnalité d'export fonctionnelle pour toutes les données
✅ **Heatmap préservée** - Widget heatmap original maintenu et amélioré
✅ **Design cohérent** - Thème blanc/bleu/noir Bagisto-style
✅ **Composants réutilisables** - KPICard, Charts, Tables, etc.
✅ **Navigation complète** - Sidebar avec 7 sections principales
✅ **Responsive** - Interface adaptative Material UI

## 📸 Captures d'écran

### Dashboard Principal
![Dashboard Overview](https://github.com/user-attachments/assets/4db2b50a-ea4c-4bef-8131-890c67640b3d)

### Gestion des Produits
![Products Page](https://github.com/user-attachments/assets/ef0f6c06-37ba-420c-a852-d3b2ec5d60ca)

### Rapports & Analytics
![Reports Page](https://github.com/user-attachments/assets/5c6c30d1-4407-45c6-8872-583b3bd2e4a5)

## 🛠️ Développement Futur

Fonctionnalités prêtes à être ajoutées :
- Backend API avec Next.js API routes
- Authentification JWT/OAuth
- Base de données (PostgreSQL/MongoDB)
- Gestion d'état global (Redux/Zustand)
- Filtrage et recherche avancés
- Mode sombre
- Internationalisation (i18n)
- Tests (Jest/React Testing Library)
- Animations avancées
- WebSockets pour temps réel

## 📄 License

MIT

---

**Note** : Ce dashboard est une implémentation complète Bagisto-inspired avec tous les widgets existants préservés (notamment la carte heatmap des ventes) et de nouvelles fonctionnalités avancées. Toutes les données sont mock et peuvent être facilement remplacées par des appels API réels.
