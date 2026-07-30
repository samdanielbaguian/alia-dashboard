'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Avatar, Tooltip, IconButton, Alert,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as UsersIcon,
  Store as MerchantsIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChevronLeft,
  Menu as MenuIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

const DRAWER_WIDTH = 280;
export { DRAWER_WIDTH };
const DRAWER_COLLAPSED = 72;

const ADMIN_NAV = [
  { path: '/dashboard/admin', label: 'Dashboard', icon: DashboardIcon },
  { path: '/dashboard/admin/users', label: 'Utilisateurs', icon: UsersIcon },
  { path: '/dashboard/admin/merchants', label: 'Marchands', icon: MerchantsIcon },
  { path: '/dashboard/admin/products', label: 'Produits', icon: ProductsIcon },
  { path: '/dashboard/admin/orders', label: 'Commandes', icon: OrdersIcon },
  { path: '/dashboard/admin/settings', label: 'Paramètres', icon: SettingsIcon },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  // Protection: redirect if not admin
  if (!isAdmin) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Accès administrateur requis</Alert>
      </Box>
    );
  }

  const isActive = (path) =>
    path === '/dashboard/admin'
      ? pathname === path
      : pathname === path || pathname?.startsWith(path + '/');

  const userInitial = (user?.email || 'A')[0].toUpperCase();

  const itemSx = (active) => ({
    borderRadius: 2,
    mx: 1, mb: 0.5,
    minHeight: 44,
    justifyContent: collapsed ? 'center' : 'flex-start',
    px: collapsed ? 1.5 : 2,
    position: 'relative',
    background: active
      ? 'linear-gradient(135deg, rgba(220,38,38,0.30) 0%, rgba(239,68,68,0.18) 100%)'
      : 'transparent',
    '&:hover': {
      background: active
        ? 'linear-gradient(135deg, rgba(220,38,38,0.42) 0%, rgba(239,68,68,0.28) 100%)'
        : 'rgba(255,255,255,0.07)',
    },
    '& .MuiListItemIcon-root': {
      color: active ? '#ef4444' : 'rgba(255,255,255,0.55)',
      minWidth: collapsed ? 0 : 36,
    },
    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: active ? 700 : 400,
      color: active ? '#fff' : 'rgba(255,255,255,0.8)',
    },
    ...(active && {
      '&::before': {
        content: '""', position: 'absolute', left: 0, top: '50%',
        transform: 'translateY(-50%)', width: 3, height: '65%',
        background: 'linear-gradient(180deg, #dc2626, #ef4444)',
        borderRadius: '0 3px 3px 0',
      },
    }),
    transition: 'all 0.2s ease',
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #7f1d1d 0%, #991b1b 60%, #b91c1c 100%)',
          border: 'none',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
        },
      }}
    >
      {/* ── Header ── */}
      <Box sx={{
        p: collapsed ? 1 : 2.5,
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 72,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Image
              src="/logos/logos.png"
              alt="Alia Admin"
              width={100}
              height={32}
              style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto', marginBottom: 4 }}
              priority
            />
            <Typography sx={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', letterSpacing: '3px', fontWeight: 600, mt: 0.3 }}>
              ADMIN
            </Typography>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5 }} />

      {/* ── User info ── */}
      {!collapsed ? (
        <Box sx={{ px: 2.5, py: 1.8, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #dc2626, #ef4444)', fontSize: 15, fontWeight: 800 }}>
            {userInitial}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
              Administrateur
            </Typography>
            <Typography sx={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ px: 1.5, py: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #dc2626, #ef4444)', fontSize: 14, fontWeight: 800 }}>
            {userInitial}
          </Avatar>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5, my: 1.5 }} />

      {/* ── Navigation ── */}
      <List sx={{ flex: 1, px: 0.5 }}>
        {ADMIN_NAV.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => router.push(item.path)}
              sx={itemSx(isActive(item.path))}
            >
              <ListItemIcon>
                <item.icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ sx: { fontSize: '0.85rem' } }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5 }} />

      {/* ── Logout ── */}
      <Box sx={{ p: collapsed ? 1 : 2 }}>
        <Tooltip title="Déconnexion">
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 2,
              background: 'rgba(255,255,255,0.08)',
              '&:hover': { background: 'rgba(255,255,255,0.15)' },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 36, color: 'rgba(255,255,255,0.7)' }}>
              <LogoutIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{ sx: { fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' } }}
              />
            )}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Drawer>
  );
}
