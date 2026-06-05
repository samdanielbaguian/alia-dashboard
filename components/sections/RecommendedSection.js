'use client';

import { Box, Typography, Grid, Button } from '@mui/material';
import { AutoAwesome as SparkleIcon, ArrowForward } from '@mui/icons-material';
import ProductCard from '@/components/ProductCard';
import { MOCK_RECOMMENDED_PRODUCTS } from '@/data/mockShops';
import { useRouter } from 'next/navigation';

export default function RecommendedSection({ onAddToCart }) {
  const router = useRouter();

  return (
    <Box sx={{ mb: 5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            background: 'linear-gradient(135deg,#a855f7,#ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(168,85,247,0.3)',
          }}>
            <SparkleIcon sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', lineHeight: 1.1 }}>
              Recommandé pour vous
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Sélectionnés selon vos préférences
            </Typography>
          </Box>
        </Box>
        <Button
          endIcon={<ArrowForward />}
          size="small"
          onClick={() => router.push('/dashboard/customer/shops')}
          sx={{ textTransform: 'none', fontWeight: 700, color: '#8b5cf6',
            '&:hover': { bgcolor: 'rgba(139,92,246,0.08)' } }}
        >
          Tout voir
        </Button>
      </Box>

      {/* Barre décorative */}
      <Box sx={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#a855f7,#ec4899,transparent)', mb: 2.5 }} />

      {/* Grille produits */}
      <Grid container spacing={2.5}>
        {MOCK_RECOMMENDED_PRODUCTS.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
