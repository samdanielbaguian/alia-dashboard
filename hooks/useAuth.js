'use client';

import { useState, useEffect, useCallback } from 'react';

// Rôles officiels du backend Alia
const VALID_ROLES = {
  MERCHANT: 'merchant',
  BUYER: 'buyer',
};

// Décoder le payload JWT sans vérification de signature (côté client)
function decodeJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function normalizeRole(role) {
  if (role === 'merchant') return VALID_ROLES.MERCHANT;
  if (role === 'buyer' || role === 'customer') return VALID_ROLES.BUYER;
  return VALID_ROLES.BUYER; // fallback sécurisé
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    let savedUser = localStorage.getItem('authUser');

    // Nettoyer les valeurs invalides
    if (!savedUser || savedUser === 'undefined' || savedUser === 'null') {
      localStorage.removeItem('authUser');
      savedUser = null;
    }

    const validToken = savedToken && savedToken !== 'undefined' && savedToken !== 'null'
      ? savedToken
      : null;

    if (!validToken) {
      localStorage.removeItem('authToken');
      setLoading(false);
      return;
    }

    // PRIORITÉ : extraire le rôle directement depuis le token JWT
    const decoded = decodeJWT(validToken);
    console.log('🔐 JWT décodé:', decoded);

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);

        // Rôle du token est prioritaire sur le rôle stocké
        const roleFromToken = decoded?.role;
        if (roleFromToken) {
          parsedUser.role = normalizeRole(roleFromToken);
          console.log('✅ Rôle lu depuis le token JWT:', parsedUser.role);
        } else {
          // Fallback : normaliser le rôle stocké
          parsedUser.role = normalizeRole(parsedUser.role);
          console.warn('⚠️ Rôle absent du token, normalisé depuis localStorage:', parsedUser.role);
        }

        localStorage.setItem('authUser', JSON.stringify(parsedUser));
        setUser(parsedUser);
      } catch (e) {
        console.error('Failed to parse user:', e);
        localStorage.removeItem('authUser');
      }
    } else if (decoded) {
      // Reconstruire l'utilisateur depuis le token si localStorage vide
      const reconstructed = {
        id: decoded.sub,
        email: decoded.email || '',
        role: normalizeRole(decoded.role),
      };
      console.log('🔄 Utilisateur reconstruit depuis le token:', reconstructed);
      localStorage.setItem('authUser', JSON.stringify(reconstructed));
      setUser(reconstructed);
    }

    setToken(validToken);
    setLoading(false);
  }, []);

  const isLoggedIn = !!token && !!user;
  const isBuyer = user?.role === VALID_ROLES.BUYER;
  const isMerchant = user?.role === VALID_ROLES.MERCHANT;

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    window.location.href = '/';
  }, []);

  return {
    user,
    token,
    loading,
    isLoggedIn,
    isBuyer,
    isMerchant,
    logout,
    setUser,
    setToken,
  };
}
