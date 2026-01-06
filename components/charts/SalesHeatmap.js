/**
 * Sales Heatmap Component
 * Visualizes sales activity across days and hours
 */

'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import { LocalFireDepartment as HeatmapIcon } from '@mui/icons-material';

export default function SalesHeatmap({ title = 'Sales Activity Heatmap', data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
          <Typography variant="body2" color="text.secondary">No data available</Typography>
        </CardContent>
      </Card>
    );
  }

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
  
  // Find max value for color scaling
  const maxValue = Math.max(...data.map(d => d.value));
  
  const getColor = (value) => {
    const intensity = value / maxValue;
    // Blue gradient from light to dark
    if (intensity < 0.2) return '#e3f2fd';
    if (intensity < 0.4) return '#90caf9';
    if (intensity < 0.6) return '#42a5f5';
    if (intensity < 0.8) return '#1976d2';
    return '#0d47a1';
  };
  
  const getValue = (day, hour) => {
    const item = data.find(d => d.day === day && d.hour === hour);
    return item ? item.value : 0;
  };
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HeatmapIcon sx={{ mr: 1, color: '#1976d2' }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ minWidth: 600 }}>
            {/* Hours header */}
            <Box sx={{ display: 'flex', mb: 1, ml: 6 }}>
              {hours.map((hour, index) => (
                <Box
                  key={index}
                  sx={{
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {hour}
                  </Typography>
                </Box>
              ))}
            </Box>
            
            {/* Heatmap grid */}
            {days.map((day, dayIndex) => (
              <Box key={dayIndex} sx={{ display: 'flex', mb: 0.5, alignItems: 'center' }}>
                {/* Day label */}
                <Box sx={{ width: 48, mr: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {day}
                  </Typography>
                </Box>
                
                {/* Hour cells */}
                {hours.map((hour, hourIndex) => {
                  const value = getValue(day, hour);
                  return (
                    <Box
                      key={hourIndex}
                      sx={{
                        flex: 1,
                        height: 40,
                        backgroundColor: getColor(value),
                        borderRadius: 1,
                        mx: 0.25,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        },
                      }}
                      title={`${day} ${hour}: ${value} sales`}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 600, color: value > maxValue * 0.5 ? '#ffffff' : '#000000' }}>
                        {value}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Box>
        
        {/* Legend */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Less
          </Typography>
          {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity, index) => (
            <Box
              key={index}
              sx={{
                width: 24,
                height: 12,
                backgroundColor: getColor(maxValue * intensity),
                borderRadius: 0.5,
              }}
            />
          ))}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            More
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
