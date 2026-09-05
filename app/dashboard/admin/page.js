'use client';

import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Skeleton, Alert,
  Tab, Tabs, LineChart as LineChartIcon, BarChart as BarChartIcon,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  People as UsersIcon, Store as MerchantsIcon, Inventory as ProductsIcon,
  ShoppingCart as OrdersIcon, TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet } from '@/utils/api';

// KPI Card Component
function KPICard({ title, value, icon: Icon, color, loading }) {
  return (
    <Card sx={{
      borderRadius: 3, overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' },
    }}>
      <Box sx={{ height: 4, background: color }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 2, background: color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            <Icon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
        </Box>
        {loading ? (
          <><Skeleton width="60%" height={36} /><Skeleton width="80%" height={20} /></>
        ) : (
          <>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', lineHeight: 1.2, mb: 0.3 }}>
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.82rem' }}>
              {title}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Stat Table Component
function StatTable({ title, data, loading }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 2, color: '#2c3e50' }}>
          {title}
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[1,2,3,4].map(i => <Skeleton key={i} height={40} />)}
          </Box>
        ) : (
          <Box>
            {data && data.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {data.map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, px: 1.5, borderRadius: 1, '&:hover': { bgcolor: '#f5f7fa' } }}>
                    <Typography sx={{ fontSize: '0.9rem', color: '#2c3e50', fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#1976d2', fontWeight: 700 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: '#b0b0b0', fontSize: '0.9rem' }}>Aucune donnée</Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orderStats, setOrderStats] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch admin order stats
        const orderRes = await apiGet('/admin/orders/stats');
        setOrderStats(orderRes);

        // Fetch product count
        const prodRes = await apiGet('/admin/stats');
        const totalProducts = prodRes.total_products || 0;

        // Fetch merchant count
        const merchRes = await apiGet('/merchants?limit=1');
        const totalMerchants = merchRes.total || 0;

        // Fetch users count (via orders)
        const usersRes = await apiGet('/admin/users?limit=1');
        const totalUsers = usersRes.total || 0;

        const totalGrossRevenue = orderRes.total_gross_revenue ?? orderRes.total_revenue ?? 0;
        const totalPlatformFees = orderRes.total_platform_fees || 0;
        const platformNetRevenue = orderRes.platform_net_revenue ?? totalPlatformFees;
        const averageCommission = orderRes.total_orders ? totalPlatformFees / Math.max(orderRes.total_orders, 1) : 0;

        setStats({
          totalUsers,
          totalMerchants,
          totalProducts,
          totalOrders: orderRes.total_orders || 0,
          totalGrossRevenue,
          totalPlatformFees,
          totalGatewayFees: orderRes.total_gateway_fees || 0,
          platformNetRevenue,
          averageCommission,
          netPayout: orderRes.total_merchant_payout || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const ordersByStatus = orderStats?.status_breakdown ? Object.entries(orderStats.status_breakdown).map(([status, count]) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
  })) : [];

  const revenueByStatus = orderStats?.revenue_by_status ? Object.entries(orderStats.revenue_by_status).map(([status, data]) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: `${(data.total || 0).toLocaleString('fr-FR')} XOF`,
  })) : [];

  return (
    <AdminDashboardLayout title="Dashboard Administrateur">
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Utilisateurs totaux" value={stats?.totalUsers || 0} icon={UsersIcon} color="#3b82f6" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Marchands" value={stats?.totalMerchants || 0} icon={MerchantsIcon} color="#8b5cf6" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Produits" value={stats?.totalProducts || 0} icon={ProductsIcon} color="#10b981" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Commandes" value={stats?.totalOrders || 0} icon={OrdersIcon} color="#f59e0b" loading={loading} />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Total brut" value={loading ? 0 : `${(stats?.totalGrossRevenue || 0).toLocaleString('fr-FR')} XOF`} icon={TrendingIcon} color="#3b82f6" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Frais collectés" value={loading ? 0 : `${(stats?.totalPlatformFees || 0).toLocaleString('fr-FR')} XOF`} icon={OrdersIcon} color="#f59e0b" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Net reversé" value={loading ? 0 : `${(stats?.netPayout || 0).toLocaleString('fr-FR')} XOF`} icon={MerchantsIcon} color="#10b981" loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPICard title="Commission moyenne" value={loading ? '0 XOF' : `${stats?.averageCommission ? stats.averageCommission.toFixed(2) : '0.00'} XOF`} icon={TrendingIcon} color="#8b5cf6" loading={loading} />
        </Grid>
      </Grid>

      {/* Platform Profit */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', background: 'linear-gradient(135deg, #f59e0b 0%, #ffb74d 100%)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <TrendingIcon sx={{ color: '#fff', fontSize: 28 }} />
                <Typography sx={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Bénéfice plateforme</Typography>
              </Box>
              <Typography sx={{ color: '#fff', fontSize: '2.2rem', fontWeight: 900 }}>
                {loading ? '...' : `${(stats?.platformNetRevenue || 0).toLocaleString('fr-FR')} XOF`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Statistics */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatTable title="Commandes par statut" data={ordersByStatus} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <StatTable title="Revenu par statut" data={revenueByStatus} loading={loading} />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', mb: 2, color: '#2c3e50' }}>
          Actions rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => window.location.href = '/dashboard/admin/users'}
              sx={{
                p: 2.5, borderRadius: 2, cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <UsersIcon sx={{ fontSize: 36, color: '#3b82f6', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, color: '#2c3e50' }}>Gérer les utilisateurs</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => window.location.href = '/dashboard/admin/merchants'}
              sx={{
                p: 2.5, borderRadius: 2, cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <MerchantsIcon sx={{ fontSize: 36, color: '#8b5cf6', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, color: '#2c3e50' }}>Vérifier les marchands</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => window.location.href = '/dashboard/admin/products'}
              sx={{
                p: 2.5, borderRadius: 2, cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <ProductsIcon sx={{ fontSize: 36, color: '#10b981', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, color: '#2c3e50' }}>Modérer les produits</Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card
              onClick={() => window.location.href = '/dashboard/admin/orders'}
              sx={{
                p: 2.5, borderRadius: 2, cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' },
                transition: 'all 0.2s',
                textAlign: 'center',
              }}
            >
              <OrdersIcon sx={{ fontSize: 36, color: '#f59e0b', mb: 1 }} />
              <Typography sx={{ fontWeight: 700, color: '#2c3e50' }}>Gérer les commandes</Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </AdminDashboardLayout>
  );
}
