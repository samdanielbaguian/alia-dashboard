/**
 * Material UI Theme Configuration
 * Defines the custom theme for the merchant dashboard
 * Bagisto-inspired: White background, black sidebar, blue accents
 */

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue accent
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#f50057',
      dark: '#c51162',
    },
    background: {
      default: '#ffffff', // White background for content
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#666666',
    },
    sidebar: {
      background: '#000000', // Black sidebar
      text: '#ffffff', // White text in sidebar
      active: '#1976d2', // Blue for active items
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000', // Black sidebar
          color: '#ffffff',
        },
      },
    },
  },
});

export default theme;
