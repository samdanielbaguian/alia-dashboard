'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Skeleton,
  LinearProgress, Divider, Alert, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import {
  TrendingUp, ShoppingCart, Percent, ShoppingBag, People, EuroSymbol,
  Refresh, FileDownload,
} from '@mui/icons-material';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const PERIODS = [
  { value: '7d',   label: '7 derniers jours' },
  { value: '30d',  label: '30 derniers jours' },
  { value: '90d',  label: '3 derniers mois'  },
  { value: '12m',  label: '12 derniers mois' },
];

function getPeriodDates(period) {
  const end = new Date();
  const start = new Date(end);
  const days = period === '7d' ? 7 : period === '90d' ? 90 : period === '12m' ? 365 : 30;
  start.setDate(start.getDate() - days + 1);
  const toIsoDate = (date) => date.toISOString().slice(0, 10);
  return { from: toIsoDate(start), to: toIsoDate(end) };
}

// Pure SVG donut chart — no external lib
function DonutChart({ data = [], size = 160 }) {
  if (!data?.length) return <Box sx={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption" sx={{ color: '#b0b0b0' }}>Aucune donnée</Typography></Box>;
  const total = data.reduce((s, d) => s + (d.value || 0), 0);
  if (total === 0) return null;
  const r = 56, cx = size / 2, cy = size / 2, stroke = 18;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <Box sx={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {data.map((d, i) => {
          const pct = (d.value || 0) / total;
          const dash = pct * circ;
          const gap = circ - dash;
          const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset * circ} strokeLinecap="butt" />;
          offset += pct;
          return el;
        })}
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 900, color: '#2c3e50', lineHeight: 1 }}>{total}</Typography>
        <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.65rem' }}>total</Typography>
      </Box>
    </Box>
  );
}

