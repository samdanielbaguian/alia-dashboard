'use client';

import { Box, Typography, Button, Stack } from '@mui/material';
import {
  MailOutline,
  LockOutlined,
  PersonOutline,
  ShoppingBag,
  Store,
  ShoppingBagOutlined,
  StorefrontOutlined,
  LocalOfferOutlined,
  Google as GoogleIcon,
  Apple as AppleIcon,
  Payments,
  Storefront,
  LocalShipping,
  ShieldOutlined,
  PaymentsOutlined,
  LocalShippingOutlined,
} from '@mui/icons-material';
import Image from 'next/image';


const DEFAULT_FEATURES = [
  {
    icon: <ShieldOutlined fontSize="small" />,
    text: 'Achats sécurisés et marchands vérifiés',
  },
  {
    icon: <PaymentsOutlined fontSize="small" />,
    text: 'Mobile Money : Wave, Orange Money et MTN Money',
  },
  {
    icon: <LocalShippingOutlined fontSize="small" />,
    text: 'Livraison rapide partout en Afrique de l’Ouest',
  },
];

/**
 * BrandingSide — panneau gauche partagé entre login et register.
 *
 * Props:
 *  tagline        string    — accroche en italique
 *  subtitle       string    — texte sous le logo (ex: "E - C O M M E R C E")
 *  features       array     — [{icon, text}] — bullets register (null = masqué)
 *  illustration   node      — JSX affiché entre subtitle et tagline (login)
 *  stats          array     — [['10K+', 'Acheteurs'], ...] (login)
 *  onGoogleLogin  fn
 *  onAppleLogin   fn
 *  onPhoneLogin   fn        — si fourni, affiche le bouton téléphone
 */
export default function BrandingSide({
  tagline = '""',
  subtitle = null,
  features = DEFAULT_FEATURES,
  illustration = null,
  stats = null,
  onGoogleLogin,
  onAppleLogin,
  onPhoneLogin = null,
  backgroundImage = null,
}) {
  const bgStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : { background: 'linear-gradient(145deg, #1565c0 0%, #0d47a1 55%, #0a2e6e 100%)' };

  return (
    <Box
      sx={{
        flex: 1,
        ...bgStyle,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        p: 5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Cercles décoratifs */}
      <Box sx={{ position: 'absolute', top: -120, right: -120, width: 380, height: 380, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '30%', right: -40, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(201,160,61,0.09)', pointerEvents: 'none' }} />

      {/* Overlay semi-transparent — toujours présent dans le DOM pour éviter les erreurs d'hydratation */}
      <Box sx={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        bgcolor: 'rgba(10,46,110,0.62)',
        pointerEvents: 'none',
        display: backgroundImage ? 'block' : 'none',
      }} />

      <Box sx={{ textAlign: 'center', zIndex: 1, maxWidth: 380, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
        {/* Logo officiel */}
        <Box sx={{ mb: 0, display: 'flex', justifyContent: 'center' }}>
          <Image
            src="/logos/logos.png"
            alt="Alia E-commerce"
            width={400}
            height={200}
            style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
            priority
          />
        </Box>

        {/* Subtitle (login) */}
        {subtitle && (
        <>
            <Typography
            sx={{
                color: '#02083d',
                fontSize: '0.9rem',
                fontWeight: 600,
                mb: 3,
                whiteSpace: 'pre-line',
                lineHeight: 1.8,
            }}
            >
            {subtitle}
            </Typography>

            <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Payments sx={{ color: '#c9a03d', fontSize: 20 }} />
                <Typography sx={{ color: '#02083d', fontSize: '0.9rem' }}>
                Paiements sécurisés et Mobile Money
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Storefront sx={{ color: '#c9a03d', fontSize: 20 }} />
                <Typography sx={{ color: '#02083d', fontSize: '0.9rem' }}>
                Des milliers de produits et marchands vérifiés
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <LocalShipping sx={{ color: '#c9a03d', fontSize: 20 }} />
                <Typography sx={{ color: '#02083d', fontSize: '0.9rem' }}>
                Livraison rapide et expérience simplifiée
                </Typography>
            </Box>
            </Box>
        </>
        )}

                {/* Feature bullets (register) */}
            {features && features.map(({ icon, text }) => (
        <Box
            key={text}
            sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 2,
            textAlign: 'left',
            }}
        >
            <Box
            sx={{
                minWidth: 20,
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: 'rgba(201,160,61,0.15)',
                display: 'flex',
                alignItems: 'center',
                color: '#c9a03d',
            }}
            >
            {icon}
            </Box>

            <Typography
            sx={{
                color: '#1a2a4f',
                fontSize: '0.9rem',
                fontWeight: 500,
                lineHeight: 1.5,
            }}
            >
            {text}
            </Typography>
        </Box>
        ))}
        
   <Box
        sx={{
            mt: 4,
            p: 2.5,
            textAlign: 'center',
        }}
        >
        <Typography
            sx={{
            color: '#000000',
            fontWeight: 700,
            fontSize: '1.1rem',
            mb: 1,
            }}
        >
            Rejoignez Alia dès aujourd'hui!!!
        </Typography>
        <Typography
            sx={{
            color: 'rgba(255, 176, 5, 0.85)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            }}
        >
            Des milliers d’acheteurs et de marchands utilisent déjà
            Alia pour développer leur activité en toute sécurité.
        </Typography>
        </Box>

        
        {/* Tagline (login) */}
        {tagline && (
          <Box sx={{ mt: 'auto', pt: 3}}>
            <Typography sx={{ color: '#ffa601', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.6, opacity: 0.95 }}>
              {tagline}
            </Typography>
          </Box>
        )}
    </Box>
    </Box>
  );
}
