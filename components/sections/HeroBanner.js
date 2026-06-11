'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Skeleton } from '@mui/material';
import {
  LocalOffer as OfferIcon,
  ArrowForward as ArrowIcon,
  Storefront as StoreIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const GREETINGS = ['Bonjour', 'Bienvenue', 'Salut'];
const SUGGESTIONS = [
  'Découvrez les offres flash du moment 🔥',
  'Les boutiques près de chez vous livrent plus vite ⚡',
  'Nos commerçants locaux vous attendent 🛒',
  'Profitez des remises exclusives Alia 🎁',
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Bonjour';
  if (h < 18) return 'Bon après-midi';
  return 'Bonsoir';
}

export default function HeroBanner({ userCity }) {
  const { user } = useAuth();
  const router = useRouter();
  const [suggIdx, setSuggIdx] = useState(0);

  const firstName = user?.first_name || user?.username || 'cher client';

  useEffect(() => {
    const t = setInterval(() => setSuggIdx(i => (i + 1) % SUGGESTIONS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <Box sx={{
      borderRadius: 4,
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)',
      p: { xs: 3, md: 5 },
      mb: 4,
      position: 'relative',
      overflow: 'hidden',
      minHeight: { xs: 180, md: 220 },
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {/* Décorations cercles */}
      {[
        { size: 260, top: -80, right: -60, opacity: 0.07 },
        { size: 180, top: 20, right: 80, opacity: 0.05 },
        { size: 120, bottom: -40, left: 200, opacity: 0.08 },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: 'absolute', borderRadius: '50%',
          width: c.size, height: c.size,
          top: c.top, right: c.right, bottom: c.bottom, left: c.left,
          background: 'rgba(255,255,255,' + c.opacity + ')',
          pointerEvents: 'none',
        }} />
      ))}

      {/* Contenu */}
      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 620 }}>
        <Typography sx={{ color: 'rgba(199,210,254,0.85)', fontSize: '0.9rem', fontWeight: 600, mb: 0.5 }}>
          {getGreeting()},
        </Typography>

        <Typography variant="h4" sx={{
          fontWeight: 900, color: '#fff',
          fontSize: { xs: '1.5rem', md: '2rem' },
          mb: 1, lineHeight: 1.2,
        }}>
          {firstName} 👋
          {userCity && (
            <Typography component="span" sx={{ fontSize: '0.9rem', color: 'rgba(199,210,254,0.8)', fontWeight: 500, ml: 1.5 }}>
              📍 {userCity}
            </Typography>
          )}
        </Typography>

        {/* Suggestion rotative */}
        <Typography sx={{
          color: 'rgba(199,210,254,0.9)', fontSize: '1.05rem', mb: 3,
          minHeight: 32,
          transition: 'opacity 0.5s',
        }}>
          {SUGGESTIONS[suggIdx]}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<OfferIcon />}
            onClick={() => router.push('/dashboard/customer/orders')}
            sx={{
              borderRadius: 3, textTransform: 'none', fontWeight: 700,
              bgcolor: '#f59e0b', color: '#1e1b4b',
              '&:hover': { bgcolor: '#d97706', boxShadow: '0 6px 20px rgba(245,158,11,0.4)' },
              boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
            }}
          >
            Voir mes commandes
          </Button>
          <Button
            variant="outlined"
            startIcon={<StoreIcon />}
            onClick={() => router.push('/dashboard/customer/shops')}
            endIcon={<ArrowIcon />}
            sx={{
              borderRadius: 3, textTransform: 'none', fontWeight: 700,
              borderColor: 'rgba(255,255,255,0.4)', color: '#fff',
              '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            Explorer les boutiques
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
