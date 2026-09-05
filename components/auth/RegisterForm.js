'use client';

import {
  Box, Typography, Alert, Button, CircularProgress, TextField, Divider, Stack,
} from '@mui/material';
import {
  MailOutline, LockOutlined, PersonOutline,
  Google as GoogleIcon, Apple as AppleIcon, StorefrontOutlined,
} from '@mui/icons-material';
import Image from 'next/image';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', bgcolor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#c9a03d' },
    '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c9a03d' },
};

const fieldSxH52 = {
  ...fieldSx,
  '& .MuiOutlinedInput-root': { ...fieldSx['& .MuiOutlinedInput-root'], height: 52 },
};

export default function RegisterForm({
  formData,
  loading,
  error,
  showPass,
  showConfirmPass,
  onChange,
  onSubmit,
  onToggleShowPass,
  onToggleShowConfirmPass,
  onGoogleLogin,
  onAppleLogin,
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
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
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}>
            <Image
              src="/logos/logos.png"
              alt="Alia"
              width={100}
              height={35}
              style={{ objectFit: 'contain', maxWidth: '100%', width: 'auto', height: 'auto' }}
              priority
            />
          </Box>
          <Typography sx={{ fontSize: { xs: 26, sm: 34 }, fontWeight: 800, color: '#1a2a4f', letterSpacing: '-0.5px', lineHeight: 1 }}>
            INSCRIVEZ VOUS.
          </Typography>
          <Box sx={{ width: 32, height: 3, background: 'linear-gradient(90deg, #c9a03d, rgba(201,160,61,0.15))', borderRadius: 2, mt: 1.5, mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.88rem' }}>
            Créez votre compte — rapide, simple, sécurisé.
          </Typography>
        </Box>

        {/* Message marchand 
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 2.5, p: 2, borderRadius: '12px', bgcolor: '#fffbeb', border: '1.5px solid #f59e0b' }}>
          <StorefrontOutlined sx={{ fontSize: 20, color: '#b45309', mt: 0.2, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: '#92400e', fontSize: '0.82rem', lineHeight: 1.5 }}>
            Pour devenir marchand, contactez l\'administrateur à{' '}
            <Box component="a" href="mailto:admin@alia.com" sx={{ fontWeight: 700, color: '#b45309', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              admin@alia.com
            </Box>
            .
          </Typography>
        </Box>*/}

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: '12px', fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Prénom + Nom */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Prénom *"
              name="firstName"
              value={formData.firstName}
              onChange={onChange}
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
              onChange={onChange}
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
            onChange={onChange}
            disabled={loading}
            autoComplete="email"
            required
            fullWidth
            InputProps={{ startAdornment: <MailOutline sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} /> }}
            sx={fieldSxH52}
          />

          {/* Password */}
          <TextField
            label="Password"
            type={showPass ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onChange}
            disabled={loading}
            autoComplete="new-password"
            required
            fullWidth
            InputProps={{
              startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
              endAdornment: (
                <Typography component="span" onClick={onToggleShowPass}
                  sx={{ fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, whiteSpace: 'nowrap', '&:hover': { color: '#c9a03d' } }}>
                  {showPass ? 'Masquer' : 'Voir'}
                </Typography>
              ),
            }}
            sx={fieldSxH52}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            type={showConfirmPass ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onChange}
            disabled={loading}
            autoComplete="new-password"
            required
            fullWidth
            error={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword}
            helperText={formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword ? 'Les mots de passe ne correspondent pas' : undefined}
            InputProps={{
              startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
              endAdornment: (
                <Typography component="span" onClick={onToggleShowConfirmPass}
                  sx={{ fontSize: '0.72rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, whiteSpace: 'nowrap', '&:hover': { color: '#c9a03d' } }}>
                  {showConfirmPass ? 'Masquer' : 'Voir'}
                </Typography>
              ),
            }}
            sx={fieldSxH52}
          />

          {/* Âge optionnel */}
          <TextField
            label="Âge (optionnel)"
            name="age"
            type="number"
            value={formData.age}
            onChange={onChange}
            disabled={loading}
            fullWidth
            helperText="18 ans minimum requis"
            inputProps={{ min: 18, max: 120 }}
            sx={fieldSxH52}
          />

          {/* Téléphone optionnel */}
          <TextField
            label="Téléphone (optionnel)"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            disabled={loading}
            fullWidth
            placeholder="+221771234567"
            sx={fieldSxH52}
          />

          {/* Adresse optionnelle */}
          <TextField
            label="Adresse (optionnel)"
            name="address"
            value={formData.address}
            onChange={onChange}
            disabled={loading}
            fullWidth
            placeholder="123 Rue de la Paix"
            sx={fieldSxH52}
          />

          {/* Ville et Pays */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Ville (optionnel)"
              name="city"
              value={formData.city}
              onChange={onChange}
              disabled={loading}
              fullWidth
              placeholder="Dakar"
              sx={fieldSx}
            />
            <TextField
              label="Pays (optionnel)"
              name="country"
              value={formData.country}
              onChange={onChange}
              disabled={loading}
              fullWidth
              placeholder="Senegal"
              sx={fieldSx}
            />
          </Box>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              height: 50, borderRadius: '10px', mt: 0.5,
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
            fullWidth onClick={onGoogleLogin}
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
            fullWidth onClick={onAppleLogin}
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
  );
}
