/**
 * Reports Page
 * Analytics and reporting dashboard
 */

'use client';

import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { GetApp as ExportIcon, Assessment as ReportsIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import SalesHeatmap from '@/components/charts/SalesHeatmap';
import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';

export default function ReportsPage() {
  const [reportStats, setReportStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [chartData, setChartData] = useState({ sales: [], categories: [], heatmap: [] });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const ordersData = await apiGet('/merchants/me/orders');
        const productsData = await apiGet('/merchants/me/products');
        
        const orders = ordersData.orders || [];
        const products = productsData.products || [];

        if (orders.length === 0) {
          setError('No orders found');
          setLoading(false);
          return;
        }

        // Calculate KPI Stats
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const avgOrderValue = totalRevenue / orders.length;
        const completedOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed').length;
        const conversionRate = ((completedOrders / orders.length) * 100).toFixed(2);
        const customerLTV = totalRevenue / new Set(orders.map(o => o.user_id)).size;

        setReportStats([
          { 
            label: 'Monthly Revenue', 
            value: `€${totalRevenue.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
            change: '+12.5%', 
            color: '#1976d2' 
          },
          { 
            label: 'Avg Order Value', 
            value: `€${avgOrderValue.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
            change: '+5.2%', 
            color: '#4caf50' 
          },
          { 
            label: 'Conversion Rate', 
            value: `${conversionRate}%`, 
            change: '+0.8%', 
            color: '#ff9800' 
          },
          { 
            label: 'Customer LTV', 
            value: `€${customerLTV.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, 
            change: '+15.3%', 
            color: '#9c27b0' 
          },
        ]);

        // Calculate top products from orders
        const productSales = {};
        orders.forEach(order => {
          if (order.products) {
            order.products.forEach(product => {
              if (!productSales[product.id]) {
                productSales[product.id] = { 
                  ...product, 
                  sales: 0, 
                  quantity: 0 
                };
              }
              productSales[product.id].sales += (product.price * (product.quantity || 1)) || 0;
              productSales[product.id].quantity += product.quantity || 1;
            });
          }
        });

        const topProductsList = Object.values(productSales)
          .sort((a, b) => b.sales - a.sales)
          .slice(0, 5);

        setTopProducts(topProductsList);

        // Generate chart data
        const salesByDate = {};
        orders.forEach(order => {
          const date = new Date(order.created_at).toLocaleDateString('fr-FR');
          salesByDate[date] = (salesByDate[date] || 0) + (order.total_amount || 0);
        });

        setChartData({
          sales: Object.entries(salesByDate).map(([date, amount]) => ({ date, amount })),
          categories: topProductsList.map(p => ({ name: p.title, value: p.sales })),
          heatmap: generateHeatmapData(orders),
        });

        setError(null);
      } catch (err) {
        console.error('Failed to load reports:', err);
        setError(err.message || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  const generateHeatmapData = (orders) => {
    // Create a heatmap showing sales by day of week and hour
    const heatmap = {};
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    orders.forEach(order => {
      const date = new Date(order.created_at);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const hour = date.getHours();
      const key = `${dayOfWeek}-${hour}`;
      heatmap[key] = (heatmap[key] || 0) + (order.total_amount || 0);
    });

    return Object.entries(heatmap).map(([key, value]) => ({ period: key, value }));
  };

  const handleExportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      period: 'Current Month',
      stats: reportStats,
      topProducts: topProducts,
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
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
            Reports & Analytics
          </Typography>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
        </Box>

        {/* Report Stats */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {reportStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ReportsIcon sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#000000' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600, mt: 1 }}>
                    {stat.change}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <LineChart 
              title="Revenue Trend Analysis" 
              data={chartData.sales.length > 0 ? chartData.sales : []} 
              height={350} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DonutChart 
              title="Top Products by Revenue" 
              data={chartData.categories.length > 0 ? chartData.categories : []} 
            />
          </Grid>
        </Grid>

        {/* Top Products Table */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Top Selling Products
                </Typography>
                <Box sx={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #ddd' }}>
                        <th style={{ textAlign: 'left', padding: '12px' }}>Product</th>
                        <th style={{ textAlign: 'right', padding: '12px' }}>Units Sold</th>
                        <th style={{ textAlign: 'right', padding: '12px' }}>Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                          <td style={{ padding: '12px' }}>{product.title}</td>
                          <td style={{ textAlign: 'right', padding: '12px' }}>{product.quantity}</td>
                          <td style={{ textAlign: 'right', padding: '12px', fontWeight: 600 }}>
                            €{product.sales.toLocaleString('fr-FR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Heatmap */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SalesHeatmap 
              title="Sales Activity Pattern" 
              data={chartData.heatmap.length > 0 ? chartData.heatmap : []} 
            />
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
