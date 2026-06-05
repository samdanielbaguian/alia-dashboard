'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Pagination,
  Menu, Alert, Snackbar, Skeleton, Divider, Grid,
} from '@mui/material';
import {
  Search, FileDownload, Refresh, MoreVert, Visibility,
  CheckCircle, LocalShipping, Cancel, OpenInNew,
  ArrowUpward, ArrowDownward,
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiPost } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';


const STATUS_LIST = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending',   label: 'En attente',  color: '#ff9800', bg: 'rgba(255,152,0,0.1)'  },
  { value: 'confirmed', label: 'Confirmée',   color: '#2196f3', bg: 'rgba(33,150,243,0.1)' },
  { value: 'shipped',   label: 'Expédiée',    color: '#9c27b0', bg: 'rgba(156,39,176,0.1)' },
  { value: 'delivered', label: 'Livrée',      color: '#4caf50', bg: 'rgba(76,175,80,0.1)'  },
  { value: 'cancelled', label: 'Annulée',     color: '#f44336', bg: 'rgba(244,67,54,0.1)'  },
];

const PERIOD_LIST = [
  { value: '', label: 'Toutes périodes' },
  { value: 'today', label: "Aujourd'hui" },
  { value: 'week', label: '7 derniers jours' },
  { value: 'month', label: '30 derniers jours' },
  { value: '3months', label: '3 mois' },
];

function StatusChip({ status }) {
  const s = STATUS_LIST.find(x => x.value === status) || { label: status, color: '#7f8c8d', bg: 'rgba(0,0,0,0.06)' };
  return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.72rem', height: 24 }} />;
}

function SortHeader({ label, field, sort, setSort }) {
  const isActive = sort?.startsWith(field);
  const isDesc = sort === `${field}_desc`;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', userSelect: 'none' }}
      onClick={() => setSort(isActive ? (isDesc ? `${field}_asc` : `${field}_desc`) : `${field}_desc`)}>
      <Typography variant="caption" sx={{ fontWeight: 700, color: isActive ? '#1976d2' : '#7f8c8d' }}>{label}</Typography>
      {isActive && (isDesc ? <ArrowDownward sx={{ fontSize: 12, color: '#1976d2' }} /> : <ArrowUpward sx={{ fontSize: 12, color: '#1976d2' }} />)}
    </Box>
  );
}

const LIMIT = 15;

