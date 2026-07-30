'use client';

import { Box, Container, Grid, Typography, Rating, Button, CircularProgress, Card, CardContent, Divider, Chip, Alert } from '@mui/material';
import { Phone as PhoneIcon, Message as MessageIcon, Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiGet, apiPost, apiPut, apiDelete } from '@/utils/api';
import ActionButton from '@/components/ActionButton';
import CheckoutNowModal from '@/components/CheckoutNowModal';
import { getProductImageUrl } from '@/utils/imageUtils';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await apiGet(`/products/${productId}`);
        const productData = data.product || data;
        setProduct(productData);
        setError(null);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    const checkFavorite = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const data = await apiGet('/customers/me/wishlist');
          const wishlist = data.wishlist || data.items || [];
          setIsFavorited(wishlist.some(item => item.id === productId));
        }
      } catch (err) {
        console.error('Failed to check favorite:', err);
      }
    };

    if (productId) {
      fetchProduct();
      checkFavorite();
    }
  }, [productId]);

  const handleFavoriteToggle = async () => {
    try {
      setFavoriteLoading(true);
      if (isFavorited) {
        await apiDelete(`/customers/me/wishlist/${productId}`);
        setIsFavorited(false);
      } else {
        await apiPost('/customers/me/wishlist', { product_id: productId });
        setIsFavorited(true);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await apiPost('/cart/items', {
        product_id: productId,
        quantity: quantity,
      });
      alert('Produit ajouté au panier');
    } catch (err) {
      alert('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Produit introuvable'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Image du produit */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
            }}
          >
            <img
              src={getProductImageUrl(product)}
              alt={product.title || product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        </Grid>

        {/* Détails du produit */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
              {product.title || product.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.merchant_rating || product.rating || 0} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({Math.round(product.merchant_rating || product.rating || 4) * 20} avis)
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 3 }}>
              {(product.price || 0).toLocaleString('fr-FR')} XOF
            </Typography>

            {product.category && (
              <Box sx={{ mb: 3 }}>
                <Chip label={product.category} variant="outlined" />
              </Box>
            )}

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            {product.stock !== undefined && (
              <Typography
                variant="body2"
                sx={{
                  mb: 3,
                  color: product.stock > 0 ? 'success.main' : 'error.main',
                  fontWeight: 600,
                }}
              >
                {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
              </Typography>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                  {quantity}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </Box>
              <ActionButton
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                requiresAuth={false}
              >
                Ajouter au panier
              </ActionButton>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="contained" color="success" onClick={() => setBuyNowOpen(true)} sx={{ textTransform: 'none' }}>
                Acheter maintenant
              </Button>
            </Box>

            <CheckoutNowModal open={buyNowOpen} onClose={() => setBuyNowOpen(false)} product={product} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <ActionButton
                requiresAuth
                variant="outlined"
                fullWidth
                startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                onClick={handleFavoriteToggle}
                disabled={favoriteLoading}
                sx={{ color: isFavorited ? 'error.main' : 'inherit' }}
              >
                {isFavorited ? 'Favorisé' : 'Ajouter aux favoris'}
              </ActionButton>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Info Marchand */}
            {product.merchant_shop_name && (
              <Card sx={{ bgcolor: '#f9f9f9' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    À propos de la boutique
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    <strong>{product.merchant_shop_name}</strong>
                  </Typography>
                  {product.merchant_location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      📍 {product.merchant_location}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={product.merchant_rating || 4} readOnly size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(product.merchant_rating || 4).toFixed(1)} / 5
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <ActionButton
                      requiresAuth
                      variant="outlined"
                      size="small"
                      startIcon={<MessageIcon />}
                    >
                      Message
                    </ActionButton>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
