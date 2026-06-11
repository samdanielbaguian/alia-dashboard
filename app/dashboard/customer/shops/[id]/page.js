'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Chip, Button, Alert, Divider,
  Avatar, Rating,
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
import { MOCK_SHOPS, MOCK_SHOP_PRODUCTS } from '@/data/mockShops';

export default function ShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { location } = useGeolocation();

  const shop = useMemo(
    () => MOCK_SHOPS.find(s => s.id === params.id) || null,
    [params.id],
  );

  const distance = useMemo(() => {
    if (!location || !shop) return null;
    return getDistance(location.lat, location.lng, shop.lat, shop.lng);
  }, [location, shop]);

  const delivery = useMemo(() => estimateDelivery(distance), [distance]);

  const products = useMemo(() => {
    if (!shop) return [];
    return MOCK_SHOP_PRODUCTS[shop.id] || [];
  }, [shop]);

  if (!shop) {
    return (
      <CustomerDashboardLayout title="Boutique introuvable">
        <Box sx={{ p: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Cette boutique n&apos;existe pas ou a été supprimée.
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
            <Avatar sx={{
              width: 80, height: 80, fontSize: '2.5rem',
              bgcolor: 'rgba(255,255,255,0.15)',
              border: '3px solid rgba(255,255,255,0.3)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            }}>
              {shop.emoji}
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

          {products.length === 0 ? (
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
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </Box>
    </CustomerDashboardLayout>
  );
}
