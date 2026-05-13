'use client';

import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function AuthInput({ icon: Icon, type = 'text', sx, ...props }) {
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPass ? 'text' : 'password') : type;

  return (
    <TextField
      type={resolvedType}
      fullWidth
      variant="outlined"
      InputProps={{
        startAdornment: Icon ? (
          <InputAdornment position="start">
            <Icon sx={{ fontSize: 19, color: '#94a3b8', transition: 'color 0.2s' }} />
          </InputAdornment>
        ) : undefined,
        endAdornment: isPassword ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPass(v => !v)}
              edge="end"
              tabIndex={-1}
              size="small"
              sx={{ color: '#94a3b8' }}
            >
              {showPass
                ? <VisibilityOff sx={{ fontSize: 18 }} />
                : <Visibility sx={{ fontSize: 18 }} />}
            </IconButton>
          </InputAdornment>
        ) : undefined,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          height: 52,
          backgroundColor: '#f8fafc',
          transition: 'background-color 0.2s',
          '& fieldset': {
            borderColor: '#e2e8f0',
            borderWidth: '1.5px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          },
          '&:hover': {
            backgroundColor: '#f1f5f9',
            '& fieldset': { borderColor: '#c9a03d' },
          },
          '&.Mui-focused': {
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#c9a03d',
              boxShadow: '0 0 0 3px rgba(201,160,61,0.14)',
            },
          },
        },
        '& .MuiInputLabel-root': {
          color: '#94a3b8',
          fontSize: '0.9rem',
          '&.Mui-focused': { color: '#c9a03d' },
        },
        '& .MuiInputBase-input': {
          color: '#1e293b',
          fontSize: '0.9rem',
        },
        '& .MuiFormHelperText-root': {
          fontSize: '0.78rem',
          mt: 0.5,
        },
        ...sx,
      }}
      {...props}
    />
  );
}
