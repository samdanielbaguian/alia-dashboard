# Alia Merchant Dashboard

Un tableau de bord marchand Next.js inspiré de Bagisto, structuré pour accueillir des fonctionnalités complexes.

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
│   ├── page.js                   # Page d'accueil / Login
│   ├── dashboard/                # Dashboard principal
│   │   └── page.js              # Page dashboard avec widgets
│   ├── layout.js                 # Layout racine avec ThemeProvider
│   └── globals.css              # Styles globaux Next.js
│
├── components/                   # Composants réutilisables
│   ├── widgets/                 # Widgets du dashboard
│   │   ├── Overview.js         # Widget vue d'ensemble
│   │   ├── Heatmap.js          # Widget heatmap d'activité
│   │   ├── BestSellers.js      # Widget meilleures ventes
│   │   ├── Alerts.js           # Widget alertes système
│   │   ├── Activity.js         # Widget flux d'activité
│   │   └── Export.js           # Widget export de données
│   ├── cards/                   # Composants de cartes (à développer)
│   ├── charts/                  # Composants de graphiques (à développer)
│   ├── tables/                  # Composants de tableaux (à développer)
│   └── heatmap/                 # Composants heatmap (à développer)
│
├── layout/                       # Composants de mise en page
│   ├── Header.js                # Barre de navigation supérieure
│   └── Sidebar.js               # Menu latéral de navigation
│
├── utils/                        # Utilitaires
│   ├── api.js                   # Fonctions API (GET, POST, PUT, DELETE)
│   └── helpers.js               # Fonctions helper (format, date, etc.)
│
├── styles/                       # Styles et thèmes
│   ├── global.css               # Styles CSS globaux personnalisés
│   └── theme.js                 # Configuration du thème Material UI
│
└── public/                       # Fichiers statiques

```

## 🎨 Technologies Utilisées

- **Next.js 15** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **Material UI (MUI)** - Composants UI et système de design
- **Emotion** - CSS-in-JS pour le styling

## 📦 Composants Disponibles

### Layout
- **Header** : Barre de navigation supérieure avec notifications et profil
- **Sidebar** : Menu latéral avec navigation principale

### Widgets (Stubs)
Tous les widgets sont actuellement des composants vides prêts à être implémentés :

1. **Overview** : Vue d'ensemble des métriques clés
2. **Heatmap** : Visualisation heatmap de l'activité
3. **BestSellers** : Liste des produits les plus vendus
4. **Alerts** : Alertes système et notifications
5. **Activity** : Flux d'activité récente
6. **Export** : Fonctionnalité d'export de données

## 🛠️ Utilities

### API (`utils/api.js`)
Fonctions pour les appels API :
- `apiGet(endpoint)` - Requête GET
- `apiPost(endpoint, data)` - Requête POST
- `apiPut(endpoint, data)` - Requête PUT
- `apiDelete(endpoint)` - Requête DELETE

### Helpers (`utils/helpers.js`)
Fonctions utilitaires :
- `formatCurrency(amount, currency)` - Formatage de devise
- `formatDate(date)` - Formatage de date
- `formatDateTime(date)` - Formatage date et heure
- `truncateText(text, maxLength)` - Troncature de texte
- `generateId()` - Génération d'ID unique
- `debounce(func, wait)` - Fonction debounce

## 🎯 Prochaines Étapes

Cette structure est prête à accueillir :

1. **Fonctionnalités avancées** :
   - Gestion des produits (catalogue façon Bagisto)
   - Gestion des commandes
   - Gestion des clients
   - Rapports et analytics

2. **Composants complexes** :
   - Tables de données avec tri et filtrage
   - Graphiques interactifs
   - Formulaires avancés
   - Gestion de l'état global (Redux/Zustand)

3. **Intégrations** :
   - API backend
   - Authentification (JWT, OAuth)
   - Base de données
   - Services tiers

4. **Améliorations UI/UX** :
   - Animations
   - Responsive design avancé
   - Mode sombre
   - Internationalisation (i18n)

## 📝 Convention de Code

- Utiliser des composants fonctionnels React
- Privilégier les hooks React
- Commenter les fonctions importantes
- Suivre les conventions Material UI
- Utiliser `'use client'` pour les composants interactifs

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

## 📄 License

MIT

---

**Note** : Ce projet est une structure initiale avec des composants stubs. Il est conçu pour être étendu avec des fonctionnalités complexes inspirées de l'architecture Bagisto.
