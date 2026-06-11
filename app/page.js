"use client";

import { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Grid, Button,
  Chip, Fab, Snackbar, Alert, Pagination,
} from '@mui/material';
import { KeyboardArrowUp as TopIcon, GridView as GridIcon, StorefrontOutlined as StoreIcon } from '@mui/icons-material';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import PromoBanner from '@/components/PromoBanner';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const MOCK_CATEGORIES = [
  { name: 'Electronique', count: 24 },
  { name: 'Mode',         count: 18 },
  { name: 'Audio',        count: 12 },
  { name: 'Maison',       count: 8  },
  { name: 'Gaming',       count: 6  },
  { name: 'Beaute',       count: 15 },
];

const ITEMS_PER_PAGE = 12;

function ProductCardSkeleton() {
  return (
    <Box sx={{
      borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%',
    }}>
      <Box sx={{ height: 200, bgcolor: 'action.hover',
        animation: 'skshimmer 1.4s ease-in-out infinite',
        '@keyframes skshimmer': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.45 } },
      }} />
      <Box sx={{ p: 2 }}>
        {[88, 65, 50, 40, 100].map(w => (
          <Box key={w} sx={{
            height: 13, bgcolor: 'action.hover', borderRadius: 1,
            mb: 1.2, width: `${w}%`,
            animation: 'skshimmer 1.4s ease-in-out infinite',
          }} />
        ))}
      </Box>
    </Box>
  );
}

export default function HomePage() {
  const { isDarkMode } = useTheme();

  const [products, setProducts]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [categories, setCategories]       = useState(MOCK_CATEGORIES);
  const [searchTerm, setSearchTerm]       = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [sortBy, setSortBy]               = useState('newest');
  const [currentPage, setCurrentPage]     = useState(1);
  const [cartCount, setCartCount]         = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites]         = useState(new Set());
  const [toast, setToast]                 = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${API_BASE}/api/products?limit=48`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.items ?? data.products ?? []);
        setProducts(list);
        const cats = [...new Set(list.map(p => p.category).filter(Boolean))];
        if (cats.length) {
          setCategories(cats.map(name => ({
            name,
            count: list.filter(p => p.category === name).length,
          })));
        }
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = products
    .filter(p => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q || [p.name, p.title, p.description, p.category].some(f => f?.toLowerCase().includes(q));
      const matchCat   = !activeCategory || p.category?.toLowerCase() === activeCategory.toLowerCase();
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':  return (a.price || 0) - (b.price || 0);
        case 'price-desc': return (b.price || 0) - (a.price || 0);
        case 'rating':     return (b.rating || 4) - (a.rating || 4);
        default:           return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const displayed  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (q) => {
    setSearchTerm(q);
    setActiveCategory('');
    setCurrentPage(1);
  };

  const handleCategory = (catName) => {
    setActiveCategory(prev => prev === catName ? '' : catName);
    setSearchTerm('');
    setCurrentPage(1);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddToCart = (product) => {
    setCartCount(prev => prev + 1);
    const name = product.title || product.name || 'Produit';
    setToast({ open: true, message: `"${name}" ajouté au panier !`, severity: 'success' });
  };

  const handleFavorite = (productId) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
        setWishlistCount(c => Math.max(0, c - 1));
      } else {
        next.add(productId);
        setWishlistCount(c => c + 1);
      }
      return next;
    });
  };

  const SORT_OPTIONS = [
    { v: 'newest',     l: 'Récents' },
    { v: 'price-asc',  l: 'Prix ↑' },
    { v: 'price-desc', l: 'Prix ↓' },
    { v: 'rating',     l: '★ Notes' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDarkMode ? '#0d0d1a' : '#f8f9fa', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
      />

      {/* HERO */}
      <HeroSection onSearch={handleSearch} />

      {/* CATEGORIES */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              Catégories populaires
            </Typography>
            <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary', mt: 0.3 }}>
              Trouvez rapidement ce que vous cherchez
            </Typography>
          </Box>
          <Button
            size="small" endIcon={<GridIcon />}
            onClick={() => { setActiveCategory(''); setCurrentPage(1); document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
            sx={{ textTransform: 'none', fontWeight: 700, color: '#1565c0', display: { xs: 'none', sm: 'flex' } }}
          >
            Voir tout
          </Button>
        </Box>

        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {categories.map((cat, i) => (
            <Grid size={{ xs: 4, sm: 3, md: 2 }} key={cat.name}>
              <CategoryCard
                category={cat.name}
                count={cat.count}
                index={i}
                onClick={() => handleCategory(cat.name)}
              />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* PROMO BANNER */}
      <Container maxWidth="lg" sx={{ pb: 2 }}>
        <PromoBanner />
      </Container>

      {/* PRODUCTS */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }} id="products-section">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
              {activeCategory
                ? `Catégorie : ${activeCategory}`
                : searchTerm
                  ? `Résultats pour « ${searchTerm} »`
                  : 'Tous les produits'}
            </Typography>
            {!loading && (
              <Typography sx={{ fontSize: '0.82rem', color: 'text.secondary', mt: 0.3 }}>
                {filtered.length} produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
            {activeCategory && (
              <Chip
                label={activeCategory}
                onDelete={() => { setActiveCategory(''); setCurrentPage(1); }}
                size="small"
                sx={{ fontWeight: 700, bgcolor: 'rgba(21,101,192,0.1)', color: '#1565c0' }}
              />
            )}
            {SORT_OPTIONS.map(o => (
              <Chip
                key={o.v} label={o.l} size="small" clickable
                onClick={() => { setSortBy(o.v); setCurrentPage(1); }}
                variant={sortBy === o.v ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer',
                  ...(sortBy === o.v ? { bgcolor: '#1565c0', color: '#fff' } : { color: 'text.secondary' }),
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Products grid */}
        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={i}>
                <ProductCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : displayed.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🔍</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Aucun produit trouvé</Typography>
            <Typography sx={{ color: 'text.secondary', mb: 3 }}>Essayez d&apos;autres mots-clés ou catégories.</Typography>
            <Button
              variant="outlined"
              onClick={() => { setSearchTerm(''); setActiveCategory(''); setCurrentPage(1); }}
              sx={{ textTransform: 'none', borderRadius: 2, fontWeight: 600 }}
            >
              Réinitialiser les filtres
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {displayed.map((p, idx) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={p.id ?? idx}>
                  <ProductCard
                    product={p}
                    onAddToCart={handleAddToCart}
                    onFavoriteToggle={handleFavorite}
                    isFavorited={favorites.has(p.id)}
                  />
                </Grid>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={(_, p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  color="primary" shape="rounded"
                  sx={{ '& .MuiPaginationItem-root': { fontWeight: 600 } }}
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* FOOTER */}
      <Footer />

      {/* Scroll-to-top FAB */}
      {showScrollTop && (
        <Fab
          size="small" color="primary"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 1300,
            boxShadow: '0 6px 20px rgba(21,101,192,0.4)',
            '&:hover': { transform: 'scale(1.1)' },
            transition: 'all 0.2s',
          }}
        >
          <TopIcon />
        </Fab>
      )}

      {/* Toast notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() => setToast(p => ({ ...p, open: false }))}
          sx={{ borderRadius: 2 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
