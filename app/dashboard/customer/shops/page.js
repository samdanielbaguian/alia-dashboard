'use client';

import { useState, useMemo } from 'react';
import {
  Box, Typography, Grid, Alert, Skeleton,
} from '@mui/material';
import { Storefront as StorefrontIcon } from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import ShopSortBar from '@/components/ShopSortBar';
import ShopCard, { ShopCardSkeleton } from '@/components/ShopCard';
import useGeolocation, { getDistance } from '@/hooks/useGeolocation';
import { MOCK_SHOPS } from '@/data/mockShops';

function sortShops(shops, criteria) {
  const list = [...shops];
  switch (criteria) {
    case 'distance':
      return list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    case 'rating':
      return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    case 'revenue':
      return list.sort((a, b) => (b.revenue ?? 0) - (a.revenue ?? 0));
    case 'products':
      return list.sort((a, b) => (b.productsCount ?? 0) - (a.productsCount ?? 0));
    case 'smart':
    default:
      // Buy Box winners first, puis par distance
      return list.sort((a, b) => {
        if (a.isWinner !== b.isWinner) return a.isWinner ? -1 : 1;
        return (a.distance ?? Infinity) - (b.distance ?? Infinity);
      });
  }
}

export default function ShopsPage() {
  const { location, loading: geoLoading, error: geoError } = useGeolocation();
  const [currentSort, setCurrentSort] = useState('smart');

  // Ajouter la distance calculée à chaque boutique
  const shopsWithDistance = useMemo(() => {
    return MOCK_SHOPS.map(shop => ({
      ...shop,
      distance: location
        ? getDistance(location.lat, location.lng, shop.lat, shop.lng)
        : null,
    }));
  }, [location]);

  const sortedShops = useMemo(
    () => sortShops(shopsWithDistance, currentSort),
    [shopsWithDistance, currentSort],
  );

  return (
    <CustomerDashboardLayout title="Boutiques">
      <Box sx={{ pb: 4 }}>

        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: 2.5,
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
            }}>
              <StorefrontIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, color: '#1e1b4b', lineHeight: 1.1 }}>
                Boutiques partenaires
              </Typography>
              <Typography sx={{ fontSize: '0.82rem', color: '#6b7280' }}>
                {sortedShops.length} boutiques disponibles · Livraison estimée selon votre position
              </Typography>
            </Box>
          </Box>

          {/* Barre décorative */}
          <Box sx={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#f59e0b,#6d28d9,transparent)', mt: 2 }} />
        </Box>

        {/* Alerte géolocalisation */}
        {geoError && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Géolocalisation indisponible — les distances ne sont pas calculées. {geoError}
          </Alert>
        )}

        {/* Barre de tri */}
        <ShopSortBar onSort={setCurrentSort} currentSort={currentSort} />

        {/* Grille boutiques */}
        {geoLoading && !location ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: 8 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShopCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={2.5}>
            {sortedShops.map(shop => (
              <Grid key={shop.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <ShopCard shop={shop} userLocation={location} />
              </Grid>
            ))}
          </Grid>
        )}

      </Box>
    </CustomerDashboardLayout>
  );
}
