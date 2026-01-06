/**
 * Customers Page
 * Displays and manages all customers
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, People as CustomersIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { customers } from '@/data/mockData';

export default function CustomersPage() {
  const columns = [
    { field: 'id', headerName: 'Customer ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'orders', headerName: 'Orders', type: 'number' },
    { field: 'totalSpent', headerName: 'Total Spent', type: 'currency' },
    { field: 'lastOrder', headerName: 'Last Order' },
    { field: 'status', headerName: 'Status', type: 'status' },
  ];

  const stats = [
    { label: 'Total Customers', value: '2,847', color: '#1976d2' },
    { label: 'VIP Customers', value: '142', color: '#9c27b0' },
    { label: 'New This Month', value: '89', color: '#4caf50' },
    { label: 'Active', value: '2,456', color: '#ff9800' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Customers
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Add Customer
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CustomersIcon sx={{ mr: 1, color: stat.color }} />
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

        {/* Customers Table */}
        <DataTable
          title="All Customers"
          columns={columns}
          data={customers}
        />
      </Box>
    </DashboardLayout>
  );
}
