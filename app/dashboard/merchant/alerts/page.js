'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Alert, Snackbar, Skeleton,
  TextField, InputAdornment, IconButton, Divider, LinearProgress, Tooltip,
} from '@mui/material';
import {
  Warning, Inventory, HourglassEmpty, Refresh, Settings, Close, OpenInNew, CheckCircle,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

function AlertCard({ type, title, message, severity, link, linkLabel, onDismiss, dismissed }) {
  const COLOR = {
    stock:   { bg: 'rgba(255,152,0,0.08)', border: '#ff9800', icon: <Inventory sx={{ fontSize: 20, color: '#ff9800' }} />, chip: 'warning' },
    order:   { bg: 'rgba(244,67,54,0.08)', border: '#f44336', icon: <HourglassEmpty sx={{ fontSize: 20, color: '#f44336' }} />, chip: 'error'   },
    info:    { bg: 'rgba(25,118,210,0.08)', border: '#1976d2', icon: <CheckCircle sx={{ fontSize: 20, color: '#1976d2' }} />, chip: 'info'    },
    default: { bg: 'rgba(0,0,0,0.04)',     border: '#7f8c8d', icon: <Warning sx={{ fontSize: 20, color: '#7f8c8d' }} />,   chip: 'default'  },
  };
  const cfg = COLOR[type] || COLOR.default;
  if (dismissed) return null;
  return (
    <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 10px rgba(0,0,0,0.06)', bgcolor: cfg.bg, border: `1px solid ${cfg.border}20`, mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
          <Box sx={{ mt: 0.2 }}>{cfg.icon}</Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.3 }}>{title}</Typography>
            {message && <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block', mb: 1 }}>{message}</Typography>}
            {link && (
              <Button size="small" variant="text" endIcon={<OpenInNew sx={{ fontSize: 13 }} />}
                onClick={() => window.open(link, '_self')}
                sx={{ fontSize: '0.72rem', fontWeight: 700, color: cfg.border, p: 0, minWidth: 0, textTransform: 'none' }}>
                {linkLabel || 'Voir'}
              </Button>
            )}
          </Box>
          <Tooltip title="Ignorer">
            <IconButton size="small" onClick={onDismiss} sx={{ color: '#b0b0b0', '&:hover': { color: '#f44336' } }}>
              <Close sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function MerchantAlerts() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const [threshold, setThreshold] = useState(5);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const mid = user?.id || user?._id;

  const fetchAlerts = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    const [alertsRes, productsRes] = await Promise.allSettled([
      apiGet(`/merchants/me/alerts`),
      apiGet(`/products?merchant_id=${mid}&limit=100&sort=stock_asc`),
    ]);
    if (alertsRes.status === 'fulfilled') {
      const data = alertsRes.value;
      setAlerts(data?.alerts || data || []);
    }
    if (productsRes.status === 'fulfilled') {
      const prods = productsRes.value?.products || productsRes.value || [];
      setStockAlerts(prods.filter(p => (p.stock_quantity ?? p.stock ?? 0) <= threshold));
    }
    setLoading(false);
  }, [mid, threshold]);

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const dismiss = (id) => setDismissed(d => [...d, id]);
  const dismissAll = () => {
    const ids = alerts.map((_, i) => `alert-${i}`);
    setDismissed(d => [...d, ...ids]);
    setSnack({ open: true, msg: 'Toutes les alertes ont été ignorées', severity: 'info' });
  };

  const activeAlerts = alerts.filter((_, i) => !dismissed.includes(`alert-${i}`));
  const totalActive = activeAlerts.length + stockAlerts.length;

  return (
    <MerchantDashboardLayout title="Centre d'alertes">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
              Centre d'alertes
              {totalActive > 0 && (
                <Chip label={totalActive} size="small" sx={{ bgcolor: 'rgba(244,67,54,0.12)', color: '#f44336', fontWeight: 900, height: 24 }} />
              )}
            </Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Surveillez vos stocks et l'état de vos commandes</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {activeAlerts.length > 0 && (
            <Button variant="outlined" onClick={dismissAll} sx={{ borderRadius: 2, color: '#7f8c8d', borderColor: 'rgba(0,0,0,0.2)', fontSize: '0.8rem' }}>
              Tout ignorer
            </Button>
          )}
          <Button variant="outlined" startIcon={<Refresh />} onClick={fetchAlerts} disabled={loading}
            sx={{ borderRadius: 2, color: '#1976d2', borderColor: '#1976d2' }}>
            Actualiser
          </Button>
        </Box>
      </Box>

      {totalActive === 0 && !loading && (
        <Alert severity="success" icon={<CheckCircle />} sx={{ borderRadius: 2, mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Tout est en ordre ! Aucune alerte active pour le moment.</Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Order Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HourglassEmpty sx={{ color: '#f44336' }} /> Alertes commandes
                  {activeAlerts.length > 0 && (
                    <Chip label={activeAlerts.length} size="small" sx={{ bgcolor: 'rgba(244,67,54,0.12)', color: '#f44336', fontWeight: 800, height: 20, fontSize: '0.7rem' }} />
                  )}
                </Typography>
              </Box>
              {loading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} height={70} sx={{ mb: 1, borderRadius: 2 }} />)
              ) : activeAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>Aucune alerte commande</Typography>
                </Box>
              ) : (
                alerts.map((alert, i) => (
                  <AlertCard
                    key={i}
                    type={alert.type || 'order'}
                    title={alert.title || alert.message || `Alerte #${i + 1}`}
                    message={alert.detail || alert.description}
                    link={alert.order_id ? `/dashboard/merchant/orders/${alert.order_id}` : null}
                    linkLabel="Voir commande"
                    dismissed={dismissed.includes(`alert-${i}`)}
                    onDismiss={() => dismiss(`alert-${i}`)}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Stock Alerts */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Inventory sx={{ color: '#ff9800' }} /> Alertes stock
                  {stockAlerts.length > 0 && (
                    <Chip label={stockAlerts.length} size="small" sx={{ bgcolor: 'rgba(255,152,0,0.12)', color: '#ff9800', fontWeight: 800, height: 20, fontSize: '0.7rem' }} />
                  )}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>Seuil :</Typography>
                  <TextField size="small" type="number" value={threshold}
                    onChange={e => setThreshold(Math.max(1, Number(e.target.value)))}
                    inputProps={{ min: 1, max: 100, style: { width: 48, textAlign: 'center' } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 1.5 }, '& input': { p: '4px 8px', fontSize: '0.8rem' } }} />
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>unités</Typography>
                </Box>
              </Box>
              {loading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} height={70} sx={{ mb: 1, borderRadius: 2 }} />)
              ) : stockAlerts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CheckCircle sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                  <Typography variant="body2" sx={{ color: '#7f8c8d', fontWeight: 600 }}>Tous les stocks sont suffisants</Typography>
                </Box>
              ) : (
                stockAlerts.map((p, i) => {
                  const pid = p.id || p._id || '';
                  const stock = p.stock_quantity ?? p.stock ?? 0;
                  const isOut = stock === 0;
                  return (
                    <Card key={i} sx={{ borderRadius: 2, boxShadow: 'none', border: `1px solid ${isOut ? '#f44336' : '#ff9800'}20`, bgcolor: isOut ? 'rgba(244,67,54,0.06)' : 'rgba(255,152,0,0.06)', mb: 1.5 }}>
                      <CardContent sx={{ p: 1.8, '&:last-child': { pb: 1.8 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Box sx={{ flex: 1, mr: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2c3e50', fontSize: '0.82rem' }} noWrap>{p.title}</Typography>
                            <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{p.category || ''}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexShrink: 0 }}>
                            <Chip label={isOut ? 'Rupture' : `${stock} restant${stock > 1 ? 's' : ''}`} size="small"
                              sx={{ height: 20, fontSize: '0.68rem', fontWeight: 800, bgcolor: isOut ? 'rgba(244,67,54,0.15)' : 'rgba(255,152,0,0.15)', color: isOut ? '#f44336' : '#ff9800' }} />
                            <Tooltip title="Modifier le produit">
                              <IconButton size="small" onClick={() => router.push(`/dashboard/merchant/products/${pid}/edit`)}
                                sx={{ color: '#1976d2', '&:hover': { bgcolor: 'rgba(25,118,210,0.08)' }, width: 24, height: 24 }}>
                                <OpenInNew sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                        <LinearProgress variant="determinate"
                          value={Math.min(100, (stock / threshold) * 100)}
                          sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.06)', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: isOut ? '#f44336' : '#ff9800' } }} />
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}
