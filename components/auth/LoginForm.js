'use client';

import {
  Box, Typography, Alert, TextField, Button, CircularProgress,
  Divider, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  MailOutline, LockOutlined, Phone as PhoneIcon,
  Google as GoogleIcon, Apple as AppleIcon,
} from '@mui/icons-material';
import Image from 'next/image';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px', bgcolor: '#fff', height: 52,
    '& fieldset': { borderColor: '#e2e8f0', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#c9a03d' },
    '&.Mui-focused fieldset': { borderColor: '#c9a03d', boxShadow: '0 0 0 3px rgba(201,160,61,0.13)' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#c9a03d' },
};

export default function LoginForm({
  email, password, loading, error, showPass,
  onEmailChange, onPasswordChange, onSubmit, onToggleShowPass,
  onGoogleLogin, onAppleLogin, onPhoneLogin,
  // phone modal
  phoneOpen, phoneNumber, phoneCode, codeSent, phoneLoading,
  onPhoneNumberChange, onPhoneCodeChange, onSendCode, onVerifyCode, onClosePhoneModal,
}) {
  return (
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
          <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}>
            <Image
              src="/logos/logos.png"
              alt="Alia"
              width={100}
              height={35}
              style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              priority
            />
          </Box>
          <Typography sx={{ fontSize: { xs: 28, sm: 36 }, fontWeight: 800, color: '#1a2a4f', letterSpacing: '-0.5px', lineHeight: 1 }}>
            Bon retour parmi nous.
          </Typography>
          <Box sx={{ width: 32, height: 3, background: 'linear-gradient(90deg, #c9a03d, rgba(201,160,61,0.15))', borderRadius: 2, mt: 1.5, mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.88rem' }}>
            Connectez-vous pour accéder à votre espace personnel.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px', fontSize: '0.85rem' }}>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => onEmailChange(e.target.value)}
            disabled={loading}
            autoComplete="email"
            required
            fullWidth
            InputProps={{ startAdornment: <MailOutline sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} /> }}
            sx={fieldSx}
          />
          <TextField
            label="Password"
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => onPasswordChange(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
            required
            fullWidth
            InputProps={{
              startAdornment: <LockOutlined sx={{ fontSize: 18, color: '#94a3b8', mr: 1 }} />,
              endAdornment: (
                <Typography
                  component="span"
                  onClick={onToggleShowPass}
                  sx={{ fontSize: '0.75rem', color: '#94a3b8', cursor: 'pointer', userSelect: 'none', mr: 0.5, '&:hover': { color: '#c9a03d' } }}
                >
                  {showPass ? 'Masquer' : 'Voir'}
                </Typography>
              ),
            }}
            sx={fieldSx}
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

        <Stack direction="row" spacing={1.5} sx={{ mb: 3.5 }}>
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
          <Button
            onClick={onPhoneLogin}
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

      {/* ── MODAL TÉLÉPHONE ── */}
      <Dialog
        open={phoneOpen}
        onClose={onClosePhoneModal}
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
              onChange={e => onPhoneNumberChange(e.target.value)}
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
                onChange={e => onPhoneCodeChange(e.target.value)}
                inputProps={{ maxLength: 6 }}
                sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={onClosePhoneModal}
            sx={{ borderRadius: '10px', textTransform: 'none', color: '#64748b' }}
          >
            Annuler
          </Button>
          <Button
            onClick={!codeSent ? onSendCode : onVerifyCode}
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
