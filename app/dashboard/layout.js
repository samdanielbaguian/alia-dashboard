'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '@/utils/api';

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Rendre directement les enfants pour éviter l'erreur d'hydration
  // La vérification d'authentification se fait en arrière-plan
  return <>{children}</>;
}
