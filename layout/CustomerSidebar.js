'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Divider, Badge, Avatar, Tooltip, IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  Favorite as WishlistIcon,
  ShoppingCart as CartIcon,
  Person as ProfileIcon,
  Payment as PaymentIcon,
  Logout as LogoutIcon,
  ChevronLeft,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/utils/api';

const DRAWER_WIDTH = 270;
export { DRAWER_WIDTH };
const DRAWER_COLLAPSED = 72;

const NAV = [
  { path: '/dashboard/customer',          label: 'Dashboard',       icon: DashboardIcon },
  { path: '/dashboard/customer/orders',   label: 'Mes commandes',   icon: OrdersIcon },
  { path: '/dashboard/customer/wishlist', label: 'Wishlist',        icon: WishlistIcon },
  { path: '/dashboard/customer/cart',     label: 'Panier',          icon: CartIcon, badge: true },
  { path: '/dashboard/customer/profile',  label: 'Mon profil',      icon: ProfileIcon },
  { path: '/dashboard/customer/payments', label: 'Paiements',       icon: PaymentIcon },
];

export default function CustomerSidebar({ collapsed, onToggle }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted]     = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    apiGet('/cart').then(d => {
      setCartCount((d?.items || []).length);
    }).catch(() => {});
  }, [mounted]);

  if (!mounted) return null;

  const isActive = (path) =>
    path === '/dashboard/customer'
      ? pathname === path
      : pathname === path || pathname?.startsWith(path + '/');

  const userInitial = (user?.first_name || user?.email || 'A')[0].toUpperCase();

  const itemSx = (active) => ({
    borderRadius: 2,
    mx: 1, mb: 0.5,
    minHeight: 44,
    justifyContent: collapsed ? 'center' : 'flex-start',
    px: collapsed ? 1.5 : 2,
    position: 'relative',
    background: active
      ? 'linear-gradient(135deg, rgba(168,85,247,0.30) 0%, rgba(236,72,153,0.18) 100%)'
      : 'transparent',
    '&:hover': {
      background: active
        ? 'linear-gradient(135deg, rgba(168,85,247,0.42) 0%, rgba(236,72,153,0.28) 100%)'
        : 'rgba(255,255,255,0.07)',
    },
    '& .MuiListItemIcon-root': {
      color: active ? '#c084fc' : 'rgba(255,255,255,0.55)',
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
        background: 'linear-gradient(180deg, #a855f7, #ec4899)',
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
          background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 60%, #3730a3 100%)',
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
          <Box>
            <Typography sx={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
              ALIA
            </Typography>
            <Typography sx={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '3.5px', fontWeight: 600, mt: 0.3 }}>
              ESPACE CLIENT
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
          <Avatar sx={{ width: 38, height: 38, background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontSize: 15, fontWeight: 800 }}>
            {userInitial}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }} noWrap>
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Client Alia'}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }} noWrap>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
          <Tooltip title={user?.email || ''} placement="right">
            <Avatar sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #a855f7, #ec4899)', fontSize: 13, fontWeight: 800, cursor: 'default' }}>
              {userInitial}
            </Avatar>
          </Tooltip>
        </Box>
      )}

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5, mb: 0.5 }} />

      {/* ── Nav items ── */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {NAV.map(({ path, label, icon: Icon, badge }) => {
          const active = isActive(path);
          const count = badge ? cartCount : 0;
          return (
            <Tooltip key={path} title={collapsed ? label : ''} placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton onClick={() => router.push(path)} sx={itemSx(active)}>
                  <ListItemIcon>
                    {count > 0 ? (
                      <Badge badgeContent={count} color="error"
                        sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 15, height: 15 } }}>
                        <Icon fontSize="small" />
                      </Badge>
                    ) : <Icon fontSize="small" />}
                  </ListItemIcon>
                  {!collapsed && <ListItemText primary={label} />}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mx: 1.5 }} />

      {/* ── Logout ── */}
      <Box sx={{ p: 1, pb: 1.5 }}>
        <Tooltip title={collapsed ? 'Déconnexion' : ''} placement="right" arrow>
          <ListItemButton
            onClick={logout}
            sx={{
              borderRadius: 2, px: collapsed ? 1.5 : 2, minHeight: 42,
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'rgba(255,255,255,0.5)',
              '&:hover': { bgcolor: 'rgba(239,68,68,0.15)', color: '#f87171' },
              transition: 'all 0.2s',
              '& .MuiListItemIcon-root': { minWidth: collapsed ? 0 : 36, color: 'inherit' },
              '& .MuiListItemText-primary': { fontSize: '0.875rem', color: 'inherit' },
            }}
          >
            <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
            {!collapsed && <ListItemText primary="Déconnexion" />}
          </ListItemButton>
        </Tooltip>
      </Box>

      {!collapsed && (
        <Box sx={{ px: 2.5, pb: 2, opacity: 0.25 }}>
          <Typography sx={{ fontSize: '0.6rem', color: '#fff', letterSpacing: '1px', fontFamily: 'monospace' }}>
            ALIA v1.0.0
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}
