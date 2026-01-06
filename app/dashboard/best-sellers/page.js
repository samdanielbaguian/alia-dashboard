/**
 * Best Sellers Page
 * Display top selling products with SKU
 */

'use client';

import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { Star as BestSellersIcon, TrendingUp } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { bestSellers } from '@/data/mockData';

export default function BestSellersPage() {
  const columns = [
    { field: 'rank', headerName: 'Rank' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'name', headerName: 'Product Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'sales', headerName: 'Units Sold', type: 'number' },
    { field: 'revenue', headerName: 'Revenue', type: 'currency' },
  ];

  const topStats = [
    { label: 'Top Product', value: bestSellers[0]?.name || 'N/A', color: '#1976d2' },
    { label: 'Total Units Sold', value: bestSellers.reduce((sum, item) => sum + item.sales, 0).toLocaleString(), color: '#4caf50' },
    { label: 'Total Revenue', value: `€${bestSellers.reduce((sum, item) => sum + item.revenue, 0).toFixed(2)}`, color: '#ff9800' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Best Sellers
        </Typography>

        {/* Top Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {topStats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUp sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Best Sellers Table */}
        <DataTable
          title="Top Selling Products"
          columns={columns}
          data={bestSellers}
        />
      </Box>
    </DashboardLayout>
  );
}
