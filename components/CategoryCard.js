'use client';

import { Box, Typography, Paper } from '@mui/material';

const CATEGORY_ICONS = {
  electronique: 'ðŸ“±', mode: 'ðŸ‘•', audio: 'ðŸŽ§', maison: 'ðŸ ',
  gaming: 'ðŸŽ®', beaute: 'ðŸ’„', sport: 'âš½', alimentation: 'ðŸŽ',
  default: 'ðŸ›ï¸',
};

const GRADIENTS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
];

export default function CategoryCard({ category, count = 0, index = 0, onClick }) {
  const key = (category || '').toLowerCase();
  const icon = CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
  const gradient = GRADIENTS[index % GRADIENTS.length];
  const name = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'CatÃ©gorie';

  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.5 },
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: 4,
        border: '1.5px solid rgba(0,0,0,0.06)',
        transition: 'all 0.25s ease',
        background: 'var(--bg-paper, #fff)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          borderColor: 'rgba(25,118,210,0.3)',
        },
      }}
    >
      <Box sx={{
        width: { xs: 60, md: 72 },
        height: { xs: 60, md: 72 },
        borderRadius: '50%',
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 1.5,
        fontSize: { xs: '1.6rem', md: '2rem' },
        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        transition: 'transform 0.25s',
        '.MuiPaper-root:hover &': { transform: 'scale(1.1)' },
      }}>
        {icon}
      </Box>
      <Typography sx={{
        fontWeight: 700, fontSize: { xs: '0.8rem', md: '0.9rem' },
        mb: 0.3, color: 'var(--text-title, #1e293b)',
      }}>
        {name}
      </Typography>
      <Typography sx={{ fontSize: '0.72rem', color: 'var(--text-secondary, #7f8c8d)' }}>
        {count > 0 ? `${count} articles` : 'Explorer'}
      </Typography>
    </Paper>
  );
}

