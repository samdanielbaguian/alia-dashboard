'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Chip, Skeleton } from '@mui/material';
import { NewReleases as NewIcon, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/utils/api';
import ProductCard from '@/components/ProductCard';

export default function NewArrivals({ onAddToCart }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiGet('/products?sort=newest&limit=10');
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch (error) {
        console.error('Failed to fetch new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (loading || products.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const newScroll = scrollLeft + 300;
        if (newScroll >= maxScroll) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loading, products, isPaused]);

  if (loading) {
    return (
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="rounded" width={44} height={44} />
          <Skeleton variant="text" width={200} height={28} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" width={180} height={240} sx={{ flexShrink: 0 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ mb: 5, textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Aucune nouveauté pour le moment</Typography>
      </Box>
    );
  }

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
              Produits récemment ajoutés
            </Typography>
          </Box>
          <Chip label="NEW" size="small"
            sx={{ bgcolor: '#d1fae5', color: '#065f46', fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
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

      {/* Carrousel horizontal */}
      <Box
        ref={scrollRef}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        sx={{
          display: 'flex',
          gap: 2.5,
          overflowX: 'auto',
          overflowY: 'hidden',
          pb: 2,
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#10b981', borderRadius: 3 },
        }}
      >
        {products.map((product) => (
          <Box key={product.id} sx={{ flexShrink: 0, width: 200 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}