'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box, Grid, Typography, Card, CardContent, CardMedia, CardActionArea,
  Chip, Avatar, Button, IconButton, Skeleton, Alert, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tooltip,
} from '@mui/material';
import {
  ShoppingBag, Favorite, ShoppingCart, Payment,
  ArrowForward, TrendingUp, Star, Add, Visibility,
  LocalOffer, Refresh, Storefront,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import { mockOrders, mockWishlist, mockCart, mockProducts } from '@/utils/mockData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending:   { label: 'En attente',  color: '#f59e0b', bg: '#fef3c7' },
  confirmed: { label: 'Confirmée',   color: '#3b82f6', bg: '#dbeafe' },
  shipped:   { label: 'Expédiée',    color: '#8b5cf6', bg: '#ede9fe' },
  delivered: { label: 'Livrée',      color: '#10b981', bg: '#d1fae5' },
  cancelled: { label: 'Annulée',     color: '#ef4444', bg: '#fee2e2' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#6b7280', bg: '#f3f4f6' };
  return (
    <Chip label={cfg.label} size="small"
      sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: '0.72rem', border: `1px solid ${cfg.color}30` }} />
  );
}

function KpiCard({ title, value, sub, icon, gradient, loading, onClick }) {
  return (
    <Card onClick={onClick} sx={{
      borderRadius: 3, overflow: 'hidden', cursor: onClick ? 'pointer' : 'default',
      boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': onClick ? { transform: 'translateY(-3px)', boxShadow: '0 8px 28px rgba(0,0,0,0.13)' } : {},
    }}>
      <Box sx={{ height: 3, background: gradient }} />
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, background: gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            {icon}
          </Box>
        </Box>
        {loading ? (
          <>
            <Skeleton width={80} height={36} />
            <Skeleton width={100} height={16} />
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e1b4b', lineHeight: 1.1 }}>{value}</Typography>
            <Typography sx={{ fontSize: '0.78rem', color: '#6b7280', mt: 0.5 }}>{sub}</Typography>
          </>
        )}
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#4b5563', mt: 1 }}>{title}</Typography>
      </CardContent>
    </Card>
  );
}

