'use client';

import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';

/**
 * Index Page - Login/Home
 * Entry point for the merchant dashboard
 */
export default function Home() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              padding: 2,
              mb: 2,
            }}
          >
            <LockIcon sx={{ color: 'white', fontSize: 30 }} />
          </Box>
          
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Alia Merchant Dashboard
          </Typography>
          
          <Box component="form" sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              href="/dashboard"
            >
              Sign In
            </Button>
          </Box>
        </Paper>
        
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Welcome to the Alia Merchant Dashboard
        </Typography>
      </Box>
    </Container>
  );
}
