/**
 * Overview Page
 * Dashboard overview with key metrics
 */

'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Overview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6">Key Metrics</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Overview metrics will be displayed here
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Revenue</Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue statistics placeholder
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Orders</Typography>
                <Typography variant="body2" color="text.secondary">
                  Orders statistics placeholder
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
