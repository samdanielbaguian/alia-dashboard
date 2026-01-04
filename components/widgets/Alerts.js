/**
 * Alerts Widget
 * Displays system alerts and notifications
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

export default function Alerts() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <WarningIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Alerts</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          System alerts and notifications will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
}
