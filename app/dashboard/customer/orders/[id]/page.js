'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box, Typography, Card, CardContent, Chip, Button, Divider,
  Grid, Skeleton, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Stepper,
  Step, StepLabel, StepConnector, stepConnectorClasses,
  Rating, TextField, // ← AJOUTÉ
} from '@mui/material';
import {
  ArrowBack, Cancel, Refresh, LocalShipping,
  CheckCircle, Pending, ShoppingBag, Payment, Home,
  Star as StarIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { apiGet, apiPost } from '@/utils/api';
import { formatMerchantName } from '@/utils/nameFormatter';
import { getProductImageUrl } from '@/utils/imageUtils';

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: '#fef3c7', icon: <Pending /> },
  confirmed: { label: 'Confirmée',   color: '#3b82f6', bg: '#dbeafe', icon: <CheckCircle /> },
  shipped:   { label: 'Expédiée',    color: '#8b5cf6', bg: '#ede9fe', icon: <LocalShipping /> },
  delivered: { label: 'Livrée',      color: '#10b981', bg: '#d1fae5', icon: <CheckCircle /> },
  cancelled: { label: 'Annulée',     color: '#ef4444', bg: '#fee2e2', icon: <Cancel /> },
};

const STEPS = ['En attente', 'Confirmée', 'Expédiée', 'Livrée'];
const STEP_STATUS = ['pending', 'confirmed', 'shipped', 'delivered'];

// ─── Styled stepper ───────────────────────────────────────────────────────────

const PurpleConnector = styled(StepConnector)(() => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 18 },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3, border: 0, backgroundColor: '#e2d9f3', borderRadius: 1,
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
  },
}));

// ─── Info card ────────────────────────────────────────────────────────────────

