/**
 * Line Chart Component
 * Simple line chart visualization using SVG
 */

'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { ShowChart as ChartIcon } from '@mui/icons-material';

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
  
  const width = 100;
  const chartHeight = 80;
  const padding = 10;
  
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1)) * (width - 2 * padding) + padding;
    const y = chartHeight - ((value - min) / range) * (chartHeight - 2 * padding) - padding;
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
            viewBox={`0 0 ${width} ${chartHeight}`}
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}
          >
            {/* Grid lines */}
            <line x1={padding} y1={padding} x2={padding} y2={chartHeight - padding} stroke="#e0e0e0" strokeWidth="0.2" />
            <line x1={padding} y1={chartHeight - padding} x2={width - padding} y2={chartHeight - padding} stroke="#e0e0e0" strokeWidth="0.2" />
            
            {/* Area under curve */}
            <polygon
              points={`${padding},${chartHeight - padding} ${points} ${width - padding},${chartHeight - padding}`}
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
