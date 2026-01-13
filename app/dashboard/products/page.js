/**
 * Products Page
 * Displays and manages all products
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Inventory as ProductsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useEffect, useState } from 'react';
// ... autres imports, laisse columns/statistiques

// Utilisation variable d'env ou fallback local
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
        // Adapte si JSON = { products: [...] }
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
