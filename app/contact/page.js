'use client';

import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTheme } from '@/context/ThemeContext';

export default function ContactPage() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Validation email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validation du formulaire
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est requis';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Le message doit contenir au moins 10 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion de la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      setLoading(false);
      setSnackbar({
        open: true,
        message: 'Merci ! Nous vous répondrons dans les meilleurs délais.',
        severity: 'success',
      });
      setFormData({
        name: '',
        email: '',
        subject: 'general',
        message: '',
      });
      setErrors({});
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: isDarkMode ? '#0d0d1a' : '#f8f9fa' }}>
      <Header />
      <Box sx={{ flex: 1 }}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            mb: 2,
            background: 'linear-gradient(135deg, #1565c0, #4ecdc4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Contactez-nous
        </Typography>
        <Typography
          variant="h5"
          sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}
        >
          Une question ? Une suggestion ? Nous sommes à votre écoute.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Colonne gauche - Formulaire */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Envoyez-nous un message
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nom complet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                placeholder="Jean Dupont"
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                placeholder="vous@example.com"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Sujet</InputLabel>
                <Select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  label="Sujet"
                >
                  <MenuItem value="general">Question générale</MenuItem>
                  <MenuItem value="order">Problème avec une commande</MenuItem>
                  <MenuItem value="merchant">Devenir marchand</MenuItem>
                  <MenuItem value="other">Autre</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                error={!!errors.message}
                helperText={errors.message}
                margin="normal"
                multiline
                rows={5}
                placeholder="Écrivez votre message ici..."
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ mt: 3, bgcolor: '#4ecdc4', color: '#fff', '&:hover': { bgcolor: '#3daea4' } }}
                startIcon={<SendIcon />}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Colonne droite - Coordonnées */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Nous contacter
            </Typography>

            {/* Email */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
              <EmailIcon sx={{ fontSize: 24, color: '#4ecdc4', mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  support@alia.com
                </Typography>
              </Box>
            </Box>

            {/* Téléphone */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
              <PhoneIcon sx={{ fontSize: 24, color: '#4ecdc4', mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Téléphone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  +221 77 123 45 67
                </Typography>
              </Box>
            </Box>

            {/* Adresse */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ fontSize: 24, color: '#4ecdc4', mt: 0.5, flexShrink: 0 }} />
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Adresse
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Dakar, Sénégal
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              <strong>Horaires de support:</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Lun - Ven: 08h - 18h
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sam: 09h - 14h
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
      </Box>
      <Footer />
    </Box>
  );
}
