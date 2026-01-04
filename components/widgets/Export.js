/**
 * Export Widget
 * Provides data export functionality
 */

import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { GetApp as GetAppIcon } from '@mui/icons-material';

export default function Export() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GetAppIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Export</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Export data and reports functionality will be available here
        </Typography>
        <Button variant="outlined" size="small" startIcon={<GetAppIcon />}>
          Export Data
        </Button>
      </CardContent>
    </Card>
  );
}
