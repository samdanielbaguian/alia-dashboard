'use client';

import { Box, Container, Typography, Button, useMediaQuery } from '@mui/material';
import { ArrowForward as ArrowIcon, LocalOffer as TagIcon } from '@mui/icons-material';

export default function PromoBanner() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ my: 4 }}>
      <Box sx={{
        borderRadius: 3, overflow: 'hidden',
        background: 'linear-gradient(120deg, #ff6b6b 0%, #ee5a24 50%, #fd9644 100%)',
        position: 'relative',
      }}>
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.08)', pointerEvents: 'none',
        }} />
        <Box sx={{
          position: 'absolute', right: 60, bottom: -50,
          width: 130, height: 130, borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
        }} />

        <Container maxWidth="lg">
          <Box sx={{
            py: { xs: 3, md: 3.5 },
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexDirection: isMobile ? 'column' : 'row', gap: 2, textAlign: isMobile ? 'center' : 'left',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2,
                p: 1.2, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <TagIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, color: '#fff', fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.3 }}>
                  PROMO DE LA SEMAINE
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: { xs: '0.85rem', md: '0.95rem' }, mt: 0.3 }}>
                  Jusqu'à <strong>-30%</strong> sur une sélection de produits — Offre limitée !
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowIcon />}
              sx={{
                bgcolor: '#fff', color: '#ee5a24', fontWeight: 800,
                borderRadius: 6, px: 3, py: 1.2, textTransform: 'none',
                fontSize: '0.92rem', whiteSpace: 'nowrap', flexShrink: 0,
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: '#fff3e0', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' },
                transition: 'all 0.2s',
              }}
            >
              Profiter maintenant
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
