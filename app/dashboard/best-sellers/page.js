/**
 * Best Sellers Page
 * Display top selling products
 */

'use client';

import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Star as BestSellersIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function BestSellersPage() {
  const mockProducts = [
    { name: 'Product 1', sales: '1,234 units' },
    { name: 'Product 2', sales: '987 units' },
    { name: 'Product 3', sales: '765 units' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Best Sellers
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BestSellersIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Top Selling Products</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Best selling products list placeholder
            </Typography>
            <List>
              {mockProducts.map((product, index) => (
                <Box key={index}>
                  <ListItem>
                    <ListItemText 
                      primary={product.name} 
                      secondary={product.sales}
                    />
                  </ListItem>
                  {index < mockProducts.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
