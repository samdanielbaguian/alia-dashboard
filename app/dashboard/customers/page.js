/**
 * Customers Page
 * Displays and manages all customers
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Add as AddIcon, People as CustomersIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { useState, useEffect } from 'react';
import { apiGet } from '@/utils/api';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    vip: 0,
    newThisMonth: 0,
  });

  const columns = [
    { field: 'id', headerName: 'Customer ID' },
    { field: 'name', headerName: 'Name' },
    { field: 'email', headerName: 'Email' },
    { field: 'orders', headerName: 'Orders', type: 'number' },
    { field: 'totalSpent', headerName: 'Total Spent', type: 'currency' },
    { field: 'lastOrder', headerName: 'Last Order' },
    { field: 'status', headerName: 'Status', type: 'status' },
  ];

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/merchants/me/orders');
        const orders = data.orders || [];

        if (orders.length === 0) {
          setCustomers([]);
          setError(null);
          setLoading(false);
          return;
        }

        // Extract unique customers from orders
        const customerMap = {};
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        orders.forEach(order => {
          const customerId = order.user_id;
          if (!customerMap[customerId]) {
            customerMap[customerId] = {
              id: customerId,
              name: order.user_name || `Customer ${customerId}`,
              email: order.user_email || 'N/A',
              orders: 0,
              totalSpent: 0,
              lastOrder: null,
              status: 'active',
              orderDates: [],
            };
          }
          
          customerMap[customerId].orders += 1;
          customerMap[customerId].totalSpent += order.total_amount || 0;
          customerMap[customerId].orderDates.push(new Date(order.created_at));
          
          // Update last order date
          const orderDate = new Date(order.created_at);
          if (!customerMap[customerId].lastOrder || orderDate > new Date(customerMap[customerId].lastOrder)) {
            customerMap[customerId].lastOrder = order.created_at;
          }
        });

        // Convert to array and calculate stats
        const customersList = Object.values(customerMap).map(customer => {
          // Determine VIP status (>5 orders or >€500 spent)
          const isVIP = customer.orders >= 5 || customer.totalSpent >= 500;
          // Determine if new this month
          const isNew = customer.orderDates.some(date => date >= thisMonthStart);
          
          return {
            ...customer,
            status: isVIP ? 'vip' : 'active',
            lastOrder: new Date(customer.lastOrder).toLocaleDateString('fr-FR'),
            totalSpent: parseFloat(customer.totalSpent.toFixed(2)),
          };
        });

        // Sort by total spent descending
        customersList.sort((a, b) => b.totalSpent - a.totalSpent);

        // Calculate stats
        const vipCount = customersList.filter(c => c.status === 'vip').length;
        const newThisMonthCount = customersList.filter(c => 
          c.orderDates?.some(date => date >= thisMonthStart)
        ).length;

        setCustomers(customersList);
        setStats({
          total: customersList.length,
          active: customersList.length,
          vip: vipCount,
          newThisMonth: newThisMonthCount,
        });
        setError(null);
      } catch (err) {
        console.error('Failed to load customers:', err);
        setError(err.message || 'Failed to load customers');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const statsList = [
    { label: 'Total Customers', value: stats.total, color: '#1976d2' },
    { label: 'VIP Customers', value: stats.vip, color: '#9c27b0' },
    { label: 'New This Month', value: stats.newThisMonth, color: '#4caf50' },
    { label: 'Active', value: stats.active, color: '#ff9800' },
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
            Customers ({stats.total})
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
          {statsList.map((stat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
