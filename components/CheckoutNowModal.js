'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, TextField, MenuItem, Select, FormControl, InputLabel,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import { apiGet, apiPost } from '@/utils/api';

export default function CheckoutNowModal({ open, onClose, product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ street: '', city: '', country: '' });
  const [paymentMethod, setPaymentMethod] = useState('mobile_money');
  const [toast, setToast] = useState({ open: false, severity: 'info', message: '' });

  useEffect(() => {
    if (!open) return;
    const loadProfile = async () => {
      try {
        const data = await apiGet('/customers/me');
        setProfile(data || null);
        if (data) {
          setPhone(data.phone || data.phone_number || '');
          setAddress({ street: data.address || '', city: data.city || '', country: data.country || '' });
        }
      } catch (e) {
        // ignore - user may not have profile
      }
    };
    loadProfile();
  }, [open]);

  const showToast = (msg, severity='info') => setToast({ open: true, severity, message: msg });

  const normalizePhoneToE164 = (rawPhone) => {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/[\s\-()]/g, '');
    // Convert 00 prefix to +
    if (cleaned.startsWith('00')) cleaned = `+${cleaned.slice(2)}`;
    // If starts with + and looks like E.164, return
    if (cleaned.startsWith('+') && /^\+[1-9]\d{1,14}$/.test(cleaned)) return cleaned;
    // If only digits provided, prefix + (backend accepts +digits)
    if (/^\d{6,15}$/.test(cleaned)) return `+${cleaned}`;
    // If starts with country code without + (e.g., 225...), add +
    if (/^[1-9]\d{1,14}$/.test(cleaned)) return `+${cleaned}`;
    return cleaned;
  };

  const handleConfirm = async () => {
    if (!product) return showToast('Produit introuvable', 'error');
    const normalizedPhone = normalizePhoneToE164(phone);
    if (!normalizedPhone) return showToast('Veuillez renseigner un numéro de téléphone', 'error');
    if (!/^\+[1-9]\d{1,14}$/.test(normalizedPhone)) {
      return showToast('Veuillez saisir un numéro au format international E.164 (ex: +225701234567)', 'error');
    }
    setLoading(true);
    try {
      // Step 1: create order
      const payload = {
        products: [{ product_id: product.id || product._id || product._id, quantity: 1 }],
        payment_method: paymentMethod,
        shipping_address: {
          street: address.street,
          city: address.city,
          country: address.country,
          phone_number: normalizedPhone,
        }
      };
      const orderResp = await apiPost('/orders', payload);
      const order = orderResp?.order || orderResp || null;
      const order_id = order?.id || order?._id || orderResp?.order_id || null;
      if (!order_id) throw new Error('Impossible de créer la commande');

      // Step 2: initiate payment
      const payPayload = { order_id, phone_number: normalizedPhone, method: paymentMethod };
      const payResp = await apiPost('/payments/initiate', payPayload);

      // Interpret success
      if (payResp && (payResp.success || payResp.status === 'initiated' || payResp.payment_id)) {
        showToast('Paiement initié, vous allez être redirigé', 'success');
        setTimeout(() => {
          onClose?.();
          router.push('/dashboard/customer/orders');
        }, 1200);
      } else {
        const errMsg = payResp?.message || 'Échec de l’initiation du paiement';
        showToast(errMsg, 'error');
      }
    } catch (err) {
      console.error('Checkout error', err);
      showToast(err?.message || String(err) || 'Erreur lors du paiement', 'error');
    } finally {
      setLoading(false);
    }
  };

  const closeToast = () => setToast(t => ({ ...t, open: false }));

  return (
    <Dialog open={Boolean(open)} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800 }}>Paiement immédiat</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ width: 120, height: 120, bgcolor: '#f5f5f5', borderRadius: 1, overflow: 'hidden' }}>
            {product?.images?.[0] ? (
              <img src={product.images?.[0]} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography>{product?.title?.[0] || 'P'}</Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontWeight: 800 }}>{product?.title || product?.name}</Typography>
            <Typography sx={{ color: 'text.secondary', mt: 1 }}>{(product?.price || 0).toLocaleString('fr-FR')} XOF</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary', mt: 1 }}>{product?.description}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1.2 }}>
          <TextField label="Téléphone" size="small" value={phone} onChange={e => setPhone(e.target.value)} />
          <TextField label="Adresse (rue)" size="small" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
          <TextField label="Ville" size="small" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
          <TextField label="Pays" size="small" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} />

          <FormControl size="small">
            <InputLabel>Moyen de paiement</InputLabel>
            <Select value={paymentMethod} label="Moyen de paiement" onChange={e => setPaymentMethod(e.target.value)}>
              <MenuItem value="mobile_money">Mobile Money</MenuItem>
              <MenuItem value="orange_money">Orange Money</MenuItem>
              <MenuItem value="mtn_momo">MTN MoMo</MenuItem>
              <MenuItem value="wave">Wave</MenuItem>
              <MenuItem value="card">Carte bancaire</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: 'none' }}>Annuler</Button>
        <Button onClick={handleConfirm} variant="contained" color="success" disabled={loading} sx={{ textTransform: 'none' }}>
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Confirmer la commande'}
        </Button>
      </DialogActions>

      <Snackbar open={toast.open} autoHideDuration={4500} onClose={closeToast} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={closeToast} severity={toast.severity} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </Dialog>
  );
}
