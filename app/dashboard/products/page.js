'use client';

import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Add as AddIcon, Inventory as ProductsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';

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

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/products');
        const productsList = Array.isArray(data) ? data : data.products || [];
        
        setProducts(productsList);

        // Calculate stats dynamically
        const total = productsList.length;
        const active = productsList.filter(p => p.stock > 0).length;
        const lowStock = productsList.filter(p => p.stock > 0 && p.stock < 10).length;
        const outOfStock = productsList.filter(p => p.stock === 0).length;

        setStats({ total, active, lowStock, outOfStock });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const statsList = [
    { label: 'Total Products', value: stats.total, color: '#1976d2' },
    { label: 'Active Products', value: stats.active, color: '#4caf50' },
    { label: 'Low Stock', value: stats.lowStock, color: '#f57c00' },
    { label: 'Out of Stock', value: stats.outOfStock, color: '#f44336' },
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Products</Typography>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>Add Product</Button>
        </Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statsList.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ProductsIcon sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <DataTable title="All Products" columns={columns} data={products} />
      </Box>
    </DashboardLayout>
  );
}
