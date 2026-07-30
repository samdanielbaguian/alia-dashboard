/**
 * Overview Page
 * Main Dashboard with comprehensive KPIs, charts, and tables
 */

"use client";

import { Box, Typography, Grid } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Store as SellersIcon,
  Inventory as ProductsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import KPICard from '@/components/cards/KPICard';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import SalesHeatmap from '@/components/charts/SalesHeatmap';
import DataTable from '@/components/tables/DataTable';
import { apiGet } from '@/utils/api';
import { formatCurrency } from '@/utils/helpers';

export default function OverviewPage() {
  // Table columns
  const orderColumns = [
    { field: 'id', headerName: 'Order ID' },
    { field: 'user_id', headerName: 'User' },
    { field: 'total_amount', headerName: 'Amount', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'created_at', headerName: 'Date' },
  ];

  const productColumns = [
    { field: 'sku', headerName: 'SKU' },
    { field: 'title', headerName: 'Product' },
    { field: 'category', headerName: 'Category' },
    { field: 'price', headerName: 'Price', type: 'currency' },
    { field: 'stock', headerName: 'Stock', type: 'number' },
  ];

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
          <Typography>Error loading dashboard: {error}</Typography>
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
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Dashboard Overview
        </Typography>
        
        {/* KPI Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Total Revenue"
              value={formatCurrency(kpiData.revenue.value)}
              change={kpiData.revenue.change}
              period={kpiData.revenue.period}
              icon={RevenueIcon}
              color="#1976d2"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard
              title="Total Orders"
              value={loading ? '—' : (overview?.orders_count ?? 0).toLocaleString()}
              change={kpiData.orders.change}
              period={kpiData.orders.period}
              icon={OrdersIcon}
              color="#42a5f5"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Total Customers"
              value={kpiData.customers.value.toLocaleString()}
              change={kpiData.customers.change}
              period={kpiData.customers.period}
              icon={CustomersIcon}
              color="#1565c0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Active Sellers"
              value={kpiData.sellers.value}
              change={kpiData.sellers.change}
              period={kpiData.sellers.period}
              icon={SellersIcon}
              color="#64b5f6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Total Products"
              value={kpiData.products.value}
              change={kpiData.products.change}
              period={kpiData.products.period}
              icon={ProductsIcon}
              color="#0d47a1"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <KPICard
              title="Low Stock Alert"
              value={loading ? '—' : (overview?.low_stock ?? 0)}
              change={kpiData.lowStock.change}
              period={kpiData.lowStock.period}
              icon={WarningIcon}
              color="#f57c00"
            />
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <LineChart title="Sales Trend" data={salesChartData} height={300} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <DonutChart title="Category Distribution" data={categoryDistribution} />
          </Grid>
        </Grid>

        {/* Tables Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <DataTable
              title="Recent Orders"
              columns={orderColumns}
              data={recentOrders}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12 }}>
            <DataTable
              title="Products"
              columns={productColumns}
              data={allProducts.slice(0, 5)}
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
