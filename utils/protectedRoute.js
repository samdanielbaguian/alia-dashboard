/**
 * Protected Route Component
 * Wraps routes that require specific roles
 */

"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from './authUtils';

export function useAdminCheck() {
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setIsAdminUser(isAdmin());
    setLoading(false);
  }, []);
  
  return { isAdminUser, loading };
}

/**
 * Higher-order component to protect admin routes
 */
export function withAdminCheck(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const { isAdminUser, loading } = useAdminCheck();
    
    useEffect(() => {
      if (!loading && !isAdminUser) {
        router.push('/dashboard');
      }
    }, [isAdminUser, loading, router]);
    
    if (loading) {
      return <div style={{ padding: '20px' }}>Loading...</div>;
    }
    
    if (!isAdminUser) {
      return <div style={{ padding: '20px', color: 'red' }}>Access denied. Admin only.</div>;
    }
    
    return <Component {...props} />;
  };
}
