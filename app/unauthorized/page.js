'use client';

import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
        <Typography variant="h1" sx={{ fontSize: '6rem', color: 'error.main', mb: 2 }}>
          403
        </Typography>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Accès non autorisé
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => router.push('/')}>
            Retour à l'accueil
          </Button>
          <Button variant="outlined" onClick={() => router.push('/login')}>
            Se connecter
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