// Pure CSS bar chart
function BarChart({ data = [], color = '#1976d2', height = 140 }) {
  if (!data?.length) return <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Typography variant="caption" sx={{ color: '#b0b0b0' }}>Aucune donnée</Typography></Box>;
  const max = Math.max(...data.map(d => d.value || 0), 1);
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height, width: '100%' }}>
      {data.map((d, i) => (
        <Box key={i} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3, height: '100%', justifyContent: 'flex-end' }}>
          <Box title={`${d.label || ''}: ${(d.value || 0).toLocaleString('fr-FR')}`} sx={{
            width: '100%', minHeight: 3,
            height: `${Math.max(3, ((d.value || 0) / max) * 100)}%`,
            background: color, borderRadius: '3px 3px 0 0',
            transition: 'height 0.4s',
            '&:hover': { opacity: 0.8 },
            cursor: 'default',
          }} />
          {data.length <= 14 && (
            <Typography variant="caption" sx={{ fontSize: '0.55rem', color: '#b0b0b0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
              {d.label}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}

function KpiCard({ title, value, subtitle, icon, gradient, loading, delta }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', position: 'relative' }}>
      <Box sx={{ height: 4, background: gradient }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, fontSize: '0.8rem' }}>{title}</Typography>
          <Box sx={{ p: 0.8, borderRadius: 2, background: gradient, color: '#fff', display: 'flex' }}>{icon}</Box>
        </Box>
        {loading ? <Skeleton height={40} width="60%" /> : (
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#2c3e50', lineHeight: 1.1 }}>{value}</Typography>
        )}
        {subtitle && <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.72rem', mt: 0.5, display: 'block' }}>{subtitle}</Typography>}
        {delta !== undefined && !loading && (
          <Chip size="small" label={`${delta >= 0 ? '+' : ''}${delta}%`}
            sx={{ mt: 1, height: 20, fontSize: '0.7rem', fontWeight: 700, bgcolor: delta >= 0 ? 'rgba(76,175,80,0.12)' : 'rgba(244,67,54,0.12)', color: delta >= 0 ? '#4caf50' : '#f44336' }} />
        )}
      </CardContent>
    </Card>
  );
}

export default function MerchantStats() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('30d');
  const [stats, setStats] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const mid = user?.id || user?._id;

  const fetchStats = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    const dates = getPeriodDates(period);
    const [statsRes, bsRes] = await Promise.allSettled([
      apiGet(`/merchants/me/orders/stats?from=${dates.from}&to=${dates.to}`),
      apiGet(`/merchants/me/bestsellers?from=${dates.from}&to=${dates.to}&limit=10`),
    ]);
    if (statsRes.status === 'fulfilled') setStats(statsRes.value);
    if (bsRes.status === 'fulfilled') {
      const bestsellerData = bsRes.value;
      let bs = bestsellerData?.top_products || bestsellerData?.bestsellers || bestsellerData || [];
      // Ensure bestsellers is always an array
      if (!Array.isArray(bs)) {
        bs = bs?.data || bs?.items || bs?.products || [];
      }
      setBestsellers(Array.isArray(bs) ? bs : []);
      setCategories(Array.isArray(bestsellerData?.top_categories) ? bestsellerData.top_categories : []);
    }
    setLoading(false);
  }, [mid, period]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Derived data for charts
  const dailySales = stats?.stats || stats?.daily_sales || stats?.sales_by_day || [];
  const salesChartData = dailySales.map(d => ({
    label: d.date ? new Date(`${d.date}T00:00:00`).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) : '',
    value: d.total_amount ?? d.revenue ?? d.amount ?? d.total ?? 0,
  }));

  const summary = stats?.summary || {};

  const ordersByStatus = [
    { label: 'En attente', value: dailySales.reduce((sum, d) => sum + (d.orders_pending || 0), 0), color: '#ff9800' },
    { label: 'Confirmées', value: dailySales.reduce((sum, d) => sum + (d.orders_confirmed || 0), 0), color: '#2196f3' },
    { label: 'Expédiées', value: dailySales.reduce((sum, d) => sum + (d.orders_shipped || 0), 0), color: '#9c27b0' },
    { label: 'Livrées', value: dailySales.reduce((sum, d) => sum + (d.orders_delivered || 0), 0), color: '#4caf50' },
    { label: 'Annulées', value: dailySales.reduce((sum, d) => sum + (d.orders_cancelled || 0), 0), color: '#f44336' },
  ].filter(d => d.value > 0);

  const categoryData = categories;
  const maxCatSales = Math.max(...categoryData.map(c => c.revenue || c.sales || 0), 1);

  const kpis = [
    { title: "Chiffre d'affaires", value: `${Number(summary.total_sales || 0).toLocaleString('fr-FR')} XOF`, subtitle: 'Revenu sur la période', icon: <EuroSymbol sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#1976d2,#42a5f5)' },
    { title: 'Commandes', value: Number(summary.total_orders || 0).toLocaleString('fr-FR'), subtitle: 'Commandes reçues', icon: <ShoppingCart sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#9c27b0,#ce93d8)' },
    { title: 'Panier moyen', value: `${Number(summary.avg_order_value || 0).toLocaleString('fr-FR')} XOF`, subtitle: 'Valeur moyenne / commande', icon: <ShoppingBag sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#ff9800,#ffcc80)' },
    { title: 'Produits vendus', value: Number(summary.total_items_sold || bestsellers.reduce((sum, product) => sum + (product.quantity_sold || 0), 0)).toLocaleString('fr-FR'), subtitle: 'Articles écoulés', icon: <TrendingUp sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#4caf50,#a5d6a7)' },
  ];

  const handleExport = () => {
    if (!stats) return;
    const rows = salesChartData.map(d => [d.label, d.value]);
    const csv = [['Date', 'CA (XOF)'], ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stats_${period}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MerchantDashboardLayout title="Statistiques">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Statistiques</Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Analyse de vos performances commerciales</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Période</InputLabel>
            <Select value={period} onChange={e => setPeriod(e.target.value)} label="Période" sx={{ borderRadius: 2 }}>
              {PERIODS.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchStats} disabled={loading}
            sx={{ borderRadius: 2, color: '#7f8c8d', borderColor: 'rgba(0,0,0,0.2)' }}>
            Actualiser
          </Button>
          <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}
            sx={{ borderRadius: 2, color: '#4caf50', borderColor: '#4caf50', fontWeight: 600 }}>
            Export CSV
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <KpiCard {...k} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales bar chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>Évolution du CA</Typography>
              <Typography variant="caption" sx={{ color: '#7f8c8d' }}>Chiffre d'affaires quotidien (XOF)</Typography>
              <Box sx={{ mt: 2.5 }}>
                {loading ? <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} /> : (
                  <BarChart data={salesChartData} color="#1976d2" height={140} />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Order status donut */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.5 }}>Statuts des commandes</Typography>
              <Typography variant="caption" sx={{ color: '#7f8c8d' }}>Répartition sur la période</Typography>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><Skeleton variant="circular" width={160} height={160} /></Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <DonutChart data={ordersByStatus} size={160} />
                  <Box sx={{ mt: 2, width: '100%' }}>
                    {ordersByStatus.map(d => (
                      <Box key={d.label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: d.color, flexShrink: 0 }} />
                          <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.75rem' }}>{d.label}</Typography>
                        </Box>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#2c3e50' }}>{d.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top products */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5 }}>Top 10 produits</Typography>
              {loading ? [...Array(5)].map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 1 }} />) : !Array.isArray(bestsellers) || bestsellers.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Aucune donnée disponible</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.8 }}>
                  {Array.isArray(bestsellers) && bestsellers.slice(0, 10).map((p, i) => {
                    const maxSales = bestsellers[0]?.sales_count || bestsellers[0]?.quantity_sold || 1;
                    const sales = p.sales_count || p.quantity_sold || 0;
                    const pct = Math.round((sales / maxSales) * 100);
                    return (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 900, color: i < 3 ? '#ff9800' : '#7f8c8d', fontSize: '0.75rem', width: 20 }}>#{i + 1}</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.82rem' }} noWrap>
                              {p.title || p.name || `Produit ${i + 1}`}
                            </Typography>
                          </Box>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: '#4caf50', whiteSpace: 'nowrap' }}>
                            {sales} vendus
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={pct}
                          sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: i < 3 ? '#ff9800' : '#1976d2' } }} />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sales by category */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5 }}>CA par catégorie</Typography>
              {loading ? [...Array(4)].map((_, i) => <Skeleton key={i} height={36} sx={{ mb: 1 }} />) : categoryData.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Aucune donnée disponible</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {categoryData.map((c, i) => {
                    const rev = c.revenue || c.sales || 0;
                    const pct = Math.round((rev / maxCatSales) * 100);
                    const COLORS = ['#1976d2', '#9c27b0', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#795548'];
                    return (
                      <Box key={i}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50', fontSize: '0.82rem' }}>{c.category || c.name}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 700, color: COLORS[i % COLORS.length] }}>
                            {rev.toLocaleString('fr-FR')} XOF
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={pct}
                          sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: COLORS[i % COLORS.length] } }} />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MerchantDashboardLayout>
  );
}
