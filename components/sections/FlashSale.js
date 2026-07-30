'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Grid, Button, Chip, Skeleton } from '@mui/material';
import { Timer as TimerIcon, ArrowForward, FlashOn } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { apiGet } from '@/utils/api';

// ─── Sous-composant Digit (affichage d'un chiffre) ─────────────────────────

function Digit({ val, label }) {
  // Affiche un chiffre avec son label (heures, minutes, secondes)
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        bgcolor: '#1e1b4b',
        color: '#fff',
        fontWeight: 900,
        fontSize: { xs: '1.2rem', md: '1.6rem' },
        width: { xs: 40, md: 52 },
        height: { xs: 40, md: 52 },
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      }}>
        {String(val).padStart(2, '0')}
      </Box>
      <Typography sx={{ fontSize: '0.6rem', color: '#6b7280', mt: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ─── Composant principal ────────────────────────────────────────────────────

export default function FlashSale({ onAddToCart }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false); // ← SOLUTION

  // Récupération des produits flash
  useEffect(() => {
    const fetchFlashProducts = async () => {
      try {
        // Simule une récupération des produits en promo (vous pouvez adapter l'endpoint)
        const data = await apiGet('/products?limit=6&sort=price_asc');
        const list = Array.isArray(data) ? data : data.products || [];
        setProducts(list);
      } catch (error) {
        console.error('Failed to fetch flash products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlashProducts();
  }, []);

  // Timer pour le compte à rebours (uniquement côté client)
  useEffect(() => {
    setMounted(true); // ← Indiquer que le composant est monté

    const targetTime = new Date();
    targetTime.setHours(targetTime.getHours() + 2); // Exemple : fin dans 2h

    const updateTimer = () => {
      const now = new Date();
      const diff = Math.max(0, (targetTime - now) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = Math.floor(diff % 60);
      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Affichage du timer uniquement côté client
  const renderTimer = () => {
    if (!mounted) {
      // Pendant le rendu serveur, on affiche un placeholder (ex: "00:00:00")
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Digit val={0} label="H" />
          <Digit val={0} label="M" />
          <Digit val={0} label="S" />
        </Box>
      );
    }
    // Côté client, on affiche le temps réel
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Digit val={timeLeft.hours} label="H" />
        <Digit val={timeLeft.minutes} label="M" />
        <Digit val={timeLeft.seconds} label="S" />
      </Box>
    );
  };

  if (loading) {
    return (
      <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Skeleton variant="rounded" width={44} height={44} />
          <Skeleton variant="text" width={200} height={28} />
        </Box>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} variant="rounded" width={180} height={240} sx={{ flexShrink: 0 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ mb: 5, textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">Aucune offre flash pour le moment</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 5 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5, flexWrap: 'wrap', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            background: 'linear-gradient(135deg,#ef4444,#dc2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(239,68,68,0.3)',
          }}>
            <FlashOn sx={{ color: '#fff', fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e1b4b', lineHeight: 1.1 }}>
              Flash Sale
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>
              Offres limitées — stocks très réduits
            </Typography>
          </Box>
          <Chip label="🔥" size="small"
            sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 800, fontSize: '0.68rem', height: 20 }} />
        </Box>

        {/* Timer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TimerIcon sx={{ fontSize: 18, color: '#ef4444' }} />
          {renderTimer()}
        </Box>

        <Button
          endIcon={<ArrowForward />}
          size="small"
          onClick={() => router.push('/dashboard/customer/shops')}
          sx={{ textTransform: 'none', fontWeight: 700, color: '#ef4444',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.08)' } }}
        >
          Tout voir
        </Button>
      </Box>

      {/* Barre décorative */}
      <Box sx={{ height: 3, borderRadius: 2, background: 'linear-gradient(90deg,#ef4444,#f59e0b,transparent)', mb: 2.5 }} />

      {/* Grille produits (carrousel horizontal) */}
      <Box sx={{
        display: 'flex',
        gap: 2.5,
        overflowX: 'auto',
        overflowY: 'hidden',
        pb: 2,
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
        '&::-webkit-scrollbar-thumb': { bgcolor: '#ef4444', borderRadius: 3 },
      }}>
        {products.map((product) => (
          <Box key={product.id} sx={{ flexShrink: 0, width: 200 }}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}