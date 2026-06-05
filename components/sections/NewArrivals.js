'use client';

import { Box, Typography, Grid, Button, Chip } from '@mui/material';
import { NewReleases as NewIcon, ArrowForward } from '@mui/icons-material';
import ProductCard from '@/components/ProductCard';
import { MOCK_NEW_ARRIVALS } from '@/data/mockShops';
import { useRouter } from 'next/navigation';

export default function NewArrivals({ onAddToCart }) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            background: 'linear-gradient(135deg,#10b981,#059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
          }}>
            <NewIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', lineHeight: 1.1 }}>
              Nouveautés
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Arrivages de la semaine
            </Typography>
          </Box>
          <Chip label="NEW" size="small"
            sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 800, fontSize: '0.68rem', height: 20, ml: 0.5 }} />
        </Box>
        <Button
          endIcon={<ArrowForward />}
          size="small"
          onClick={() => router.push('/dashboard/customer/shops')}
          sx={{ textTransform: 'none', fontWeight: 700, color: '#10b981',
            '&:hover': { bgcolor: 'rgba(16,185,129,0.08)' } }}
        >
          Tout voir
        </Button>
      </Box>

      {/* Barre décorative */}
      <Box sx={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#10b981,#3b82f6,transparent)', mb: 2.5 }} />

      {/* Grille produits */}
      <Grid container spacing={2.5}>
        {MOCK_NEW_ARRIVALS.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