export default function MerchantOrders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams?.get('status') || '');
  const [periodFilter, setPeriodFilter] = useState('');
  const [sort, setSort] = useState('created_at_desc');
  const [menuAnchor, setMenuAnchor] = useState({ el: null, orderId: null, status: null });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const mid = user?.id || user?._id;

  const fetchOrders = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
        ...(statusFilter && { status: statusFilter }),
        ...(periodFilter && { period: periodFilter }),
        ...(search && { search }),
        ...(sort && { sort }),
      });
      const data = await apiGet(`/merchants/me/orders?${params}`);
      const list = data?.orders || data || [];
      setOrders(list);
      setTotal(data?.total || list.length);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [mid, page, search, statusFilter, periodFilter, sort]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleAction = async (orderId, action) => {
    setMenuAnchor({ el: null, orderId: null, status: null });
    try {
      await apiPost(`/orders/${orderId}/${action}`, {});
      setSnack({ open: true, msg: `Commande ${action === 'confirm' ? 'confirmée' : action === 'cancel' ? 'annulée' : 'mise à jour'} !`, severity: 'success' });
      fetchOrders();
    } catch (e) {
      setSnack({ open: true, msg: e?.message || 'Erreur', severity: 'error' });
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Date', 'Client', 'Montant', 'Statut', 'Articles'];
    const rows = orders.map(o => [
      (o.id || o._id || '').slice(-6).toUpperCase(),
      o.created_at ? new Date(o.created_at).toLocaleDateString('fr-FR') : '',
      o.buyer_name || o.user_name || '',
      `${(o.total_amount || 0).toLocaleString('fr-FR')} XOF`,
      o.status || '',
      (o.products || []).length,
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `commandes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const countByStatus = STATUS_LIST.slice(1).reduce((acc, s) => {
    acc[s.value] = orders.filter(o => o.status === s.value).length;
    return acc;
  }, {});

  const kpiOrders = [
    { label: 'Total commandes',  value: total,                         color: '#1976d2', bg: 'rgba(25,118,210,0.08)'  },
    { label: 'En attente',       value: countByStatus.pending   || 0, color: '#ff9800', bg: 'rgba(255,152,0,0.08)'  },
    { label: 'Expédiées',        value: countByStatus.shipped   || 0, color: '#9c27b0', bg: 'rgba(156,39,176,0.08)' },
    { label: 'Livrées',          value: countByStatus.delivered || 0, color: '#4caf50', bg: 'rgba(76,175,80,0.08)'  },
  ];

  return (
    <MerchantDashboardLayout title="Gestion des commandes">
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiOrders.map((k, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', bgcolor: k.bg, height: '100%' }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600, fontSize: '0.8rem', mb: 1 }}>{k.label}</Typography>
                {loading ? <Skeleton height={40} width="60%" /> : (
                  <Typography variant="h4" sx={{ fontWeight: 800, color: k.color }}>{k.value}</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Status Tabs */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
        {STATUS_LIST.map(s => (
          <Chip
            key={s.value}
            label={s.value ? `${s.label}${countByStatus[s.value] ? ` (${countByStatus[s.value]})` : ''}` : 'Tous'}
            onClick={() => { setStatusFilter(s.value); setPage(1); }}
            sx={{
              cursor: 'pointer', fontWeight: statusFilter === s.value ? 700 : 400,
              bgcolor: statusFilter === s.value ? (s.bg || 'rgba(25,118,210,0.1)') : '#f5f7fa',
              color: statusFilter === s.value ? (s.color || '#1976d2') : '#7f8c8d',
              border: statusFilter === s.value ? `1px solid ${s.color || '#1976d2'}` : '1px solid transparent',
              '&:hover': { bgcolor: s.bg || 'rgba(25,118,210,0.06)' }, transition: 'all 0.2s',
            }}
          />
        ))}
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Rechercher par ID, client..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              size="small" sx={{ minWidth: 280, flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
            />
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Période</InputLabel>
              <Select value={periodFilter} onChange={e => { setPeriodFilter(e.target.value); setPage(1); }} label="Période" sx={{ borderRadius: 2 }}>
                {PERIOD_LIST.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<Refresh />} onClick={fetchOrders} disabled={loading}
                sx={{ borderRadius: 2, color: '#7f8c8d', borderColor: 'rgba(0,0,0,0.2)' }}>
                Actualiser
              </Button>
              <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExport}
                sx={{ borderRadius: 2, color: '#4caf50', borderColor: '#4caf50', fontWeight: 600 }}>
                Export CSV
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#fafafa' }}>
                {[
                  <SortHeader key="id" label="Commande" field="id" sort={sort} setSort={setSort} />,
                  <SortHeader key="date" label="Date" field="created_at" sort={sort} setSort={setSort} />,
                  'Client', 'Produits',
                  <SortHeader key="amt" label="Montant" field="total_amount" sort={sort} setSort={setSort} />,
                  'Statut', 'Livraison', 'Actions',
                ].map((h, i) => (
                  <TableCell key={i} sx={{ fontWeight: 700, color: '#7f8c8d', fontSize: '0.75rem', py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <TableRow key={i}>
                    {[...Array(8)].map((_, j) => <TableCell key={j}><Skeleton height={20} /></TableCell>)}
                  </TableRow>
                ))
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: '#7f8c8d', fontWeight: 600 }}>Aucune commande trouvée</Typography>
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>Modifiez vos filtres ou attendez de nouvelles commandes</Typography>
                  </TableCell>
                </TableRow>
              ) : orders.map(order => {
                const oid = order.id || order._id || '';
                return (
                  <TableRow key={oid} hover sx={{ '& td': { py: 1.5 }, '&:hover': { bgcolor: '#f8f9ff' } }}>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#1976d2', fontSize: '0.82rem' }}>
                        #{oid.slice(-6).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0', fontSize: '0.7rem' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem' }}>
                        {order.buyer_name || order.user_name || 'Client'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.7rem' }}>
                        {order.delivery_address?.city || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontSize: '0.82rem' }}>
                        {(order.products || []).length} article{(order.products || []).length > 1 ? 's' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2c3e50', fontSize: '0.85rem' }}>
                        {(order.total_amount || 0).toLocaleString('fr-FR')} XOF
                      </Typography>
                    </TableCell>
                    <TableCell><StatusChip status={order.status} /></TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.72rem' }}>
                        {order.shipping_method || 'Standard'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => router.push(`/dashboard/merchant/orders/${oid}`)}
                            sx={{ color: '#1976d2', '&:hover': { bgcolor: 'rgba(25,118,210,0.08)' } }}>
                            <OpenInNew sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small" onClick={e => setMenuAnchor({ el: e.currentTarget, orderId: oid, status: order.status })}
                          sx={{ color: '#7f8c8d', '&:hover': { bgcolor: 'rgba(0,0,0,0.06)' } }}>
                          <MoreVert sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        {total > LIMIT && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2.5, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <Pagination count={Math.ceil(total / LIMIT)} page={page}
              onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
              color="primary" shape="rounded" />
          </Box>
        )}
      </Card>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor.el} open={Boolean(menuAnchor.el)} onClose={() => setMenuAnchor({ el: null, orderId: null, status: null })}
        PaperProps={{ sx: { borderRadius: 2.5, boxShadow: '0 8px 28px rgba(0,0,0,0.12)', minWidth: 200 } }}>
        <MenuItem onClick={() => { router.push(`/dashboard/merchant/orders/${menuAnchor.orderId}`); setMenuAnchor({ el: null, orderId: null, status: null }); }}
          sx={{ fontSize: '0.85rem', gap: 1.5 }}>
          <Visibility sx={{ fontSize: 16, color: '#1976d2' }} /> Voir détails
        </MenuItem>
        {menuAnchor.status === 'pending' && (
          <MenuItem onClick={() => handleAction(menuAnchor.orderId, 'confirm')} sx={{ fontSize: '0.85rem', gap: 1.5, color: '#4caf50' }}>
            <CheckCircle sx={{ fontSize: 16 }} /> Confirmer
          </MenuItem>
        )}
        {menuAnchor.status === 'confirmed' && (
          <MenuItem onClick={() => router.push(`/dashboard/merchant/orders/${menuAnchor.orderId}`)} sx={{ fontSize: '0.85rem', gap: 1.5, color: '#9c27b0' }}>
            <LocalShipping sx={{ fontSize: 16 }} /> Marquer expédiée
          </MenuItem>
        )}
        {(menuAnchor.status === 'pending' || menuAnchor.status === 'confirmed') && (
          <>
            <Divider />
            <MenuItem onClick={() => handleAction(menuAnchor.orderId, 'cancel')} sx={{ fontSize: '0.85rem', gap: 1.5, color: '#f44336' }}>
              <Cancel sx={{ fontSize: 16 }} /> Annuler
            </MenuItem>
          </>
        )}
      </Menu>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}

