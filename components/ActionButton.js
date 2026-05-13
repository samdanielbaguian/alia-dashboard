'use client';

import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ActionButton({
  onClick,
  children,
  requiresAuth = true,
  variant = 'contained',
  color = 'primary',
  redirectTo = '/login',
  ...props
}) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (requiresAuth && !isLoggedIn) {
      // Rediriger vers la page de connexion au lieu d'ouvrir la modale
      router.push(redirectTo);
      return;
    }
    if (onClick) onClick();
  };

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      color={color}
      {...props}
    >
      {children}
    </Button>
  );
}
