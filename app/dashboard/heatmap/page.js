/**
 * Heatmap Page
 * Heatmap visualization for activity tracking
 */

'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { LocalFireDepartment as HeatmapIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function HeatmapPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Heatmap
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HeatmapIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Activity Heatmap</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Heatmap visualization will be displayed here
            </Typography>
            <Box 
              sx={{ 
                mt: 3, 
                height: 400, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Heatmap Visualization Area
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
