'use client';

import { Box, Typography } from '@mui/material';

export default function AuthCard({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0c1526 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        p: 2,
      }}
    >
      {/* Decorative orbs */}
      <Box sx={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,160,61,0.07) 0%, transparent 65%)', top: '-15%', left: '-12%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(26,42,79,0.5) 0%, transparent 65%)', bottom: '-5%', right: '-8%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,160,61,0.05) 0%, transparent 65%)', top: '65%', left: '6%', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,160,61,0.04) 0%, transparent 65%)', top: '18%', right: '8%', pointerEvents: 'none' }} />

      {/* Main card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          background: 'rgba(255,255,255,0.985)',
          backdropFilter: 'blur(24px)',
          borderRadius: '32px',
          boxShadow: '0 32px 64px -16px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)',
          p: { xs: '44px 28px 34px', sm: '52px 40px 38px' },
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Gold top accent bar */}
        <Box
          sx={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #1a2a4f 0%, #c9a03d 50%, #1a2a4f 100%)',
          }}
        />

        {children}

        {/* BLUEBACK SHUTTERS brand mark */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: 4,
            pt: 2.5,
            borderTop: '1px solid rgba(226,232,240,0.6)',
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '8px',
              letterSpacing: '3.5px',
              color: 'rgba(100,116,139,0.4)',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            B L U E B A C K
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(201,160,61,0.25), transparent)',
              mx: 1.5,
            }}
          />
          <Typography
            sx={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: '8px',
              letterSpacing: '3.5px',
              color: 'rgba(201,160,61,0.38)',
              fontWeight: 700,
              userSelect: 'none',
            }}
          >
            S H U T T E R S
          </Typography>
        </Box>
      </Box>

      {/* Fixed bottom-right brand overlay */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 22,
          right: 28,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 0.4,
          opacity: 0.18,
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <Typography sx={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', letterSpacing: '5px', color: '#ffffff', fontWeight: 700 }}>
          B L U E B A C K
        </Typography>
        <Typography sx={{ fontFamily: '"Courier New", Courier, monospace', fontSize: '10px', letterSpacing: '5px', color: '#c9a03d', fontWeight: 700 }}>
          S H U T T E R S
        </Typography>
      </Box>
    </Box>
  );
}
