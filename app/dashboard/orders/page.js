/**
 * Orders Page
 * Displays and manages all orders
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { GetApp as ExportIcon, ShoppingCart as OrderIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    pending: 0,
  });

  const columns = [
    { field: 'id', headerName: 'Order ID' },
    { field: 'user_id', headerName: 'User' },
    { field: 'total_amount', headerName: 'Amount', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'created_at', headerName: 'Date' },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/merchants/me/orders');
        const ordersList = data.orders || [];
        
        setOrders(ordersList);

        // Calculate stats dynamically
        const total = ordersList.length;
        const completed = ordersList.filter(o => o.status === 'delivered' || o.status === 'completed').length;
        const processing = ordersList.filter(o => o.status === 'confirmed' || o.status === 'shipped').length;
        const pending = ordersList.filter(o => o.status === 'pending' || o.status === 'paid').length;

        setStats({ total, completed, processing, pending });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const statsList = [
    { label: 'Total Orders', value: stats.total, color: '#1976d2' },
    { label: 'Completed', value: stats.completed, color: '#4caf50' },
    { label: 'Processing', value: stats.processing, color: '#ff9800' },
    { label: 'Pending', value: stats.pending, color: '#f44336' },
  ];

  const handleExport = () => {
    const escapeCSVValue = (value) => {
      if (value == null) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = orders.map(order => {
      const productNames = order.products?.map(p => p.title).join('; ') || 'N/A';
      return [order.id, order.user_id, productNames, order.total_amount, order.status, order.created_at]
        .map(escapeCSVValue).join(',');
    }).join('\n');
    
    const header = 'Order ID,User ID,Products,Amount,Status,Date\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Orders
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {statsList.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <OrderIcon sx={{ mr: 1, color: stat.color }} />
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

        {/* Orders Table */}
        <DataTable
          title="All Orders"
          columns={columns}
          data={orders}
        />
      </Box>
    </DashboardLayout>
  );
}
