'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, TextField, Tabs, Tab,
  FormControlLabel, Switch, Divider, Alert, Snackbar, Skeleton,
  InputAdornment, Avatar,
} from '@mui/material';
import {
  Store, LocalShipping, LocationOn, Notifications, Payment, Save, CloudUpload, Phone, Email, Person,
} from '@mui/icons-material';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiPut } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

function TabPanel({ children, value, index }) {
  return value === index ? <Box sx={{ pt: 3 }}>{children}</Box> : null;
}

const NOTIFICATION_TYPES = [
  { key: 'new_order',        label: 'Nouvelle commande',    desc: 'NotifiÃ© Ã  chaque commande reÃ§ue'      },
  { key: 'order_cancelled',  label: 'Commande annulÃ©e',     desc: 'Quand un acheteur annule sa commande'  },
  { key: 'low_stock',        label: 'Stock faible',         desc: 'Quand un produit passe sous le seuil'  },
  { key: 'payment_received', label: 'Paiement reÃ§u',        desc: 'Confirmation de paiement validÃ©'       },
  { key: 'new_review',       label: 'Nouvel avis',          desc: 'Quand un client laisse un commentaire' },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const mid = user?.id || user?._id;
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const logoInputRef = useRef(null);

  const [profile, setProfile] = useState({ shop_name: '', description: '', phone: '', email: '', logo_url: '' });
  const [delivery, setDelivery] = useState({ shipping_fee: '', free_shipping_threshold: '', shipping_delay: '' });
  const [location, setLocation] = useState({ address: '', city: '', country: 'SÃ©nÃ©gal', postal_code: '' });
  const [notifs, setNotifs] = useState({ email: true, sms: false, ...NOTIFICATION_TYPES.reduce((a, n) => ({ ...a, [n.key]: true }), {}) });
  const [payment, setPayment] = useState({ bank_name: '', account_number: '', account_holder: '', mobile_money: '' });

  useEffect(() => {
    if (!mid) return;
    apiGet(`/merchants/${mid}`)
      .then(data => {
        setProfile({ shop_name: data.shop_name || data.name || '', description: data.description || '', phone: data.phone || '', email: data.email || '', logo_url: data.logo_url || '' });
        setDelivery({ shipping_fee: String(data.shipping_fee ?? ''), free_shipping_threshold: String(data.free_shipping_threshold ?? ''), shipping_delay: data.shipping_delay || '' });
        setLocation({ address: data.address || '', city: data.city || '', country: data.country || 'SÃ©nÃ©gal', postal_code: data.postal_code || '' });
        setNotifs(prev => ({ ...prev, ...(data.notification_settings || {}) }));
        setPayment({ bank_name: data.bank_name || '', account_number: data.account_number || '', account_holder: data.account_holder || '', mobile_money: data.mobile_money || '' });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [mid]);

  const save = async (payload) => {
    setSaving(true);
    try {
      await apiPut(`/merchants/${mid}`, payload);
      setSnack({ open: true, msg: 'ParamÃ¨tres enregistrÃ©s !', severity: 'success' });
    } catch (e) {
      setSnack({ open: true, msg: e?.message || 'Erreur lors de la sauvegarde', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setProfile(p => ({ ...p, logo_url: ev.target.result }));
    reader.readAsDataURL(file);
  };

  if (loading) return (
    <MerchantDashboardLayout title="ParamÃ¨tres">
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2, mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2].map(i => <Grid size={{ xs: 12, md: 6 }} key={i}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 3 }} /></Grid>)}
      </Grid>
    </MerchantDashboardLayout>
  );

  return (
    <MerchantDashboardLayout title="ParamÃ¨tres boutique">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>ParamÃ¨tres boutique</Typography>
        <Typography variant="body2" sx={{ color: '#7f8c8d' }}>GÃ©rez toutes vos configurations en un seul endroit</Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto"
          sx={{ borderBottom: '1px solid rgba(0,0,0,0.08)', px: 2, '& .MuiTab-root': { fontWeight: 600, textTransform: 'none', minHeight: 52, fontSize: '0.85rem' }, '& .Mui-selected': { color: '#1976d2' }, '& .MuiTabs-indicator': { bgcolor: '#1976d2', height: 3, borderRadius: 3 } }}>
          <Tab icon={<Store sx={{ fontSize: 18 }} />} iconPosition="start" label="Profil boutique" />
          <Tab icon={<LocalShipping sx={{ fontSize: 18 }} />} iconPosition="start" label="Livraison" />
          <Tab icon={<LocationOn sx={{ fontSize: 18 }} />} iconPosition="start" label="Localisation" />
          <Tab icon={<Notifications sx={{ fontSize: 18 }} />} iconPosition="start" label="Notifications" />
          <Tab icon={<Payment sx={{ fontSize: 18 }} />} iconPosition="start" label="Paiements" />
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {/* Tab 0 â€” Profil */}
          <TabPanel value={tab} index={0}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Avatar src={profile.logo_url} sx={{ width: 100, height: 100, mx: 'auto', mb: 2, bgcolor: '#1976d2', fontSize: 36 }}>
                    {(profile.shop_name || 'M')[0]?.toUpperCase()}
                  </Avatar>
                  <Button variant="outlined" startIcon={<CloudUpload />} onClick={() => logoInputRef.current?.click()}
                    sx={{ borderRadius: 2, mb: 1, textTransform: 'none', fontWeight: 600 }}>
                    Changer le logo
                  </Button>
                  <input ref={logoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
                  <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block' }}>JPG, PNG â€” max 2MB</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <Grid container spacing={2.5}>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth label="Nom de la boutique *" value={profile.shop_name}
                      onChange={e => setProfile(p => ({ ...p, shop_name: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Store sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField fullWidth multiline rows={3} label="Description" value={profile.description}
                      onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="TÃ©lÃ©phone" value={profile.phone}
                      onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="Email" type="email" value={profile.email}
                      onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                      InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                  </Grid>
                </Grid>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<Save />} disabled={saving}
                    onClick={() => save(profile)}
                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#1976d2,#42a5f5)', fontWeight: 700 }}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 1 â€” Livraison */}
          <TabPanel value={tab} index={1}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Frais de livraison (XOF)" type="number" value={delivery.shipping_fee}
                  onChange={e => setDelivery(d => ({ ...d, shipping_fee: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 100 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Livraison gratuite Ã  partir de (XOF)" type="number" value={delivery.free_shipping_threshold}
                  onChange={e => setDelivery(d => ({ ...d, free_shipping_threshold: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                  helperText="Laisser vide pour dÃ©sactiver"
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 500 }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="DÃ©lai de livraison estimÃ©" value={delivery.shipping_delay}
                  onChange={e => setDelivery(d => ({ ...d, shipping_delay: e.target.value }))}
                  placeholder="ex: 3-5 jours"
                  InputProps={{ endAdornment: <InputAdornment position="end">jours</InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider sx={{ mb: 2, mt: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="contained" startIcon={<Save />} disabled={saving}
                    onClick={() => save({ shipping_fee: Number(delivery.shipping_fee) || 0, free_shipping_threshold: delivery.free_shipping_threshold ? Number(delivery.free_shipping_threshold) : null, shipping_delay: delivery.shipping_delay })}
                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#9c27b0,#ce93d8)', fontWeight: 700 }}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 2 â€” Localisation */}
          <TabPanel value={tab} index={2}>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <TextField fullWidth label="Adresse" value={location.address}
                  onChange={e => setLocation(l => ({ ...l, address: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><LocationOn sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Ville" value={location.city}
                  onChange={e => setLocation(l => ({ ...l, city: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Code postal" value={location.postal_code}
                  onChange={e => setLocation(l => ({ ...l, postal_code: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Pays" value={location.country}
                  onChange={e => setLocation(l => ({ ...l, country: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ height: 180, borderRadius: 3, bgcolor: '#f0f2f5', border: '2px dashed rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 36, color: '#b0b0b0' }} />
                  <Typography variant="body2" sx={{ color: '#b0b0b0', fontWeight: 600 }}>AperÃ§u de la carte</Typography>
                  <Typography variant="caption" sx={{ color: '#b0b0b0' }}>IntÃ©gration Google Maps disponible</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" startIcon={<Save />} disabled={saving}
                    onClick={() => save(location)}
                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#4caf50,#81c784)', fontWeight: 700 }}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3 â€” Notifications */}
          <TabPanel value={tab} index={3}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5 }}>Canaux de notification</Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <FormControlLabel
                  control={<Switch checked={notifs.email} onChange={e => setNotifs(n => ({ ...n, email: e.target.checked }))} color="primary" />}
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Email sx={{ fontSize: 18, color: '#7f8c8d' }} /><Typography variant="body2" sx={{ fontWeight: 600 }}>Email</Typography></Box>}
                />
                <FormControlLabel
                  control={<Switch checked={notifs.sms} onChange={e => setNotifs(n => ({ ...n, sms: e.target.checked }))} color="secondary" />}
                  label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Phone sx={{ fontSize: 18, color: '#7f8c8d' }} /><Typography variant="body2" sx={{ fontWeight: 600 }}>SMS</Typography></Box>}
                />
              </Box>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Ã‰vÃ©nements</Typography>
            {NOTIFICATION_TYPES.map(n => (
              <Box key={n.key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c3e50' }}>{n.label}</Typography>
                  <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{n.desc}</Typography>
                </Box>
                <Switch checked={notifs[n.key] !== false} onChange={e => setNotifs(prev => ({ ...prev, [n.key]: e.target.checked }))} color="primary" />
              </Box>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="contained" startIcon={<Save />} disabled={saving}
                onClick={() => save({ notification_settings: notifs })}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#ff9800,#ffcc80)', fontWeight: 700 }}>
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </Box>
          </TabPanel>

          {/* Tab 4 â€” Paiements */}
          <TabPanel value={tab} index={4}>
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>Informations bancaires</Typography>
              <Typography variant="caption">Ces informations sont utilisÃ©es pour les virements de vos ventes.</Typography>
            </Alert>
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Nom de la banque" value={payment.bank_name}
                  onChange={e => setPayment(p => ({ ...p, bank_name: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Titulaire du compte" value={payment.account_holder}
                  onChange={e => setPayment(p => ({ ...p, account_holder: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Person sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="NumÃ©ro de compte" value={payment.account_number}
                  onChange={e => setPayment(p => ({ ...p, account_number: e.target.value }))}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Mobile Money (Wave, Orange Money...)" value={payment.mobile_money}
                  onChange={e => setPayment(p => ({ ...p, mobile_money: e.target.value }))}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Phone sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button variant="contained" startIcon={<Save />} disabled={saving}
                    onClick={() => save(payment)}
                    sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#f44336,#ef9a9a)', fontWeight: 700 }}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}
