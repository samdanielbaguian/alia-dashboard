'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Card, CardContent, CardMedia, Button,
  IconButton, Divider, Skeleton, Alert, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, MenuItem, Select,
  FormControl, InputLabel, InputAdornment, Tooltip, Avatar,
} from '@mui/material';
import {
  Add, Remove, Delete, ShoppingCart, Share, Storefront,
  ArrowForward, CreditCard, LocalShipping, Home,
} from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/api';
import { getProductImageUrl } from '@/utils/imageUtils';

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItem({ item, onQtyChange, onRemove }) {
  const product = item.product || item;
  const name    = item.title || product?.title || product?.name || 'Produit';
  const price   = item.current_price || item.price_at_add || product?.price || 0;
  const image   = getProductImageUrl(product);
  const itemId  = item.product_id || item._id || item.id;
  const qty     = item.quantity || 1;

  return (
    <Box sx={{
      display: 'flex', gap: 2, p: 2, alignItems: 'center',
      borderBottom: '1px solid #f1f5f9',
      '&:last-child': { borderBottom: 'none' },
      '&:hover': { bgcolor: '#faf9ff' }, transition: 'background 0.15s',
    }}>
      <Avatar variant="rounded"
        src={image}
        sx={{ width: 72, height: 72, bgcolor: '#ede9fe', borderRadius: 2, flexShrink: 0 }}>
        <Storefront sx={{ color: '#7c3aed', fontSize: 28 }} />
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e1b4b', mb: 0.3 }} noWrap>
          {name}
        </Typography>
        <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#7c3aed' }}>
          {price.toLocaleString('fr-FR')} XOF
        </Typography>
        {item.stock_warning && (
          <Typography sx={{ fontSize: '0.75rem', color: '#f59e0b' }}>
            Quantité limitée en stock
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, bgcolor: '#f5f3ff', borderRadius: 2, px: 0.5 }}>
        <IconButton size="small" onClick={() => onQtyChange(itemId, qty - 1)} disabled={qty <= 1}
          sx={{ color: '#7c3aed', '&:disabled': { color: '#c4b5fd' } }}>
          <Remove fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 700, minWidth: 24, textAlign: 'center', fontSize: '0.88rem', color: '#1e1b4b' }}>
          {qty}
        </Typography>
        <IconButton size="small" onClick={() => onQtyChange(itemId, qty + 1)}
          sx={{ color: '#7c3aed' }}>
          <Add fontSize="small" />
        </IconButton>
      </Box>

      <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', color: '#1e1b4b', minWidth: 100, textAlign: 'right' }}>
        {(price * qty).toLocaleString('fr-FR')} XOF
      </Typography>

      <Tooltip title="Retirer du panier">
        <IconButton size="small" onClick={() => onRemove(itemId)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fee2e2' } }}>
          <Delete fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ─── Checkout Modal ───────────────────────────────────────────────────────────

function CheckoutModal({ open, onClose, total, onConfirm, loading }) {
  const [form, setForm] = useState({
    address: '', city: '', phone: '', payment_method: 'mobile_money', notes: '',
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, color: '#1e1b4b', pb: 1 }}>
        Finaliser la commande
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.83rem', color: '#6b7280', mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <Home fontSize="small" /> Adresse de livraison
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" label="Adresse" value={form.address} onChange={set('address')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Ville" value={form.city} onChange={set('city')}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth size="small" label="Téléphone" value={form.phone} onChange={set('phone')}
              InputProps={{ startAdornment: <InputAdornment position="start">+</InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Divider sx={{ my: 0.5 }} />
            <Typography sx={{ fontWeight: 700, fontSize: '0.83rem', color: '#6b7280', mb: 1.5, mt: 1.5, display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <CreditCard fontSize="small" /> Paiement
            </Typography>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Méthode de paiement</InputLabel>
              <Select value={form.payment_method} label="Méthode de paiement" onChange={set('payment_method')}
                sx={{ borderRadius: 2 }}>
                <MenuItem value="mobile_money">Mobile Money</MenuItem>
                <MenuItem value="card">Carte bancaire</MenuItem>
                <MenuItem value="cash_on_delivery">Paiement à la livraison</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField fullWidth size="small" label="Notes (optionnel)" value={form.notes} onChange={set('notes')}
              multiline rows={2} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Box sx={{ bgcolor: '#faf9ff', borderRadius: 2, p: 2, border: '1px solid #e9d5ff' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography sx={{ fontSize: '0.83rem', color: '#6b7280' }}>Livraison</Typography>
                <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: '#374151' }}>Gratuite</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontWeight: 800, color: '#1e1b4b' }}>Total</Typography>
                <Typography sx={{ fontWeight: 800, color: '#7c3aed', fontSize: '1.05rem' }}>
                  {total.toLocaleString('fr-FR')} XOF
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none', color: '#6b7280', borderRadius: 2 }}>Annuler</Button>
        <Button
          variant="contained"
          onClick={() => onConfirm(form)}
          disabled={loading || !form.address || !form.city || !form.phone}
          endIcon={<ArrowForward />}
          sx={{
            textTransform: 'none', borderRadius: 2, fontWeight: 700,
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: 'none',
          }}
        >
          {loading ? 'Commande en cours...' : 'Confirmer la commande'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart]             = useState({ items: [] });
  const [loading, setLoading]       = useState(true);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [toast, setToast]           = useState({ show: false, msg: '', sev: 'info' });
  const [shareLink, setShareLink]   = useState('');

  const showToast = (msg, sev = 'success') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet('/cart');
      setCart(data || { items: [] });
    } catch (error) {
      console.error(error);
      setCart({ items: [] });
      showToast('Impossible de charger le panier', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleQtyChange = async (itemId, newQty) => {
    if (!itemId || newQty < 1) return;
    setLoading(true);
    try {
      const data = await apiPut(`/cart/items/${itemId}`, { quantity: newQty });
      setCart(data);
    } catch (error) {
      console.error(error);
      showToast('Impossible de mettre à jour la quantité', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId) => {
    setLoading(true);
    try {
      const data = await apiDelete(`/cart/items/${itemId}`);
      setCart(data);
      showToast('Article retiré du panier');
    } catch (error) {
      console.error(error);
      showToast('Impossible de retirer l\'article', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      const data = await apiPost('/cart/share', { expires_in_hours: 24 });
      setShareLink(data.share_link || '');
      showToast('Lien de partage généré');
    } catch (error) {
      console.error(error);
      showToast('Échec du partage du panier', 'error');
    }
  };

  const handleCheckout = async (form) => {
    setCheckoutLoading(true);
    try {
      await apiPost('/orders/from-cart', { payment_method: form.payment_method });
      setCheckoutOpen(false);
      showToast('Commande passée avec succès !');
      router.push('/dashboard/customer/orders');
    } catch (error) {
      console.error(error);
      showToast('Erreur lors de la validation du panier', 'error');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => {
    const price = i.current_price || i.price_at_add || i.product?.price || 0;
    return s + price * (i.quantity || 1);
  }, 0);

  return (
    <CustomerDashboardLayout title="Mon panier">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        total={subtotal}
        onConfirm={handleCheckout}
        loading={checkoutLoading}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b' }}>Mon panier</Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.83rem', mt: 0.3 }}>
            {loading ? '—' : `${items.length} article${items.length > 1 ? 's' : ''}`}
          </Typography>
        </Box>
        {!loading && items.length > 0 && (
          <Tooltip title="Partager le panier">
            <Button startIcon={<Share />} variant="outlined" onClick={handleShare} size="small"
              sx={{ borderRadius: 2, textTransform: 'none', borderColor: '#a855f7', color: '#7c3aed' }}>
              Partager
            </Button>
          </Tooltip>
        )}
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2.5 }} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 2.5 }} />
          </Grid>
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #ede9fe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <ShoppingCart sx={{ fontSize: 48, color: '#a855f7' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e1b4b', mb: 1 }}>
              Votre panier est vide
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', mb: 3, maxWidth: 360, mx: 'auto' }}>
              Ajoutez des produits à votre panier pour commencer vos achats.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')} endIcon={<ArrowForward />}
              sx={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
              Découvrir les produits
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {/* Items list */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
              {/* Header */}
              <Box sx={{ display: 'flex', px: 2.5, py: 1.5, bgcolor: '#faf9ff', borderBottom: '1px solid #f1f5f9' }}>
                <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>PRODUIT</Typography>
                <Typography sx={{ minWidth: 90, textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>QUANTITÉ</Typography>
                <Typography sx={{ minWidth: 100, textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: '#6b7280' }}>TOTAL</Typography>
                <Box sx={{ width: 36 }} />
              </Box>

              {items.map(item => (
                <CartItem
                  key={item.product_id || item._id || item.id || `${item.title}-${item.quantity}`}
                  item={item}
                  onQtyChange={handleQtyChange}
                  onRemove={handleRemove}
                />
              ))}
            </Card>
          </Grid>

          {/* Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', position: 'sticky', top: 80 }}>
              <CardContent sx={{ p: 2.5 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1e1b4b', mb: 2 }}>Récapitulatif</Typography>

                {[
                  { label: 'Sous-total', value: subtotal },
                  { label: 'Livraison', value: 0, suffix: 'Gratuite' },
                ].map(({ label, value, suffix }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.2 }}>
                    <Typography sx={{ fontSize: '0.85rem', color: '#6b7280' }}>{label}</Typography>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>
                      {suffix || `${value.toLocaleString('fr-FR')} XOF`}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 1.5 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>Total</Typography>
                  <Typography sx={{ fontWeight: 800, color: '#7c3aed', fontSize: '1.2rem' }}>
                    {subtotal.toLocaleString('fr-FR')} XOF
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  endIcon={<CreditCard />}
                  onClick={() => setCheckoutOpen(true)}
                  sx={{
                    borderRadius: 2, textTransform: 'none', fontWeight: 700, py: 1.3,
                    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                    boxShadow: '0 4px 16px rgba(168,85,247,0.4)',
                    '&:hover': { boxShadow: '0 6px 24px rgba(168,85,247,0.5)' },
                  }}
                >
                  Commander ({items.length} article{items.length > 1 ? 's' : ''})
                </Button>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                  <LocalShipping sx={{ fontSize: 16, color: '#10b981' }} />
                  <Typography sx={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>
                    Livraison gratuite incluse
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </CustomerDashboardLayout>
  );
}
