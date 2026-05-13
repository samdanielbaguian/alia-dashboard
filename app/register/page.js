'use client';

import { useState } from 'react';
import { Box, Typography, Alert, FormControl, InputLabel, Select, MenuItem, Button, CircularProgress, TextField, Divider, Stack } from '@mui/material';
import { MailOutline, LockOutlined, PersonOutline, ShoppingBag, Store, ShoppingBagOutlined, StorefrontOutlined, LocalOfferOutlined, Google as GoogleIcon, Apple as AppleIcon } from '@mui/icons-material';

// Fonction pour décoder le JWT
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('❌ Erreur lors du décodage JWT:', err);
    return null;
  }
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    shop_name: '',
    age: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleGoogleLogin = () => { window.location.href = 'http://localhost:8000/api/auth/google'; };
  const handleAppleLogin  = () => { window.location.href = 'http://localhost:8000/api/auth/apple'; };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🎯 Formulaire d\'inscription soumis!');
    
    if (!formData.email || !formData.password || !formData.firstName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.role === 'merchant' && !formData.shop_name.trim()) {
      setError('Le nom de la boutique est obligatoire pour les marchands');
      return;
    }

    if (formData.age && formData.age !== '') {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        setError("L'âge doit être compris entre 18 et 120 ans");
        return;
      }
    }

    setLoading(true);
    setError('');
    console.log('📝 Tentative d\'inscription...');

    try {
      console.log('🔍 Appel API vers localhost:8000...');
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify((() => {
          const body = {
            email: formData.email,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: formData.role,
          };
          if (formData.age && formData.age !== '') body.age = parseInt(formData.age);
          if (formData.role === 'merchant') body.shop_name = formData.shop_name.trim();
          return body;
        })()),
      });

      console.log('📊 Réponse - Status:', response.status);
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        const errorMsg = data?.detail || data?.message || "Erreur d'inscription";
        console.error('❌ Erreur API:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Vérifier que le token existe
      if (!data.access_token) {
        const errorMsg = 'Token absent dans la réponse';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Décoder le JWT pour extraire les informations utilisateur
      const decodedToken = decodeJWT(data.access_token);
      console.log('🔐 Payload du JWT décodé:', decodedToken);

      if (!decodedToken) {
        const errorMsg = 'Impossible de décoder le token';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      // Créer un objet utilisateur à partir du token
      const user = {
        id: decodedToken.sub,
        email: decodedToken.email || formData.email,
        role: decodedToken.role || 'buyer',
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      console.log('👤 Utilisateur construit:', user);

      // Stocker le token et l'utilisateur
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('authUser', JSON.stringify(user));

      console.log('✅ Inscription réussie!');
      console.log('✅ Token:', data.access_token.substring(0, 20) + '...');
      console.log('✅ Utilisateur:', user.email, '| Rôle:', user.role);

      // Redirection selon le rôle
      if (user.role === 'merchant') {
        window.location.href = '/dashboard/merchant';
      } else {
        window.location.href = '/dashboard/customer';
      }

    } catch (err) {
      console.error('❌ Erreur:', err.message);
      setError('Erreur d\'inscription. Vérifiez que le backend est accessible.');
      setLoading(false);
    }
  };

  // Styles communs pour les TextField
  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px', bgcolor: '#fff',
      '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
      '&:hover fieldset': { borderColor: '#c9a03d' },
      '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#c9a03d' },
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>

      {/* ── GAUCHE : BRANDING ── */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(145deg, #1565c0 0%, #0d47a1 55%, #0a2e6e 100%)',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 5,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Cercles décoratifs */}
        <Box sx={{ position: 'absolute', top: -120, right: -120, width: 380, height: 380, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -80, left: -80, width: 280, height: 280, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: '30%', right: -40, width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(201,160,61,0.09)', pointerEvents: 'none' }} />

        <Box sx={{ textAlign: 'center', zIndex: 1, maxWidth: 380 }}>
          {/* Logo text */}
          <Typography sx={{ fontSize: { md: 52, lg: 68 }, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 0.9 }}>
            ALIA
          </Typography>
          <Typography sx={{ fontSize: { md: 13, lg: 15 }, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '8px', mt: 1, mb: 5 }}>
            E - C O M M E R C E
          </Typography>

          {/* Illustration */}
          <Box sx={{ position: 'relative', width: 160, height: 160, mx: 'auto', mb: 5 }}>
            <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBagOutlined sx={{ fontSize: 76, color: 'rgba(255,255,255,0.85)' }} />
            </Box>
            <Box sx={{ position: 'absolute', top: 8, right: -8, bgcolor: 'rgba(201,160,61,0.9)', borderRadius: '50%', p: 0.8 }}>
              <LocalOfferOutlined sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Box sx={{ position: 'absolute', bottom: 12, left: -10, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', p: 0.8 }}>
              <StorefrontOutlined sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
          </Box>

          {/* Tagline */}
          <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem', lineHeight: 1.7, mb: 5, fontStyle: 'italic' }}>
            "Rejoignez notre communauté de marchands et d'acheteurs"
          </Typography>

          {/* Feature bullets */}
          {[
            { icon: <ShoppingBagOutlined sx={{ fontSize: 18 }} />, text: 'Achetez parmi des milliers de produits' },
            { icon: <StorefrontOutlined sx={{ fontSize: 18 }} />, text: 'Créez votre boutique en quelques clics' },
            { icon: <LocalOfferOutlined sx={{ fontSize: 18 }} />, text: 'Profitez des meilleures offres du marché' },
          ].map(({ icon, text }) => (
            <Box key={text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, textAlign: 'left' }}>
              <Box sx={{ minWidth: 34, height: 34, borderRadius: '50%', bgcolor: 'rgba(201,160,61,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a03d' }}>
                {icon}
              </Box>
              <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.88rem', lineHeight: 1.4 }}>
                {text}
              </Typography>
            </Box>
          ))}

          {/* Boutons sociaux */}
          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Button
              onClick={handleGoogleLogin}
              startIcon={<GoogleIcon sx={{ fontSize: '18px !important' }} />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.95)', color: '#3c4043', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.82rem', px: 2.5, py: 1.1, textTransform: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
                '&:hover': { bgcolor: '#fff', boxShadow: '0 4px 18px rgba(0,0,0,0.25)' },
              }}
            >
              Google
            </Button>
            <Button
              onClick={handleAppleLogin}
              startIcon={<AppleIcon sx={{ fontSize: '20px !important' }} />}
              sx={{
                bgcolor: 'rgba(0,0,0,0.75)', color: '#fff', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.82rem', px: 2.5, py: 1.1, textTransform: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.9)' },
              }}
            >
              Apple
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* ── DROITE : FORMULAIRE ── */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 3, md: 5 },
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 440, py: 4 }}>

          {/* Header */}
          <Box sx={{ mb: 3.5 }}>
          {/* Mobile brand */}
          <Typography sx={{ display: { xs: 'block', md: 'none' }, fontWeight: 900, fontSize: 24, color: '#1565c0', mb: 0.5, letterSpacing: '-1px' }}>
            ALIA
          </Typography>
          <Typography sx={{ fontSize: { xs: 26, sm: 34 }, fontWeight: 800, color: '#1a2a4f', letterSpacing: '-0.5px', lineHeight: 1 }}>
            SIGN UP
          </Typography>
          <Box sx={{ width: 32, height: 3, background: 'linear-gradient(90deg, #c9a03d, rgba(201,160,61,0.15))', borderRadius: 2, mt: 1.5, mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.88rem' }}>
            Create your account to get started
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Prénom + Nom */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Prénom *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={loading}
              autoComplete="given-name"
              fullWidth
              InputProps={{ startAdornment: <PersonOutline sx={{ fontSize: 17, color: '#94a3b8', mr: 0.8 }} /> }}
              sx={fieldSx}
            />
            <TextField
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={loading}
              autoComplete="family-name"
              fullWidth
              sx={fieldSx}
            />
          </Box>

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            autoComplete="email"
            required
            fullWidth
            InputProps={{ startAdornment: <MailOutline sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} /> }}
            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 } }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type={showPass ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            required
            fullWidth
            InputProps={{
              startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
              endAdornment: (
                <Typography component="span" onClick={() => setShowPass(v => !v)}
                  sx={{ fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, whiteSpace: 'nowrap', '&:hover': { color: '#c9a03d' } }}>
                  {showPass ? 'Masquer' : 'Voir'}
                </Typography>
              ),
            }}
            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 } }}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            type={showConfirmPass ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading}
            autoComplete="new-password"
            required
            fullWidth
            error={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
            helperText={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
            InputProps={{
              startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
              endAdornment: (
                <Typography component="span" onClick={() => setShowConfirmPass(v => !v)}
                  sx={{ fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, whiteSpace: 'nowrap', '&:hover': { color: '#c9a03d' } }}>
                  {showConfirmPass ? 'Masquer' : 'Voir'}
                </Typography>
              ),
            }}
            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 } }}
          />

          {/* Champ shop_name conditionnel */}
          {formData.role === 'merchant' && (
            <TextField
              label="Nom de la boutique *"
              name="shop_name"
              value={formData.shop_name}
              onChange={handleChange}
              disabled={loading}
              required
              fullWidth
              helperText="Nom public de votre boutique sur Alia"
              InputProps={{ startAdornment: <StorefrontOutlined sx={{ fontSize: 18, color: '#c9a03d', mr: 1 }} /> }}
              sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 } }}
            />
          )}

          {/* Âge optionnel */}
          <TextField
            label="Âge (optionnel)"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            disabled={loading}
            fullWidth
            helperText="18 ans minimum requis"
            inputProps={{ min: 18, max: 120 }}
            sx={{ ...fieldSx, '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 } }}
          />

          {/* Rôle */}
          <FormControl
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px', bgcolor: '#fff',
                '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                '&:hover fieldset': { borderColor: '#c9a03d' },
                '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
              },
              '& .MuiInputLabel-root': { color: '#94a3b8', '&.Mui-focused': { color: '#c9a03d' } },
            }}
          >
            <InputLabel id="role-label">Je suis</InputLabel>
            <Select
              labelId="role-label"
              value={formData.role}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              label="Je suis"
              disabled={loading}
            >
              <MenuItem value="buyer">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ShoppingBag sx={{ fontSize: 18, color: '#1a2a4f' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>Acheteur</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Je veux acheter des produits</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem value="merchant">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Store sx={{ fontSize: 18, color: '#c9a03d' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b', lineHeight: 1.2 }}>Marchand</Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>Je veux vendre mes produits</Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              height: 52, borderRadius: '12px', mt: 0.5,
              background: 'linear-gradient(135deg, #1a2a4f 0%, #243b6e 100%)',
              color: '#fff', fontWeight: 700, letterSpacing: '1.5px', fontSize: '0.82rem',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(26,42,79,0.35)',
              transition: 'all 0.3s',
              '&:hover': { background: 'linear-gradient(135deg, #c9a03d 0%, #d4af55 100%)', boxShadow: '0 6px 22px rgba(201,160,61,0.45)', transform: 'translateY(-1.5px)' },
              '&:active': { transform: 'translateY(0)' },
              '&.Mui-disabled': { background: '#e2e8f0', color: '#94a3b8', boxShadow: 'none', transform: 'none' },
            }}
          >
            {loading ? <CircularProgress size={22} sx={{ color: '#94a3b8' }} /> : 'Sign Up'}
          </Button>
        </Box>

        <Divider sx={{ my: 3, '& .MuiDivider-wrapper': { px: 1.5 } }}>
          <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>OU</Typography>
        </Divider>

        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
          <Button
            fullWidth onClick={handleGoogleLogin}
            startIcon={<GoogleIcon sx={{ fontSize: '18px !important' }} />}
            sx={{
              borderRadius: '12px', height: 46, border: '1.5px solid #e2e8f0', bgcolor: '#fff',
              color: '#3c4043', fontWeight: 600, fontSize: '0.82rem', textTransform: 'none',
              '&:hover': { borderColor: '#c9a03d', bgcolor: '#fffdf5' },
            }}
          >
            Google
          </Button>
          <Button
            fullWidth onClick={handleAppleLogin}
            startIcon={<AppleIcon sx={{ fontSize: '20px !important' }} />}
            sx={{
              borderRadius: '12px', height: 46, border: '1.5px solid #e2e8f0', bgcolor: '#fff',
              color: '#1e293b', fontWeight: 600, fontSize: '0.82rem', textTransform: 'none',
              '&:hover': { borderColor: '#1e293b', bgcolor: '#f8fafc' },
            }}
          >
            Apple
          </Button>
        </Stack>

        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#64748b', fontSize: '0.88rem' }}>
          {'Already have an account? '}
          <Box component="a" href="/login" sx={{ color: '#c9a03d', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
            Sign in
          </Box>
        </Typography>

        {/* Brand mark mobile */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 3, opacity: 0.35 }}>
          <Typography sx={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '3px', fontWeight: 700 }}>B L U E B A C K</Typography>
          <Box sx={{ width: 20, height: 1, bgcolor: '#c9a03d' }} />
          <Typography sx={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '3px', color: '#c9a03d', fontWeight: 700 }}>S H U T T E R S</Typography>
        </Box>
        </Box>
      </Box>
    </Box>
  );
}
