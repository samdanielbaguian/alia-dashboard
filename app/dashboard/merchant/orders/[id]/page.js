'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, Chip, Divider,
  TextField, Alert, Snackbar, Skeleton, Stepper, Step, StepLabel, StepConnector,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, IconButton, Tooltip, Dialog,
  DialogTitle, DialogContent, DialogActions, LinearProgress,
} from '@mui/material';
import {
  ArrowBack, CheckCircle, LocalShipping, Inventory, HourglassEmpty, Cancel,
  Person, Phone, Home, Info, Timeline, MonetizationOn, Edit,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiPost, apiPatch } from '@/utils/api';
import { getProductImageUrl } from '@/utils/imageUtils';
import { useAuth } from '@/hooks/useAuth';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_CFG = {
  pending:   { label: 'En attente',   color: '#ff9800', bg: 'rgba(255,152,0,0.12)',  icon: <HourglassEmpty /> },
  confirmed: { label: 'Confirmée',    color: '#2196f3', bg: 'rgba(33,150,243,0.12)', icon: <CheckCircle />   },
  shipped:   { label: 'Expédiée',     color: '#9c27b0', bg: 'rgba(156,39,176,0.12)', icon: <LocalShipping /> },
  delivered: { label: 'Livrée',       color: '#4caf50', bg: 'rgba(76,175,80,0.12)',  icon: <CheckCircle />   },
  cancelled: { label: 'Annulée',      color: '#f44336', bg: 'rgba(244,67,54,0.12)',  icon: <Cancel />        },
};

function StatusBadge({ status }) {
  const s = STATUS_CFG[status] || { label: status, color: '#7f8c8d', bg: 'rgba(0,0,0,0.08)' };
  return (
    <Chip label={s.label} size="medium"
      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 800, fontSize: '0.85rem', px: 1, height: 32 }} />
  );
}

function InfoRow({ icon, label, value }) {
  const displayValue = value === undefined || value === null || value === '' ? 'Non renseigné' : value;
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1 }}>
      <Box sx={{ color: '#7f8c8d', mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.72rem', display: 'block' }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>{displayValue}</Typography>
      </Box>
    </Box>
  );
}

