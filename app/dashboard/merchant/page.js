'use client';

import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Avatar,
  LinearProgress, IconButton, Tooltip, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Alert, Fade,
} from '@mui/material';
import {
  TrendingUp, TrendingDown, AttachMoney, ShoppingBag, Storefront,
  Star, Refresh, ArrowForward, CheckCircle, LocalShipping,
  Cancel, HourglassEmpty, Warning, Notifications, OpenInNew,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiPost } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data = [], color = '#1976d2', height = 160 }) {
  const max = Math.max(...data.map(d => d.value || 0), 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height, px: 1 }}>
      {data.map((d, i) => (
        <Tooltip key={i} title={`${d.label || ''}: ${(d.value || 0).toLocaleString('fr-FR')} XOF`}>
          <Box sx={{
            flex: 1,
            background: `linear-gradient(180deg, ${color} 0%, ${color}99 100%)`,
            height: `${Math.max((d.value / max) * 100, 4)}%`,
            borderRadius: '4px 4px 0 0',
            transition: 'height 0.6s ease',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            minWidth: 8,
          }} />
        </Tooltip>
      ))}
    </Box>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────
function DonutChart({ data = [], size = 130 }) {
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const r = (size - 24) / 2;
  const circ = 2 * Math.PI * r;
  const center = size / 2;
  let cumulPct = 0;
  return (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {data.map((d, i) => {
          const pct = (d.value || 0) / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const rot = cumulPct * 360 - 90;
          cumulPct += pct;
          return (
            <circle key={i} cx={center} cy={center} r={r}
              fill="none" stroke={d.color} strokeWidth={14}
              strokeDasharray={`${dash} ${gap}`}
              transform={`rotate(${rot} ${center} ${center})`}
            />
          );
        })}
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1, fontSize: '1.2rem', color: '#2c3e50' }}>{total}</Typography>
        <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.6rem' }}>Total</Typography>
      </Box>
    </Box>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ title, value, subtitle, icon, gradient, trend, trendValue, loading }) {
  return (
    <Card sx={{
      borderRadius: 3, overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 32px rgba(0,0,0,0.14)' },
    }}>
      <Box sx={{ height: 4, background: gradient }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{
            width: 48, height: 48, borderRadius: 2.5,
            background: gradient, display: 'flex', alignItems: 'center',
            justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          }}>
            {icon}
          </Box>
          {!loading && (
            <Chip
              label={`${trend === 'up' ? '+' : ''}${trendValue}%`}
              size="small"
              icon={trend === 'up' ? <TrendingUp sx={{ fontSize: '12px !important' }} /> : <TrendingDown sx={{ fontSize: '12px !important' }} />}
              sx={{
                bgcolor: trend === 'up' ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                color: trend === 'up' ? '#4caf50' : '#f44336',
                fontWeight: 700, fontSize: '0.7rem', height: 22,
                '& .MuiChip-icon': { color: 'inherit' },
              }}
            />
          )}
        </Box>
        {loading ? (
          <><Skeleton width="60%" height={36} /><Skeleton width="80%" height={20} /></>
        ) : (
          <>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50', lineHeight: 1.2, mb: 0.3 }}>{value}</Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d', fontSize: '0.82rem' }}>{title}</Typography>
            {subtitle && <Typography variant="caption" sx={{ color: '#b0b0b0', fontSize: '0.7rem' }}>{subtitle}</Typography>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending:   { label: 'En attente', color: '#ff9800', bg: 'rgba(255,152,0,0.1)'   },
  confirmed: { label: 'Confirmée',  color: '#2196f3', bg: 'rgba(33,150,243,0.1)'  },
  shipped:   { label: 'Expédiée',   color: '#9c27b0', bg: 'rgba(156,39,176,0.1)'  },
  delivered: { label: 'Livrée',     color: '#4caf50', bg: 'rgba(76,175,80,0.1)'   },
  cancelled: { label: 'Annulée',    color: '#f44336', bg: 'rgba(244,67,54,0.1)'   },
};
function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
  return <Chip label={c.label} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 600, fontSize: '0.72rem', height: 24 }} />;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function MerchantDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [activity, setActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const mid = user?.id || user?._id;

  const fetchAll = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    try {
      const [ov, orders, best, act, alrt, stats] = await Promise.allSettled([
        apiGet(`/merchants/me/dashboard-overview`),
        apiGet(`/merchants/me/orders?limit=5`),
        apiGet(`/merchants/me/bestsellers?limit=4`),
        apiGet(`/merchants/me/recent-activity?limit=8`),
        apiGet(`/merchants/me/alerts`),
        apiGet(`/merchants/me/orders/stats?period=month`),
      ]);
      if (ov.status === 'fulfilled') setOverview(ov.value);
      if (orders.status === 'fulfilled') setRecentOrders(orders.value?.orders || orders.value || []);
      if (best.status === 'fulfilled') {
        const raw = best.value;
        const list = raw?.bestsellers ?? raw?.products ?? raw?.items ?? raw;
        setBestsellers(Array.isArray(list) ? list : []);
      }
      if (act.status === 'fulfilled') setActivity(act.value?.activities || act.value || []);
      if (alrt.status === 'fulfilled') setAlerts([...(alrt.value?.alerts || []), ...(alrt.value?.stock_alerts || [])]);
      if (stats.status === 'fulfilled') setOrderStats(stats.value?.stats || []);
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  }, [mid]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  useEffect(() => {
    const t = setInterval(fetchAll, 30000);
    return () => clearInterval(t);
  }, [fetchAll]);

  const donutData = [
    { label: 'En attente', value: overview?.orders_pending || 0, color: '#ff9800' },
    { label: 'Expédiées', value: overview?.orders_shipped || 0, color: '#9c27b0' },
    { label: 'Livrées', value: Math.max(0, (overview?.orders_count || 0) - (overview?.orders_pending || 0) - (overview?.orders_shipped || 0) - (overview?.orders_canceled || 0)), color: '#4caf50' },
    { label: 'Annulées', value: overview?.orders_canceled || 0, color: '#f44336' },
  ];
  const COLORS = ['#1976d2','#4caf50','#9c27b0','#ff9800'];
  const COLORS2 = ['#42a5f5','#81c784','#ce93d8','#ffcc02'];

  return (
    <MerchantDashboardLayout title="Dashboard Marchand">

      {alerts.length > 0 && (
        <Fade in>
          <Alert severity="warning" variant="filled" icon={<Warning />}
            action={<Button size="small" color="inherit" onClick={() => router.push('/dashboard/merchant/alerts')} endIcon={<ArrowForward />}>Voir tout</Button>}
            sx={{ mb: 2, borderRadius: 2, fontWeight: 600 }}>
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''} active{alerts.length > 1 ? 's' : ''} — Stock bas ou commandes en attente
          </Alert>
        </Fade>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Vue d&apos;ensemble</Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Mis à jour à {lastUpdated.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAll} disabled={loading}
          sx={{ borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}>
          Actualiser
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: "Chiffre d'affaires", value: `${(overview?.total_sales || 0).toLocaleString('fr-FR')} XOF`, subtitle: 'Toutes périodes', gradient: 'linear-gradient(135deg,#1976d2,#42a5f5)', icon: <AttachMoney sx={{ color: '#fff', fontSize: 24 }} />, trend: 'up', tv: 12 },
          { title: 'Commandes reçues', value: (overview?.orders_count || 0).toLocaleString('fr-FR'), subtitle: `${overview?.orders_pending || 0} en attente`, gradient: 'linear-gradient(135deg,#4caf50,#81c784)', icon: <ShoppingBag sx={{ color: '#fff', fontSize: 24 }} />, trend: 'up', tv: 8 },
          { title: 'Produits en stock', value: (overview?.products_in_stock || 0).toLocaleString('fr-FR'), subtitle: `${overview?.low_stock || 0} en rupture imminente`, gradient: 'linear-gradient(135deg,#9c27b0,#ce93d8)', icon: <Storefront sx={{ color: '#fff', fontSize: 24 }} />, trend: (overview?.low_stock || 0) > 5 ? 'down' : 'up', tv: 3 },
          { title: 'Note boutique', value: `${((overview?.rating || 50) / 20).toFixed(1)} / 5`, subtitle: 'Score satisfaction client', gradient: 'linear-gradient(135deg,#ff9800,#ffcc02)', icon: <Star sx={{ color: '#fff', fontSize: 24 }} />, trend: 'up', tv: 2 },
        ].map((kpi, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <KpiCard loading={loading} title={kpi.title} value={kpi.value} subtitle={kpi.subtitle}
              icon={kpi.icon} gradient={kpi.gradient} trend={kpi.trend} trendValue={kpi.tv} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>Évolution des ventes</Typography>
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>14 derniers jours</Typography>
                </Box>
                <Chip label="Ce mois" size="small" sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: '#1976d2', fontWeight: 600 }} />
              </Box>
              {loading ? <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} /> : (
                <MiniBarChart
                  data={orderStats.slice(-14).map(s => ({ label: s.date, value: s.total_amount || 0 }))}
                  color="#1976d2" height={160}
                />
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Statuts commandes</Typography>
              {loading ? <Skeleton variant="circular" width={130} height={130} sx={{ mx: 'auto' }} /> : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    <DonutChart data={donutData} size={130} />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {donutData.map(d => (
                      <Box key={d.label} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color }} />
                          <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{d.label}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#2c3e50' }}>{d.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders + Bestsellers */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>Commandes récentes</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/dashboard/merchant/orders')} sx={{ color: '#1976d2', fontWeight: 600 }}>Voir tout</Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { color: '#7f8c8d', fontSize: '0.75rem', fontWeight: 600, borderBottom: '1px solid rgba(0,0,0,0.06)', py: 1.2, bgcolor: '#fafafa' } }}>
                      <TableCell>Commande</TableCell>
                      <TableCell>Articles</TableCell>
                      <TableCell>Montant</TableCell>
                      <TableCell>Statut</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? [...Array(5)].map((_, i) => (
                      <TableRow key={i}>{[...Array(5)].map((_, j) => <TableCell key={j}><Skeleton /></TableCell>)}</TableRow>
                    )) : recentOrders.length === 0 ? (
                      <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: '#7f8c8d' }}>Aucune commande récente</TableCell></TableRow>
                    ) : recentOrders.map(order => {
                      const oid = order.id || order._id || '';
                      return (
                        <TableRow key={oid} hover sx={{ '& td': { py: 1.5, fontSize: '0.82rem' } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '0.8rem' }}>#{oid.slice(-6).toUpperCase()}</Typography>
                            <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : ''}</Typography>
                          </TableCell>
                          <TableCell><Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{(order.products || []).length} art.</Typography></TableCell>
                          <TableCell><Typography variant="body2" sx={{ fontWeight: 700 }}>{(order.total_amount || 0).toLocaleString('fr-FR')} XOF</Typography></TableCell>
                          <TableCell><StatusBadge status={order.status} /></TableCell>
                          <TableCell>
                            <Tooltip title="Voir détails">
                              <IconButton size="small" onClick={() => router.push(`/dashboard/merchant/orders/${oid}`)} sx={{ color: '#7f8c8d' }}>
                                <OpenInNew sx={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>Meilleures ventes</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/dashboard/merchant/stats')} sx={{ color: '#1976d2', fontWeight: 600 }}>Stats</Button>
              </Box>
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} height={60} sx={{ borderRadius: 2 }} />) :
                bestsellers.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#7f8c8d', textAlign: 'center', py: 3 }}>Aucune donnée</Typography>
                ) : bestsellers.slice(0, 4).map((p, i) => {
                  const maxS = Math.max(...bestsellers.map(b => b.total_sold || 1));
                  return (
                    <Box key={p.product_id || i} sx={{ p: 1.5, borderRadius: 2, background: '#f5f7fa', '&:hover': { background: '#e8f0fe' }, transition: 'background 0.2s' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box sx={{ width: 28, height: 28, borderRadius: 1.5, background: `linear-gradient(135deg,${COLORS[i]},${COLORS2[i]})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.75rem' }}>
                            {i + 1}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.82rem', maxWidth: 130 }} noWrap>
                            {p.title || p.product_title || `Produit ${i + 1}`}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#4caf50', fontSize: '0.8rem' }}>{p.total_sold || 0} ventes</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={((p.total_sold || 0) / maxS) * 100} sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { background: `linear-gradient(90deg,${COLORS[i]},${COLORS2[i]})`, borderRadius: 3 } }} />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Activity + Alerts */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Activité récente</Typography>
              {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} height={48} sx={{ mb: 1, borderRadius: 2 }} />) :
              activity.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#7f8c8d', textAlign: 'center', py: 3 }}>Aucune activité récente</Typography>
              ) : activity.slice(0, 7).map((act, i) => {
                const iconColor = act.type === 'new_order' ? '#1976d2' : act.type === 'low_stock' ? '#f44336' : act.type === 'status_change' ? '#4caf50' : '#ff9800';
                return (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, mb: 2, position: 'relative' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: `${iconColor}20`, color: iconColor }}>
                        {act.type === 'new_order' ? <ShoppingBag sx={{ fontSize: 16 }} /> :
                         act.type === 'low_stock' ? <Warning sx={{ fontSize: 16 }} /> :
                         act.type === 'status_change' ? <CheckCircle sx={{ fontSize: 16 }} /> :
                         <Notifications sx={{ fontSize: 16 }} />}
                      </Avatar>
                      {i < Math.min(activity.length, 7) - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'rgba(0,0,0,0.06)', mt: 0.5, minHeight: 16 }} />}
                    </Box>
                    <Box sx={{ flex: 1, pb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.82rem' }}>{act.message || act.description || 'Activité'}</Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{act.timestamp ? new Date(act.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}</Typography>
                    </Box>
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50' }}>Alertes actives</Typography>
                <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/dashboard/merchant/alerts')} sx={{ color: '#f44336', fontWeight: 600 }}>Gérer</Button>
              </Box>
              {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} height={56} sx={{ mb: 1, borderRadius: 2 }} />) :
              alerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 48, color: '#4caf50', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 600 }}>Aucune alerte active</Typography>
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>Tout est en ordre !</Typography>
                </Box>
              ) : alerts.slice(0, 5).map((alert, i) => {
                const isStock = alert.type === 'stock' || alert.current_stock !== undefined;
                return (
                  <Alert key={i} severity={isStock ? 'error' : 'warning'} sx={{ mb: 1, borderRadius: 2, py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>
                      {isStock
                        ? `Stock bas: ${alert.product_title || alert.title || 'Produit'} (${alert.current_stock ?? alert.stock ?? 0} restants)`
                        : `Commande ${(alert.order_id || '').slice(-6).toUpperCase()} en attente depuis ${alert.hours_pending || '?'}h`}
                    </Typography>
                  </Alert>
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MerchantDashboardLayout>
  );
}
