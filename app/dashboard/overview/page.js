/**
 * Overview Page
 * Main Dashboard with comprehensive KPIs, charts, and tables
 */

'use client';

import { Box, Typography, Grid, CircularProgress } from '@mui/material';
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

// Fallback data structures for charts
const createEmptyLineChart = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Sales',
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    borderColor: '#1976d2',
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
  }],
});

const createEmptyDonutChart = () => ({
  labels: ['Category A', 'Category B', 'Category C'],
  datasets: [{
    data: [0, 0, 0],
    backgroundColor: ['#1976d2', '#42a5f5', '#64b5f6'],
  }],
});

export default function OverviewPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kpiData, setKpiData] = useState({
    revenue: { value: 0, change: 0, period: 'vs last month' },
    orders: { value: 0, change: 0, period: 'vs last month' },
    customers: { value: 0, change: 0, period: 'vs last month' },
    sellers: { value: 0, change: 0, period: 'vs last month' },
    products: { value: 0, change: 0, period: 'total active' },
    lowStock: { value: 0, change: 0, period: 'products' },
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [salesChartData, setSalesChartData] = useState(createEmptyLineChart());
  const [categoryDistribution, setCategoryDistribution] = useState(createEmptyDonutChart());
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch multiple endpoints in parallel
        const [dashboardData, ordersData, productsData] = await Promise.all([
          apiGet('/merchants/me/dashboard-overview').catch(() => ({})),
          apiGet('/merchants/me/orders').catch(() => ({ orders: [] })),
          apiGet('/products').catch(() => ([])),
        ]);

        // Extract orders
        const orders = dashboardData.orders || ordersData.orders || [];
        setRecentOrders(orders.slice(0, 5));

        // Extract and process products
        const products = Array.isArray(productsData) ? productsData : productsData.products || [];
        setAllProducts(products);

        // Calculate KPIs
        const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 10).length;

        setKpiData({
          revenue: { value: totalRevenue, change: 0, period: 'total' },
          orders: { value: totalOrders, change: 0, period: 'total' },
          customers: { value: 0, change: 0, period: 'vs last month' },
          sellers: { value: 0, change: 0, period: 'vs last month' },
          products: { value: totalProducts, change: 0, period: 'total active' },
          lowStock: { value: lowStockCount, change: 0, period: 'products' },
        });

        // Build category distribution chart
        const categoryCounts = {};
        products.forEach(p => {
          categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
        });
        const categories = Object.keys(categoryCounts).slice(0, 5);
        setCategoryDistribution({
          labels: categories,
          datasets: [{
            data: categories.map(c => categoryCounts[c]),
            backgroundColor: ['#1976d2', '#42a5f5', '#64b5f6', '#90caf9', '#bbdefb'],
          }],
        });

        // Build sales chart data from orders (by month)
        const monthlySales = {};
        orders.forEach(o => {
          const date = new Date(o.created_at);
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          monthlySales[monthKey] = (monthlySales[monthKey] || 0) + (o.total_amount || 0);
        });

        const months = Object.keys(monthlySales).sort().slice(-12);
        setSalesChartData({
          labels: months.map(m => m.split('-')[1]),
          datasets: [{
            label: 'Sales',
            data: months.map(m => monthlySales[m]),
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
          }],
        });

        setError(null);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
          <Grid item xs={12} sm={6} md={4}>
            <KPICard
              title="Total Orders"
              value={kpiData.orders.value.toLocaleString()}
              change={kpiData.orders.change}
              period={kpiData.orders.period}
              icon={OrdersIcon}
              color="#42a5f5"
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
              value={kpiData.lowStock.value}
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
            <LineChart title="Sales Trend" data={salesChartData} height={300} />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart title="Category Distribution" data={categoryDistribution} />
          </Grid>
        </Grid>

        {/* Tables Row */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <DataTable
              title="Recent Orders"
              columns={orderColumns}
              data={recentOrders}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
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
