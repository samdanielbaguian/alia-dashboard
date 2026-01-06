/**
 * Sellers Page
 * Displays and manages all sellers/vendors
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent } from '@mui/material';
import { Add as AddIcon, Store as SellersIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { sellers } from '@/data/mockData';

export default function SellersPage() {
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

  const stats = [
    { label: 'Total Sellers', value: '48', color: '#1976d2' },
    { label: 'Active Sellers', value: '42', color: '#4caf50' },
    { label: 'New This Month', value: '3', color: '#ff9800' },
    { label: 'Pending Approval', value: '2', color: '#f44336' },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Sellers / Vendors
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ textTransform: 'none' }}
          >
            Add Seller
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
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

        {/* Sellers Table */}
        <DataTable
          title="All Sellers"
          columns={columns}
          data={sellers}
        />
      </Box>
    </DashboardLayout>
  );
}
