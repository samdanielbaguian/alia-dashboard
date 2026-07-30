'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Rating, Chip, Tooltip, Skeleton } from '@mui/material';
import {
  FavoriteBorder as WishlistIcon,
  Favorite as FavoriteIcon,
  ShoppingCart as CartIcon,
  Storefront as StoreIcon,
  LocalShipping as ShippingIcon,
  Visibility as ViewIcon,
  Bolt as FlashIcon,
  FiberNew as NewIcon,
  EmojiEvents as WinnerIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { formatMerchantName } from '@/utils/nameFormatter';
import { getProductImageUrl } from '@/utils/imageUtils';
import CheckoutNowModal from '@/components/CheckoutNowModal';

function getCategoryIcon(category) {
  const map = {
    'Électronique': '📱', 'Audio': '🎧', 'Mode': '👕', 'Maison': '🏠',
    'Gaming': '🎮', 'Bijoux': '💎', 'Sports': '⚽', 'Beauté': '✨',
    'Alimentation': '🍽️', 'Art': '🎨',
  };
  return map[category] || '📦';
}

export default function ProductCard({ product, onAddToCart, onFavoriteToggle, isFavorited = false, formatPrice }) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [favActive, setFavActive] = useState(isFavorited);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setFavActive(isFavorited);
  }, [isFavorited]);

  const productId = product.id || product._id;
  const name          = product.title || product.name || 'Produit';
  const price         = product.price || 0;
  const originalPrice = product.originalPrice || product.original_price || null;
  const discount      = product.discount || (originalPrice ? Math.round((1 - price / originalPrice) * 100) : null);
  const rating        = product.merchant_rating || product.rating || 4.0;
  const reviews       = product.reviews_count || Math.floor(rating * 20 + 12);
  const stock         = product.stock ?? 20;
  const category      = product.category || '';
  const merchantObj   = { shop_name: product.merchant_shop_name, name: product.merchant_name };
  const merchant      = formatMerchantName(merchantObj) || 'Marchand';
  const image         = getProductImageUrl(product);
  const lowStock      = stock > 0 && stock <= 5;
  const isFlash       = product.isFlash || false;
  const isNew         = product.isNew || false;
  const isWinner      = product.isWinner || false;

  const fmtPrice = (v) => formatPrice ? formatPrice(v) : `${v.toLocaleString('fr-FR')} FCFA`;

  const handleFav = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { router.push('/login'); return; }
    setFavActive(f => !f);
    onFavoriteToggle?.(productId);
  };

  const handleCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { router.push('/login'); return; }
    setAdding(true);
    onAddToCart?.(product);
    setTimeout(() => setAdding(false), 800);
  };

  const [buyNowOpen, setBuyNowOpen] = useState(false);

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) { router.push('/login'); return; }
    setBuyNowOpen(true);
  };

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 3, overflow: 'hidden',
        bgcolor: 'background.paper',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        cursor: 'pointer', height: '100%',
        border: isWinner ? '2px solid #f59e0b' : '1px solid transparent',
      }}
    >
      {/* Image zone */}
      <Box sx={{ position: 'relative', height: 200, bgcolor: '#f5f5f5', flexShrink: 0, overflow: 'hidden' }}>
        {image ? (
          <Box component="img" src={image} alt={name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover',
              transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.4s ease' }} />
        ) : (
          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%)' }}>
            <Typography sx={{ fontSize: '3.5rem' }}>{getCategoryIcon(category)}</Typography>
          </Box>
        )}

        {/* Badges top-left */}
        <Box sx={{ position: 'absolute', top: 10, left: 10, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {discount && (
            <Chip label={`-${discount}%`} size="small" icon={<FlashIcon sx={{ fontSize: '12px !important', color: '#fff !important' }} />}
              sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 800, fontSize: '0.7rem', height: 22 }} />
          )}
          {isNew && !discount && (
            <Chip label="Nouveau" size="small"
              sx={{ bgcolor: '#10b981', color: '#fff', fontWeight: 800, fontSize: '0.7rem', height: 22 }} />
          )}
          {isFlash && (
            <Chip label="⚡ Flash" size="small"
              sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.7rem', height: 22 }} />
          )}
          {isWinner && (
            <Chip label="Buy Box" size="small" icon={<WinnerIcon sx={{ fontSize: '12px !important', color: '#fff !important' }} />}
              sx={{ bgcolor: '#f59e0b', color: '#fff', fontWeight: 800, fontSize: '0.7rem', height: 22 }} />
          )}
          {lowStock && !discount && !isNew && (
            <Chip label={`${stock} restants`} size="small"
              sx={{ bgcolor: '#ff6b6b', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
          )}
          {stock === 0 && (
            <Chip label="Rupture" size="small"
              sx={{ bgcolor: '#9e9e9e', color: '#fff', fontWeight: 700, fontSize: '0.68rem', height: 22 }} />
          )}
        </Box>

        {/* Wishlist button */}
        <Tooltip title={favActive ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
          <IconButton size="small" onClick={handleFav}
            sx={{
              position: 'absolute', top: 8, right: 8,
              bgcolor: 'rgba(255,255,255,0.92)', width: 32, height: 32,
              color: favActive ? '#ff6b6b' : '#9e9e9e',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              '&:hover': { bgcolor: '#fff', color: '#ff6b6b', transform: 'scale(1.15)' },
              transition: 'all 0.2s',
            }}>
            {favActive ? <FavoriteIcon sx={{ fontSize: 16 }} /> : <WishlistIcon sx={{ fontSize: 16 }} />}
          </IconButton>
        </Tooltip>

        {/* Quick view on hover */}
        <Box sx={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          bgcolor: 'rgba(21,101,192,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          py: 1,
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.25s',
        }}>
          <ViewIcon sx={{ color: '#fff', fontSize: 16 }} />
          <Typography sx={{ color: '#fff', fontSize: '0.78rem', fontWeight: 600 }}>Aperçu rapide</Typography>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
        {category && (
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ecdc4', textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {category}
          </Typography>
        )}

        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary', lineHeight: 1.35,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Rating value={rating} readOnly size="small" precision={0.5}
            sx={{ '& .MuiRating-iconFilled': { color: '#f59e0b' }, '& .MuiRating-iconEmpty': { color: '#e5e7eb' } }} />
          <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', fontWeight: 600 }}>
            {rating.toFixed(1)} ({reviews})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#1565c0' }}>
              {fmtPrice(price)}
            </Typography>
            {originalPrice && (
              <Typography sx={{ fontSize: '0.78rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                {fmtPrice(originalPrice)}
              </Typography>
            )}
          </Box>
          {discount && (
            <Typography sx={{ fontSize: '0.72rem', color: '#ef4444', fontWeight: 700 }}>
              Économisez {fmtPrice(originalPrice - price)}
            </Typography>
          )}
        </Box>

        {/* Shipping + Merchant */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ShippingIcon sx={{ fontSize: 13, color: '#4ecdc4' }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#4ecdc4', fontWeight: 600 }}>Livraison gratuite</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StoreIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }} noWrap>{merchant}</Typography>
        </Box>

        {/* CTA */}
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            startIcon={<CartIcon sx={{ fontSize: '0.95rem' }} />}
            onClick={handleCart}
            disabled={stock === 0 || adding}
            sx={{
              borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.82rem',
              background: adding ? '#10b981' : 'linear-gradient(135deg,#1565c0,#1976d2)',
              boxShadow: 'none',
              '&:hover': { background: 'linear-gradient(135deg,#0d47a1,#1565c0)', boxShadow: '0 4px 12px rgba(21,101,192,0.35)' },
              transition: 'all 0.2s',
            }}
          >
            {stock === 0 ? 'Indisponible' : adding ? '✓ Ajouté' : 'Ajouter au panier'}
          </Button>

          <Button
            fullWidth
            size="small"
            variant="contained"
            color="success"
            onClick={handleBuyNow}
            disabled={stock === 0}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.82rem' }}
          >
            Acheter maintenant
          </Button>
        </Box>

        <CheckoutNowModal open={buyNowOpen} onClose={() => setBuyNowOpen(false)} product={product} />
      </Box>
    </Box>
  );
}

/**
 * Skeleton de chargement
 */
export function ProductCardSkeleton() {
  return (
    <Box sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
      <Skeleton variant="rectangular" height={200} />
      <Box sx={{ p: 2 }}>
        <Skeleton width="40%" height={14} sx={{ mb: 0.5 }} />
        <Skeleton width="80%" height={18} />
        <Skeleton width="60%" height={18} />
        <Skeleton width="50%" height={24} sx={{ mt: 1 }} />
        <Skeleton variant="rectangular" height={34} sx={{ mt: 1.5, borderRadius: 1 }} />
      </Box>
    </Box>
  );
}
