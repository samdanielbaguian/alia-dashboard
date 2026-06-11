import { createTheme } from '@mui/material/styles';

export const getTheme = (mode = 'light') => {
  const isLight = mode === 'light';

  return createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
      },
      secondary: {
        main: '#dc004e',
        light: '#f50057',
        dark: '#c51162',
      },
      background: {
        default: isLight ? '#ffffff' : '#121212',
        paper: isLight ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: isLight ? '#000000' : '#ffffff',
        secondary: isLight ? '#666666' : '#b0b0b0',
      },
      sidebar: {
        background: isLight ? '#000000' : '#0a0a0a',
        text: '#ffffff',
        active: '#1976d2',
      },
      divider: isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.12)',
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
            boxShadow: isLight 
              ? '0 2px 4px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
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
            backgroundColor: isLight ? '#000000' : '#0a0a0a',
            color: '#ffffff',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: isLight ? '#ffffff' : '#1e1e1e',
            color: isLight ? '#000000' : '#ffffff',
            boxShadow: isLight 
              ? '0 2px 4px rgba(0,0,0,0.1)' 
              : '0 2px 8px rgba(0,0,0,0.3)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isLight ? 'transparent' : 'rgba(255,255,255,0.05)',
            },
          },
        },
      },
    },
  });
};

const theme = getTheme('light');
export default theme;
