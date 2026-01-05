/**
 * Export Page
 * Data export functionality
 */

'use client';

import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { GetApp as ExportIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function ExportPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Export
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ExportIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Data Export</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Export functionality will be available here
            </Typography>
            
            <Stack spacing={2} sx={{ maxWidth: 400 }}>
              <Button variant="contained" startIcon={<ExportIcon />}>
                Export as CSV
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />}>
                Export as PDF
              </Button>
              <Button variant="outlined" startIcon={<ExportIcon />}>
                Export as Excel
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
