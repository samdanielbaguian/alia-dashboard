'use client';

import { useState } from 'react';
import { Box, Container, Typography, InputBase, Button, Chip } from '@mui/material';
import { Search as SearchIcon, Bolt as BoltIcon, Email as EmailIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import Image from 'next/image';


export default function HeroSection({ onSearch }) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch?.(searchValue.trim());
    }
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box   sx={{
    position: 'relative',
    overflow: 'hidden',
    py: { xs: 7, md: 8 },

    backgroundImage: 'url("/images/fond.png")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',

    minHeight: { xs: 500, md: 650 },

    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,

      // voile sombre pour améliorer la lisibilité
      background:
        'linear-gradient(rgba(8,15,35,0.65), rgba(8,15,35,0.65))',

      zIndex: 0,
    },
  }}>
      {/* Decorative blobs */}
      <Box sx={{
        position: 'absolute', top: -80, right: -80,
        width: 400, height: 400, borderRadius: '50%',
        background: 'rgba(78,205,196,0.08)', pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: -60, left: -60,
        width: 300, height: 300, borderRadius: '50%',
        background: 'rgba(255,107,107,0.07)', pointerEvents: 'none',
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Merchant Invitation Badge */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
          p: 1.5,
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(201,160,61,0.3)',
          backdropFilter: 'blur(8px)',
          width: 'fit-content',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255,255,255,0.12)',
            borderColor: 'rgba(201,160,61,0.6)',
            transform: 'translateY(-2px)',
          },
        }}>
          <Typography sx={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#c9a03d',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Devenir marchand ALIA
          </Typography>

          {/* Email Icon */}
          <Box
            component="a"
            href="mailto:admin@alia.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Contactez par email : admin@alia.com"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(201,160,61,0.2)',
              color: '#c9a03d',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(201,160,61,0.4)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <EmailIcon sx={{ fontSize: 16 }} />
          </Box>

          {/* WhatsApp Icon */}
          <Box
            component="a"
            href="https://wa.me/22672696033"
            target="_blank"
            rel="noopener noreferrer"
            title="Contactez par WhatsApp : +226 72696033"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: '6px',
              background: 'rgba(76,175,80,0.2)',
              color: '#4caf50',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(76,175,80,0.4)',
                transform: 'scale(1.1)',
              },
            }}
          >
            <WhatsAppIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>

        {/* Icône décorative */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Image
            src="/icons/icons.png"
            alt="Alia"
            width={400}
            height={200}
            style={{
              objectFit: 'contain',
              filter: 'drop-shadow(0 4px 16px rgba(96,165,250,0.45))',
            }}
            priority
          />
        </Box>

        {/* Title */}
        <Typography variant="h2" sx={{
          fontWeight: 800, color: '#0f0f0f', textAlign: 'center',
          fontSize: { xs: '2rem', sm: '2.8rem', md: '3.5rem' },
          lineHeight: 1.1, mb: 2,
          textShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}>
          DÉCOUVREZ LES MEILLEURS<br />
          <Box component="span" sx={{
            background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            PRODUITS DU MARCHÉ
          </Box>
        </Typography>

        <Typography sx={{
          color: 'rgba(255,255,255,0.65)', textAlign: 'center',
          fontSize: { xs: '0.95rem', md: '1.1rem' }, mb: 5,
        }}>
          Des milliers de produits • Marchands vérifiés • Paiement sécurisé
        </Typography>

        {/* Search bar */}
        <Box sx={{ maxWidth: 640, mx: 'auto', mb: 4 }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', bgcolor: '#fff',
            borderRadius: '50px', pl: 2.5, pr: 0.8, py: 0.7,
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            <SearchIcon sx={{ color: '#9ca3af', mr: 1.5, fontSize: 22, flexShrink: 0 }} />
            <InputBase
              placeholder="Que recherchez-vous aujourd'hui ?"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              sx={{ flex: 1, fontSize: '0.95rem', color: '#374151' }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                borderRadius: '50px', textTransform: 'none', fontWeight: 700,
                px: 3, py: 1, flexShrink: 0,
                background: 'linear-gradient(135deg, #1565c0, #1976d2)',
                boxShadow: 'none',
                '&:hover': { boxShadow: '0 4px 14px rgba(21,101,192,0.5)' },
              }}
            >
              Rechercher
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
