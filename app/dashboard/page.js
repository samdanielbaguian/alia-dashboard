'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAuthToken, getAuthUser } from '@/utils/api';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const token = getAuthToken();
        
        if (!token) {
          router.push('/login');
          return;
        }

        const user = getAuthUser();
        
        if (!user) {
          router.push('/login');
          return;
        }

        const role = user.role || user.type;

        if (role === 'merchant') {
          router.push('/dashboard/merchant');
        } else if (role === 'customer') {
          router.push('/dashboard/customer');
        } else {
          router.push('/unauthorized');
        }
      } catch (error) {
        console.error('Redirect error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [router]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Box>
  );
}
