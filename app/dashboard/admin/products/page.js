'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Pagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar,
  Skeleton, Rating,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search, Block, CheckCircle, Edit as EditIcon, Delete as DeleteIcon,
  Visibility, Star, TrendingUp, Warning,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';

const CATEGORY_OPTIONS = [
  { value: '', label: 'Toutes les catégories' },
  { value: 'electronics', label: 'Électronique' },
  { value: 'fashion', label: 'Mode' },
  { value: 'food', label: 'Alimentation' },
  { value: 'home', label: 'Maison' },
  { value: 'beauty', label: 'Beauté' },
];

const PER_PAGE = 20;

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });

  const showSnack = (msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
    setTimeout(() => setSnack(s => ({ ...s, open: false })), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        ...(categoryFilter && { category: categoryFilter }),
        ...(search && { search }),
      });
      const data = await apiGet(`/admin/products?${params}`);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showSnack('Erreur lors du chargement des produits', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, categoryFilter, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleFeature = async (productId) => {
    try {
      await apiPost(`/admin/products/${productId}/feature`, {});
      showSnack('Produit mis en avant');
      fetchProducts();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la mise en avant', 'error');
    }
  };

  const handleUnfeature = async (productId) => {
    try {
      await apiPost(`/admin/products/${productId}/unfeature`, {});
      showSnack('Produit retiré des mises en avant');
      fetchProducts();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors du retrait', 'error');
    }
  };

  const handleFlagIssue = async (productId) => {
    try {
      await apiPost(`/admin/products/${productId}/flag-issue`, { reason: 'Signalé par admin' });
      showSnack('Produit signalé');
      fetchProducts();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors du signalement', 'error');
    }
  };

  const handleDelete = async (productId) => {
    try {
      await apiDelete(`/admin/products/${productId}`);
      showSnack('Produit supprimé');
      fetchProducts();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <AdminDashboardLayout title="Gestion des produits">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b', mb: 0.5 }}>
          Produits ({total})
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Modérez, sélectionnez et supprimez les produits de la plateforme.
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Rechercher par nom ou marchand..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
                  label="Catégorie"
                  sx={{ borderRadius: 2 }}
                >
                  {CATEGORY_OPTIONS.map(c => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { setSearch(''); setCategoryFilter(''); setPage(1); }}
                sx={{ borderRadius: 2, color: '#7f8c8d', borderColor: 'rgba(0,0,0,0.2)' }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa' }}>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Produit</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Marchand</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Prix</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Note</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6, 7].map(j => <TableCell key={j}><Skeleton /></TableCell>)}
                </TableRow>
              ))
            ) : products.length > 0 ? (
              products.map((p) => (
                <TableRow key={p.id || p._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2c3e50', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.name}
                  </TableCell>
                  <TableCell sx={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{p.merchant_name || 'N/A'}</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{p.price.toLocaleString('fr-FR')} XOF</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={p.rating || 0} readOnly size="small" />
                      <Typography sx={{ fontSize: '0.8rem', color: '#7f8c8d' }}>({p.rating_count || 0})</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: p.stock <= 5 ? '#f59e0b' : '#2c3e50' }}>
                    {p.stock}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {p.is_featured && <Chip label="Mis en avant" size="small" icon={<TrendingUp />} sx={{ bgcolor: '#d1fae5', color: '#065f46' }} />}
                      {p.has_issue && <Chip label="Signalé" size="small" icon={<Warning />} sx={{ bgcolor: '#fee2e2', color: '#991b1b' }} />}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title="Détails">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedProduct(p); setActionDialog({ open: true, type: 'view' }); }}
                        sx={{ color: '#1976d2' }}
                      >
                        <Visibility sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    {!p.is_featured && (
                      <Tooltip title="Mettre en avant">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedProduct(p); setActionDialog({ open: true, type: 'feature' }); }}
                          sx={{ color: '#4caf50' }}
                        >
                          <TrendingUp sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {p.is_featured && (
                      <Tooltip title="Retirer de la mise en avant">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedProduct(p); setActionDialog({ open: true, type: 'unfeature' }); }}
                          sx={{ color: '#f59e0b' }}
                        >
                          <Block sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedProduct(p); setActionDialog({ open: true, type: 'delete' }); }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#b0b0b0' }}>
                  Aucun produit trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / PER_PAGE)}
          page={page}
          onChange={(e, p) => setPage(p)}
          color="primary"
        />
      </Box>

      {/* Action Dialogs */}
      {actionDialog.type === 'view' && selectedProduct && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Détails du produit</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Nom</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedProduct.name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Marchand</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedProduct.merchant_name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Prix</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedProduct.price.toLocaleString('fr-FR')} XOF</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Stock</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedProduct.stock} unités</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Note</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={selectedProduct.rating || 0} readOnly />
                  <Typography sx={{ fontWeight: 600 }}>({selectedProduct.rating_count || 0} avis)</Typography>
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Description</Typography>
                <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{selectedProduct.description}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'feature' && selectedProduct && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#4caf50' }}>Mettre en avant le produit</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Ce produit apparaîtra en avant sur la plateforme.</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedProduct.name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleFeature(selectedProduct.id || selectedProduct._id)} variant="contained" color="success">
              Mettre en avant
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'unfeature' && selectedProduct && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#f59e0b' }}>Retirer de la mise en avant</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Ce produit ne sera plus mis en avant.</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedProduct.name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleUnfeature(selectedProduct.id || selectedProduct._id)} variant="contained" color="warning">
              Retirer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'delete' && selectedProduct && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>Supprimer le produit</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Cette action est irréversible!</Alert>
            <Typography>Êtes-vous sûr de vouloir supprimer ce produit?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedProduct.name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleDelete(selectedProduct.id || selectedProduct._id)} variant="contained" color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </AdminDashboardLayout>
  );
}
