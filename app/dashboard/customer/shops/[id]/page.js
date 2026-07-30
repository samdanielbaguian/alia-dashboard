'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Chip, Button, Alert, Divider,
  Avatar, Rating, CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  LocalShipping,
  EmojiEvents as TrophyIcon,
  Storefront as StorefrontIcon,
  Star,
} from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import ProductCard from '@/components/ProductCard';
import useGeolocation, { getDistance } from '@/hooks/useGeolocation';
import { estimateDelivery } from '@/utils/deliveryConfig';
import { useAuth } from '@/hooks/useAuth';
import { apiGet, apiPost, apiDelete } from '@/utils/api';


export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { location } = useGeolocation();
  const { isLoggedIn } = useAuth();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsError, setProductsError] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  useEffect(() => {
    if (!isLoggedIn) {
      setFavorites(new Set());
      return;
    }

    const loadWishlist = async () => {
      try {
        const data = await apiGet('/customers/me/wishlist');
        const ids = (data.wishlist || [])
          .map((item) => item.id || item.product_id || item._id || item.product?._id || item.product?.id)
          .filter(Boolean);
        setFavorites(new Set(ids));
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      }
    };

    loadWishlist();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchShop = async () => {
      const routeId = params?.id;
      if (!routeId) return;

      setLoading(true);
      try {
        let shopData = null;
        const routeValue = String(routeId).trim();

        // Fetch merchant by ID (must succeed or show an error)
        try {
          shopData = await apiGet(`/merchants/${encodeURIComponent(routeValue)}`);
        } catch (err) {
          // Do not attempt fallbacks to other endpoints — show an explicit error
          setError('Impossible de charger la boutique. Veuillez réessayer plus tard.');
          setShop(null);
          setProducts([]);
          setLoading(false);
          return;
        }

        const normalizedShop = {
          ...shopData,
          id: shopData.id || shopData._id || shopData.user_id,
          name: shopData.shop_name || shopData.name || 'Boutique sans nom',
          description: shopData.description || '',
          city: shopData.city || '',
          category: shopData.category || '',
          rating: shopData.rating ?? null,
          reviewsCount: shopData.reviewsCount ?? 0,
          productsCount: shopData.products_count ?? 0,
          revenue: shopData.total_sales ?? 0,
          logo: shopData.logo || shopData.logo_url || '/placeholder.png',
        };

        setShop(normalizedShop);
        setError(null);

        // Fetch products for this merchant
        try {
          const merchantIdParam = encodeURIComponent(normalizedShop.user_id || normalizedShop.id || normalizedShop._id);
          const prodUrl = `/products?merchant_id=${merchantIdParam}`;
          const prodData = await apiGet(prodUrl);
          const prodList = prodData?.products || prodData?.items || (Array.isArray(prodData) ? prodData : []);

          if (!Array.isArray(prodList)) {
            // Unexpected response structure
            setProducts([]);
            setProductsError('Format de réponse inattendu. Veuillez réessayer.');
          } else if (prodList.length === 0) {
            // No products - this is normal, not an error
            setProducts([]);
            setProductsError(null);
          } else {
            setProducts(prodList);
            setProductsError(null);
          }
        } catch (err) {
          // Product fetch failed - distinguish from shop-level error
          setProducts([]);
          setProductsError('Impossible de charger les produits de cette boutique. Vérifiez votre connexion réseau.');
        }
      } catch (err) {
        setError('Impossible de charger la boutique. Veuillez réessayer plus tard.');
        setShop(null);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShop();
  }, [params.id]);

  const handleAddToCart = async (product) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const productId = product?.id || product?._id;
    if (!productId) {
      return;
    }

    try {
      await apiPost('/cart/items', { product_id: productId, quantity: 1 });
    } catch (err) {
      console.error('Failed to add product to cart:', err);
    }
  };

  const handleFavoriteToggle = async (productId) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (!productId) {
      return;
    }

    const isCurrentlyFavorite = favorites.has(productId);

    try {
      if (isCurrentlyFavorite) {
        await apiDelete(`/customers/me/wishlist/${productId}`);
      } else {
        await apiPost('/customers/me/wishlist', { product_id: productId });
      }

      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const distance = useMemo(() => {
    if (!location || !shop) return null;
    const shopLat = shop.latitude || shop.lat || 0;
    const shopLng = shop.longitude || shop.lng || 0;
    return getDistance(location.lat, location.lng, shopLat, shopLng);
  }, [location, shop]);

  const delivery = useMemo(() => estimateDelivery(distance), [distance]);

  if (loading) {
    return (
      <CustomerDashboardLayout title="Boutique">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </CustomerDashboardLayout>
    );
  }

  if (error || !shop) {
    return (
      <CustomerDashboardLayout title="Boutique introuvable">
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {error || 'Cette boutique n\'existe pas ou a été supprimée.'}
          </Alert>
          <Button onClick={() => router.push('/dashboard/customer/shops')} sx={{ mt: 2 }} startIcon={<ArrowBack />}>
            Retour aux boutiques
          </Button>
        </Box>
      </CustomerDashboardLayout>
    );
  }

  return (
    <CustomerDashboardLayout title={shop.name}>
      <Box sx={{ pb: 4 }}>

        {/* Bouton retour */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push('/dashboard/customer/shops')}
          sx={{ mb: 2.5, textTransform: 'none', color: '#6b7280', fontWeight: 600,
            '&:hover': { color: '#1e1b4b', bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          Retour aux boutiques
        </Button>

        {/* Hero bannière */}
        <Box sx={{
          borderRadius: 4,
          background: shop.coverColor || 'linear-gradient(135deg,#1e1b4b,#6d28d9)',
          p: { xs: 3, md: 4 },
          mb: 3,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Cercles décoratifs */}
          <Box sx={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
          <Box sx={{ position: 'absolute', bottom: -30, right: 80, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {/* Avatar emoji */}
            <Avatar src={shop.logo} sx={{
              width: 80, height: 80, fontSize: '2.5rem',
              bgcolor: 'rgba(255,255,255,0.15)',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              {!shop.logo && shop.emoji}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, lineHeight: 1.1 }}>
                  {shop.name}
                </Typography>
                {shop.isWinner && (
                  <Chip
                    icon={<TrophyIcon sx={{ fontSize: 14, color: '#92400e !important' }} />}
                    label="BUY BOX"
                    size="small"
                    sx={{
                      bgcolor: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                      background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                      color: '#92400e', fontWeight: 900, fontSize: '0.7rem',
                      border: '1px solid rgba(251,191,36,0.6)',
                    }}
                  />
                )}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationOn sx={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.87rem', fontWeight: 500 }}>
                  {shop.city} · {shop.category}
                </Typography>
              </Box>

              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.5, mb: 2, maxWidth: 560 }}>
                {shop.description}
              </Typography>

              {/* Stats */}
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                    {shop.rating?.toFixed(1)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Star sx={{ fontSize: 14, color: '#fbbf24' }} />
                    <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                      {shop.reviewsCount} avis
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                    {shop.productsCount}
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                    produits
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>
                    {(shop.revenue / 1_000_000).toFixed(1)}M
                  </Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem' }}>
                    FCFA ventes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Distance & Livraison */}
        {(distance !== null || delivery) && (
          <Box sx={{
            borderRadius: 3, p: 2.5, mb: 3,
            background: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
            display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center',
          }}>
            {distance !== null && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LocationOn sx={{ color: '#7c3aed', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>
                    {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>de vous</Typography>
                </Box>
              </Box>
            )}

            <Divider orientation="vertical" flexItem />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: delivery.amount === 0 ? '#d1fae5' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalShipping sx={{ color: delivery.amount === 0 ? '#059669' : '#d97706', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>
                  {delivery.label}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }}>estimation livraison</Typography>
              </Box>
            </Box>

            {shop.tags?.length > 0 && (
              <>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
                  {shop.tags.map(tag => (
                    <Chip key={tag} label={tag} size="small"
                      sx={{ bgcolor: '#f3f4f6', color: '#374151', fontSize: '0.72rem', fontWeight: 600 }} />
                  ))}
                </Box>
              </>
            )}
          </Box>
        )}

        {/* Produits */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', mb: 0.5 }}>
            Produits disponibles
          </Typography>
          <Box sx={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#f59e0b,#a855f7,transparent)', mb: 2.5 }} />

          {productsError ? (
            <Box sx={{
              p: 4, textAlign: 'center', borderRadius: 3,
              bgcolor: '#fef2f2', border: '2px solid #fecaca',
            }}>
              <Typography sx={{ color: '#dc2626', fontWeight: 600, mb: 1 }}>
                ⚠️ Erreur de chargement
              </Typography>
              <Typography sx={{ color: '#7f1d1d', fontSize: '0.9rem' }}>
                {productsError}
              </Typography>
              <Button 
                onClick={() => {
                  setProductsError(null);
                  setProducts([]);
                  window.location.reload();
                }}
                sx={{ mt: 2, textTransform: 'none', fontSize: '0.9rem' }}
              >
                Réessayer
              </Button>
            </Box>
          ) : products.length === 0 ? (
            <Box sx={{
              p: 6, textAlign: 'center', borderRadius: 3,
              bgcolor: '#faf9ff', border: '2px dashed #e5e7eb',
            }}>
              <StorefrontIcon sx={{ fontSize: 56, color: '#c4b5fd', mb: 1.5 }} />
              <Typography sx={{ color: '#6b7280', fontWeight: 600 }}>
                Aucun produit disponible pour cette boutique pour l&apos;instant.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {products.map(product => (
                <Grid key={product.id || product._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorited={favorites.has(product.id || product._id)}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </Box>
    </CustomerDashboardLayout>
  );
}
