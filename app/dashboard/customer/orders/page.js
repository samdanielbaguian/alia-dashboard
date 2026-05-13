'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Card, Chip, Button, IconButton, TextField,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tooltip,
  Skeleton, Pagination, InputAdornment, Alert,
} from '@mui/material';
import {
  Search, FilterList, Visibility, Cancel, Download,
  ShoppingBag, ArrowForward,
} from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { mockOrders } from '@/utils/mockData';

const STATUS_CFG = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: '#fef3c7' },
  confirmed: { label: 'Confirmée',   color: '#3b82f6', bg: '#dbeafe' },
  shipped:   { label: 'Expédiée',    color: '#8b5cf6', bg: '#ede9fe' },
  delivered: { label: 'Livrée',      color: '#10b981', bg: '#d1fae5' },
  cancelled: { label: 'Annulée',     color: '#ef4444', bg: '#fee2e2' },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <Chip label={c.label} size="small"
      sx={{ bgcolor: c.bg, color: c.color, fontWeight: 700, fontSize: '0.72rem', border: `1px solid ${c.color}30` }} />
  );
}

const PER_PAGE = 10;

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage]       = useState(1);
  const [status, setStatus]   = useState('');
  const [period, setPeriod]   = useState('');
  const [search, setSearch]   = useState('');
  const [toast, setToast]     = useState({ show: false, msg: '', sev: 'info' });

  const showToast = (msg, sev = 'success') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const fetchOrders = useCallback(() => {
    setLoading(true);
    let filtered = [...mockOrders];
    if (status) filtered = filtered.filter(o => o.status === status);
    if (search) filtered = filtered.filter(o =>
      (o._id || o.id || '').toLowerCase().includes(search.toLowerCase())
    );
    if (period === '7d') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(o => new Date(o.created_at).getTime() >= cutoff);
    } else if (period === '30d') {
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      filtered = filtered.filter(o => new Date(o.created_at).getTime() >= cutoff);
    }
    const start = (page - 1) * PER_PAGE;
    setTotal(filtered.length);
    setOrders(filtered.slice(start, start + PER_PAGE));
    setLoading(false);
  }, [page, status, period, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleCancel = (orderId) => {
    setOrders(prev => prev.map(o => (o._id || o.id) === orderId ? { ...o, status: 'cancelled' } : o));
    showToast('Commande annulée avec succès');
  };

  const exportCSV = () => {
    const rows = [
      ['ID', 'Date', 'Montant (XOF)', 'Statut'],
      ...orders.map(o => [
        (o._id || o.id || '').toString().slice(-6).toUpperCase(),
        o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '',
        o.total_amount || o.total || 0,
        o.status || '',
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mes-commandes.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <CustomerDashboardLayout title="Mes commandes">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b' }}>Mes commandes</Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.83rem', mt: 0.3 }}>
            {loading ? '—' : `${total} commande${total > 1 ? 's' : ''} au total`}
          </Typography>
        </Box>
        <Button onClick={exportCSV} startIcon={<Download />} variant="outlined"
          sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#a855f7', color: '#7c3aed',
            '&:hover': { bgcolor: '#faf5ff', borderColor: '#7c3aed' } }}>
          Exporter CSV
        </Button>
      </Box>

      <Card sx={{ borderRadius: 2.5, p: 2, mb: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterList sx={{ color: '#6b7280' }} />
          <TextField
            size="small" placeholder="Rechercher par ID..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 16 }} /></InputAdornment> }}
            sx={{ minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Statut</InputLabel>
            <Select value={status} label="Statut" onChange={e => { setStatus(e.target.value); setPage(1); }}
              sx={{ borderRadius: 2 }}>
              <MenuItem value="">Tous</MenuItem>
              {Object.entries(STATUS_CFG).map(([k, v]) => (
                <MenuItem key={k} value={k}>{v.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Période</InputLabel>
            <Select value={period} label="Période" onChange={e => { setPeriod(e.target.value); setPage(1); }}
              sx={{ borderRadius: 2 }}>
              <MenuItem value="">Toute période</MenuItem>
              <MenuItem value="30d">30 derniers jours</MenuItem>
              <MenuItem value="6m">6 mois</MenuItem>
              <MenuItem value="1y">1 an</MenuItem>
            </Select>
          </FormControl>
          {(status || period || search) && (
            <Button size="small" onClick={() => { setStatus(''); setPeriod(''); setSearch(''); setPage(1); }}
              sx={{ textTransform: 'none', color: '#6b7280' }}>
              Réinitialiser
            </Button>
          )}
        </Box>
      </Card>

      <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { bgcolor: '#faf9ff', color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, py: 1.5 } }}>
                <TableCell>N° Commande</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Articles</TableCell>
                <TableCell align="right">Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}><Skeleton height={28} /></TableCell>
                  ))}
                </TableRow>
              )) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <ShoppingBag sx={{ fontSize: 56, color: '#e9d5ff', mb: 1.5 }} />
                      <Typography sx={{ color: '#9ca3af', fontWeight: 600, mb: 1 }}>Aucune commande trouvée</Typography>
                      <Button variant="contained" onClick={() => router.push('/')} endIcon={<ArrowForward />}
                        sx={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 2, textTransform: 'none', boxShadow: 'none' }}>
                        Découvrir les produits
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : orders.map((order) => {
                const id = order._id || order.id;
                const itemCount = (order.items || []).length;
                return (
                  <TableRow key={id}
                    sx={{ '&:hover': { bgcolor: '#faf9ff' }, '& td': { py: 1.5, fontSize: '0.83rem' } }}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.83rem' }}>
                        #{id?.toString().slice(-6).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#6b7280' }}>
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
                    </TableCell>
                    <TableCell sx={{ color: '#4b5563' }}>
                      {itemCount > 0 ? `${itemCount} article${itemCount > 1 ? 's' : ''}` : '—'}
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                      {(order.total_amount || order.total || 0).toLocaleString('fr-FR')} XOF
                    </TableCell>
                    <TableCell><StatusBadge status={order.status} /></TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => router.push(`/dashboard/customer/orders/${id}`)}>
                            <Visibility sx={{ fontSize: 17, color: '#7c3aed' }} />
                          </IconButton>
                        </Tooltip>
                        {order.status === 'pending' && (
                          <Tooltip title="Annuler">
                            <IconButton size="small" onClick={() => handleCancel(id)}>
                              <Cancel sx={{ fontSize: 17, color: '#ef4444' }} />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2.5, borderTop: '1px solid #f1f5f9' }}>
            <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)}
              color="primary" shape="rounded" size="small"
              sx={{ '& .MuiPaginationItem-root': { fontWeight: 600 } }} />
          </Box>
        )}
      </Card>
    </CustomerDashboardLayout>
  );
}
