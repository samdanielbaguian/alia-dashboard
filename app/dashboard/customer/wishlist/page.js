'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, Grid, Card, CardMedia, CardContent,
  Button, IconButton, Chip, Skeleton, Alert, Tooltip,
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import {
  FavoriteBorder, Delete, ShoppingCart, Storefront,
  ArrowForward, Add,
} from '@mui/icons-material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { mockWishlist } from '@/utils/mockData';

function WishlistCard({ item, onRemove, onAddToCart }) {
  const product = item.product || item;
  const name    = product?.name || product?.title || 'Produit';
  const price   = product?.price || product?.base_price || 0;
  const image   = product?.images?.[0] || product?.image_url;
  const itemId  = item._id || item.id || product?._id || product?.id;

  return (
    <Card sx={{
      borderRadius: 2.5, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.12)' },
      display: 'flex', flexDirection: 'column',
    }}>
      <Box sx={{ height: 180, bgcolor: '#f5f3ff', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {image ? (
          <CardMedia component="img" image={image} alt={name}
            sx={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        ) : (
          <Storefront sx={{ fontSize: 56, color: '#c4b5fd' }} />
        )}
        <Tooltip title="Retirer des favoris">
          <IconButton size="small" onClick={() => onRemove(itemId)}
            sx={{
              position: 'absolute', top: 8, right: 8,
              bgcolor: 'rgba(255,255,255,0.9)', color: '#ef4444',
              '&:hover': { bgcolor: '#fee2e2' }, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
      <CardContent sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e1b4b', lineHeight: 1.3 }}>
          {name}
        </Typography>
        {product?.category && (
          <Chip label={product.category} size="small"
            sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 600, fontSize: '0.7rem', width: 'fit-content' }} />
        )}
        <Typography sx={{ fontWeight: 800, color: '#7c3aed', fontSize: '1rem', mt: 'auto' }}>
          {price.toLocaleString('fr-FR')} XOF
        </Typography>
        <Button size="small" variant="contained" startIcon={<Add />} onClick={() => onAddToCart(item)}
          sx={{
            mt: 0.5, borderRadius: 1.5, textTransform: 'none', fontSize: '0.8rem',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(168,85,247,0.4)' },
          }}>
          Ajouter au panier
        </Button>
      </CardContent>
    </Card>
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems]         = useState(mockWishlist);
  const [loading, setLoading]     = useState(false);
  const [addingAll, setAddingAll] = useState(false);
  const [toast, setToast]         = useState({ show: false, msg: '', sev: 'info' });
  const [confirmId, setConfirmId] = useState(null);

  const showToast = (msg, sev = 'success') => {
    setToast({ show: true, msg, sev });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  const fetchWishlist = useCallback(() => {
    setItems(mockWishlist);
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const handleRemove = (itemId) => {
    setConfirmId(null);
    setItems(prev => prev.filter(i => (i._id || i.id) !== itemId));
    showToast('Article retiré de la wishlist');
  };

  const handleAddToCart = (item) => {
    const product = item.product || item;
    showToast(`"é${product?.name || 'Produit'}" ajouté au panier`);
  };

  const handleAddAll = () => {
    setAddingAll(true);
    const count = items.length;
    setTimeout(() => {
      setAddingAll(false);
      showToast(`${count} article${count > 1 ? 's' : ''} ajouté${count > 1 ? 's' : ''} au panier`);
      if (count > 0) setTimeout(() => router.push('/dashboard/customer/cart'), 1500);
    }, 300);
  };

  return (
    <CustomerDashboardLayout title="Ma wishlist">
      {toast.show && (
        <Alert severity={toast.sev} variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
          {toast.msg}
        </Alert>
      )}

      <Dialog open={Boolean(confirmId)} onClose={() => setConfirmId(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1e1b4b', pb: 1 }}>Retirer de la wishlist</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Êtes-vous sûr de vouloir retirer cet article de votre wishlist ?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmId(null)} sx={{ textTransform: 'none', color: '#6b7280' }}>Annuler</Button>
          <Button variant="contained" color="error" onClick={() => handleRemove(confirmId)}
            sx={{ textTransform: 'none', borderRadius: 2 }}>Retirer</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b' }}>Ma wishlist</Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.83rem', mt: 0.3 }}>
            {loading ? '—' : `${items.length} article${items.length > 1 ? 's' : ''} sauvegardé${items.length > 1 ? 's' : ''}`}
          </Typography>
        </Box>
        {!loading && items.length > 0 && (
          <Button variant="contained" startIcon={<ShoppingCart />} onClick={handleAddAll} disabled={addingAll}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 700,
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
            }}>
            {addingAll ? 'Ajout en cours...' : 'Tout ajouter au panier'}
          </Button>
        )}
      </Box>

      {loading ? (
        <Grid container spacing={2.5}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton variant="rectangular" height={310} sx={{ borderRadius: 2.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : items.length === 0 ? (
        <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
          <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
            <Box sx={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #ede9fe, #fce7f3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
              <FavoriteBorder sx={{ fontSize: 48, color: '#ec4899' }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', color: '#1e1b4b', mb: 1 }}>
              Votre wishlist est vide
            </Typography>
            <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', mb: 3, maxWidth: 360, mx: 'auto' }}>
              Sauvegardez vos produits préférés pour les retrouver facilement.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')} endIcon={<ArrowForward />}
              sx={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', borderRadius: 2, textTransform: 'none', fontWeight: 700, boxShadow: '0 4px 16px rgba(168,85,247,0.4)' }}>
              Découvrir les produits
            </Button>
          </Box>
        </Card>
      ) : (
        <Grid container spacing={2.5}>
          {items.map((item) => {
            const itemId = item._id || item.id;
            return (
              <Grid key={itemId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <WishlistCard item={item} onRemove={(id) => setConfirmId(id)} onAddToCart={handleAddToCart} />
              </Grid>
            );
          })}
        </Grid>
      )}
    </CustomerDashboardLayout>
  );
}
