'use client';

import { useState } from 'react';
import {
  Box, Typography, Alert, TextField, Button, CircularProgress,
  Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  Google as GoogleIcon, Apple as AppleIcon, Phone as PhoneIcon,
  ShoppingBagOutlined as ShoppingIcon, LockOutlined, MailOutline,
  StorefrontOutlined, LocalOfferOutlined,
} from '@mui/icons-material';

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

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Phone modal states
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleGoogleLogin = () => { window.location.href = 'http://localhost:8000/api/auth/google'; };
  const handleAppleLogin  = () => { window.location.href = 'http://localhost:8000/api/auth/apple';  };

  const handleSendCode = async () => {
    if (!phoneNumber) return;
    setPhoneLoading(true);
    try {
      await fetch('http://localhost:8000/api/auth/phone/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      setCodeSent(true);
    } catch { /* ignore */ } finally { setPhoneLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!phoneCode) return;
    setPhoneLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, code: phoneCode }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('authUser', JSON.stringify(data.user || {}));
        window.location.href = data.user?.role === 'merchant' ? '/dashboard/merchant' : '/dashboard/customer';
      }
    } catch { /* ignore */ } finally { setPhoneLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      console.log('⚠️ Champs vides');
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');
    console.log('📝 Tentative de connexion avec:', email);

    try {
      console.log('🔍 Appel API vers localhost:8000...');
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('📊 Réponse - Status:', response.status);
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        const errorMsg = data?.detail || data?.message || 'Erreur de connexion';
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
        email: decodedToken.email || email,
        role: decodedToken.role || 'buyer',
        first_name: decodedToken.first_name || decodedToken.name || 'Utilisateur',
      };

      console.log('👤 Utilisateur construit:', user);

      // Stocker le token et l'utilisateur
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('authUser', JSON.stringify(user));

      console.log('✅ Authentification réussie!');
      console.log('✅ Token:', data.access_token.substring(0, 20) + '...');
      console.log('✅ Utilisateur:', user.email);
      console.log('✅ Rôle:', user.role);

      // Redirection selon le rôle
      if (user.role === 'merchant') {
        window.location.href = '/dashboard/merchant';
      } else if (user.role === 'buyer') {
        window.location.href = '/dashboard/customer';
      } else {
        window.location.href = '/';
      }

    } catch (err) {
      console.error('❌ Erreur:', err.message);
      setError('Erreur de connexion. Vérifiez que le backend est accessible.');
      setLoading(false);
    }
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
        <Box sx={{ position: 'absolute', top: '40%', right: -60, width: 160, height: 160, borderRadius: '50%', bgcolor: 'rgba(201,160,61,0.08)', pointerEvents: 'none' }} />

        <Box sx={{ textAlign: 'center', zIndex: 1, maxWidth: 380 }}>
          {/* Logo text */}
          <Typography sx={{ fontSize: { md: 52, lg: 68 }, fontWeight: 900, color: '#fff', letterSpacing: '-2px', lineHeight: 0.9 }}>
            ALIA
          </Typography>
          <Typography sx={{ fontSize: { md: 13, lg: 15 }, fontWeight: 600, color: 'rgba(255,255,255,0.7)', letterSpacing: '8px', mt: 1, mb: 5 }}>
            E - C O M M E R C E
          </Typography>

          {/* Illustration composée d'icônes */}
          <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto', mb: 5 }}>
            <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingIcon sx={{ fontSize: 88, color: 'rgba(255,255,255,0.85)' }} />
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
            "La meilleure marketplace pour acheteurs et marchands"
          </Typography>

          {/* Boutons sociaux */}
          <Stack direction="row" spacing={2} justifyContent="center">
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
            <Button
              onClick={() => setPhoneOpen(true)}
              sx={{
                minWidth: 0, bgcolor: 'rgba(255,255,255,0.12)', color: '#fff',
                borderRadius: '10px', px: 1.8, py: 1.1,
                border: '1px solid rgba(255,255,255,0.2)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              <PhoneIcon sx={{ fontSize: 20 }} />
            </Button>
          </Stack>

          {/* Stats decoratives */}
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', mt: 5 }}>
            {[['10K+', 'Acheteurs'], ['2K+', 'Marchands'], ['50K+', 'Produits']].map(([n, l]) => (
              <Box key={l} sx={{ textAlign: 'center' }}>
                <Typography sx={{ color: '#c9a03d', fontWeight: 800, fontSize: '1.3rem' }}>{n}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', mt: 0.2 }}>{l}</Typography>
              </Box>
            ))}
          </Box>
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
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <Box sx={{ mb: 4 }}>
            {/* Mobile only brand */}
            <Typography sx={{ display: { xs: 'block', md: 'none' }, fontWeight: 900, fontSize: 28, color: '#1565c0', mb: 0.5, letterSpacing: '-1px' }}>
              ALIA
            </Typography>
            <Typography sx={{ fontSize: { xs: 28, sm: 36 }, fontWeight: 800, color: '#1a2a4f', letterSpacing: '-0.5px', lineHeight: 1 }}>
              WELCOME
            </Typography>
            <Box sx={{ width: 32, height: 3, background: 'linear-gradient(90deg, #c9a03d, rgba(201,160,61,0.15))', borderRadius: 2, mt: 1.5, mb: 1.5 }} />
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.88rem' }}>
              Login to your account to continue
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.85rem' }}>
              {error}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              required
              fullWidth
              InputProps={{ startAdornment: <MailOutline sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} /> }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', bgcolor: '#fff', height: 52,
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                  '&:hover fieldset': { borderColor: '#c9a03d' },
                  '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#c9a03d' },
              }}
            />
            <TextField
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
              required
              fullWidth
              InputProps={{
                startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
                endAdornment: (
                  <Typography
                    component="span"
                    onClick={() => setShowPass(v => !v)}
                    sx={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, '&:hover': { color: '#c9a03d' } }}
                  >
                    {showPass ? 'Masquer' : 'Voir'}
                  </Typography>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px', bgcolor: '#fff', height: 52,
                  '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
                  '&:hover fieldset': { borderColor: '#c9a03d' },
                  '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#c9a03d' },
              }}
            />

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
              {loading ? <CircularProgress size={22} sx={{ color: '#94a3b8' }} /> : 'Log In'}
            </Button>
          </Box>

          <Divider sx={{ my: 3, '& .MuiDivider-wrapper': { px: 1.5 } }}>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.5px' }}>OU</Typography>
          </Divider>

          {/* Social — toujours visible */}
          <Stack direction="row" spacing={1.5} sx={{ mb: 3.5 }}>
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
            <Button
              onClick={() => setPhoneOpen(true)}
              sx={{
                minWidth: 48, borderRadius: '12px', height: 46, border: '1.5px solid #e2e8f0',
                bgcolor: '#fff', color: '#4caf50',
                '&:hover': { borderColor: '#4caf50', bgcolor: '#f0faf0' },
              }}
            >
              <PhoneIcon sx={{ fontSize: 20 }} />
            </Button>
          </Stack>

          <Typography variant="body2" sx={{ textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
            {"Don't have an account? "}
            <Box component="a" href="/register" sx={{ color: '#c9a03d', fontWeight: 700, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign up
            </Box>
          </Typography>

          {/* Brand mark mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'center', gap: 1.5, mt: 4, opacity: 0.35 }}>
            <Typography sx={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '3px', fontWeight: 700 }}>B L U E B A C K</Typography>
            <Box sx={{ width: 20, height: 1, bgcolor: '#c9a03d' }} />
            <Typography sx={{ fontFamily: 'monospace', fontSize: '7px', letterSpacing: '3px', color: '#c9a03d', fontWeight: 700 }}>S H U T T E R S</Typography>
          </Box>
        </Box>
      </Box>

      {/* ── MODAL TÉLÉPHONE ── */}
      <Dialog
        open={phoneOpen}
        onClose={() => { setPhoneOpen(false); setCodeSent(false); setPhoneNumber(''); setPhoneCode(''); }}
        PaperProps={{ sx: { borderRadius: '20px', p: 1, minWidth: 340 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: '#1a2a4f', pb: 0.5 }}>
          {codeSent ? 'Entrez le code reçu' : 'Connexion par téléphone'}
        </DialogTitle>
        <DialogContent>
          {!codeSent ? (
            <TextField
              label="Numéro de téléphone"
              fullWidth
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              placeholder="+221 7X XXX XX XX"
              sx={{ mt: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            />
          ) : (
            <>
              <Typography variant="body2" sx={{ color: '#64748b', mt: 1.5, mb: 0.5 }}>
                Code envoyé au {phoneNumber}
              </Typography>
              <TextField
                label="Code de validation"
                fullWidth
                value={phoneCode}
                onChange={e => setPhoneCode(e.target.value)}
                inputProps={{ maxLength: 6 }}
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => { setPhoneOpen(false); setCodeSent(false); setPhoneNumber(''); setPhoneCode(''); }} sx={{ borderRadius: '10px', textTransform: 'none', color: '#64748b' }}>
            Annuler
          </Button>
          <Button
            onClick={!codeSent ? handleSendCode : handleVerifyCode}
            disabled={phoneLoading || (!codeSent ? !phoneNumber : !phoneCode)}
            variant="contained"
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#1a2a4f', '&:hover': { bgcolor: '#c9a03d' }, px: 3 }}
          >
            {phoneLoading
              ? <CircularProgress size={18} sx={{ color: '#fff' }} />
              : !codeSent ? 'Envoyer le code' : 'Valider'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
