'use client';

import { useState } from 'react';
import {
  AppBar, Toolbar, Box, Typography, IconButton, Button, Badge,
  InputBase, Drawer, List, ListItem, ListItemText, Divider,
  Avatar, Menu, MenuItem, Tooltip, useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  ShoppingCart as CartIcon,
  FavoriteBorder as WishlistIcon,
  NotificationsNone as NotifIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  Store as StoreIcon,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';

export default function Header({ searchTerm, onSearchChange, cartCount = 0, wishlistCount = 0 }) {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width:768px)');

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleAccountMenu = (e) => setAnchorEl(e.currentTarget);
  const handleAccountClose = () => setAnchorEl(null);
  const handleLogout = () => { handleAccountClose(); logout(); window.location.href = '/'; };
  const handleDashboard = () => { handleAccountClose(); router.push('/dashboard/customer'); };

  const bg = isDarkMode ? '#0f0f1a' : '#1565c0';
  const userInitial = (user?.first_name || user?.email || 'U')[0].toUpperCase();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: bg,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        zIndex: 1200,
      }}
    >
      {/* Top promo bar 
      <Box sx={{ bgcolor: '#ff6b6b', py: 0.6, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#fff', letterSpacing: 0.3 }}>
          LIVRAISON GRATUITE À PARTIR DE 150 000 FCFA — Profitez-en maintenant !
        </Typography>
      </Box>*/}

      <Toolbar sx={{ px: { xs: 1.5, md: 3 }, gap: { xs: 1, md: 2 }, minHeight: { xs: 64, md: 70 } }}>
        {/* Logo */}
        <Box
          onClick={() => router.push('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer', flexShrink: 0 }}
        >
          {/* Icône mobile */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, alignItems: 'center' }}>
            <Image
              src="/icons/icons.png"
              alt="Alia"
              width={64}
              height={64}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
          {/* Logo complet desktop */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
            <Image
              src="/logos/logos.png"
              alt="Alia Marketplace"
              width={100}
              height={36}
              style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              priority
            />
          </Box>
        </Box>

        {/* Search bar (central) */}
        <Box sx={{
          flex: 1, mx: { xs: 1, md: 3 }, maxWidth: 600,
          bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 6,
          display: 'flex', alignItems: 'center', px: 2, py: 0.5,
          border: '1px solid rgba(255,255,255,0.2)',
          transition: 'all 0.2s',
          '&:focus-within': { bgcolor: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.5)' },
        }}>
          <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 1, fontSize: 20, flexShrink: 0 }} />
          <InputBase
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            sx={{ color: '#fff', flex: 1, fontSize: '0.9rem', '& input::placeholder': { color: 'rgba(255,255,255,0.6)' } }}
          />
        </Box>

        {/* Right icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 0.8 }, flexShrink: 0 }}>
          <Tooltip title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
            <IconButton onClick={toggleDarkMode} sx={{ color: 'rgba(255,255,255,0.85)' }}>
              {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {isLoggedIn && (
            <>
              <Tooltip title="Notifications">
                <IconButton sx={{ color: 'rgba(255,255,255,0.85)', display: { xs: 'none', md: 'flex' } }}>
                  <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
                    <NotifIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Wishlist">
                <IconButton onClick={() => router.push('/dashboard/customer/wishlist')} sx={{ color: 'rgba(255,255,255,0.85)', display: { xs: 'none', md: 'flex' } }}>
                  <Badge badgeContent={wishlistCount || 0} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
                    <WishlistIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Tooltip title="Panier">
                <IconButton onClick={() => router.push('/dashboard/customer/cart')} sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  <Badge badgeContent={cartCount || 0} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', minWidth: 16, height: 16 } }}>
                    <CartIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
            </>
          )}

          {!isLoggedIn ? (
            <Box sx={{ display: 'flex', gap: 1, ml: 1 }}>
              <Button
                size="small"
                onClick={() => router.push('/login')}
                sx={{ color: '#fff', textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', display: { xs: 'none', sm: 'flex' } }}
              >
                Connexion
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => router.push('/register')}
                sx={{
                  bgcolor: '#ff6b6b', color: '#fff', textTransform: 'none', fontWeight: 700,
                  borderRadius: 5, px: 2, fontSize: '0.82rem',
                  '&:hover': { bgcolor: '#ff5252' }, boxShadow: 'none',
                }}
              >
                S'inscrire
              </Button>
            </Box>
          ) : (
            <Box>
              <Tooltip title="Mon compte">
                <Box
                  onClick={handleAccountMenu}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 0.8, cursor: 'pointer',
                    bgcolor: 'rgba(255,255,255,0.12)', borderRadius: 5, px: 1.5, py: 0.6,
                    ml: 0.5, transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#4ecdc4', fontSize: '0.78rem', fontWeight: 700 }}>
                    {userInitial}
                  </Avatar>
                  <Typography sx={{ color: '#fff', fontSize: '0.82rem', fontWeight: 600, display: { xs: 'none', md: 'block' } }}>
                    {user?.first_name || 'Mon compte'}
                  </Typography>
                  <KeyboardArrowDown sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, display: { xs: 'none', md: 'block' } }} />
                </Box>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleAccountClose}
                slotProps={{ paper: { sx: { borderRadius: 2, mt: 1, minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.15)' } } }}
              >
                <MenuItem onClick={handleDashboard} sx={{ fontSize: '0.88rem', gap: 1 }}>
                  Mon tableau de bord
                </MenuItem>
                <MenuItem onClick={() => { handleAccountClose(); router.push('/dashboard/customer/orders'); }} sx={{ fontSize: '0.88rem' }}>
                  Mes commandes
                </MenuItem>
                <MenuItem onClick={() => { handleAccountClose(); router.push('/dashboard/customer/profile'); }} sx={{ fontSize: '0.88rem' }}>
                  Mon profil
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ fontSize: '0.88rem', color: '#ef4444' }}>
                  Déconnexion
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
