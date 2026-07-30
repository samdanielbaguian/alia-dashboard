'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Skeleton, Alert,
  Button, IconButton, FormControl, InputLabel, Select, MenuItem, Tooltip,
  TablePagination,
} from '@mui/material';
import {
  Payment as PaymentIcon, Download, Visibility, FilterList, Refresh,
} from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { apiGet } from '@/utils/api';

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_MAP = {
  completed: { label: 'Réussi',     color: '#10b981', bg: '#d1fae5' },
  pending:   { label: 'En attente', color: '#f59e0b', bg: '#fef3c7' },
  failed:    { label: 'Échoué',     color: '#ef4444', bg: '#fee2e2' },
  refunded:  { label: 'Remboursé',  color: '#6b7280', bg: '#f3f4f6' },
};

const METHOD_LABELS = {
  mobile_money:     'Mobile Money',
  card:             'Carte bancaire',
  cash_on_delivery: 'À la livraison',
  bank_transfer:    'Virement',
};

const PER_PAGE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusChip({ status }) {
  const cfg = STATUS_MAP[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <Chip label={cfg.label} size="small"
      sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.72rem', border: 'none' }} />
  );
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

function exportCSV(rows) {
  const header = ['Référence', 'Date', 'Montant (XOF)', 'Méthode', 'Statut', 'Commande'];
  const lines = rows.map(p => [
    p.reference || p._id || p.id,
    fmtDate(p.created_at || p.date),
    p.amount || 0,
    METHOD_LABELS[p.payment_method] || p.payment_method || '—',
    STATUS_MAP[p.status]?.label || p.status || '—',
    p.order_id || '—',
  ].join(','));
  const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'paiements.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState({ show: false, msg: '', sev: 'info' });
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]         = useState(0);
  const [total, setTotal]       = useState(0);

  const showToast = (msg, sev = 'info') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const offset = page * PER_PAGE;
      const data = await apiGet(`/payments?limit=${PER_PAGE}&offset=${offset}`);
      const fetched = data.payments || data.items || data || [];
      let filtered = Array.isArray(fetched) ? fetched : [];
      if (statusFilter) filtered = filtered.filter(p => p.status === statusFilter);
      setTotal(data.total || filtered.length);
      setPayments(filtered);
    } catch (error) {
      console.error('Failed to load payments:', error);
      setPayments([]);
      setTotal(0);
      showToast('Impossible de charger les paiements', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  const handleFilterChange = (val) => { setStatusFilter(val); setPage(0); };

  // KPI totals
  const totalAmount  = payments.reduce((s, p) => s + (p.amount || 0), 0);
  const countSuccess = payments.filter(p => p.status === 'completed').length;

  return (
    <CustomerDashboardLayout title="Mes paiements">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      {/* ── KPI strip ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {[
          { label: 'Total paiements',      value: loading ? '—' : payments.length, gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)' },
          { label: 'Paiements réussis',    value: loading ? '—' : countSuccess,    gradient: 'linear-gradient(135deg,#10b981,#34d399)' },
          { label: 'Montant total',        value: loading ? '—' : `${totalAmount.toLocaleString('fr-FR')} XOF`, gradient: 'linear-gradient(135deg,#a855f7,#ec4899)' },
        ].map(({ label, value, gradient }) => (
          <Card key={label} sx={{ flex: '1 1 160px', minWidth: 140, borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
            <Box sx={{ height: 4, background: gradient }} />
            <CardContent sx={{ p: 2 }}>
              <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>{label}</Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#1e1b4b', mt: 0.5 }}>{value}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* ── Filters + actions ── */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Statut</InputLabel>
          <Select value={statusFilter} label="Statut" onChange={e => handleFilterChange(e.target.value)}
            sx={{ borderRadius: 2 }}>
            <MenuItem value="">Tous</MenuItem>
            {Object.entries(STATUS_MAP).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title="Actualiser">
          <IconButton onClick={fetchPayments} size="small"
            sx={{ bgcolor: '#f5f3ff', color: '#7c3aed', '&:hover': { bgcolor: '#ede9fe' } }}>
            <Refresh />
          </IconButton>
        </Tooltip>

        <Box sx={{ ml: 'auto' }}>
          <Button startIcon={<Download />} variant="outlined" size="small" onClick={() => exportCSV(payments)}
            disabled={payments.length === 0}
            sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#a855f7', color: '#7c3aed' }}>
            Exporter CSV
          </Button>
        </Box>
      </Box>

      {/* ── Table ── */}
      <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#faf9ff' }}>
                {['Référence', 'Date', 'Montant', 'Méthode', 'Statut', 'Commande'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, color: '#374151', fontSize: '0.78rem', py: 1.5 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, #ede9fe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <PaymentIcon sx={{ fontSize: 36, color: '#a855f7' }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, color: '#1e1b4b' }}>Aucun paiement trouvé</Typography>
                      <Typography sx={{ color: '#6b7280', fontSize: '0.83rem' }}>
                        Vos paiements apparaîtront ici après vos premières commandes.
                      </Typography>
                      <Button variant="contained" size="small" onClick={() => router.push('/dashboard/customer/orders')}
                        sx={{ mt: 1, textTransform: 'none', borderRadius: 2, background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                        Voir mes commandes
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p) => {
                  const ref      = p.reference || p.transaction_id || (p._id || p.id || '').slice(-8).toUpperCase();
                  const amount   = p.amount || 0;
                  const method   = METHOD_LABELS[p.payment_method] || p.payment_method || '—';
                  const orderId  = p.order_id || p.order?._id || p.order?.id;
                  return (
                    <TableRow key={p._id || p.id} hover sx={{ '&:hover': { bgcolor: '#faf9ff' } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e1b4b', fontFamily: 'monospace' }}>
                          #{ref}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.82rem', color: '#374151' }}>
                          {fmtDate(p.created_at || p.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#7c3aed' }}>
                          {amount.toLocaleString('fr-FR')} XOF
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: '0.82rem', color: '#374151' }}>{method}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={p.status} />
                      </TableCell>
                      <TableCell>
                        {orderId ? (
                          <Tooltip title="Voir la commande">
                            <IconButton size="small"
                              onClick={() => router.push(`/dashboard/customer/orders/${orderId}`)}
                              sx={{ color: '#7c3aed', '&:hover': { bgcolor: '#ede9fe' } }}>
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af' }}>—</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!loading && payments.length > 0 && (
          <TablePagination
            component="div"
            count={total}
            page={page}
            rowsPerPage={PER_PAGE}
            rowsPerPageOptions={[PER_PAGE]}
            onPageChange={(_, p) => setPage(p)}
            labelDisplayedRows={({ from, to, count }) => `${from}–${to} sur ${count !== -1 ? count : `+${to}`}`}
            sx={{ borderTop: '1px solid #f1f5f9', '& .MuiTablePagination-toolbar': { pl: 2 } }}
          />
        )}
      </Card>
    </CustomerDashboardLayout>
  );
}
