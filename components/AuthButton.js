'use client';

import { Button, CircularProgress } from '@mui/material';

export default function AuthButton({ loading = false, children, sx, ...props }) {
  return (
    <Button
      variant="contained"
      fullWidth
      disabled={loading}
      sx={{
        height: 52,
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #1a2a4f 0%, #243b6e 100%)',
        color: '#ffffff',
        fontWeight: 700,
        letterSpacing: '1.5px',
        fontSize: '0.82rem',
        textTransform: 'uppercase',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 15px rgba(26,42,79,0.35)',
        '&:hover': {
          background: 'linear-gradient(135deg, #c9a03d 0%, #d4af55 100%)',
          boxShadow: '0 6px 22px rgba(201,160,61,0.45)',
          transform: 'translateY(-1.5px)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 2px 8px rgba(26,42,79,0.3)',
        },
        '&.Mui-disabled': {
          background: '#e2e8f0',
          color: '#94a3b8',
          boxShadow: 'none',
          transform: 'none',
        },
        ...sx,
      }}
      {...props}
    >
      {loading ? <CircularProgress size={22} sx={{ color: '#94a3b8' }} /> : children}
    </Button>
  );
}
