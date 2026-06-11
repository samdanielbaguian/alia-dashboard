'use client';

import { useState } from 'react';
import { Container, Button, Typography, Box, Paper, Alert, TextField, CircularProgress } from '@mui/material';

export default function TestAPIPage() {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const [email, setEmail] = useState('acheteur@alia.com');
  const [password, setPassword] = useState('qwerty123');

  const testAPI = async () => {
    setLoading(true);
    setStatus('');
    setApiResponse('');
    
    try {
      setStatus('⏳ Tentative de connexion...');
      console.log('🔍 Appel API vers localhost:8000...');
      
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      setStatus('📊 Réponse reçue');
      
      const data = await response.json();
      console.log('📦 Réponse complète:', data);

      setApiResponse(JSON.stringify(data, null, 2));

      if (response.ok) {
        setStatus('✅ Connexion réussie!');
        console.log('✅ Token:', data.access_token);
        console.log('✅ Utilisateur:', data.user);
      } else {
        setStatus('❌ Erreur: ' + (data.detail || response.statusText));
      }
    } catch (err) {
      console.error('❌ Erreur complète:', err);
      setStatus('❌ Erreur: ' + err.message);
      setApiResponse('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const testBackendAvailability = async () => {
    setLoading(true);
    setStatus('');
    setApiResponse('');

    try {
      setStatus('🔍 Test de disponibilité du backend...');
      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
      });

      if (response.ok) {
        setStatus('✅ Backend disponible (port 8000 actif)');
        const data = await response.json();
        setApiResponse('✅ Réponse reçue:\n' + JSON.stringify(data, null, 2).substring(0, 500) + '...');
      } else {
        setStatus('❌ Backend répond avec erreur: ' + response.status);
        setApiResponse('Status: ' + response.statusText);
      }
    } catch (err) {
      setStatus('❌ Backend indisponible: ' + err.message);
      setApiResponse('Assurez-vous que le backend FastAPI est en train de tourner sur le port 8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>🔧 Diagnostic API</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Button variant="contained" onClick={testBackendAvailability} disabled={loading} sx={{ mr: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Tester la disponibilité du backend'}
        </Button>

        {status && (
          <Alert severity={status.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {status}
          </Alert>
        )}

        {apiResponse && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, maxHeight: 300, overflow: 'auto' }}>
            <pre style={{ fontSize: '12px' }}>{apiResponse}</pre>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>🔐 Tester la connexion</Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loading}
        />

        <Button variant="contained" onClick={testAPI} disabled={loading} sx={{ mt: 2, mr: 2 }}>
          {loading ? <CircularProgress size={24} /> : 'Tester la connexion'}
        </Button>

        {status && (
          <Alert severity={status.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
            {status}
          </Alert>
        )}

        {apiResponse && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, maxHeight: 400, overflow: 'auto' }}>
            <pre style={{ fontSize: '12px' }}>{apiResponse}</pre>
          </Box>
        )}

        <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
          💡 Ouvrez la console du navigateur (F12) pour voir tous les logs détaillés.
        </Typography>
      </Paper>
    </Container>
  );
}
