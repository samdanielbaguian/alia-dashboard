/**
 * BestSellers Widget
 * Displays top selling products
 */

import { Card, CardContent, Typography, Box } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';

export default function BestSellers() {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StarIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Best Sellers</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Top selling products list will be displayed here
        </Typography>
      </CardContent>
    </Card>
  );
}
