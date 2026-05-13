/**
 * Best Sellers Page
 * Display top selling products with SKU
 */

'use client';

import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Star as BestSellersIcon, TrendingUp } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { apiGet } from '@/utils/api';
import { formatCurrency } from '@/utils/helpers';

export default function BestSellersPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    topProduct: 'N/A',
    totalUnits: 0,
    totalRevenue: 0,
  });

  const columns = [
    { field: 'sku', headerName: 'SKU' },
    { field: 'title', headerName: 'Product Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'size', headerName: 'Size' },
    { field: 'color', headerName: 'Color' },
    { field: 'weight', headerName: 'Weight' },
    { field: 'material', headerName: 'Material' },
    { field: 'price', headerName: 'Price', type: 'currency' },
    { field: 'stock', headerName: 'Stock', type: 'number' },
  ];

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/products');
        const productsList = Array.isArray(data) ? data : data.products || [];
        
        // Sort by stock (as proxy for sales - in real scenario would use order history)
        const sorted = productsList.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        
        setProducts(sorted.slice(0, 20));

        // Calculate stats
        const topProd = sorted[0]?.title || 'N/A';
        const totalRev = sorted.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

        setStats({
          topProduct: topProd,
          totalUnits: sorted.reduce((sum, p) => sum + (p.stock || 0), 0),
          totalRevenue: totalRev,
        });

        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load best sellers');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  const topStats = [
    { label: 'Top Product', value: stats.topProduct, color: '#1976d2' },
    { label: 'Total Units', value: stats.totalUnits.toLocaleString(), color: '#4caf50' },
    { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), color: '#ff9800' },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
          <Typography>Error: {error}</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

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
          title="Top Products"
          columns={columns}
          data={products}
        />
      </Box>
    </DashboardLayout>
  );
}
