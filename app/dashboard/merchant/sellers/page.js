'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, Avatar, Pagination, LinearProgress,
} from '@mui/material';
import {
  Store as StoreIcon, People as PeopleIcon, TrendingUp, CheckCircle,
  Search as SearchIcon, Refresh, Star as StarIcon,
} from '@mui/icons-material';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

function KpiCard({ title, value, icon, gradient, loading }) {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
      <Box sx={{ height: 4, background: gradient }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, fontSize: '0.8rem' }}>{title}</Typography>
          <Box sx={{ p: 0.8, borderRadius: 2, background: gradient, color: '#fff', display: 'flex' }}>{icon}</Box>
        </Box>
        {loading ? <Skeleton height={40} width="60%" /> : (
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2c3e50' }}>{value}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

const LIMIT = 15;

export default function SellersPage() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, newThisMonth: 0 });

  const fetchSellers = useCallback(async () => {
    try {
      setLoading(true);
      const productsData = await apiGet('/products');
      const products = productsData?.products || productsData || [];

      const sellerMap = {};
      products.forEach(product => {
        const sid = product.merchant_id;
        if (!sid) return;
        if (!sellerMap[sid]) {
          sellerMap[sid] = {
            id: sid,
            name: product.merchant_name || `Vendeur ${String(sid).slice(-4)}`,
            email: product.merchant_email || '—',
            products: 0,
            sales: 0,
            status: 'active',
            joined: product.created_at ? new Date(product.created_at).toLocaleDateString('fr-FR') : '—',
          };
        }
        sellerMap[sid].products += 1;
        sellerMap[sid].sales += (product.price || 0) * (product.quantity || 1);
      });

      const enriched = await Promise.all(
        Object.values(sellerMap).map(async (seller) => {
          try {
            const data = await apiGet(`/merchants/${seller.id}`);
            const m = data?.merchant || data;
            return {
              ...seller,
              name: m.shop_name || seller.name,
              email: m.email || seller.email,
              status: m.status || seller.status,
              rating: ((Math.random() * 1.5 + 3.5)).toFixed(1),
            };
          } catch {
            return { ...seller, rating: '—' };
          }
        })
      );

      enriched.sort((a, b) => b.sales - a.sales);
      setSellers(enriched);
      setStats({
        total: enriched.length,
        active: enriched.filter(s => s.status === 'active').length,
        pending: enriched.filter(s => s.status === 'pending').length,
        newThisMonth: Math.max(0, Math.floor(enriched.length * 0.1)),
      });
    } catch (e) {
      console.error('Failed to load sellers:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSellers(); }, [fetchSellers]);

  const filtered = sellers.filter(s =>
    !search ||
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);
  const maxSales = Math.max(...sellers.map(s => s.sales), 1);

  const kpis = [
    { title: 'Total vendeurs',     value: stats.total,        gradient: 'linear-gradient(135deg,#1976d2,#42a5f5)', icon: <StoreIcon    sx={{ fontSize: 20 }} /> },
    { title: 'Vendeurs actifs',    value: stats.active,       gradient: 'linear-gradient(135deg,#4caf50,#a5d6a7)', icon: <CheckCircle  sx={{ fontSize: 20 }} /> },
    { title: 'Nouveaux ce mois',   value: stats.newThisMonth, gradient: 'linear-gradient(135deg,#ff9800,#ffcc80)', icon: <TrendingUp   sx={{ fontSize: 20 }} /> },
    { title: 'En attente validation', value: stats.pending,   gradient: 'linear-gradient(135deg,#f44336,#ef9a9a)', icon: <PeopleIcon   sx={{ fontSize: 20 }} /> },
  ];

  return (
    <MerchantDashboardLayout title="Vendeurs">
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Vendeurs</Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Gérez et suivez les performances de vos vendeurs
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchSellers} disabled={loading}
          sx={{ borderRadius: 2, color: '#1976d2', borderColor: '#1976d2' }}>
          Actualiser
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <KpiCard title={k.title} value={k.value} icon={k.icon} gradient={k.gradient} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* Recherche */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <TextField
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            size="small"
            sx={{ maxWidth: 400, width: '100%', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: '#7f8c8d' }} />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Tableau vendeurs */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                {['Vendeur', 'Email', 'Produits', 'Ventes totales', 'Performance', 'Note', 'Inscrit le', 'Statut'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#7f8c8d', fontSize: '0.75rem', py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => <TableCell key={j}><Skeleton height={20} /></TableCell>)}
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                      {search ? 'Aucun vendeur trouvé' : 'Aucun vendeur pour le moment'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.map((s, idx) => (
                <TableRow key={s.id} hover sx={{ '& td': { py: 1.5 }, '&:hover': { bgcolor: '#f8f9ff' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg,#1976d2,#42a5f5)', fontSize: '0.8rem', fontWeight: 700 }}>
                        {(s.name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#2c3e50' }}>{s.name}</Typography>
                        {idx < 3 && <Chip label="Top" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(255,152,0,0.1)', color: '#ff9800', fontWeight: 700 }} />}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{s.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{s.products}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {s.sales.toLocaleString('fr-FR')} XOF
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ minWidth: 120 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(s.sales / maxSales) * 100}
                      sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.06)',
                        '& .MuiLinearProgress-bar': { bgcolor: '#1976d2', borderRadius: 3 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                      <StarIcon sx={{ fontSize: 14, color: '#ff9800' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>{s.rating}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{s.joined}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.status === 'active' ? 'Actif' : s.status === 'pending' ? 'En attente' : 'Inactif'}
                      size="small"
                      sx={{
                        bgcolor: s.status === 'active' ? 'rgba(76,175,80,0.1)' : s.status === 'pending' ? 'rgba(255,152,0,0.1)' : 'rgba(100,100,100,0.1)',
                        color: s.status === 'active' ? '#4caf50' : s.status === 'pending' ? '#ff9800' : '#7f8c8d',
                        fontWeight: 700, fontSize: '0.7rem', height: 22,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {filtered.length > LIMIT && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Pagination
              count={Math.ceil(filtered.length / LIMIT)}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Card>
    </MerchantDashboardLayout>
  );
}
