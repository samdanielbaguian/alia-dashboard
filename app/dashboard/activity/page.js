/**
 * Activity Page
 * Recent activity feed
 */

'use client';

import { Box, Typography, Card, CardContent, Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/material';
import { Timeline as ActivityIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function ActivityPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Activity
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ActivityIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Recent Activity</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Activity feed will be displayed here
            </Typography>
            
            <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Activity timeline placeholder
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
