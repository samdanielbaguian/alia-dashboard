'use client';

import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Chip, Skeleton } from '@mui/material';
import { AutoAwesome as SparkleIcon, ArrowForward } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/utils/api';
import ShopCard from '@/components/ShopCard';

export default function RecommendedSection() {
  const router = useRouter();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        // Récupère les boutiques triées par note (ou popularité)
        const data = await apiGet('/merchants?sort_by=rating_desc&limit=10');
        setShops(data.merchants || []);
      } catch (error) {
        console.error('Failed to fetch recommended shops:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  // Défilement automatique
  useEffect(() => {
    if (loading || shops.length === 0 || isPaused) return;
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        const newScroll = scrollLeft + 300; // défilement de 300px
        if (newScroll >= maxScroll) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: newScroll, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [loading, shops, isPaused]);

  if (loading) {
    return (
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="rounded" width={44} height={44} />
          <Skeleton variant="text" width={200} height={28} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} variant="rounded" width={220} height={280} sx={{ flexShrink: 0 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (shops.length === 0) {
    return (
      <Box sx={{ mb: 5, textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Aucune boutique recommandée pour le moment</Typography>
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
              Boutiques sélectionnées selon vos préférences
            </Typography>
          </Box>
          <Chip label="TOP" size="small"
            sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
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
          '&::-webkit-scrollbar-thumb': { bgcolor: '#a855f7', borderRadius: 3 },
        }}
      >
        {shops.map((shop) => (
          <Box key={shop.id} sx={{ flexShrink: 0, width: 240 }}>
            <ShopCard shop={shop} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}