'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography, Divider, Collapse, Badge, Avatar, LinearProgress,
  Chip, Tooltip, IconButton,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Storefront as StorefrontIcon,
  ShoppingBag as OrdersIcon,
  TrendingUp as StatsIcon,
  NotificationsActive as AlertsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandLess, ExpandMore,
  AddBox as AddIcon,
  List as ListIcon,
  HourglassEmpty as PendingIcon,
  LocalShipping as ShipIcon,
  Star as StarIcon,
  ChevronLeft, Menu as MenuIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { apiGet } from '@/utils/api';

const DRAWER_WIDTH = 280;

export default function MerchantSidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [productsOpen, setProductsOpen] = useState(pathname?.startsWith('/dashboard/merchant/products'));
  const [ordersOpen, setOrdersOpen] = useState(pathname?.startsWith('/dashboard/merchant/orders'));
  const [alertsCount, setAlertsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [toShipCount, setToShipCount] = useState(0);
  const [merchantInfo, setMerchantInfo] = useState(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !user) return;
    const mid = user?.id || user?._id;
    // Load alerts count
    apiGet(`/merchants/me/alerts`).then(d => {
      const count = (d?.alerts || []).length + (d?.stock_alerts || []).length;
      setAlertsCount(count);
    }).catch(() => {});
    // Load pending/to-ship counts
    apiGet(`/merchants/me/orders?status=pending&limit=1`).then(d => {
      setPendingCount(d?.total || 0);
    }).catch(() => {});
    apiGet(`/merchants/me/orders?status=confirmed&limit=1`).then(d => {
      setToShipCount(d?.total || 0);
    }).catch(() => {});
    // Load merchant info
    apiGet(`/merchants/${mid}`).then(d => setMerchantInfo(d)).catch(() => {});
  }, [mounted, user]);

  if (!mounted) return null;

  const isActive = (path) => pathname === path || pathname?.startsWith(path + '/');

  const navTo = (path) => router.push(path);

  const menuSx = (path) => ({
    borderRadius: 2, mx: 1, mb: 0.5,
    background: isActive(path)
      ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
      : 'transparent',
    '&:hover': {
      background: isActive(path)
        ? 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)'
        : 'rgba(255,255,255,0.08)',
    },
    '& .MuiListItemIcon-root': { color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.6)' },
    '& .MuiListItemText-primary': {
      color: isActive(path) ? '#fff' : 'rgba(255,255,255,0.85)',
      fontWeight: isActive(path) ? 600 : 400,
      fontSize: '0.9rem',
    },
    transition: 'all 0.2s ease',
    position: 'relative',
    ...(isActive(path) && {
      '&::before': {
        content: '""', position: 'absolute', left: 0, top: '50%',
        transform: 'translateY(-50%)', width: 4, height: '70%',
        background: '#fff', borderRadius: '0 4px 4px 0',
      },
    }),
  });

  const subMenuSx = (path) => ({
    borderRadius: 1.5, ml: 3, mr: 1, mb: 0.3, py: 0.5,
    background: isActive(path) ? 'rgba(25,118,210,0.3)' : 'transparent',
    '&:hover': { background: 'rgba(255,255,255,0.06)' },
    '& .MuiListItemText-primary': {
      color: isActive(path) ? '#90caf9' : 'rgba(255,255,255,0.65)',
      fontSize: '0.82rem',
      fontWeight: isActive(path) ? 600 : 400,
    },
  });

  const ratingStars = Math.round((merchantInfo?.rating || 0) / 20);
  const drawerWidth = collapsed ? 72 : DRAWER_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          color: '#fff',
          borderRight: 'none',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          boxShadow: '4px 0 20px rgba(0,0,0,0.4)',
        },
      }}
    >
      {/* Logo / Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
        px: collapsed ? 0 : 2, py: 2,
        background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.08)',
        minHeight: 64,
      }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2,
              background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(25,118,210,0.5)',
            }}>
              <StorefrontIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>
                Alia
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                Espace Marchand
              </Typography>
            </Box>
          </Box>
        )}
        <IconButton onClick={onToggle} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeft fontSize="small" />}
        </IconButton>
      </Box>

      {/* Merchant Info */}
      {!collapsed && merchantInfo && (
        <Box sx={{
          mx: 2, my: 1.5, p: 1.5,
          background: 'rgba(255,255,255,0.06)',
          borderRadius: 2,
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Avatar sx={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #1976d2, #9c27b0)',
              fontSize: '1rem', fontWeight: 700,
            }}>
              {(merchantInfo.shop_name || user?.email || 'M')[0].toUpperCase()}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#fff', noWrap: true, fontSize: '0.85rem' }}>
                {merchantInfo.shop_name || 'Ma Boutique'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} sx={{ fontSize: 10, color: i < ratingStars ? '#ffd700' : 'rgba(255,255,255,0.2)' }} />
                ))}
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', ml: 0.3, fontSize: '0.65rem' }}>
                  {((merchantInfo.rating || 0) / 20).toFixed(1)}/5
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
              Ventes totales
            </Typography>
            <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 700, fontSize: '0.75rem' }}>
              {(merchantInfo.total_sales || 0).toLocaleString('fr-FR')} XOF
            </Typography>
          </Box>
        </Box>
      )}

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)', mx: 2 }} />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 1, pb: 1 }}>
        {/* Dashboard */}
        <Tooltip title={collapsed ? 'Dashboard' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navTo('/dashboard/merchant')} sx={menuSx('/dashboard/merchant')}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                <DashboardIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Dashboard" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>

        {/* Produits */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => !collapsed && setProductsOpen(!productsOpen)} sx={menuSx('/dashboard/merchant/products')}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
              <StorefrontIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText primary="Produits" />
                {productsOpen ? <ExpandLess sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={productsOpen && !collapsed} timeout="auto">
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo('/dashboard/merchant/products')} sx={subMenuSx('/dashboard/merchant/products')}>
                <ListItemIcon sx={{ minWidth: 28 }}><ListIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
                <ListItemText primary="Tous les produits" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo('/dashboard/merchant/products/new')} sx={subMenuSx('/dashboard/merchant/products/new')}>
                <ListItemIcon sx={{ minWidth: 28 }}><AddIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
                <ListItemText primary="Ajouter un produit" />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Commandes */}
        <ListItem disablePadding>
          <ListItemButton onClick={() => !collapsed && setOrdersOpen(!ordersOpen)} sx={menuSx('/dashboard/merchant/orders')}>
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
              <OrdersIcon sx={{ fontSize: 20 }} />
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText primary="Commandes" />
                {(pendingCount + toShipCount) > 0 && (
                  <Chip label={pendingCount + toShipCount} size="small" sx={{ bgcolor: '#f44336', color: '#fff', height: 18, fontSize: '0.65rem', fontWeight: 700, mr: 0.5 }} />
                )}
                {ordersOpen ? <ExpandLess sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} /> : <ExpandMore sx={{ fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />}
              </>
            )}
          </ListItemButton>
        </ListItem>
        <Collapse in={ordersOpen && !collapsed} timeout="auto">
          <List disablePadding>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo('/dashboard/merchant/orders')} sx={subMenuSx('/dashboard/merchant/orders')}>
                <ListItemIcon sx={{ minWidth: 28 }}><ListIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
                <ListItemText primary="Toutes les commandes" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo('/dashboard/merchant/orders?status=pending')} sx={subMenuSx('/noop1')}>
                <ListItemIcon sx={{ minWidth: 28 }}><PendingIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
                <ListItemText primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    En attente
                    {pendingCount > 0 && <Chip label={pendingCount} size="small" sx={{ bgcolor: '#ff9800', color: '#fff', height: 16, fontSize: '0.6rem', fontWeight: 700 }} />}
                  </Box>
                } />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navTo('/dashboard/merchant/orders?status=confirmed')} sx={subMenuSx('/noop2')}>
                <ListItemIcon sx={{ minWidth: 28 }}><ShipIcon sx={{ fontSize: 14, color: 'rgba(255,255,255,0.5)' }} /></ListItemIcon>
                <ListItemText primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    À expédier
                    {toShipCount > 0 && <Chip label={toShipCount} size="small" sx={{ bgcolor: '#9c27b0', color: '#fff', height: 16, fontSize: '0.6rem', fontWeight: 700 }} />}
                  </Box>
                } />
              </ListItemButton>
            </ListItem>
          </List>
        </Collapse>

        {/* Statistiques */}
        <Tooltip title={collapsed ? 'Statistiques' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navTo('/dashboard/merchant/stats')} sx={menuSx('/dashboard/merchant/stats')}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                <StatsIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Statistiques" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>

        {/* Alertes */}
        <Tooltip title={collapsed ? 'Alertes' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navTo('/dashboard/merchant/alerts')} sx={menuSx('/dashboard/merchant/alerts')}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                <Badge badgeContent={alertsCount || null} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem' } }}>
                  <AlertsIcon sx={{ fontSize: 20 }} />
                </Badge>
              </ListItemIcon>
              {!collapsed && (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <ListItemText primary="Alertes" />
                  {alertsCount > 0 && (
                    <Chip label={alertsCount} size="small" sx={{ bgcolor: '#f44336', color: '#fff', height: 18, fontSize: '0.65rem', fontWeight: 700 }} />
                  )}
                </Box>
              )}
            </ListItemButton>
          </ListItem>
        </Tooltip>

        {/* Paramètres */}
        <Tooltip title={collapsed ? 'Paramètres' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={() => navTo('/dashboard/merchant/settings')} sx={menuSx('/dashboard/merchant/settings')}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                <SettingsIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Paramètres" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.08)' }} />

      {/* Logout */}
      <List sx={{ pb: 1 }}>
        <Tooltip title={collapsed ? 'Déconnexion' : ''} placement="right">
          <ListItem disablePadding>
            <ListItemButton onClick={logout} sx={{
              borderRadius: 2, mx: 1, mb: 0.5,
              '&:hover': { background: 'rgba(244,67,54,0.15)' },
              '& .MuiListItemIcon-root': { color: 'rgba(255,100,100,0.8)' },
              '& .MuiListItemText-primary': { color: 'rgba(255,100,100,0.8)', fontSize: '0.9rem' },
            }}>
              <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40 }}>
                <LogoutIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Déconnexion" />}
            </ListItemButton>
          </ListItem>
        </Tooltip>
      </List>
    </Drawer>
  );
}
