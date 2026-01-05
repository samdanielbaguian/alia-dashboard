/**
 * Header Component
 * Elegant top navigation bar for the merchant dashboard
 * White background with blue accents
 */

'use client';

import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Box,
  Avatar,
  Badge 
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

export default function Header() {
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
          Merchant Dashboard
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Notifications */}
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
          
          {/* Settings */}
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
          
          {/* User Avatar - Placeholder */}
          <Box 
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
              M
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Merchant
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
