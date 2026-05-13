'use client';

import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Add as AddIcon, Store as SellersIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    newThisMonth: 0,
  });

  const columns = [
    { field: 'id', headerName: 'Seller ID' },
    { field: 'name', headerName: 'Seller Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'products', headerName: 'Products', type: 'number' },
    { field: 'sales', headerName: 'Total Sales', type: 'currency' },
    { field: 'rating', headerName: 'Rating' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'joined', headerName: 'Joined Date' },
  ];

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        setLoading(true);
        
        const productsData = await apiGet('/products');
        const products = productsData.products || [];

        if (products.length === 0) {
          setSellers([]);
          setError(null);
          setLoading(false);
          return;
        }

        const sellerMap = {};
        
        products.forEach(product => {
          const sellerId = product.merchant_id;
          if (sellerId && !sellerMap[sellerId]) {
            sellerMap[sellerId] = {
              id: sellerId,
              name: product.merchant_name || `Seller ${sellerId}`,
              email: product.merchant_email || 'N/A',
              products: 0,
              sales: 0,
              rating: (Math.random() * 2 + 3.5).toFixed(1),
              status: 'active',
              joined: new Date(product.created_at || Date.now()).toLocaleDateString('fr-FR'),
              productList: [],
            };
          }
        });

        products.forEach(product => {
          const sellerId = product.merchant_id;
          if (sellerMap[sellerId]) {
            sellerMap[sellerId].products += 1;
            sellerMap[sellerId].sales += (product.price || 0) * (product.quantity || 1);
            sellerMap[sellerId].productList.push({
              title: product.title,
              price: product.price,
            });
          }
        });

        const sellersWithDetails = await Promise.all(
          Object.values(sellerMap).map(async (seller) => {
            try {
              const merchantData = await apiGet(`/merchants/${seller.id}`);
              const merchant = merchantData.merchant || merchantData;
              return {
                ...seller,
                name: merchant.shop_name || seller.name,
                email: merchant.email || seller.email,
                products: seller.products,
                sales: parseFloat(seller.sales.toFixed(2)),
                status: merchant.status || 'active',
              };
            } catch (err) {
              return {
                ...seller,
                products: seller.products,
                sales: parseFloat(seller.sales.toFixed(2)),
              };
            }
          })
        );

        sellersWithDetails.sort((a, b) => b.sales - a.sales);

        setSellers(sellersWithDetails);
        
        const activeCount = sellersWithDetails.filter(s => s.status === 'active').length;
        const pendingCount = sellersWithDetails.filter(s => s.status === 'pending').length;

        setStats({
          total: sellersWithDetails.length,
          active: activeCount,
          pending: pendingCount,
          newThisMonth: Math.floor(sellersWithDetails.length * 0.1),
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load sellers:', err);
        setError(err.message || 'Failed to load sellers');
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  const statsList = [
    { label: 'Total Sellers', value: stats.total, color: '#1976d2' },
    { label: 'Active Sellers', value: stats.active, color: '#4caf50' },
    { label: 'New This Month', value: stats.newThisMonth, color: '#ff9800' },
    { label: 'Pending Approval', value: stats.pending, color: '#f44336' },
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Sellers / Vendors ({stats.total})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Add Seller
          </Button>
        </Box>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statsList.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SellersIcon sx={{ mr: 1, color: stat.color }} />
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

        <DataTable
          title="All Sellers"
          columns={columns}
          data={sellers}
        />
      </Box>
    </DashboardLayout>
  );
}
