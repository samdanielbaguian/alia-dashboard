"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container, Paper, Typography, TextField, Button } from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import { apiPost, apiGet } from '../utils/api';

/**
 * Index Page - Login/Home
 * Entry point for the merchant dashboard
 */
export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await apiPost('/auth/login', { email, password });
      if (res && res.access_token) {
        localStorage.setItem('access_token', res.access_token);
        
        // Fetch user profile to get role and other info
        try {
          const userRes = await apiGet('/auth/me');
          if (userRes) {
            localStorage.setItem('user', JSON.stringify({
              id: userRes.id,
              email: userRes.email,
              role: userRes.role,
              age: userRes.age,
              preferences: userRes.preferences,
              good_rate: userRes.good_rate,
            }));
          }
        } catch (err) {
          console.warn('Could not fetch user profile, but login succeeded', err);
          // Still redirect even if profile fetch fails
        }
        
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

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
          
          <Box component="form" sx={{ width: '100%' }} onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
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
