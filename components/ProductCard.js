'use client';

import { Card, CardContent, CardMedia, Box, Typography, Rating, IconButton, Button } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon, Message as MessageIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProductCard({ 
  product, 
  onFavoriteToggle, 
  isFavorited = false,
  onContact,
  displayVariant = 'grid' // 'grid' or 'list'
}) {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [hovered, setHovered] = useState(false);

  const handleFavoriteClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    onFavoriteToggle?.(product.id);
  };

  const handleContactClick = () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    onContact?.(product);
  };

  if (displayVariant === 'list') {
    return (
      <Card sx={{ display: 'flex', mb: 2, '&:hover': { boxShadow: 3 } }}>
        <CardMedia
          component="img"
          sx={{ width: 200, height: 200, objectFit: 'cover' }}
          image={product.image_url || '/placeholder.jpg'}
          alt={product.name}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
              {product.description?.substring(0, 100)}...
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating value={product.rating || 0} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews_count || 0})
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
                €{product.price?.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  onClick={handleFavoriteClick}
                  sx={{ color: isFavorited ? 'error.main' : 'inherit' }}
                >
                  {isFavorited ? 'Favorisé' : 'Favori'}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<MessageIcon />}
                  onClick={handleContactClick}
                >
                  Contacter
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Box>
      </Card>
    );
  }

  // Grid variant (default)
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 },
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          sx={{ objectFit: 'cover' }}
        />
        {hovered && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              bgcolor: 'rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Button
              variant="contained"
              size="small"
              startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              onClick={handleFavoriteClick}
              sx={{
                bgcolor: isFavorited ? 'error.main' : 'primary.main',
                '&:hover': { bgcolor: isFavorited ? 'error.dark' : 'primary.dark' },
              }}
            />
            <Button
              variant="contained"
              size="small"
              startIcon={<MessageIcon />}
              onClick={handleContactClick}
            />
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, minHeight: '2.5em' }}>
          {product.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={product.rating || 0} readOnly size="small" />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
            ({product.reviews_count || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>
            €{product.price?.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {product.merchant_name || 'Marchand'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
