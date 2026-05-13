'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Grid, Typography, Card, CardContent, CardMedia, CardActions,
  Button, Chip, IconButton, Tooltip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Skeleton, Pagination,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  LinearProgress, Badge, Alert, Snackbar, Menu,
} from '@mui/material';
import {
  Search, Add, Edit, Delete, MoreVert, FilterList,
  Inventory, Warning, CheckCircle, TrendingUp, FileDownload,
  Visibility, ContentCopy, StoreMallDirectory,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import MerchantDashboardLayout from '@/layout/MerchantDashboardLayout';
import { apiGet, apiDelete } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

const CATEGORIES = ['Tous', 'Électronique', 'Mode', 'Maison', 'Beauté', 'Sports', 'Alimentation', 'Jouets', 'Auto', 'Autre'];
const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Plus récent' },
  { value: 'created_at_asc', label: 'Plus ancien' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc', label: 'Prix décroissant' },
  { value: 'stock_asc', label: 'Stock le plus bas' },
  { value: 'sales_desc', label: 'Meilleures ventes' },
];

function StockBar({ stock, maxStock = 100 }) {
  const pct = Math.min((stock / Math.max(maxStock, 1)) * 100, 100);
  const color = stock <= 5 ? '#f44336' : stock <= 20 ? '#ff9800' : '#4caf50';
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.3 }}>
        <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.68rem' }}>Stock</Typography>
        <Typography variant="caption" sx={{ color, fontWeight: 700, fontSize: '0.68rem' }}>
          {stock <= 5 ? '⚠ ' : ''}{stock} unités
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate" value={pct}
        sx={{ height: 5, borderRadius: 3, bgcolor: 'rgba(0,0,0,0.08)',
          '& .MuiLinearProgress-bar': { bgcolor: color, borderRadius: 3 } }}
      />
    </Box>
  );
}

function ProductCard({ product, onEdit, onDelete, onView }) {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const price = product.price || product.merchant_price || 0;
  const stock = product.stock_quantity ?? product.stock ?? 0;
  const isActive = product.is_active !== false;

  return (
    <Card sx={{
      borderRadius: 3, overflow: 'hidden', position: 'relative',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 8px 28px rgba(0,0,0,0.12)' },
      opacity: isActive ? 1 : 0.7,
    }}>
      {/* Status Badge */}
      <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
        <Chip
          label={isActive ? 'Actif' : 'Inactif'}
          size="small"
          sx={{
            bgcolor: isActive ? 'rgba(76,175,80,0.9)' : 'rgba(100,100,100,0.8)',
            color: '#fff', fontWeight: 700, fontSize: '0.65rem', height: 20,
            backdropFilter: 'blur(4px)',
          }}
        />
      </Box>

      {/* Options Menu */}
      <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
        <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ bgcolor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', width: 28, height: 28, '&:hover': { bgcolor: '#fff' } }}>
          <MoreVert sx={{ fontSize: 16 }} />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}
          PaperProps={{ sx: { borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160 } }}>
          <MenuItem onClick={() => { setMenuAnchor(null); onView(product); }} sx={{ fontSize: '0.85rem', gap: 1.5 }}>
            <Visibility sx={{ fontSize: 16, color: '#7f8c8d' }} /> Aperçu
          </MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); onEdit(product); }} sx={{ fontSize: '0.85rem', gap: 1.5 }}>
            <Edit sx={{ fontSize: 16, color: '#1976d2' }} /> Modifier
          </MenuItem>
          <MenuItem onClick={() => { setMenuAnchor(null); onDelete(product); }} sx={{ fontSize: '0.85rem', gap: 1.5, color: '#f44336' }}>
            <Delete sx={{ fontSize: 16 }} /> Supprimer
          </MenuItem>
        </Menu>
      </Box>

      {/* Product Image */}
      <Box sx={{ height: 180, overflow: 'hidden', bgcolor: '#f5f7fa', position: 'relative' }}>
        {product.images?.[0] || product.image_url ? (
          <CardMedia
            component="img"
            image={product.images?.[0] || product.image_url}
            alt={product.title}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <StoreMallDirectory sx={{ fontSize: 56, color: 'rgba(0,0,0,0.1)' }} />
          </Box>
        )}
      </Box>

      <CardContent sx={{ p: 2, pb: 1 }}>
        {/* Category */}
        <Chip label={product.category || 'Autre'} size="small"
          sx={{ mb: 1, bgcolor: 'rgba(25,118,210,0.08)', color: '#1976d2', fontWeight: 600, fontSize: '0.65rem', height: 18 }} />

        {/* Title */}
        <Typography variant="body1" sx={{ fontWeight: 700, color: '#2c3e50', lineHeight: 1.3, mb: 0.5, fontSize: '0.9rem' }} noWrap>
          {product.title || 'Produit sans titre'}
        </Typography>

        {/* Description */}
        <Typography variant="caption" sx={{ color: '#7f8c8d', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4, fontSize: '0.72rem' }}>
          {product.description || 'Pas de description'}
        </Typography>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 1, mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#1976d2', fontSize: '1rem' }}>
            {price.toLocaleString('fr-FR')} XOF
          </Typography>
          {product.original_price && product.original_price > price && (
            <Typography variant="caption" sx={{ color: '#b0b0b0', textDecoration: 'line-through', fontSize: '0.75rem' }}>
              {product.original_price.toLocaleString('fr-FR')} XOF
            </Typography>
          )}
        </Box>

        {/* Stock Bar */}
        <StockBar stock={stock} maxStock={product.initial_stock || 100} />
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, pt: 0.5, gap: 1 }}>
        <Button size="small" variant="outlined" startIcon={<Edit />}
          onClick={() => onEdit(product)}
          sx={{ flex: 1, borderRadius: 2, borderColor: '#1976d2', color: '#1976d2', fontSize: '0.75rem', fontWeight: 600 }}>
          Modifier
        </Button>
        <Tooltip title="Supprimer">
          <IconButton size="small" onClick={() => onDelete(product)}
            sx={{ color: '#f44336', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 2, width: 32, height: 32 }}>
            <Delete sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
}

