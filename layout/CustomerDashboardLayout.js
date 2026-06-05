'use client';

import { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar,
  Menu, MenuItem, Divider, Tooltip, InputBase, Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ShoppingCart as CartIcon,
  Favorite as WishlistIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import CustomerSidebar, { DRAWER_WIDTH } from './CustomerSidebar';

const DRAWER_COLLAPSED = 72;

export default function CustomerDashboardLayout({ children, title = 'Mon espace' }) {
  const [mounted, setMounted]     = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl]   = useState(null);
  const [searchQ, setSearchQ]     = useState('');
  const router = useRouter();
  const { user, isBuyer, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('customerSidebarCollapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('customerSidebarCollapsed', JSON.stringify(next));
  };

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) { window.location.href = '/login'; return; }
      if (!isBuyer) { window.location.href = '/unauthorized'; }
    }
  }, [loading, mounted, user, isBuyer]);

  if (!mounted || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f4ff' }}>
        <Box sx={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': { to: { transform: 'rotate(360deg)' } },
          borderTop: '3px solid transparent',
        }} />
      </Box>
    );
  }

  const sideWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;
  const userInitial = (user?.first_name || user?.email || 'A')[0].toUpperCase();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQ.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQ.trim())}`);
      setSearchQ('');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      <CustomerSidebar collapsed={collapsed} onToggle={handleToggle} />

      {/* ── AppBar ── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          left: sideWidth,
          width: `calc(100% - ${sideWidth}px)`,
          transition: 'left 0.3s ease, width 0.3s ease',
          background: '#fff',
          borderBottom: '1px solid #e8eaed',
        }}
      >
        <Toolbar sx={{ minHeight: 64, gap: 2 }}>
          {/* Logo icône */}
          <Box
            component="a"
            href="/"
            sx={{ display: 'flex', alignItems: 'center', mr: 0.5, textDecoration: 'none', flexShrink: 0 }}
          >
            <Image
              src="/icons/icons.png"
              alt="Alia"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e1b4b', flexShrink: 0 }}>
            {title}
          </Typography>

          {/* Search */}
          <Box sx={{
            flex: 1, maxWidth: 420,
            display: 'flex', alignItems: 'center',
            bgcolor: '#f5f3ff', borderRadius: '10px',
            px: 1.5, py: 0.6, gap: 1,
            border: '1.5px solid transparent',
            '&:focus-within': { borderColor: '#a855f7', bgcolor: '#fff' },
            transition: 'all 0.2s',
          }}>
            <SearchIcon sx={{ fontSize: 18, color: '#9ca3af' }} />
            <InputBase
              placeholder="Rechercher des produits..."
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              onKeyDown={handleSearch}
              sx={{ fontSize: '0.875rem', flex: 1, color: '#374151' }}
            />
          </Box>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Panier">
            <IconButton onClick={() => router.push('/dashboard/customer/cart')} size="small">
              <CartIcon sx={{ color: '#6b7280' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Wishlist">
            <IconButton onClick={() => router.push('/dashboard/customer/wishlist')} size="small">
              <WishlistIcon sx={{ color: '#6b7280' }} />
            </IconButton>
          </Tooltip>

          <Chip
            label={user?.role === 'buyer' ? 'Client' : 'Acheteur'}
            size="small"
            sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', fontWeight: 700, fontSize: '0.72rem', border: '1px solid #e9d5ff' }}
          />

          <Tooltip title="Mon compte">
            <IconButton onClick={e => setAnchorEl(e.currentTarget)} size="small" sx={{ p: 0.3 }}>
              <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontSize: 13, fontWeight: 800 }}>
                {userInitial}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            slotProps={{ paper: { sx: { mt: 1, borderRadius: 2, minWidth: 180, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } } }}
          >
            <Box sx={{ px: 2, py: 1.2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e1b4b' }}>
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Client Alia'}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280' }} noWrap>{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); router.push('/dashboard/customer/profile'); }}
              sx={{ gap: 1.5, fontSize: '0.875rem' }}>
              <PersonIcon fontSize="small" sx={{ color: '#7c3aed' }} /> Mon profil
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }}
              sx={{ gap: 1.5, fontSize: '0.875rem', color: '#ef4444' }}>
              <LogoutIcon fontSize="small" /> Déconnexion
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* ── Content ── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: '64px',
          ml: `${sideWidth}px`,
          transition: 'margin-left 0.3s ease',
          p: { xs: 2, md: 3 },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
