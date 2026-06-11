'use client';

import { useState } from 'react';
import {
  Box, Card, CardActionArea, Typography, Chip, Rating,
  Avatar, Divider, Skeleton,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  NearMe as NearMeIcon,
  LocalShipping as ShippingIcon,
  Inventory as InventoryIcon,
  Star as StarIcon,
  StoreMallDirectory as StoreIcon,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { estimateDelivery } from '@/utils/deliveryConfig';

export default function ShopCard({ shop, userLocation }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const dist = shop.distance ?? null;
  const delivery = estimateDelivery(dist);
  const fmtDist = dist !== null ? (dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`) : null;

  return (
    <Card
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.14)' : '0 2px 14px rgba(0,0,0,0.07)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        border: shop.isWinner ? '2px solid #f59e0b' : '1px solid rgba(0,0,0,0.06)',
        position: 'relative',
      }}
    >
      {/* Buy Box badge */}
      {shop.isWinner && (
        <Box sx={{
          position: 'absolute', top: 12, right: 12, zIndex: 2,
          bgcolor: '#f59e0b', borderRadius: '20px',
          px: 1.2, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5,
          boxShadow: '0 2px 10px #f59e0b55',
        }}>
          <TrophyIcon sx={{ fontSize: 14, color: '#fff' }} />
          <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, color: '#fff' }}>BUY BOX</Typography>
        </Box>
      )}

      <CardActionArea onClick={() => router.push(`/dashboard/customer/shops/${shop.id}`)} sx={{ flexGrow: 1 }}>
        {/* Bannière couleur */}
        <Box sx={{
          height: 90,
          background: shop.coverColor,
          display: 'flex',
          alignItems: 'flex-end',
          px: 2,
          pb: 0,
        }}>
          <Avatar sx={{
            width: 62, height: 62,
            bgcolor: '#fff',
            border: '3px solid #fff',
            fontSize: '1.8rem',
            mb: -3.5,
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          }}>
            {shop.emoji || <StoreIcon />}
          </Avatar>
        </Box>

        {/* Contenu */}
        <Box sx={{ px: 2, pt: 5, pb: 2 }}>
          {/* Nom + catégorie */}
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#1e1b4b', lineHeight: 1.2, mb: 0.3 }}>
            {shop.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', mb: 1 }}>
            {shop.city} · {shop.category}
          </Typography>

          {/* Description */}
          <Typography sx={{
            fontSize: '0.8rem', color: '#4b5563', mb: 1.5,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {shop.description}
          </Typography>

          {/* Note */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1.5 }}>
            <Rating value={shop.rating} precision={0.1} size="small" readOnly />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e1b4b' }}>{shop.rating}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#9ca3af' }}>({shop.reviewsCount})</Typography>
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <InventoryIcon sx={{ fontSize: 15, color: '#8b5cf6' }} />
              <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{shop.productsCount} produits</Typography>
            </Box>
            {fmtDist && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <NearMeIcon sx={{ fontSize: 15, color: '#3b82f6' }} />
                <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>{fmtDist}</Typography>
              </Box>
            )}
          </Box>

          {/* Livraison */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.8,
            bgcolor: delivery.amount === 0 ? 'rgba(16,185,129,0.08)' : 'rgba(59,130,246,0.08)',
            borderRadius: 1.5, px: 1.2, py: 0.6,
          }}>
            <ShippingIcon sx={{ fontSize: 15, color: delivery.amount === 0 ? '#10b981' : '#3b82f6' }} />
            <Typography sx={{
              fontSize: '0.78rem', fontWeight: 700,
              color: delivery.amount === 0 ? '#10b981' : '#3b82f6',
            }}>
              {delivery.label}
            </Typography>
          </Box>

          {/* Tags */}
          {shop.tags?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1.5 }}>
              {shop.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small"
                  sx={{ fontSize: '0.7rem', height: 20, bgcolor: 'rgba(139,92,246,0.08)', color: '#7c3aed' }} />
              ))}
            </Box>
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}

/**
 * Skeleton de chargement
 */
export function ShopCardSkeleton() {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: 320 }}>
      <Skeleton variant="rectangular" height={90} />
      <Box sx={{ px: 2, pt: 5, pb: 2 }}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="40%" height={16} sx={{ mt: 0.5 }} />
        <Skeleton width="100%" height={36} sx={{ mt: 1 }} />
        <Skeleton width="80%" height={20} sx={{ mt: 1 }} />
        <Skeleton width="50%" height={20} sx={{ mt: 1 }} />
      </Box>
    </Card>
  );
}
