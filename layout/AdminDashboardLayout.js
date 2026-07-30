'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Alert } from '@mui/material';
import { Logout as LogoutIcon, Person as PersonIcon, Settings as SettingsIcon } from '@mui/icons-material';
import AdminSidebar, { DRAWER_WIDTH } from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboardLayout({ title = 'Admin Dashboard', children }) {
  const router = useRouter();
  const { user, isAdmin, logout, loading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted || loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Typography>Chargement...</Typography>
      </Box>
    );
  }

  // Protection: redirect if not admin
  if (!isAdmin) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          Vous n'avez pas accès à cette section. Seuls les administrateurs peuvent accéder au panneau de contrôle.
        </Alert>
      </Box>
    );
  }

  const mainContentWidth = collapsed ? `calc(100% - 72px)` : `calc(100% - ${DRAWER_WIDTH}px)`;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      {/* Sidebar */}
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(prev => !prev)} />

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          sx={{
            bgcolor: '#fff',
            color: '#2c3e50',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            width: mainContentWidth,
            ml: collapsed ? '72px' : `${DRAWER_WIDTH}px`,
            transition: 'all 0.3s ease',
          }}
        >
          <Toolbar>
            <Typography variant="h6" sx={{ fontWeight: 800, flex: 1, fontSize: '1.15rem' }}>
              🛡️ {title}
            </Typography>

            {/* User menu */}
            <IconButton
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{ color: '#2c3e50', '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' } }}
            >
              <PersonIcon />
            </IconButton>
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' } }}
            >
              <MenuItem disabled sx={{ color: '#7f8c8d', fontSize: '0.85rem' }}>
                {user?.email}
              </MenuItem>
              <MenuItem onClick={() => { setMenuAnchor(null); router.push('/dashboard/admin/settings'); }}>
                <SettingsIcon sx={{ mr: 1.5, fontSize: 18 }} /> Paramètres
              </MenuItem>
              <MenuItem onClick={() => { setMenuAnchor(null); logout(); }} sx={{ color: '#ef4444' }}>
                <LogoutIcon sx={{ mr: 1.5, fontSize: 18 }} /> Déconnexion
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <Container maxWidth="xl">
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