export default function MerchantProducts() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tous');
  const [sort, setSort] = useState('created_at_desc');
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const LIMIT = 12;

  const mid = user?.id || user?._id;

  const fetchProducts = useCallback(async () => {
    if (!mid) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({
        merchant_id: mid,
        limit: LIMIT,
        skip: (page - 1) * LIMIT,
        ...(search && { search }),
        ...(category !== 'Tous' && { category }),
        ...(sort && { sort }),
      });
      const data = await apiGet(`/products?${params}`);
      setProducts(data?.products || data || []);
      setTotal(data?.total || (data?.products || data || []).length);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [mid, page, search, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(), 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDelete = async () => {
    if (!deleteProduct) return;
    setDeleting(true);
    try {
      await apiDelete(`/products/${deleteProduct.id || deleteProduct._id}`);
      setSnack({ open: true, msg: 'Produit supprimé avec succès', severity: 'success' });
      setDeleteProduct(null);
      fetchProducts();
    } catch {
      setSnack({ open: true, msg: 'Erreur lors de la suppression', severity: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Titre', 'Catégorie', 'Prix', 'Stock', 'Statut'];
    const rows = products.map(p => [
      p.title || '', p.category || '', p.price || 0,
      p.stock_quantity ?? p.stock ?? 0, p.is_active ? 'Actif' : 'Inactif',
    ]);
    const csv = [headers, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `produits_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lowStock = products.filter(p => (p.stock_quantity ?? p.stock ?? 0) <= 5).length;
  const activeCount = products.filter(p => p.is_active !== false).length;

  return (
    <MerchantDashboardLayout title="Mes Produits">
      {/* Stats Bar */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: 'Total produits', value: total, color: '#1976d2', icon: <Inventory sx={{ fontSize: 20, color: '#1976d2' }} /> },
          { label: 'Actifs', value: activeCount, color: '#4caf50', icon: <CheckCircle sx={{ fontSize: 20, color: '#4caf50' }} /> },
          { label: 'Stock faible', value: lowStock, color: '#f44336', icon: <Warning sx={{ fontSize: 20, color: '#f44336' }} /> },
          { label: 'Best-sellers', value: products.filter(p => (p.total_sold || 0) > 10).length, color: '#ff9800', icon: <TrendingUp sx={{ fontSize: 20, color: '#ff9800' }} /> },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Card sx={{ borderRadius: 2.5, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', p: 0 }}>
              <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#2c3e50', lineHeight: 1 }}>{stat.value}</Typography>
                  <Typography variant="caption" sx={{ color: '#7f8c8d', fontSize: '0.72rem' }}>{stat.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters & Actions */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <TextField
              placeholder="Rechercher un produit..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              size="small"
              sx={{ minWidth: 260, flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
            />
            {/* Category */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Catégorie</InputLabel>
              <Select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }} label="Catégorie"
                sx={{ borderRadius: 2 }}>
                {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            {/* Sort */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel>Trier par</InputLabel>
              <Select value={sort} onChange={e => setSort(e.target.value)} label="Trier par" sx={{ borderRadius: 2 }}>
                {SORT_OPTIONS.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<FileDownload />} onClick={handleExportCSV}
                sx={{ borderRadius: 2, color: '#4caf50', borderColor: '#4caf50', fontWeight: 600 }}>
                Export CSV
              </Button>
              <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/dashboard/merchant/products/new')}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#1976d2,#42a5f5)', fontWeight: 700, boxShadow: '0 4px 12px rgba(25,118,210,0.35)' }}>
                Nouveau produit
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Low stock alert */}
      {lowStock > 0 && (
        <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
          <strong>{lowStock} produit{lowStock > 1 ? 's' : ''}</strong> en rupture imminente (stock ≤ 5)
        </Alert>
      )}

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={2.5}>
          {[...Array(8)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
              <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 3 }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <CardContent sx={{ py: 8, textAlign: 'center' }}>
            <StoreMallDirectory sx={{ fontSize: 72, color: 'rgba(0,0,0,0.1)', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#7f8c8d', fontWeight: 600 }}>
              {search || category !== 'Tous' ? 'Aucun produit trouvé' : 'Aucun produit pour l\'instant'}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
              {search || category !== 'Tous' ? 'Essayez d\'autres filtres' : 'Commencez par ajouter votre premier produit'}
            </Typography>
            {!search && category === 'Tous' && (
              <Button variant="contained" startIcon={<Add />} onClick={() => router.push('/dashboard/merchant/products/new')}
                sx={{ borderRadius: 2, background: 'linear-gradient(135deg,#1976d2,#42a5f5)', fontWeight: 700 }}>
                Ajouter un produit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id || product._id}>
              <ProductCard
                product={product}
                onEdit={p => router.push(`/dashboard/merchant/products/${p.id || p._id}/edit`)}
                onDelete={setDeleteProduct}
                onView={p => router.push(`/products/${p.id || p._id}`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={Math.ceil(total / LIMIT)} page={page}
            onChange={(_, v) => { setPage(v); window.scrollTo(0, 0); }}
            color="primary" shape="rounded"
            sx={{ '& .MuiPaginationItem-root': { borderRadius: 2 } }}
          />
        </Box>
      )}

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(deleteProduct)} onClose={() => setDeleteProduct(null)}
        PaperProps={{ sx: { borderRadius: 3, maxWidth: 420 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#2c3e50' }}>
          Supprimer le produit ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#7f8c8d' }}>
            Êtes-vous sûr de vouloir supprimer <strong>"{deleteProduct?.title}"</strong> ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteProduct(null)} sx={{ borderRadius: 2, color: '#7f8c8d', fontWeight: 600 }}>
            Annuler
          </Button>
          <Button onClick={handleDelete} disabled={deleting} variant="contained"
            sx={{ borderRadius: 2, bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' }, fontWeight: 700 }}>
            {deleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }} onClose={() => setSnack(s => ({ ...s, open: false }))}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </MerchantDashboardLayout>
  );
}
