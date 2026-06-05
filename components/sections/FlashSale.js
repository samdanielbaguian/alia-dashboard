'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Button, Chip } from '@mui/material';
import { Bolt as FlashIcon, Timer as TimerIcon, ArrowForward } from '@mui/icons-material';
import ProductCard from '@/components/ProductCard';
import { MOCK_FLASH_PRODUCTS } from '@/data/mockShops';

function useCountdown(targetMs) {
  const [remaining, setRemaining] = useState(targetMs - Date.now());
  useEffect(() => {
    const t = setInterval(() => setRemaining(targetMs - Date.now()), 1000);
    return () => clearInterval(t);
  }, [targetMs]);
  const total = Math.max(0, remaining);
  const h  = Math.floor(total / 3600000);
  const m  = Math.floor((total % 3600000) / 60000);
  const s  = Math.floor((total % 60000) / 1000);
  return { h, m, s, expired: total === 0 };
}

function Digit({ val, label }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{
        bgcolor: '#1e1b4b', color: '#fff', fontWeight: 900,
        fontSize: { xs: '1.2rem', md: '1.6rem' },
        width: { xs: 40, md: 52 }, height: { xs: 40, md: 52 },
        borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(30,27,75,0.3)',
        minWidth: { xs: 40, md: 52 },
      }}>
        {String(val).padStart(2, '0')}
      </Box>
      <Typography sx={{ fontSize: '0.6rem', color: '#6b7280', mt: 0.3, fontWeight: 600 }}>{label}</Typography>
    </Box>
  );
}

export default function FlashSale({ onAddToCart }) {
  // Flash sale se termine dans ~8 heures depuis maintenant
  const [endTime] = useState(() => Date.now() + 8 * 60 * 60 * 1000);
  const { h, m, s, expired } = useCountdown(endTime);

  if (expired) return null;

  return (
    <Box sx={{ mb: 5 }}>
      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 2, mb: 2.5,
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #ef4444 100%)',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2, p: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FlashIcon sx={{ color: '#fbbf24', fontSize: 26 }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.1rem', md: '1.35rem' }, color: '#fff' }}>
              ⚡ Flash Sale
            </Typography>
            <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)' }}>
              Offres limitées — stocks très réduits
            </Typography>
          </Box>
        </Box>

        {/* Compte à rebours */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Digit val={h} label="H" />
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', mb: 1.5 }}>:</Typography>
            <Digit val={m} label="MIN" />
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.3rem', mb: 1.5 }}>:</Typography>
            <Digit val={s} label="SEC" />
          </Box>
        </Box>
      </Box>

      {/* Produits */}
      <Grid container spacing={2}>
        {MOCK_FLASH_PRODUCTS.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={product.id}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
