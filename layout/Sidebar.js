'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingBag as OrdersIcon,
  Person as ProfileIcon,
  Favorite as WishlistIcon,
  Store as ProductsIcon,
  People as CustomersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

const drawerWidth = 280;

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isBuyer, isMerchant, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getMenuItems = () => {
    if (isBuyer) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/customer' },
        { text: 'Mes commandes', icon: <OrdersIcon />, path: '/dashboard/customer/orders' },
        { text: 'Ma wishlist', icon: <WishlistIcon />, path: '/dashboard/customer/wishlist' },
        { text: 'Mon profil', icon: <ProfileIcon />, path: '/dashboard/customer/profile' },
      ];
    }
    
    if (isMerchant) {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard/merchant' },
        { text: 'Commandes', icon: <OrdersIcon />, path: '/dashboard/merchant/orders' },
        { text: 'Produits', icon: <ProductsIcon />, path: '/dashboard/merchant/products' },
        { text: 'Clients', icon: <CustomersIcon />, path: '/dashboard/merchant/customers' },
        { text: 'Paramètres', icon: <SettingsIcon />, path: '/dashboard/merchant/settings' },
      ];
    }
    
    return [];
  };

  const menuItems = getMenuItems();

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1a1a2e',
          color: '#ffffff',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DashboardIcon sx={{ color: '#1976d2', fontSize: 32, mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Alia
          </Typography>
        </Box>
      </Toolbar>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
          {isBuyer ? 'Espace Acheteur' : isMerchant ? 'Espace Marchand' : 'Menu'}
        </Typography>
      </Box>
      
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mx: 1,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '& .MuiListItemText-primary': { color: '#fff' },
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.7)' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.8)' } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            onClick={handleLogout} 
            sx={{ 
              mx: 1, 
              borderRadius: 2,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.7)' }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Déconnexion" 
              sx={{ '& .MuiListItemText-primary': { color: 'rgba(255,255,255,0.8)' } }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
