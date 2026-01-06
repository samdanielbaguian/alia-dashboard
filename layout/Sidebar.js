/**
 * Sidebar Component
 * Black navigation sidebar for the merchant dashboard
 * Bagisto-inspired design with blue active states
 */

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Box,
  Typography,
  Divider 
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Store as SellersIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import Link from 'next/link';
import { DRAWER_WIDTH } from './constants';

const menuItems = [
  { text: 'Dashboard', icon: TrendingUpIcon, path: '/dashboard/overview' },
  { text: 'Products', icon: ProductsIcon, path: '/dashboard/products' },
  { text: 'Orders', icon: OrdersIcon, path: '/dashboard/orders' },
  { text: 'Customers', icon: CustomersIcon, path: '/dashboard/customers' },
  { text: 'Sellers', icon: SellersIcon, path: '/dashboard/sellers' },
  { text: 'Reports', icon: ReportsIcon, path: '/dashboard/reports' },
  { text: 'Settings', icon: SettingsIcon, path: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo/Brand Area */}
      <Box 
        sx={{ 
          p: 2, 
          mt: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <DashboardIcon sx={{ color: '#1976d2', fontSize: 32, mr: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#ffffff' }}>
          Alia
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      
      {/* Navigation Menu */}
      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            const IconComponent = item.icon;
            
            return (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  sx={{
                    py: 1.5,
                    px: 2,
                    backgroundColor: isActive ? 'rgba(25, 118, 210, 0.15)' : 'transparent',
                    borderRight: isActive ? '3px solid #1976d2' : 'none',
                    '&:hover': {
                      backgroundColor: isActive 
                        ? 'rgba(25, 118, 210, 0.25)' 
                        : 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <IconComponent 
                      sx={{ 
                        color: isActive ? '#1976d2' : '#ffffff',
                        fontSize: 24,
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      sx: {
                        color: isActive ? '#1976d2' : '#ffffff',
                        fontWeight: isActive ? 600 : 400,
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
