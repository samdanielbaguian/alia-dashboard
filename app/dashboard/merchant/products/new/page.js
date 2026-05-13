'use client';

import { useState, useRef } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, Button, TextField,
  FormControl, InputLabel, Select, MenuItem, Chip, Alert, Snackbar,
  InputAdornment, Divider, LinearProgress, IconButton, Tooltip,
  Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material';
import {
  ArrowBack, Save, Publish, CloudUpload, Delete, Add, ExpandMore,
  Euro, Inventory, LocalShipping, Info, Image as ImageIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiPost } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = ['Électronique', 'Mode', 'Maison', 'Beauté', 'Sports', 'Alimentation', 'Jouets', 'Auto', 'Autre'];
const CURRENCIES = ['XOF'];
const CONDITIONS = ['Neuf', 'Occasion - Très bon état', 'Occasion - Bon état', 'Occasion - État correct'];

const INIT = {
  title: '', description: '', category: '', price: '', stock_quantity: '',
  sku: '', brand: '', weight: '', condition: 'Neuf',
  shipping_fee: '0', shipping_delay: '3-5', is_active: true,
  min_order_quantity: '1', max_order_quantity: '',
  tags: [], original_price: '',
};

export default function NewProduct() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState(INIT);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5 - images.length);
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setImagePreviews(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t) && tags.length < 10) {
      setTags(prev => [...prev, t]);
      setTagInput('');
    }
  };

  const validate = () => {
    const err = {};
    if (!form.title.trim()) err.title = 'Le titre est requis';
    if (!form.description.trim()) err.description = 'La description est requise';
    if (!form.category) err.category = 'La catégorie est requise';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) err.price = 'Prix invalide';
    if (!form.stock_quantity || isNaN(Number(form.stock_quantity)) || Number(form.stock_quantity) < 0) err.stock_quantity = 'Stock invalide';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (publish = false) => {
    if (!validate()) {
      setSnack({ open: true, msg: 'Veuillez corriger les erreurs', severity: 'error' });
      return;
    }
    setSaving(true);
    try {
      const mid = user?.id || user?._id;
      // Build FormData for image upload
      const formData = new FormData();
      const productData = {
        ...form,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        original_price: form.original_price ? Number(form.original_price) : undefined,
        shipping_fee: Number(form.shipping_fee || 0),
        min_order_quantity: Number(form.min_order_quantity || 1),
        max_order_quantity: form.max_order_quantity ? Number(form.max_order_quantity) : undefined,
        merchant_id: mid,
        is_active: publish ? true : form.is_active,
        tags,
      };
      // Try JSON first (backend may not support multipart)
      const created = await apiPost('/products', productData);
      setSnack({ open: true, msg: `Produit ${publish ? 'publié' : 'enregistré'} avec succès !`, severity: 'success' });
      setTimeout(() => router.push('/dashboard/merchant/products'), 1500);
    } catch (e) {
      setSnack({ open: true, msg: e?.message || 'Erreur lors de la création', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const priceNum = Number(form.price) || 0;
  const origNum = Number(form.original_price) || 0;
  const discount = origNum > priceNum && origNum > 0 ? Math.round(((origNum - priceNum) / origNum) * 100) : 0;

  return (
    <MerchantDashboardLayout title="Nouveau produit">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => router.back()} sx={{ bgcolor: '#f5f7fa', '&:hover': { bgcolor: '#e8f0fe' } }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50' }}>Créer un produit</Typography>
            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>Remplissez les informations de votre produit</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button variant="outlined" startIcon={<Save />} onClick={() => handleSubmit(false)} disabled={saving}
            sx={{ borderRadius: 2, borderColor: '#1976d2', color: '#1976d2', fontWeight: 600 }}>
            Enregistrer
          </Button>
          <Button variant="contained" startIcon={<Publish />} onClick={() => handleSubmit(true)} disabled={saving}
            sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#4caf50,#81c784)', fontWeight: 700, boxShadow: '0 4px 12px rgba(76,175,80,0.35)' }}>
            {saving ? 'Publication...' : 'Publier'}
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          {/* Section 1: Informations */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info sx={{ color: '#1976d2' }} /> Informations générales
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Titre du produit *" value={form.title}
                    onChange={handleChange('title')} error={Boolean(errors.title)} helperText={errors.title}
                    placeholder="Ex: Smartphone Samsung Galaxy S24 128Go Noir"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ maxLength: 200 }}
                    InputProps={{ endAdornment: <InputAdornment position="end"><Typography variant="caption" sx={{ color: '#b0b0b0' }}>{form.title.length}/200</Typography></InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={4} label="Description *" value={form.description}
                    onChange={handleChange('description')} error={Boolean(errors.description)} helperText={errors.description}
                    placeholder="Décrivez votre produit en détail : caractéristiques, dimensions, matériaux..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={Boolean(errors.category)}>
                    <InputLabel>Catégorie *</InputLabel>
                    <Select value={form.category} onChange={handleChange('category')} label="Catégorie *" sx={{ borderRadius: 2 }}>
                      {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                    {errors.category && <Typography variant="caption" sx={{ color: '#f44336', ml: 1.5, mt: 0.3 }}>{errors.category}</Typography>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Marque" value={form.brand} onChange={handleChange('brand')}
                    placeholder="Samsung, Apple, Nike..."
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>État du produit</InputLabel>
                    <Select value={form.condition} onChange={handleChange('condition')} label="État du produit" sx={{ borderRadius: 2 }}>
                      {CONDITIONS.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Référence / SKU" value={form.sku} onChange={handleChange('sku')}
                    placeholder="SKU-12345"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 2: Prix & Stock */}
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
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 0, step: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Prix original / Barré (XOF)" type="number" value={form.original_price}
                    onChange={handleChange('original_price')}
                    InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 0, step: 100 }}
                    helperText={discount > 0 ? `Réduction de ${discount}%` : ''}
                    FormHelperTextProps={{ sx: { color: '#4caf50', fontWeight: 600 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Quantité en stock *" type="number" value={form.stock_quantity}
                    onChange={handleChange('stock_quantity')} error={Boolean(errors.stock_quantity)} helperText={errors.stock_quantity}
                    InputProps={{ startAdornment: <InputAdornment position="start"><Inventory sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 0, step: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Poids (kg)" type="number" value={form.weight}
                    onChange={handleChange('weight')}
                    InputProps={{ endAdornment: <InputAdornment position="end">kg</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth label="Qté min commande" type="number" value={form.min_order_quantity}
                    onChange={handleChange('min_order_quantity')}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TextField fullWidth label="Qté max commande" type="number" value={form.max_order_quantity}
                    onChange={handleChange('max_order_quantity')} placeholder="Illimité"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                {/* Price preview */}
                {priceNum > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 2, bgcolor: '#f0f7ff', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                      <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                        Prix affiché : {priceNum.toLocaleString('fr-FR')} XOF
                        {discount > 0 && <Chip label={`-${discount}%`} size="small" sx={{ ml: 1, bgcolor: '#e8f5e9', color: '#4caf50', fontWeight: 700 }} />}
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>

          {/* Section 3: Livraison */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalShipping sx={{ color: '#9c27b0' }} /> Livraison
              </Typography>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Frais de livraison (XOF)" type="number" value={form.shipping_fee}
                    onChange={handleChange('shipping_fee')}
                    InputProps={{ startAdornment: <InputAdornment position="start">XOF</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    helperText="0 pour la livraison gratuite"
                    inputProps={{ min: 0, step: 100 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Délai de livraison" value={form.shipping_delay}
                    onChange={handleChange('shipping_delay')}
                    placeholder="3-5"
                    InputProps={{ endAdornment: <InputAdornment position="end">jours</InputAdornment> }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Section 4: Tags */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 1.5 }}>Tags / Mots-clés</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1.5 }}>
                <TextField size="small" placeholder="Ajouter un tag..." value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <Button variant="outlined" onClick={addTag} disabled={!tagInput.trim() || tags.length >= 10}
                  sx={{ borderRadius: 2, borderColor: '#1976d2', color: '#1976d2' }}>
                  <Add />
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                {tags.map(tag => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => setTags(prev => prev.filter(t => t !== tag))}
                    sx={{ bgcolor: 'rgba(25,118,210,0.1)', color: '#1976d2', fontWeight: 600 }} />
                ))}
              </Box>
              <Typography variant="caption" sx={{ color: '#b0b0b0', mt: 0.5, display: 'block' }}>
                {tags.length}/10 tags — Appuyez Entrée pour ajouter
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          {/* Images */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon sx={{ color: '#ff9800' }} /> Images produit
              </Typography>
              {/* Upload zone */}
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed rgba(25,118,210,0.3)',
                  borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
                  bgcolor: 'rgba(25,118,210,0.03)',
                  '&:hover': { borderColor: '#1976d2', bgcolor: 'rgba(25,118,210,0.06)' },
                  transition: 'all 0.2s', mb: 2,
                }}
              >
                <CloudUpload sx={{ fontSize: 36, color: '#1976d2', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#1976d2', fontWeight: 600 }}>
                  Cliquer pour uploader
                </Typography>
                <Typography variant="caption" sx={{ color: '#7f8c8d' }}>
                  PNG, JPG jusqu&apos;à 5MB — max 5 images
                </Typography>
              </Box>
              <input ref={fileInputRef} type="file" multiple accept="image/*"
                style={{ display: 'none' }} onChange={handleImageChange} />

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <Grid container spacing={1}>
                  {imagePreviews.map((src, i) => (
                    <Grid item xs={4} key={i}>
                      <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', aspectRatio: '1' }}>
                        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {i === 0 && <Chip label="Principale" size="small" sx={{ position: 'absolute', top: 4, left: 4, bgcolor: 'rgba(25,118,210,0.9)', color: '#fff', fontSize: '0.6rem', height: 16 }} />}
                        <IconButton size="small" onClick={() => removeImage(i)}
                          sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', width: 22, height: 22, '&:hover': { bgcolor: '#f44336' } }}>
                          <Delete sx={{ fontSize: 12 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                  {imagePreviews.length < 5 && (
                    <Grid item xs={4}>
                      <Box onClick={() => fileInputRef.current?.click()} sx={{
                        aspectRatio: '1', border: '2px dashed rgba(0,0,0,0.12)', borderRadius: 2,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        '&:hover': { borderColor: '#1976d2' },
                      }}>
                        <Add sx={{ color: '#b0b0b0' }} />
                      </Box>
                    </Grid>
                  )}
                </Grid>
              )}
            </CardContent>
          </Card>

          {/* Publication */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Publication</Typography>
              <FormControlLabel
                control={<Switch checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} color="success" />}
                label={<Typography variant="body2" sx={{ fontWeight: 600, color: form.is_active ? '#4caf50' : '#7f8c8d' }}>{form.is_active ? 'Produit actif' : 'Brouillon'}</Typography>}
              />
              <Typography variant="caption" sx={{ color: '#7f8c8d', display: 'block', mt: 0.5 }}>
                {form.is_active ? 'Le produit sera visible par les clients' : 'Le produit ne sera pas visible en ligne'}
              </Typography>
            </CardContent>
          </Card>

          {/* Quick Summary */}
          {(priceNum > 0 || form.title) && (
            <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', bgcolor: 'linear-gradient(135deg,#f0f7ff,#e8f5e9)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#2c3e50', mb: 2 }}>Récapitulatif</Typography>
                {[
                  { label: 'Titre', value: form.title || '—' },
                  { label: 'Catégorie', value: form.category || '—' },
                  { label: 'Prix', value: priceNum ? `${priceNum.toLocaleString('fr-FR')} XOF` : '—' },
                  { label: 'Stock', value: form.stock_quantity ? `${form.stock_quantity} unités` : '—' },
                  { label: 'Livraison', value: Number(form.shipping_fee) === 0 ? 'Gratuite' : `${Number(form.shipping_fee).toLocaleString('fr-FR')} XOF` },
                ].map(item => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#7f8c8d' }}>{item.label}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#2c3e50', maxWidth: 160, textAlign: 'right' }} noWrap>{item.value}</Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}
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
