'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Avatar,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { getAuthUser, removeAuthToken } from '@/utils/api';
import { formatUserName, getUserInitials } from '@/utils/nameFormatter';

export default function Header() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const user = getAuthUser();
  const userInitial = getUserInitials(user);
  const displayName = formatUserName(user);

  useEffect(() => {
    try {
      setUserRole(user?.role || user?.type || 'user');
    } catch (err) {
      console.error('Failed to get user role:', err);
    }
  }, [user]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeAuthToken();
    handleMenuClose();
    router.push('/login');
  };

  const pageTitle = userRole === 'merchant' 
    ? 'Merchant Dashboard' 
    : userRole === 'customer'
    ? 'Customer Dashboard'
    : 'Dashboard';

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#ffffff',
        color: '#000000',
        boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
      }}
    >
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 600,
            color: '#000000',
          }}
        >
          {pageTitle}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit"
            sx={{
              color: '#000000',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: '#1976d2',
              }
            }}
          >
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          
          <IconButton 
            color="inherit"
            sx={{
              color: '#000000',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                color: '#1976d2',
              }
            }}
          >
            <SettingsIcon />
          </IconButton>
          
          <Box 
            onClick={handleMenuOpen}
            sx={{ 
              ml: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              padding: '4px 12px',
              borderRadius: '20px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }}
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                backgroundColor: '#1976d2',
                fontSize: '0.875rem',
              }}
            >
              {userInitial}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {user?.role || 'Merchant'}
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                {displayName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
