/**
 * Orders Page
 * Displays and manages all orders
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { GetApp as ExportIcon, ShoppingCart as OrderIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { orders } from '@/data/mockData';

export default function OrdersPage() {
  const columns = [
    { field: 'id', headerName: 'Order ID' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'customer', headerName: 'Customer' },
    { field: 'product', headerName: 'Product' },
    { field: 'amount', headerName: 'Amount', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'date', headerName: 'Date' },
  ];

  const stats = [
    { label: 'Total Orders', value: '1,543', color: '#1976d2' },
    { label: 'Completed', value: '1,245', color: '#4caf50' },
    { label: 'Processing', value: '156', color: '#ff9800' },
    { label: 'Pending', value: '142', color: '#f44336' },
  ];

  const handleExport = () => {
    // Mock CSV export
    const csvContent = orders.map(order => 
      `${order.id},${order.sku},${order.customer},${order.product},${order.amount},${order.status},${order.date}`
    ).join('\n');
    
    const header = 'Order ID,SKU,Customer,Product,Amount,Status,Date\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
