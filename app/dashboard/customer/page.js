'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import CustomerDashboardLayout from '@/layout/CustomerDashboardLayout';
import HeroBanner from '@/components/sections/HeroBanner';
import RecommendedSection from '@/components/sections/RecommendedSection';
import NewArrivals from '@/components/sections/NewArrivals';
import useGeolocation from '@/hooks/useGeolocation';

export default function CustomerDashboard() {
  const { location } = useGeolocation();
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (product) => {
    setCartCount(c => c + 1);
  };

  return (
    <CustomerDashboardLayout title="Accueil">
      <Box sx={{ pb: 4 }}>
        <HeroBanner userCity={location?.city} />
        <RecommendedSection onAddToCart={handleAddToCart} />
        <NewArrivals onAddToCart={handleAddToCart} />
      </Box>
    </CustomerDashboardLayout>
  );
}
