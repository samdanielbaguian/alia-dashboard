/**
 * Heatmap Page
 * Heatmap visualization for sales activity tracking
 * PRESERVED - Original heatmap widget maintained as dedicated page
 */

'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { LocalFireDepartment as HeatmapIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import SalesHeatmap from '@/components/charts/SalesHeatmap';
import { heatmapData } from '@/data/mockData';

export default function HeatmapPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Sales Activity Heatmap
        </Typography>
        
        <SalesHeatmap 
          title="Weekly Sales Pattern - Hourly Breakdown"
          data={heatmapData} 
        />
        
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HeatmapIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Heatmap Insights</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Peak sales hours: 12:00 - 16:00 across all days
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Highest activity: Friday and Saturday afternoons
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              • Lowest activity: Early morning hours (00:00 - 04:00)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Recommended promotion times: Wednesday to Friday, 12:00 - 20:00
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
