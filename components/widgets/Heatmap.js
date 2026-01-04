/**
 * Heatmap Widget
 * Displays activity heatmap for merchant data
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { GridOn as GridOnIcon } from '@mui/icons-material';

export default function Heatmap() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GridOnIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Heatmap</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Activity heatmap visualization will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
}
