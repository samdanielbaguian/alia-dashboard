/**
 * Products Page
 * Displays and manages all products
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Inventory as ProductsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { products } from '@/data/mockData';

export default function ProductsPage() {
  const columns = [
    { field: 'sku', headerName: 'SKU' },
    { field: 'name', headerName: 'Product Name' },
    { field: 'category', headerName: 'Category' },
    { field: 'size', headerName: 'Size' },
    { field: 'color', headerName: 'Color' },
    { field: 'weight', headerName: 'Weight' },
    { field: 'material', headerName: 'Material' },
    { field: 'price', headerName: 'Price', type: 'currency' },
    { field: 'stock', headerName: 'Stock', type: 'number' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'seller', headerName: 'Seller' },
  ];

  const stats = [
    { label: 'Total Products', value: '892', color: '#1976d2' },
    { label: 'Active Products', value: '845', color: '#4caf50' },
    { label: 'Low Stock', value: '23', color: '#f57c00' },
    { label: 'Out of Stock', value: '12', color: '#f44336' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Products
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Add Product
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ProductsIcon sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Products Table */}
        <DataTable
          title="All Products"
          columns={columns}
          data={products}
        />
      </Box>
    </DashboardLayout>
  );
}
