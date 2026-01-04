/**
 * Overview Widget
 * Displays key metrics and statistics overview
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp as TrendingUpIcon } from '@mui/icons-material';

export default function Overview() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Overview</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Key metrics and statistics will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
}
