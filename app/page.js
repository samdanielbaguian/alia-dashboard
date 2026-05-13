'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Pagination,
  CircularProgress,
  Chip,
  IconButton,
  AppBar,
  Toolbar,
  useTheme as useMuiTheme,
} from '@mui/material';
import {
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/products');
        const data = await response.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        setProducts(productList);
        const cats = [...new Set(productList.map(p => p.category).filter(Boolean))];
        setCategories(cats);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    filtered = filtered.filter(p => {
      const price = p.price || 0;
      if (priceRange === '<50') return price < 50;
      if (priceRange === '50-200') return price >= 50 && price <= 200;
      if (priceRange === '>200') return price > 200;
      return true;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return (a.price || 0) - (b.price || 0);
        case 'price-desc': return (b.price || 0) - (a.price || 0);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        default: return new Date(b.created_at) - new Date(a.created_at);
      }
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      {/* Header avec boutons VISIBLES */}
      <AppBar 
        position="sticky" 
        color="primary" 
        sx={{ 
          bgcolor: isDarkMode ? '#1e1e1e' : '#1976d2',
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
            Alia Marketplace
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Toggle Dark Mode - TOUJOURS VISIBLE */}
            <IconButton 
              onClick={toggleDarkMode} 
              sx={{ color: '#fff' }}
              aria-label="dark mode toggle"
            >
              {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>

            {/* Boutons Auth - TOUJOURS VISIBLES avec contraste fort */}
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="outlined" 
                  onClick={() => router.push('/login')}
                  sx={{ 
                    color: '#fff', 
                    borderColor: '#fff',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Se connecter
                </Button>
                <Button 
                  variant="contained" 
                  onClick={() => router.push('/register')}
                  sx={{ 
                    bgcolor: '#fff', 
                    color: '#1976d2',
                    '&:hover': { bgcolor: '#f5f5f5' }
                  }}
                >
                  S'inscrire
                </Button>
              </>
            ) : (
              <>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 500 }}>
                    {user?.first_name || user?.email || 'Compte'}
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: '0.8rem', opacity: 0.8 }}>
                    ({user?.role === 'buyer' ? 'Acheteur' : user?.role === 'merchant' ? 'Marchand' : user?.role})
                  </Typography>
                </Box>
                <Button 
                  variant="outlined" 
                  onClick={handleLogout}
                  sx={{ 
                    color: '#fff', 
                    borderColor: '#fff',
                    '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Déconnexion
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 6, mb: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontWeight: 700, mb: 2 }}>
            Bienvenue sur Alia Marketplace
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
            Découvrez des milliers de produits de qualité auprès des meilleurs marchands
          </Typography>
          <TextField
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#666' }} />,
              sx: { bgcolor: '#fff', borderRadius: 1 }
            }}
          />
        </Container>
      </Box>

      {/* Contenu principal */}
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Sidebar Filtres */}
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Filtres
              </Typography>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Catégories
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <MenuItem value="">Toutes</MenuItem>
                    {categories.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Prix
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={priceRange} onChange={(e) => setPriceRange(e.target.value)}>
                    <MenuItem value="all">Tous</MenuItem>
                    <MenuItem value="<50">Moins de 50€</MenuItem>
                    <MenuItem value="50-200">50€ - 200€</MenuItem>
                    <MenuItem value=">200">Plus de 200€</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                  Trier par
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <MenuItem value="newest">Nouveautés</MenuItem>
                    <MenuItem value="price-asc">Prix croissant</MenuItem>
                    <MenuItem value="price-desc">Prix décroissant</MenuItem>
                    <MenuItem value="rating">Mieux notés</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Button fullWidth variant="outlined" size="small" onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setPriceRange('all');
                setSortBy('newest');
              }} sx={{ mt: 2 }}>
                Réinitialiser
              </Button>
            </Box>
          </Grid>

          {/* Grille Produits */}
          <Grid item xs={12} md={9}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {filteredProducts.length} produit(s)
              </Typography>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : displayedProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary">
                  Aucun produit trouvé
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>
                  {displayedProducts.map(product => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <ProductCard product={product} />
                    </Grid>
                  ))}
                </Grid>
                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination count={totalPages} page={currentPage} onChange={(e, page) => setCurrentPage(page)} />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