function ProductMiniCard({ product, onAddToCart }) {
  const price = product?.price || product?.base_price || 0;
  const name  = product?.name || product?.title || 'Produit';
  return (
    <Card sx={{ borderRadius: 2.5, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 140, bgcolor: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {product?.images?.[0] || product?.image_url ? (
          <CardMedia component="img" image={product.images?.[0] || product.image_url} alt={name}
            sx={{ height: '100%', objectFit: 'cover' }} />
        ) : (
          <Storefront sx={{ fontSize: 48, color: '#c4b5fd' }} />
        )}
      </Box>
      <CardContent sx={{ p: 1.8, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.83rem', color: '#1e1b4b', lineHeight: 1.3 }} noWrap>
          {name}
        </Typography>
        <Typography sx={{ fontWeight: 800, color: '#7c3aed', fontSize: '0.95rem' }}>
          {price.toLocaleString('fr-FR')} XOF
        </Typography>
        <Button
          size="small"
          variant="contained"
          onClick={() => onAddToCart(product)}
          startIcon={<Add />}
          sx={{
            mt: 'auto', borderRadius: 1.5, textTransform: 'none', fontSize: '0.78rem',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            boxShadow: 'none', '&:hover': { boxShadow: '0 4px 12px rgba(168,85,247,0.4)' },
          }}
        >
          Ajouter
        </Button>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CustomerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading]         = useState(true);
  const [orders, setOrders]           = useState([]);
  const [wishlist, setWishlist]       = useState([]);
  const [cart, setCart]               = useState({ items: [] });
  const [products, setProducts]       = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [toast, setToast]             = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchAll = useCallback(() => {
    setLoading(true);
    setOrders(mockOrders.slice(0, 5));
    setWishlist(mockWishlist);
    setCart(mockCart);
    setProducts(mockProducts.slice(0, 4));
    setBestSellers(mockProducts.slice(0, 6));
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleAddToCart = (product) => {
    setCart(c => ({ ...c, items: [...(c.items || []), { ...product, _id: product._id || product.id, quantity: 1, unit_price: product.price || product.base_price || 0 }] }));
    showToast(`"${product?.name || 'Produit'}" ajouté au panier`);
  };

  const totalSpent = orders.reduce((s, o) => s + (o.total_amount || o.total || 0), 0);

  return (
    <CustomerDashboardLayout title="Dashboard">

      {/* Toast */}
      {toast && (
        <Alert
          severity="success" variant="filled"
          sx={{ position: 'fixed', top: 80, right: 24, zIndex: 9999, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.15)', minWidth: 280 }}
        >
          {toast}
        </Alert>
      )}

      {/* ── Welcome ── */}
      <Box sx={{
        borderRadius: 3, p: { xs: 2.5, md: 3 }, mb: 3,
        background: 'linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 2,
      }}>
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', mb: 0.5 }}>
            Bienvenue,
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 800, lineHeight: 1 }}>
            {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Acheteur Alia'} 👋
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', mt: 0.8 }}>
            Découvrez vos achats et favoris
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => router.push('/dashboard/customer/orders')}
            variant="outlined" size="small" endIcon={<ArrowForward />}
            sx={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff', borderRadius: 2, textTransform: 'none', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
            Mes commandes
          </Button>
          <IconButton onClick={fetchAll} size="small" sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
            <Refresh fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ── KPI Cards ── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Commandes totales', value: loading ? '—' : orders.length, sub: 'Toutes périodes', icon: <ShoppingBag sx={{ color: '#fff', fontSize: 22 }} />, gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)', onClick: () => router.push('/dashboard/customer/orders') },
          { title: 'Total dépensé', value: loading ? '—' : `${totalSpent.toLocaleString('fr-FR')} XOF`, sub: 'Cumul achats', icon: <Payment sx={{ color: '#fff', fontSize: 22 }} />, gradient: 'linear-gradient(135deg,#10b981,#34d399)', onClick: () => router.push('/dashboard/customer/payments') },
          { title: 'Favoris', value: loading ? '—' : wishlist.length, sub: 'Articles sauvegardés', icon: <Favorite sx={{ color: '#fff', fontSize: 22 }} />, gradient: 'linear-gradient(135deg,#ec4899,#f472b6)', onClick: () => router.push('/dashboard/customer/wishlist') },
          { title: 'Panier', value: loading ? '—' : (cart?.items || []).length, sub: 'Articles en attente', icon: <ShoppingCart sx={{ color: '#fff', fontSize: 22 }} />, gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)', onClick: () => router.push('/dashboard/customer/cart') },
        ].map((kpi, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard {...kpi} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* ── Commandes récentes ── */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <Box sx={{ px: 2.5, pt: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>Commandes récentes</Typography>
              <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/dashboard/customer/orders')}
                sx={{ textTransform: 'none', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600 }}>
                Voir tout
              </Button>
            </Box>
            <Divider />
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ '& th': { bgcolor: '#faf9ff', color: '#6b7280', fontSize: '0.75rem', fontWeight: 700, py: 1.2 } }}>
                    <TableCell>Commande</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Montant</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 5 }).map((__, j) => (
                        <TableCell key={j}><Skeleton height={24} /></TableCell>
                      ))}
                    </TableRow>
                  )) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4, color: '#9ca3af' }}>
                        Aucune commande pour le moment
                      </TableCell>
                    </TableRow>
                  ) : orders.slice(0, 5).map((order) => (
                    <TableRow key={order._id || order.id}
                      sx={{ '&:hover': { bgcolor: '#faf9ff' }, '& td': { py: 1.2, fontSize: '0.82rem' } }}>
                      <TableCell>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e1b4b' }}>
                          #{(order._id || order.id || '').toString().slice(-6).toUpperCase()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#6b7280' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : '—'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#1e1b4b' }}>
                        {(order.total_amount || order.total || 0).toLocaleString('fr-FR')} XOF
                      </TableCell>
                      <TableCell><StatusBadge status={order.status} /></TableCell>
                      <TableCell align="center">
                        <Tooltip title="Voir détails">
                          <IconButton size="small" onClick={() => router.push(`/dashboard/customer/orders/${order._id || order.id}`)}>
                            <Visibility sx={{ fontSize: 16, color: '#7c3aed' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        {/* ── Quick links + Alertes ── */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', mb: 2.5 }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 800, color: '#1e1b4b', mb: 2, fontSize: '1rem' }}>
                Accès rapide
              </Typography>
              {[
                { label: 'Parcourir les produits', icon: <Storefront />, path: '/', color: '#3b82f6' },
                { label: 'Gérer ma wishlist', icon: <Favorite />, path: '/dashboard/customer/wishlist', color: '#ec4899' },
                { label: 'Voir mon panier', icon: <ShoppingCart />, path: '/dashboard/customer/cart', color: '#f59e0b' },
                { label: 'Modifier mon profil', icon: <TrendingUp />, path: '/dashboard/customer/profile', color: '#10b981' },
              ].map(({ label, icon, path, color }) => (
                <Box
                  key={path}
                  onClick={() => router.push(path)}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, p: 1.3,
                    borderRadius: 2, cursor: 'pointer', mb: 1,
                    '&:hover': { bgcolor: '#f5f3ff' }, transition: 'background 0.15s',
                  }}
                >
                  <Box sx={{ width: 34, height: 34, borderRadius: 1.5, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                    {icon}
                  </Box>
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151', flex: 1 }}>{label}</Typography>
                  <ArrowForward sx={{ fontSize: 16, color: '#9ca3af' }} />
                </Box>
              ))}
            </CardContent>
          </Card>

          {wishlist.length > 0 && (
            <Alert severity="info" icon={<LocalOffer />}
              sx={{ borderRadius: 2, '& .MuiAlert-message': { fontSize: '0.83rem' } }}>
              Vous avez <strong>{wishlist.length}</strong> article{wishlist.length > 1 ? 's' : ''} dans votre wishlist.
              <Button size="small" onClick={() => router.push('/dashboard/customer/wishlist')} sx={{ ml: 1, textTransform: 'none', fontWeight: 700, p: 0 }}>
                Voir →
              </Button>
            </Alert>
          )}
        </Grid>

        {/* ── Nouveaux produits ── */}
        <Grid size={{ xs: 12 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>Nouveaux produits</Typography>
            <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/')}
              sx={{ textTransform: 'none', color: '#7c3aed', fontWeight: 600, fontSize: '0.8rem' }}>
              Tout voir
            </Button>
          </Box>
          <Grid container spacing={2}>
            {loading ? Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={240} sx={{ borderRadius: 2.5 }} />
              </Grid>
            )) : products.slice(0, 4).map((p) => (
              <Grid key={p._id || p.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <ProductMiniCard product={p} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* ── Best sellers ── */}
        {bestSellers.length > 0 && (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: '#f59e0b', fontSize: 20 }} />
                <Typography sx={{ fontWeight: 800, color: '#1e1b4b', fontSize: '1rem' }}>Meilleures ventes</Typography>
              </Box>
              <Button size="small" endIcon={<ArrowForward />} onClick={() => router.push('/')}
                sx={{ textTransform: 'none', color: '#7c3aed', fontWeight: 600, fontSize: '0.8rem' }}>
                Tout voir
              </Button>
            </Box>
            <Grid container spacing={2}>
              {bestSellers.slice(0, 6).map((p) => (
                <Grid key={p._id || p.id} size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <ProductMiniCard product={p} onAddToCart={handleAddToCart} />
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </CustomerDashboardLayout>
  );
}