export default function OrderDetail() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const orderId = params?.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const data = await apiGet(`/orders/${orderId}`);
      setOrder(data);
    } catch {
      setSnack({ open: true, msg: 'Commande introuvable', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const doAction = async (action, extra = {}) => {
    setActing(true);
    try {
      await apiPost(`/orders/${orderId}/${action}`, extra);
      setSnack({
        open: true,
        msg: action === 'confirm' ? 'Commande confirmée !' : action === 'ship' ? 'Commande marquée expédiée !' : action === 'deliver' ? 'Commande marquée livrée !' : 'Commande annulée.',
        severity: action === 'cancel' ? 'warning' : 'success',
      });
      fetchOrder();
    } catch (e) {
      setSnack({ open: true, msg: e?.message || 'Erreur', severity: 'error' });
    } finally {
      setActing(false);
      setShowTrackingDialog(false);
    }
  };

  if (loading) return (
    <MerchantDashboardLayout title="Détail commande">
      <Grid container spacing={3}>
        {[1, 2, 3].map(i => (
          <Grid size={{ xs: 12, md: i === 1 ? 8 : 4 }} key={i}>
            <Skeleton variant="rectangular" height={220} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    </MerchantDashboardLayout>
  );

  if (!order) return (
    <MerchantDashboardLayout title="Détail commande">
      <Alert severity="error" sx={{ borderRadius: 2 }}>Commande introuvable.</Alert>
    </MerchantDashboardLayout>
  );

  const oid = order.id || order._id || '';
  const status = order.status || 'pending';
  const isCancelled = status === 'cancelled';
  const stepIndex = isCancelled ? -1 : STATUS_STEPS.indexOf(status);
  const products = order.products || order.items || [];
  const delivery = order.delivery_address || {};
  const history = order.status_history || order.history || [];
  const customer = order.customer || {};
  const customerName = customer.full_name || [customer.first_name, customer.last_name].filter(Boolean).join(' ') || order.buyer_name || order.user_name || 'Non renseigné';
  const customerPhone = customer.phone || order.buyer_phone || delivery.phone || 'Non renseigné';
  const customerAddress = order.shipping_address || delivery.address || delivery.street || 'Non renseigné';
  const customerCity = customer.city || delivery.city || 'Non renseigné';
  const customerCountry = customer.country || delivery.country || 'Non renseigné';

  const subtotal = products.reduce((acc, p) => acc + (p.price || p.unit_price || 0) * (p.quantity || p.qty || 1), 0);
  const shipping = order.shipping_fee || 0;
  const total = order.total_amount || (subtotal + shipping);

  return (
    <MerchantDashboardLayout title={`Commande #${oid.slice(-6).toUpperCase()}`}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#e8f0fe' } }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>
              Commande #{oid.slice(-6).toUpperCase()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
              {order.created_at ? new Date(order.created_at).toLocaleString('fr-FR') : ''}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <StatusBadge status={status} />
          {status === 'pending' && (
            <>
              <Button variant="contained" startIcon={<CheckCircle />} onClick={() => doAction('confirm')} disabled={acting}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#2196f3,#42a5f5)', fontWeight: 700 }}>
                Confirmer
              </Button>
              <Button variant="outlined" color="error" startIcon={<Cancel />} onClick={() => doAction('cancel')} disabled={acting}
                sx={{ borderRadius: 2, fontWeight: 700 }}>
                Annuler
              </Button>
            </>
          )}
          {status === 'confirmed' && (
            <Button variant="contained" startIcon={<LocalShipping />} onClick={() => setShowTrackingDialog(true)} disabled={acting}
              sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#9c27b0,#ba68c8)', fontWeight: 700 }}>
              Marquer expédiée
            </Button>
          )}
          {status === 'shipped' && (
            <Button variant="contained" startIcon={<CheckCircle />} onClick={() => doAction('deliver')} disabled={acting}
              sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#4caf50,#81c784)', fontWeight: 700 }}>
              Marquer livrée
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Stepper */}
      {!isCancelled && (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={stepIndex} alternativeLabel>
              {STATUS_STEPS.map((s, i) => {
                const cfg = STATUS_CFG[s];
                return (
                  <Step key={s} completed={i <= stepIndex}>
                    <StepLabel StepIconProps={{
                      sx: i <= stepIndex ? { color: cfg.color + ' !important' } : {},
                    }}>
                      <Typography variant="caption" sx={{ fontWeight: i === stepIndex ? 800 : 400, color: i <= stepIndex ? cfg.color : '#b0b0b0', fontSize: '0.75rem' }}>
                        {cfg.label}
                      </Typography>
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Left */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Products */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Inventory sx={{ color: '#1976d2' }} /> Articles ({products.length})
              </Typography>
              {products.length === 0 ? (
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Aucun article</Typography>
              ) : products.map((p, i) => {
                const qty = p.quantity || p.qty || 1;
                const unitPrice = p.price || p.unit_price || p.merchant_price || 0;
                const lineTotal = unitPrice * qty;
                return (
                  <Box key={i}>
                    <Box sx={{ display: 'flex', gap: 2, py: 1.5, alignItems: 'center' }}>
                      <Box sx={{ width: 56, height: 56, borderRadius: 2, overflow: 'hidden', flexShrink: 0, bgcolor: '#f5f7fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {getProductImageUrl(p) ? (
                          <img src={getProductImageUrl(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Inventory sx={{ color: '#b0b0b0', fontSize: 28 }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#2c3e50', mb: 0.3 }}>
                          {p.title || p.name || `Produit ${i + 1}`}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                          {unitPrice.toLocaleString('fr-FR')} XOF × {qty}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2c3e50', whiteSpace: 'nowrap' }}>
                        {lineTotal.toLocaleString('fr-FR')} XOF
                      </Typography>
                    </Box>
                    {i < products.length - 1 && <Divider />}
                  </Box>
                );
              })}
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, alignItems: 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Sous-total</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{subtotal.toLocaleString('fr-FR')} XOF</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Livraison</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{shipping.toLocaleString('fr-FR')} XOF</Typography>
                </Box>
                <Divider sx={{ width: 200 }} />
                <Box sx={{ display: 'flex', gap: 4 }}>
                  <Typography variant="body1" sx={{ fontWeight: 800, color: '#2c3e50' }}>Total</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 900, color: '#1976d2' }}>{total.toLocaleString('fr-FR')} XOF</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Status History */}
          {history.length > 0 && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Timeline sx={{ color: '#9c27b0' }} /> Historique
                </Typography>
                {history.map((h, i) => {
                  const cfg = STATUS_CFG[h.status] || STATUS_CFG.pending;
                  return (
                    <Box key={i} sx={{ display: 'flex', gap: 2, pb: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                          {cfg.icon}
                        </Box>
                        {i < history.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: 'rgba(0,0,0,0.08)', my: 0.5 }} />}
                      </Box>
                      <Box sx={{ pb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: cfg.color }}>{cfg.label}</Typography>
                        <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                          {h.timestamp ? new Date(h.timestamp).toLocaleString('fr-FR') : ''}
                          {h.note && ` — ${h.note}`}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Right */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Customer info */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ color: '#4caf50' }} /> Client
              </Typography>
              <InfoRow icon={<Person sx={{ fontSize: 18 }} />} label="Nom" value={customerName} />
              <InfoRow icon={<Phone sx={{ fontSize: 18 }} />} label="Téléphone" value={customerPhone} />
              <InfoRow icon={<Info sx={{ fontSize: 18 }} />} label="Email" value={customer.email || 'Non renseigné'} />
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1 }}>Adresse de livraison</Typography>
              <InfoRow icon={<Home sx={{ fontSize: 18 }} />} label="Adresse" value={customerAddress} />
              <InfoRow icon={<Info sx={{ fontSize: 18 }} />} label="Ville" value={customerCity} />
              <InfoRow icon={<Info sx={{ fontSize: 18 }} />} label="Pays" value={customerCountry} />
            </CardContent>
          </Card>

          {/* Payment info */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MonetizationOn sx={{ color: '#ff9800' }} /> Paiement
              </Typography>
              <InfoRow icon={<MonetizationOn sx={{ fontSize: 18 }} />} label="Méthode" value={order.payment_method} />
              <InfoRow icon={<CheckCircle sx={{ fontSize: 18 }} />} label="Statut paiement" value={order.payment_status} />
              <InfoRow icon={<MonetizationOn sx={{ fontSize: 18 }} />} label="Montant" value={`${(order.total_amount || 0).toLocaleString('fr-FR')} XOF`} />
              {order.platform_fee != null && (
                <InfoRow icon={<MonetizationOn sx={{ fontSize: 18 }} />} label="Frais de plateforme" value={`${order.platform_fee.toLocaleString('fr-FR')} XOF`} />
              )}
              {order.payment_gateway_fee != null && (
                <InfoRow icon={<MonetizationOn sx={{ fontSize: 18 }} />} label="Frais passerelle" value={`${order.payment_gateway_fee.toLocaleString('fr-FR')} XOF`} />
              )}
              {order.merchant_payout != null && (
                <InfoRow icon={<MonetizationOn sx={{ fontSize: 18 }} />} label="Net reversé" value={`${order.merchant_payout.toLocaleString('fr-FR')} XOF`} />
              )}
            </CardContent>
          </Card>

          {/* Shipping info */}
          {(order.tracking_number || order.shipping_method) && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalShipping sx={{ color: '#9c27b0' }} /> Expédition
                </Typography>
                <InfoRow icon={<LocalShipping sx={{ fontSize: 18 }} />} label="Mode" value={order.shipping_method} />
                <InfoRow icon={<Info sx={{ fontSize: 18 }} />} label="N° suivi" value={order.tracking_number} />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Tracking Dialog */}
      <Dialog open={showTrackingDialog} onClose={() => setShowTrackingDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2c3e50' }}>Marquer comme expédiée</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#7f8c8d', mb: 2.5 }}>Optionnellement, entrez un numéro de suivi.</Typography>
          <TextField fullWidth label="Numéro de suivi (optionnel)" value={trackingInput}
            onChange={e => setTrackingInput(e.target.value)}
            placeholder="ex: TK1234567890FR"
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button onClick={() => setShowTrackingDialog(false)} sx={{ borderRadius: 2 }}>Annuler</Button>
          <Button variant="contained" onClick={() => doAction('ship', { tracking_number: trackingInput || undefined })} disabled={acting}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#9c27b0,#ba68c8)', fontWeight: 700 }}>
            {acting ? 'En cours...' : 'Confirmer expédition'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}
