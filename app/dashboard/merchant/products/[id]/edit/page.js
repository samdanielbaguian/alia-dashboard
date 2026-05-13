'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, Alert, Snackbar,
  InputAdornment, IconButton, Switch, FormControlLabel, Skeleton, Divider,
} from '@mui/material';
import {
  ArrowBack, Save, Delete, CloudUpload, Add, Info, Euro, LocalShipping, Image as ImageIcon,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiPut, apiDelete } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Beauté', 'Sports', 'Alimentation', 'Jouets', 'Auto', 'Autre'];

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const productId = params?.id;
  const [form, setForm] = useState(null);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!productId) return;
    apiGet(`/products/${productId}`)
      .then(data => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
          price: String(data.price || data.merchant_price || ''),
          original_price: String(data.original_price || ''),
          stock_quantity: String(data.stock_quantity ?? data.stock ?? ''),
          sku: data.sku || '',
          brand: data.brand || '',
          weight: String(data.weight || ''),
          condition: data.condition || 'Neuf',
          shipping_fee: String(data.shipping_fee ?? 0),
          shipping_delay: data.shipping_delay || '3-5',
          is_active: data.is_active !== false,
          min_order_quantity: String(data.min_order_quantity || 1),
          max_order_quantity: String(data.max_order_quantity || ''),
        });
        setTags(data.tags || []);
        setImagePreviews(data.images || (data.image_url ? [data.image_url] : []));
      })
      .catch(() => setSnack({ open: true, msg: 'Produit introuvable', severity: 'error' }))
      .finally(() => setLoading(false));
  }, [productId]);

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const validate = () => {
    const err = {};
    if (!form.title?.trim()) err.title = 'Le titre est requis';
    if (!form.category) err.category = 'La catégorie est requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) err.price = 'Prix invalide';
    if (form.stock_quantity === '' || isNaN(Number(form.stock_quantity))) err.stock_quantity = 'Stock invalide';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) { setSnack({ open: true, msg: 'Veuillez corriger les erreurs', severity: 'error' }); return; }
    setSaving(true);
    try {
      await apiPut(`/products/${productId}`, {
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        original_price: form.original_price ? Number(form.original_price) : undefined,
        shipping_fee: Number(form.shipping_fee || 0),
        tags,
      });
      setSnack({ open: true, msg: 'Produit mis à jour !', severity: 'success' });
      setTimeout(() => router.push('/dashboard/merchant/products'), 1500);
    } catch (e) {
      setSnack({ open: true, msg: e?.message || 'Erreur lors de la mise à jour', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiDelete(`/products/${productId}`);
      router.push('/dashboard/merchant/products');
    } catch {
      setSnack({ open: true, msg: 'Erreur lors de la suppression', severity: 'error' });
    } finally {
      setDeleting(false); setConfirmDelete(false);
    }
  };

  if (loading) return (
    <MerchantDashboardLayout title="Modifier produit">
      <Grid container spacing={3}>
        {[1,2,3].map(i => <Grid item xs={12} key={i}><Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} /></Grid>)}
      </Grid>
    </MerchantDashboardLayout>
  );

  if (!form) return (
    <MerchantDashboardLayout title="Modifier produit">
      <Alert severity="error" sx={{ borderRadius: 2 }}>Produit introuvable ou accès refusé.</Alert>
    </MerchantDashboardLayout>
  );

  const priceNum = Number(form.price) || 0;
  const origNum = Number(form.original_price) || 0;
  const discount = origNum > priceNum && origNum > 0 ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

  return (
    <MerchantDashboardLayout title="Modifier produit">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#e8f0fe' } }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Modifier le produit</Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>ID: {productId}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          {!confirmDelete ? (
            <Button variant="outlined" color="error" startIcon={<Delete />} onClick={() => setConfirmDelete(true)}
              sx={{ borderRadius: 2, fontWeight: 600 }}>
              Supprimer
            </Button>
          ) : (
            <>
              <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}
                sx={{ borderRadius: 2, fontWeight: 700 }}>
                {deleting ? 'Suppression...' : 'Confirmer suppression'}
              </Button>
              <Button variant="outlined" onClick={() => setConfirmDelete(false)} sx={{ borderRadius: 2 }}>
                Annuler
              </Button>
            </>
          )}
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#1976d2,#42a5f5)', fontWeight: 700 }}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {/* Infos */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info sx={{ color: '#1976d2' }} /> Informations générales
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Titre *" value={form.title} onChange={handleChange('title')}
                    error={Boolean(errors.title)} helperText={errors.title}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Description" value={form.description} onChange={handleChange('description')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.category)}>
                    <InputLabel>Catégorie *</InputLabel>
                    <Select value={form.category} onChange={handleChange('category')} label="Catégorie *" sx={{ borderRadius: 2 }}>
                      {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Marque" value={form.brand} onChange={handleChange('brand')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="SKU" value={form.sku} onChange={handleChange('sku')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Prix & Stock */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Euro sx={{ color: '#4caf50' }} /> Prix et Stock
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Prix de vente (XOF) *" type="number" value={form.price}
                    onChange={handleChange('price')} error={Boolean(errors.price)} helperText={errors.price}
                    InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 100 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Prix original (XOF)" type="number" value={form.original_price}
                    onChange={handleChange('original_price')}
                    InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                    helperText={discount > 0 ? `Réduction de ${discount}%` : ''}
                    FormHelperTextProps={{ sx: { color: '#4caf50', fontWeight: 600 } }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 100 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Stock *" type="number" value={form.stock_quantity}
                    onChange={handleChange('stock_quantity')} error={Boolean(errors.stock_quantity)} helperText={errors.stock_quantity}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Poids (kg)" type="number" value={form.weight}
                    onChange={handleChange('weight')}
                    InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 0.1 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5 }}>Tags</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField size="small" placeholder="Ajouter un tag..." value={tagInput}
                  onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (() => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(p => [...p, tagInput.trim()]); setTagInput(''); } })()}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                <Button variant="outlined" onClick={() => { if (tagInput.trim() && !tags.includes(tagInput.trim())) { setTags(p => [...p, tagInput.trim()]); setTagInput(''); } }}
                  sx={{ borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}>
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => setTags(p => p.filter(t => t !== tag))}
                    sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: '#1976d2', fontWeight: 600 }} />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right */}
        <Grid item xs={12} lg={4}>
          {/* Images */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon sx={{ color: '#ff9800' }} /> Images
              </Typography>
              <Box onClick={() => fileInputRef.current?.click()} sx={{
                border: '2px dashed rgba(25,118,210,0.3)', borderRadius: 2, p: 2.5, textAlign: 'center',
                cursor: 'pointer', bgcolor: 'rgba(25,118,210,0.03)',
                '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25,118,210,0.06)' }, mb: 2,
              }}>
                <CloudUpload sx={{ fontSize: 28, color: '#1976d2', mb: 0.5 }} />
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.8rem' }}>Uploader des images</Typography>
              </Box>
              <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
              {imagePreviews.length > 0 && (
                <Grid container spacing={1}>
                  {imagePreviews.map((src, i) => (
                    <Grid item xs={4} key={i}>
                      <Box sx={{ position: 'relative', borderRadius: 1.5, overflow: 'hidden', aspectRatio: '1' }}>
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton size="small" onClick={() => { setImagePreviews(p => p.filter((_, j) => j !== i)); setImages(p => p.filter((_, j) => j !== i)); }}
                          sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', width: 20, height: 20, '&:hover': { bgcolor: '#f44336' } }}>
                          <Delete sx={{ fontSize: 11 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Statut */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Statut</Typography>
              <FormControlLabel
                control={<Switch checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} color="success" />}
                label={<Typography variant="body2" sx={{ fontWeight: 600, color: form.is_active ? '#4caf50' : '#7f8c8d' }}>{form.is_active ? 'Actif' : 'Inactif (brouillon)'}</Typography>}
              />
            </CardContent>
          </Card>

          {/* Livraison */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping sx={{ color: '#9c27b0' }} /> Livraison
              </Typography>
              <TextField fullWidth label="Frais de livraison (XOF)" type="number" value={form.shipping_fee}
                onChange={handleChange('shipping_fee')}
                InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 2 } }} inputProps={{ min: 0, step: 100 }} />
              <TextField fullWidth label="Délai (jours)" value={form.shipping_delay}
                onChange={handleChange('shipping_delay')}
                InputProps={{ endAdornment: <InputAdornment position="end">jours</InputAdornment> }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}
