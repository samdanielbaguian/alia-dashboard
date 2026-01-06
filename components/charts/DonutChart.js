/**
 * Donut Chart Component
 * Simple donut/pie chart visualization using SVG
 */

'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart as PieChartIcon } from '@mui/icons-material';

export default function DonutChart({ title, data }) {
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
  const colors = data.datasets[0].backgroundColor || [];
  
  const total = values.reduce((sum, val) => sum + val, 0);
  
  // Calculate pie slices
  let currentAngle = -90; // Start from top
  const slices = values.map((value, index) => {
    const percentage = (value / total) * 100;
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle = endAngle;
    
    return {
      value,
      percentage,
      startAngle,
      endAngle,
      color: colors[index] || '#1976d2',
      label: labels[index]
    };
  });
  
  // Convert angle to SVG path
  const getSlicePath = (startAngle, endAngle, outerRadius = 40, innerRadius = 25) => {
    const start = polarToCartesian(50, 50, outerRadius, endAngle);
    const end = polarToCartesian(50, 50, outerRadius, startAngle);
    const innerStart = polarToCartesian(50, 50, innerRadius, endAngle);
    const innerEnd = polarToCartesian(50, 50, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  };
  
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PieChartIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6">{title || 'Distribution'}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <svg viewBox="0 0 100 100" style={{ width: '200px', height: '200px' }}>
            {slices.map((slice, index) => (
              <path
                key={index}
                d={getSlicePath(slice.startAngle, slice.endAngle)}
                fill={slice.color}
                stroke="#ffffff"
                strokeWidth="0.5"
              />
            ))}
            
            {/* Center circle for total */}
            <circle cx="50" cy="50" r="20" fill="#f5f5f5" />
            <text x="50" y="48" textAnchor="middle" fontSize="6" fontWeight="600" fill="#000000">
              Total
            </text>
            <text x="50" y="54" textAnchor="middle" fontSize="5" fill="#666666">
              {total}%
            </text>
          </svg>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {slices.map((slice, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    backgroundColor: slice.color,
                    borderRadius: 1,
                    mr: 1
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {slice.label}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {slice.percentage.toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
