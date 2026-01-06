/**
 * Reports Page
 * Analytics and reporting dashboard
 */

'use client';

import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { GetApp as ExportIcon, Assessment as ReportsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import SalesHeatmap from '@/components/charts/SalesHeatmap';
import { salesChartData, categoryDistribution, heatmapData } from '@/data/mockData';

export default function ReportsPage() {
  const reportStats = [
    { label: 'Monthly Revenue', value: '€125,840', change: '+12.5%', color: '#1976d2' },
    { label: 'Avg Order Value', value: '€81.52', change: '+5.2%', color: '#4caf50' },
    { label: 'Conversion Rate', value: '3.42%', change: '+0.8%', color: '#ff9800' },
    { label: 'Customer LTV', value: '€542', change: '+15.3%', color: '#9c27b0' },
  ];

  const handleExportReport = () => {
    // Mock report export
    const reportData = {
      generated: new Date().toISOString(),
      period: 'Last 12 Months',
      revenue: '€125,840.50',
      orders: '1,543',
      customers: '2,847',
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics-report.json';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Reports & Analytics
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </Box>

        {/* Report Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {reportStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ReportsIcon sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, mt: 1 }}>
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <LineChart title="Revenue Trend Analysis" data={salesChartData} height={350} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart title="Sales by Category" data={categoryDistribution} />
          </Grid>
        </Grid>

        {/* Heatmap */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesHeatmap title="Sales Activity Pattern" data={heatmapData} />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
