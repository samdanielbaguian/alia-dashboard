/**
 * Dashboard Page
 * Redirects to overview page
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/overview');
  }, [router]);

  return null;
}
