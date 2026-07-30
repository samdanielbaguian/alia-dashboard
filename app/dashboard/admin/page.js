<<<<<<< HEAD
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
=======
"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminCheck } from "../../../utils/protectedRoute"
import * as adminApi from "../../../utils/AdminApi"
import Link from "next/link"

export default function AdminOverview() {
  const router = useRouter()
  const { isAdminUser, loading } = useAdminCheck()
  const [stats, setStats] = useState({
    orders: { pending: 0, total: 0 },
    users: { total: 0, suspended: 0, banned: 0 },
    products: { pending: 0, approved: 0, rejected: 0, total: 0 },
    merchants: { pending: 0, verified: 0, suspended: 0, totalRevenue: 0 }
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, loading, router])

  useEffect(() => {
    if (isAdminUser) {
      fetchAllStats()
    }
  }, [isAdminUser])

  const fetchAllStats = async () => {
    setLoadingStats(true)
    try {
      // Fetch all stats in parallel
      const [productsStats, merchantsStats] = await Promise.all([
        adminApi.getProductsStats().catch(() => ({ pending_count: 0, approved_count: 0, rejected_count: 0, total_count: 0 })),
        adminApi.getMerchantsStats().catch(() => ({ pending_count: 0, verified_count: 0, suspended_count: 0, total_revenue: 0 }))
      ])

      setStats({
        orders: { pending: 0, total: 0 }, // We can enhance this later with order stats endpoint
        users: { total: 0, suspended: 0, banned: 0 }, // We can enhance this later with user stats endpoint
        products: {
          pending: productsStats.pending_count || 0,
          approved: productsStats.approved_count || 0,
          rejected: productsStats.rejected_count || 0,
          total: productsStats.total_count || 0
        },
        merchants: {
          pending: merchantsStats.pending_count || 0,
          verified: merchantsStats.verified_count || 0,
          suspended: merchantsStats.suspended_count || 0,
          totalRevenue: merchantsStats.total_revenue || 0
        }
      })
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Checking permissions...</div>
  }

  if (!isAdminUser) {
    return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 30 }}>Welcome to the admin control panel. Manage all aspects of the platform.</p>
      
      {loadingStats ? (
        <div>Loading statistics...</div>
      ) : (
        <>
          {/* Platform Statistics */}
          <div style={{ marginBottom: 40 }}>
            <h2>Platform Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
              {/* Products Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Products</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1976d2" }}>{stats.products.total}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "#f59e0b" }}>⏳ {stats.products.pending} pending</span>
                  <span style={{ color: "#10b981" }}>✓ {stats.products.approved}</span>
                </div>
              </div>

              {/* Merchants Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Merchants</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1976d2" }}>{stats.merchants.verified}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "#f59e0b" }}>⏳ {stats.merchants.pending} pending</span>
                  <span style={{ color: "#dc2626" }}>⏸ {stats.merchants.suspended}</span>
                </div>
              </div>

              {/* Revenue Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Total Revenue</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#10b981" }}>
                  ${stats.merchants.totalRevenue.toFixed(2)}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                  From all merchant sales
                </div>
              </div>

              {/* Pending Reviews */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Needs Review</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#f59e0b" }}>
                  {stats.products.pending + stats.merchants.pending}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                  Products & Merchants
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
              <Link href="/dashboard/admin/orders" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>📦 Order Approvals</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Review and approve payment & shipping for orders</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/users" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>👥 User Management</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Manage users, suspend accounts, reset passwords</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/products" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>📦 Product Approval</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Review and approve products • <span style={{ color: "#f59e0b", fontWeight: 600 }}>{stats.products.pending} pending</span>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/admin/merchants" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>🏪 Merchant Verification</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Verify merchants & set commissions • <span style={{ color: "#f59e0b", fontWeight: 600 }}>{stats.merchants.pending} pending</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

>>>>>>> f986b201f2e5007a8fb787a31ce149833f898f68