function InfoCard({ title, children, icon }) {
  return (
    <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon && <Box sx={{ color: '#7c3aed' }}>{icon}</Box>}
          <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e1b4b' }}>{title}</Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.8, borderBottom: '1px solid #f1f5f9' }}>
      <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1e1b4b', textAlign: 'right', maxWidth: '60%' }}>
        {value || '—'}
      </Typography>
    </Box>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id;

  const [order, setOrder]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [toast, setToast]     = useState({ show: false, msg: '', sev: 'info' });

  // ─── États pour l'avis ───
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const showToast = (msg, sev = 'success') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const orderData = await apiGet(`/orders/me/${orderId}`);
      setOrder(orderData);
      // Vérifier si un avis a déjà été laissé
      try {
        const reviews = await apiGet(`/reviews/order/${orderId}`);
        if (reviews && reviews.length > 0) {
          setReviewSubmitted(true);
          setRating(reviews[0].rating);
          setComment(reviews[0].comment || '');
        }
      } catch {
        // Ignorer l'erreur si l'endpoint n'existe pas encore
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      setOrder(null);
      showToast('Commande introuvable', 'error');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  const handleCancel = async () => {
    if (!orderId) return;
    setCancelling(true);
    try {
      await apiPost(`/orders/${orderId}/cancel`, { reason: 'Annulation par le client' });
      setOrder(prev => prev ? { ...prev, status: 'cancelled' } : prev);
      showToast('Commande annulée avec succès');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      showToast('Impossible d\'annuler la commande', 'error');
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    showToast('Articles ajoutés au panier !');
    setTimeout(() => router.push('/dashboard/customer/cart'), 1500);
  };

  // ─── Soumission de l'avis ───
  const submitReview = async () => {
    if (!rating) {
      showToast('Veuillez attribuer une note', 'warning');
      return;
    }
    setSubmittingReview(true);
    try {
      await apiPost(`/reviews/${orderId}`, { rating, comment });
      setReviewSubmitted(true);
      showToast('Merci pour votre avis !');
    } catch (error) {
      console.error('Failed to submit review:', error);
      showToast('Erreur lors de l\'envoi de l\'avis', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const statusCfg = STATUS_CFG[order?.status] || { label: order?.status, color: '#6b7280', bg: '#f3f4f6' };
  const activeStep = STEP_STATUS.indexOf(order?.status);
  const isCancelled = order?.status === 'cancelled';
  const canReview = order?.status === 'delivered' && !reviewSubmitted;

  return (
    <CustomerDashboardLayout title="Détail commande">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Button startIcon={<ArrowBack />} onClick={() => router.back()}
          sx={{ textTransform: 'none', color: '#6b7280', borderRadius: 2, '&:hover': { bgcolor: '#f3f4f6' } }}>
          Retour
        </Button>
        {loading ? (
          <Skeleton width={200} height={32} />
        ) : (
          <>
            <Typography sx={{ fontWeight: 800, fontSize: '1.3rem', color: '#1e1b4b' }}>
              Commande #{(orderId || '').slice(-6).toUpperCase()}
            </Typography>
            {order?.status && (
              <Chip
                label={statusCfg.label}
                sx={{ bgcolor: statusCfg.bg, color: statusCfg.color, fontWeight: 700, fontSize: '0.78rem' }}
              />
            )}
          </>
        )}
        <Box sx={{ flex: 1 }} />
        <Button startIcon={<Refresh />} onClick={fetchOrder} size="small"
          sx={{ textTransform: 'none', color: '#6b7280', borderRadius: 2 }}>
          Actualiser
        </Button>
        {order?.status === 'delivered' && (
          <Button variant="outlined" onClick={handleReorder} size="small"
            sx={{ textTransform: 'none', borderColor: '#a855f7', color: '#7c3aed', borderRadius: 2,
              '&:hover': { bgcolor: '#faf5ff', borderColor: '#7c3aed' } }}>
            Recommander
          </Button>
        )}
        {order?.status === 'pending' && (
          <Button variant="outlined" color="error" onClick={handleCancel} disabled={cancelling} size="small"
            sx={{ textTransform: 'none', borderRadius: 2 }}>
            {cancelling ? 'Annulation...' : 'Annuler la commande'}
          </Button>
        )}
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2.5, mb: 2 }} />
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2.5 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={500} sx={{ borderRadius: 2.5 }} />
          </Grid>
        </Grid>
      ) : !order ? (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Commande introuvable ou vous n&apos;avez pas accès à cette commande.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* ─── Colonne gauche ─── */}
          <Grid size={{ xs: 12, md: 8 }}>
            {/* Timeline */}
            {!isCancelled && (
              <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', mb: 2.5, p: 2.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2, fontSize: '0.95rem' }}>
                  Suivi de la commande
                </Typography>
                <Stepper activeStep={activeStep} alternativeLabel connector={<PurpleConnector />}>
                  {STEPS.map((label, i) => (
                    <Step key={label} completed={i < activeStep}>
                      <StepLabel
                        StepIconProps={{
                          sx: {
                            '&.Mui-completed': { color: '#a855f7' },
                            '&.Mui-active': { color: '#7c3aed' },
                          },
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: i <= activeStep ? 700 : 400, color: i <= activeStep ? '#7c3aed' : '#9ca3af' }}>
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Card>
            )}

            {/* Articles */}
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
              <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
                <Typography sx={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.95rem' }}>
                  Articles commandés ({(order.items || []).length})
                </Typography>
              </Box>
              <Divider />
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { bgcolor: '#faf9ff', color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, py: 1.2 } }}>
                      <TableCell>Produit</TableCell>
                      <TableCell align="center">Quantité</TableCell>
                      <TableCell align="right">P.U.</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(order.items || []).map((item, i) => {
                      const name = item.product_name || item.product?.name || `Article ${i + 1}`;
                      const pu   = item.unit_price || item.price || 0;
                      const qty  = item.quantity || 1;
                      return (
                        <TableRow key={i} sx={{ '& td': { py: 1.3, fontSize: '0.83rem' } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar variant="rounded"
                                src={getProductImageUrl(item.product || item)}
                                sx={{ width: 36, height: 36, bgcolor: '#ede9fe' }}>
                                <ShoppingBag sx={{ fontSize: 18, color: '#7c3aed' }} />
                              </Avatar>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: '#1e1b4b' }}>{name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ fontWeight: 600 }}>× {qty}</TableCell>
                          <TableCell align="right" sx={{ color: '#6b7280' }}>{pu.toLocaleString('fr-FR')} XOF</TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                            {(pu * qty).toLocaleString('fr-FR')} XOF
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Totals */}
              <Box sx={{ p: 2.5, borderTop: '1px solid #f1f5f9' }}>
                {[
                  { label: 'Sous-total', value: (order.subtotal || order.total_amount || 0) },
                  { label: 'Livraison', value: order.delivery_fee || 0 },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                    <Typography sx={{ fontSize: '0.83rem', color: '#6b7280' }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: '#374151' }}>
                      {value.toLocaleString('fr-FR')} XOF
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e1b4b' }}>Total</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#7c3aed' }}>
                    {(order.total_amount || order.total || 0).toLocaleString('fr-FR')} XOF
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* ─── Colonne droite ─── */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Infos commande */}
              <InfoCard title="Informations" icon={<ShoppingBag fontSize="small" />}>
                <InfoRow label="N° Commande" value={`#${(orderId || '').slice(-6).toUpperCase()}`} />
                <InfoRow label="Date" value={order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} />
                <InfoRow label="Statut" value={statusCfg.label} />
                <InfoRow label="Nb articles" value={(order.items || []).length} />
              </InfoCard>

              {/* Livraison */}
              <InfoCard title="Livraison" icon={<LocalShipping fontSize="small" />}>
                <InfoRow label="Méthode" value={order.delivery_method || 'Standard'} />
                <InfoRow label="Adresse" value={order.delivery_address?.full_address || order.shipping_address || ''} />
                <InfoRow label="Ville" value={order.delivery_address?.city || ''} />
                {order.tracking_number && (
                  <InfoRow label="N° suivi" value={order.tracking_number} />
                )}
                {order.estimated_delivery && (
                  <InfoRow label="Livraison estimée"
                    value={new Date(order.estimated_delivery).toLocaleDateString('fr-FR')} />
                )}
              </InfoCard>

              {/* Paiement */}
              <InfoCard title="Paiement" icon={<Payment fontSize="small" />}>
                <InfoRow label="Méthode" value={order.payment_method || ''} />
                <InfoRow label="Statut" value={order.payment_status || ''} />
                <InfoRow label="Référence" value={order.payment_reference || ''} />
              </InfoCard>

              {/* Marchand */}
              {order.merchant && (
                <InfoCard title="Marchand" icon={<Home fontSize="small" />}>
                  <InfoRow label="Boutique" value={formatMerchantName(order.merchant)} />
                  <InfoRow label="Contact" value={order.merchant.phone || order.merchant.email || 'Non renseigné'} />
                </InfoCard>
              )}

              {/* ⭐ AVIS CLIENT */}
              {canReview && (
                <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', p: 2.5 }}>
                  <Typography sx={{ fontWeight: 700, color: '#1e1b4b', mb: 2, fontSize: '0.95rem' }}>
                    Donnez votre avis
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating
                      value={rating}
                      onChange={(e, val) => setRating(val)}
                      size="large"
                      icon={<StarIcon fontSize="inherit" />}
                    />
                    {rating > 0 && (
                      <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {rating}/5
                      </Typography>
                    )}
                  </Box>
                  <TextField
                    label="Votre commentaire (optionnel)"
                    multiline
                    rows={3}
                    fullWidth
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                    placeholder="Qu'avez-vous pensé de ce marchand ?"
                  />
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={submitReview}
                    disabled={!rating || submittingReview}
                    sx={{
                      bgcolor: '#7c3aed',
                      '&:hover': { bgcolor: '#6d28d9' },
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    {submittingReview ? 'Envoi...' : 'Envoyer mon avis'}
                  </Button>
                </Card>
              )}

              {reviewSubmitted && order?.status === 'delivered' && (
                <Alert severity="success" sx={{ borderRadius: 2 }}>
                  ✅ Merci pour votre avis !
                </Alert>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </CustomerDashboardLayout>
  );
}