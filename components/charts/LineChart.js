/**
 * Line Chart Component
 * Simple line chart visualization using SVG
 */

'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ShowChart as ChartIcon } from '@mui/icons-material';

// Chart configuration constants
const CHART_CONFIG = {
  width: 100,
  height: 80,
  padding: 10,
};

// Helper function to calculate X coordinate
const calculateXCoordinate = (index, totalPoints) => {
  return (index / (totalPoints - 1)) * (CHART_CONFIG.width - 2 * CHART_CONFIG.padding) + CHART_CONFIG.padding;
};

// Helper function to calculate Y coordinate
const calculateYCoordinate = (value, min, range) => {
  return CHART_CONFIG.height - ((value - min) / range) * (CHART_CONFIG.height - 2 * CHART_CONFIG.padding) - CHART_CONFIG.padding;
};

export default function LineChart({ title, data, height = 300 }) {
  if (!data || !data.labels || !data.datasets || data.datasets.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>{title || 'Chart'}</Typography>
          <Typography variant="body2" color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const labels = data.labels;
  const values = data.datasets[0].data;
  const color = data.datasets[0].borderColor || '#1976d2';
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min;
  
  const points = values.map((value, index) => {
    const x = calculateXCoordinate(index, values.length);
    const y = calculateYCoordinate(value, min, range);
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ChartIcon sx={{ mr: 1, color }} />
          <Typography variant="h6">{title || 'Sales Trend'}</Typography>
        </Box>
        
        <Box sx={{ position: 'relative', width: '100%', height: `${height}px` }}>
          <svg
            viewBox={`0 0 ${CHART_CONFIG.width} ${CHART_CONFIG.height}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Grid lines */}
            <line x1={CHART_CONFIG.padding} y1={CHART_CONFIG.padding} x2={CHART_CONFIG.padding} y2={CHART_CONFIG.height - CHART_CONFIG.padding} stroke="#e0e0e0" strokeWidth="0.2" />
            <line x1={CHART_CONFIG.padding} y1={CHART_CONFIG.height - CHART_CONFIG.padding} x2={CHART_CONFIG.width - CHART_CONFIG.padding} y2={CHART_CONFIG.height - CHART_CONFIG.padding} stroke="#e0e0e0" strokeWidth="0.2" />
            
            {/* Area under curve */}
            <polygon
              points={`${CHART_CONFIG.padding},${CHART_CONFIG.height - CHART_CONFIG.padding} ${points} ${CHART_CONFIG.width - CHART_CONFIG.padding},${CHART_CONFIG.height - CHART_CONFIG.padding}`}
              fill={`${color}20`}
            />
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Points */}
            {points.split(' ').map((point, i) => {
              const [x, y] = point.split(',');
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="0.8"
                  fill={color}
                />
              );
            })}
          </svg>
        </Box>
        
        {/* Labels */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, px: 1 }}>
          {labels.map((label, index) => {
            // Show only first, middle, and last labels to avoid crowding
            if (index === 0 || index === Math.floor(labels.length / 2) || index === labels.length - 1) {
              return (
                <Typography key={index} variant="caption" color="text.secondary">
                  {label}
                </Typography>
              );
            }
            return null;
          })}
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
          <Box sx={{ width: 16, height: 3, backgroundColor: color, mr: 1, borderRadius: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {data.datasets[0].label || 'Value'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
