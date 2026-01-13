'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Inventory as ProductsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useEffect, useState } from 'react';

// Tes colonnes et stats doivent être définies ici !
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
const stats = [
  { label: 'Total Products', value: '892', color: '#1976d2' },
  { label: 'Active Products', value: '845', color: '#4caf50' },
  { label: 'Low Stock', value: '23', color: '#f57c00' },
  { label: 'Out of Stock', value: '12', color: '#f44336' },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => {
        if (!res.ok) throw new Error('Erreur API');
        return res.json();
      })
      .then(res => {
        setProducts(Array.isArray(res) ? res : res.products || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div style={{color:'red'}}>Erreur : {error}</div>;

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>Products</Typography>
          <Button variant="contained" startIcon={<AddIcon />} sx={{ textTransform: 'none' }}>Add Product</Button>
        </Box>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
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
