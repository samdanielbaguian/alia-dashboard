/**
 * KPI Card Component
 * Displays a key performance indicator with value, change, and icon
 */

'use client';

import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

export default function KPICard({ title, value, change, period, icon: Icon, color = '#1976d2' }) {
  const isPositive = change >= 0;
  
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>
              {value}
            </Typography>
          </Box>
          {Icon && (
            <Box
              sx={{
                backgroundColor: `${color}15`,
                borderRadius: 2,
                p: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon sx={{ fontSize: 32, color }} />
            </Box>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
          {isPositive ? (
            <TrendingUp sx={{ fontSize: 20, color: '#4caf50', mr: 0.5 }} />
          ) : (
            <TrendingDown sx={{ fontSize: 20, color: '#f44336', mr: 0.5 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              color: isPositive ? '#4caf50' : '#f44336',
              fontWeight: 600,
              mr: 1,
            }}
          >
            {isPositive ? '+' : ''}{change}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {period}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
