/**
 * Overview Page
 * Main Dashboard with comprehensive KPIs, charts, and tables
 */

"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Grid } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ShoppingCart as OrdersIcon,
  People as CustomersIcon,
  Store as SellersIcon,
  Inventory as ProductsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import KPICard from '@/components/cards/KPICard';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import SalesHeatmap from '@/components/charts/SalesHeatmap';
import SalesMapWidget from '@/components/charts/SalesMapWidget';
import DataTable from '@/components/tables/DataTable';
import {
  kpiData,
  recentOrders,
  bestSellers,
  topCustomers,
  salesChartData,
  categoryDistribution,
  heatmapData,
  salesZones,
} from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';
import { apiGet } from '@/utils/api';

export default function OverviewPage() {
  const router = useRouter();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadOverview() {
      try {
        const data = await apiGet('/merchants/me/dashboard-overview');
        if (mounted) setOverview(data);
      } catch (err) {
        console.error('Failed to load dashboard overview', err);
        // If unauthorized, clear token and redirect to login
        if (err && err.message && err.message.includes('401')) {
          try { localStorage.removeItem('access_token'); } catch (e) {}
          router.push('/');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadOverview();
    return () => { mounted = false; };
  }, [router]);
  // Table columns
  const orderColumns = [
    { field: 'id', headerName: 'Order ID' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'customer', headerName: 'Customer' },
    { field: 'amount', headerName: 'Amount', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'date', headerName: 'Date' },
  ];

  const bestSellerColumns = [
    { field: 'rank', headerName: 'Rank' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'name', headerName: 'Product' },
    { field: 'category', headerName: 'Category' },
    { field: 'sales', headerName: 'Sales', type: 'number' },
    { field: 'revenue', headerName: 'Revenue', type: 'currency' },
  ];

  const customerColumns = [
    { field: 'name', headerName: 'Customer' },
    { field: 'email', headerName: 'Email' },
    { field: 'orders', headerName: 'Orders', type: 'number' },
    { field: 'totalSpent', headerName: 'Total Spent', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
  ];

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
                value={loading ? '—' : formatCurrency(overview?.total_sales ?? 0)}
                change={kpiData.revenue.change}
                period={kpiData.revenue.period}
                icon={RevenueIcon}
                color="#1976d2"
              />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
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
              title="New Customers"
              value={loading ? '—' : (overview?.new_customers ?? 0).toLocaleString()}
              change={kpiData.customers.change}
              period={kpiData.customers.period}
              icon={CustomersIcon}
              color="#1565c0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Products In Stock"
              value={loading ? '—' : (overview?.products_in_stock ?? 0)}
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
          <Grid item xs={12} sm={6} md={4}>
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
          <Grid item xs={12} md={8}>
            <LineChart title="Sales Trend (Last 12 Months)" data={salesChartData} height={300} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart title="Category Distribution" data={categoryDistribution} />
          </Grid>
        </Grid>

        {/* Sales Heatmap - PRESERVED FROM EXISTING */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <SalesHeatmap title="Sales Activity Heatmap" data={heatmapData} />
          </Grid>
        </Grid>

        {/* Sales Map Widget - NEW FEATURE */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <SalesMapWidget title="Zones de Vente par Région" data={salesZones} />
          </Grid>
        </Grid>

        {/* Tables Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <DataTable
              title="Recent Orders"
              columns={orderColumns}
              data={recentOrders.slice(0, 5)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <DataTable
              title="Best Sellers"
              columns={bestSellerColumns}
              data={bestSellers.slice(0, 5)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DataTable
              title="Top Customers"
              columns={customerColumns}
              data={topCustomers.slice(0, 5)}
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
