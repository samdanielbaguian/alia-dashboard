/**
 * Activity Widget
 * Displays recent activity feed
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';

export default function Activity() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TimelineIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Activity</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Recent activity feed will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
}
