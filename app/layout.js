'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getTheme } from '@/styles/theme';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import '@/styles/global.css';
import { useEffect, useState } from 'react';

// Nettoyage du localStorage au chargement
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('authUser');
  
  if (user === 'undefined' || user === 'null') {
    localStorage.removeItem('authUser');
  }
  if (token === 'undefined' || token === 'null') {
    localStorage.removeItem('authToken');
  }
}

function LayoutContent({ children }) {
  const { isDarkMode, mounted } = useTheme();
  const [theme, setTheme] = useState(getTheme('light'));

  useEffect(() => {
    if (mounted) {
      setTheme(getTheme(isDarkMode ? 'dark' : 'light'));
    }
  }, [isDarkMode, mounted]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" type="image/png" href="/icons/icons.png" />
        <link rel="shortcut icon" type="image/png" href="/icons/icons.png" />
        <link rel="apple-touch-icon" href="/icons/icons.png" />
      </head>
      <body>
        <ThemeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ThemeProvider>
      </body>
    </html>
  );
}
