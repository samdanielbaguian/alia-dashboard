'use client';
import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, InputAdornment, Avatar, Pagination,
} from '@mui/material';
import {
  People as PeopleIcon, Star as StarIcon, TrendingUp,
  Search as SearchIcon, CalendarToday, Refresh,
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

export default function CustomersPage() {
  const { user } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState({ total: 0, vip: 0, active: 0, newThisMonth: 0 });

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiGet('/merchants/me/orders');
      const orders = data?.orders || [];
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const customerMap = {};

      orders.forEach(order => {
        const cid = order.user_id || order.buyer_id || String(Math.random());
        if (!customerMap[cid]) {
          customerMap[cid] = {
            id: cid,
            name: order.user_name || order.buyer_name || 'Client anonyme',
            email: order.user_email || order.buyer_email || '—',
            orders: 0, totalSpent: 0, lastOrder: null, orderDates: [],
          };
        }
        customerMap[cid].orders += 1;
        customerMap[cid].totalSpent += order.total_amount || 0;
        const d = new Date(order.created_at);
        customerMap[cid].orderDates.push(d);
        if (!customerMap[cid].lastOrder || d > new Date(customerMap[cid].lastOrder)) {
          customerMap[cid].lastOrder = order.created_at;
        }
      });

      const list = Object.values(customerMap).map(c => ({
        ...c,
        isVIP: c.orders >= 5 || c.totalSpent >= 100000,
        isNew: c.orderDates.some(d => d >= monthStart),
        totalSpentFmt: c.totalSpent.toLocaleString('fr-FR'),
        lastOrderFmt: c.lastOrder ? new Date(c.lastOrder).toLocaleDateString('fr-FR') : '—',
      })).sort((a, b) => b.totalSpent - a.totalSpent);

      setCustomers(list);
      setStats({
        total: list.length,
        vip: list.filter(c => c.isVIP).length,
        active: list.length,
        newThisMonth: list.filter(c => c.isNew).length,
      });
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const filtered = customers.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * LIMIT, page * LIMIT);

  const kpis = [
    { title: 'Total clients',       value: stats.total,        gradient: 'linear-gradient(135deg,#1976d2,#42a5f5)', icon: <PeopleIcon    sx={{ fontSize: 20 }} /> },
    { title: 'Clients VIP',         value: stats.vip,          gradient: 'linear-gradient(135deg,#9c27b0,#ce93d8)', icon: <StarIcon       sx={{ fontSize: 20 }} /> },
    { title: 'Nouveaux ce mois',    value: stats.newThisMonth, gradient: 'linear-gradient(135deg,#4caf50,#a5d6a7)', icon: <CalendarToday  sx={{ fontSize: 20 }} /> },
    { title: 'Clients actifs',      value: stats.active,       gradient: 'linear-gradient(135deg,#ff9800,#ffcc80)', icon: <TrendingUp     sx={{ fontSize: 20 }} /> },
  ];

  return (
    <MerchantDashboardLayout title="Clients">
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Clients</Typography>
          <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
            Vue d&apos;ensemble de votre base clients
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchCustomers} disabled={loading}
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

      {/* Barre de recherche */}
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

      {/* Tableau clients */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                {['Client', 'Email', 'Commandes', 'Dépenses totales', 'Dernière commande', 'Statut'].map(h => (
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
                    {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton height={20} /></TableCell>)}
                  </TableRow>
                ))
              ) : paginated.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
                      {search ? 'Aucun client trouvé' : 'Aucun client pour le moment'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginated.map(c => (
                <TableRow key={c.id} hover sx={{ '& td': { py: 1.5 }, '&:hover': { bgcolor: '#f8f9ff' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(25,118,210,0.12)', color: '#1976d2', fontSize: '0.8rem', fontWeight: 700 }}>
                        {(c.name || '?')[0].toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#2c3e50' }}>{c.name}</Typography>
                        {c.isVIP && (
                          <Chip label="VIP" size="small" sx={{ height: 16, fontSize: '0.6rem', bgcolor: 'rgba(156,39,176,0.1)', color: '#9c27b0', fontWeight: 700 }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{c.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{c.orders}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {c.totalSpentFmt} XOF
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>{c.lastOrderFmt}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={c.isVIP ? 'VIP' : c.isNew ? 'Nouveau' : 'Régulier'}
                      size="small"
                      sx={{
                        bgcolor: c.isVIP ? 'rgba(156,39,176,0.1)' : c.isNew ? 'rgba(76,175,80,0.1)' : 'rgba(25,118,210,0.1)',
                        color: c.isVIP ? '#9c27b0' : c.isNew ? '#4caf50' : '#1976d2',
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
