'use client';

import { Box, Container, Typography, Link, IconButton, Divider } from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Storefront as LogoIcon,
} from '@mui/icons-material';
import { useTheme } from '@/context/ThemeContext';

export default function Footer() {
  const { isDarkMode } = useTheme();
  const bg = isDarkMode ? '#0d0d1a' : '#1a1a2e';

  return (
    <Box sx={{ bgcolor: bg, color: 'rgba(255,255,255,0.82)', mt: 6 }}>
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', md: '2fr 1fr 1fr 1.4fr' },
          gap: { xs: 4, md: 5 },
        }}>
          {/* Col 1 – Brand */}
          <Box sx={{ gridColumn: { xs: '1 / -1', md: 'auto' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1565c0, #4ecdc4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <LogoIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff', letterSpacing: 1 }}>
                ALIA
              </Typography>
            </Box>
            <Typography sx={{ fontSize: '0.85rem', lineHeight: 1.7, maxWidth: 240, color: 'rgba(255,255,255,0.6)', mb: 2.5 }}>
              Marketplace leader en Afrique de l'Ouest. Des milliers de produits locaux et internationaux de qualité, livrés chez vous.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <FacebookIcon fontSize="small" />, label: 'Facebook' },
                { icon: <TwitterIcon fontSize="small" />, label: 'Twitter' },
                { icon: <InstagramIcon fontSize="small" />, label: 'Instagram' },
              ].map(s => (
                <IconButton key={s.label} size="small"
                  sx={{ color: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 1.5,
                    '&:hover': { color: '#4ecdc4', borderColor: '#4ecdc4', bgcolor: 'rgba(78,205,196,0.08)' }, transition: 'all 0.2s' }}>
                  {s.icon}
                </IconButton>
              ))}
            </Box>
          </Box>

          {/* Col 2 – Liens utiles */}
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Liens utiles
            </Typography>
            {[
              { label: 'À propos', href: '/about' },
              { label: 'Nos boutiques', href: '#' },
              { label: 'Devenir marchand', href: '#' },
              { label: 'FAQ', href: '/faq' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link key={link.label} href={link.href} underline="none"
                sx={{ display: 'block', fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', mb: 1.1,
                  '&:hover': { color: '#4ecdc4', pl: 0.5 }, transition: 'all 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Col 3 – Assistance */}
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Assistance
            </Typography>
            {[
              { label: 'Centre d\'aide', href: '#' },
              { label: 'Conditions d\'utilisation', href: '/terms' },
              { label: 'Politique de confidentialité', href: '/privacy' },
              { label: 'Retours et remboursements', href: '#' },
              { label: 'Signaler un problème', href: '/contact' },
            ].map(link => (
              <Link key={link.label} href={link.href} underline="none"
                sx={{ display: 'block', fontSize: '0.83rem', color: 'rgba(255,255,255,0.6)', mb: 1.1,
                  '&:hover': { color: '#4ecdc4', pl: 0.5 }, transition: 'all 0.2s' }}>
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Col 4 – Contact */}
          <Box>
            <Typography sx={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Nous contacter
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 2 }}>
              <EmailIcon sx={{ fontSize: 18, color: '#4ecdc4', mt: 0.1, flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>
                support@alia-marketplace.net<br />
                partenaires@alia-marketplace.net
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <PhoneIcon sx={{ fontSize: 18, color: '#4ecdc4', flexShrink: 0 }} />
              <Typography sx={{ fontSize: '0.83rem', color: 'rgba(255,255,255,0.65)' }}>
                +1 (226) 000-0000
              </Typography>
            </Box>

            {/* Payment badges */}
            <Box sx={{ mt: 3 }}>
              <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', mb: 1.2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Paiements acceptés
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {['Orange Money', 'Wave', 'MTN MoMo', 'Carte'].map(p => (
                  <Box key={p} sx={{ px: 1.2, py: 0.4, borderRadius: 1, bgcolor: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.6)' }}>
                    {p}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Bottom bar */}
      <Container maxWidth="lg">
        <Box sx={{ py: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
            © {new Date().getFullYear()} Alia Marketplace. Tous droits réservés.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2.5 }}>
            {[
              { label: 'Confidentialité', href: '/privacy' },
              { label: 'Conditions d\'utilisation', href: '/terms' },
              { label: 'Cookies', href: '#' },
              { label: 'Accessibilité', href: '#' },
            ].map(l => (
              <Link key={l.label} href={l.href} underline="none"
                sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', '&:hover': { color: '#4ecdc4' }, transition: 'color 0.2s' }}>
                {l.label}
              </Link>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
