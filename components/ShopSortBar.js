'use client';

import { useState } from 'react';
import {
  Box, ToggleButton, ToggleButtonGroup, Typography, Chip,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  NearMe as NearMeIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Inventory as InventoryIcon,
} from '@mui/icons-material';

const SORT_OPTIONS = [
  { value: 'smart',    label: 'Buy Box + Proximité', icon: <TrophyIcon sx={{ fontSize: 18 }} />, color: '#f59e0b' },
  { value: 'distance', label: 'Distance',             icon: <NearMeIcon sx={{ fontSize: 18 }} />, color: '#3b82f6' },
  { value: 'rating',   label: 'Meilleures notes',     icon: <StarIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6' },
  { value: 'revenue',  label: 'Chiffre d\'affaires',  icon: <TrendingUpIcon sx={{ fontSize: 18 }} />, color: '#10b981' },
  { value: 'products', label: 'Nb de produits',        icon: <InventoryIcon sx={{ fontSize: 18 }} />, color: '#ef4444' },
];

export default function ShopSortBar({ onSort, currentSort = 'smart' }) {
  const [active, setActive] = useState(currentSort);

  const handleChange = (_, newVal) => {
    if (!newVal) return;
    setActive(newVal);
    onSort?.(newVal);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 3 }}>
      <Typography sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
        Trier par :
      </Typography>
      <ToggleButtonGroup
        value={active}
        exclusive
        onChange={handleChange}
        size="small"
        sx={{
          flexWrap: 'wrap',
          gap: 0.5,
          '& .MuiToggleButtonGroup-grouped': { border: 'none !important', borderRadius: '20px !important' },
        }}
      >
        {SORT_OPTIONS.map((opt) => (
          <ToggleButton
            key={opt.value}
            value={opt.value}
            sx={{
              borderRadius: '20px !important',
              px: 2,
              py: 0.6,
              fontSize: '0.8rem',
              fontWeight: 600,
              gap: 0.7,
              transition: 'all 0.2s',
              color: active === opt.value ? '#fff' : '#6b7280',
              background: active === opt.value
                ? `linear-gradient(135deg, ${opt.color}, ${opt.color}cc)`
                : 'rgba(0,0,0,0.04)',
              '&:hover': {
                background: active === opt.value
                  ? `linear-gradient(135deg, ${opt.color}, ${opt.color}cc)`
                  : 'rgba(0,0,0,0.08)',
              },
              '&.Mui-selected': {
                color: '#fff',
                background: `linear-gradient(135deg, ${opt.color}, ${opt.color}cc)`,
                boxShadow: `0 4px 14px ${opt.color}55`,
              },
            }}
          >
            {opt.icon}
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {active === 'smart' && (
        <Chip
          icon={<TrophyIcon sx={{ fontSize: 14 }} />}
          label="Buy Box activé"
          size="small"
          sx={{ bgcolor: '#fef3c7', color: '#92400e', fontWeight: 700, fontSize: '0.75rem', border: '1px solid #fbbf2444' }}
        />
      )}
    </Box>
  );
}
