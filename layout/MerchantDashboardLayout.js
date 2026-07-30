'use client';

import { useState, useEffect } from 'react';
import {
  Box, AppBar, Toolbar, Typography, IconButton, Avatar,
  Badge, Menu, MenuItem, Divider, Tooltip, InputBase, Chip,
} from '@mui/material';
import {
  NotificationsActive as NotifIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  LightMode, DarkMode,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import MerchantSidebar from './MerchantSidebar';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED = 72;

export default function MerchantDashboardLayout({ children, title = 'Dashboard' }) {
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();
  const { user, isMerchant, loading, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('merchantSidebarCollapsed');
    if (saved !== null) setCollapsed(JSON.parse(saved));
  }, []);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('merchantSidebarCollapsed', JSON.stringify(next));
  };

  useEffect(() => {
    if (!loading && mounted) {
      if (!user) { window.location.href = '/login'; return; }
      if (!isMerchant) { window.location.href = '/unauthorized'; }
    }
  }, [loading, mounted, user, isMerchant]);

  const sideWidth = collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH;
  const userInitial = (user?.email || 'M')[0].toUpperCase();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Sidebar */}
      <MerchantSidebar collapsed={collapsed} onToggle={handleToggle} />

      {/* Main area */}
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, ml: `${sideWidth}px`, transition: 'margin-left 0.3s ease', minWidth: 0 }}>

        {/* Top AppBar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            ml: `${sideWidth}px`, width: `calc(100% - ${sideWidth}px)`,
            transition: 'margin-left 0.3s ease, width 0.3s ease',
            background: '#ffffff',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            color: '#2c3e50',
          }}
        >
          <Toolbar sx={{ gap: 2, minHeight: 64 }}>
            {/* Logo icône */}
            <Box
              component="a"
              href="/"
              sx={{ display: 'flex', alignItems: 'center', mr: 1, textDecoration: 'none', flexShrink: 0 }}
            >
              <Image
                src="/icons/icons.png"
                alt="Alia"
                width={150}
                height={75}
                style={{ objectFit: 'contain' }}
              />
            </Box>
            {/* Breadcrumb / Title */}
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '1.1rem' }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Typography>
            </Box>

            {/* Search bar */}
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              background: '#f5f7fa', borderRadius: 2, px: 2, py: 0.8,
              border: '1px solid rgba(0,0,0,0.06)',
              '&:focus-within': { border: '1px solid #1976d2', background: '#fff' },
              transition: 'all 0.2s',
              minWidth: 220,
            }}>
              <SearchIcon sx={{ fontSize: 18, color: '#7f8c8d' }} />
              <InputBase placeholder="Rechercher..." sx={{ fontSize: '0.85rem', color: '#2c3e50' }} />
            </Box>

            {/* Refresh */}
            <Tooltip title="Rafraîchir">
              <IconButton onClick={() => window.location.reload()} sx={{ color: '#7f8c8d', '&:hover': { color: '#1976d2', background: 'rgba(25,118,210,0.08)' } }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton onClick={() => router.push('/dashboard/merchant/alerts')} sx={{ color: '#7f8c8d', '&:hover': { color: '#f44336', background: 'rgba(244,67,54,0.08)' } }}>
                <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                  <NotifIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Dark mode */}
            <Tooltip title={darkMode ? 'Mode clair' : 'Mode sombre'}>
              <IconButton onClick={() => setDarkMode(d => !d)} sx={{ color: '#7f8c8d', '&:hover': { color: '#1976d2' } }}>
                {darkMode ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
              </IconButton>
            </Tooltip>

            {/* User menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer', pl: 1, borderLeft: '1px solid rgba(0,0,0,0.08)' }}
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #1976d2, #9c27b0)', fontSize: '0.85rem', fontWeight: 700 }}>
                {userInitial}
              </Avatar>
              <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', lineHeight: 1.2, fontSize: '0.82rem' }}>
                  {user?.email?.split('@')[0] || 'Marchand'}
                </Typography>
                <Chip label="Marchand" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(25,118,210,0.1)', color: '#1976d2', fontWeight: 600 }} />
              </Box>
            </Box>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1, minWidth: 180, borderRadius: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } }}>
              <MenuItem onClick={() => { setAnchorEl(null); router.push('/dashboard/merchant/settings'); }}>
                <SettingsIcon fontSize="small" sx={{ mr: 1.5, color: '#7f8c8d' }} />
                Paramètres
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); logout(); }} sx={{ color: '#f44336' }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                Déconnexion
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box component="main" sx={{ flexGrow: 1, mt: '64px', p: 3, minWidth: 0 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
