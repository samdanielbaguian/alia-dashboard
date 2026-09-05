'use client';

import { useState } from 'react';

// Convert FastAPI validation errors (array of {msg,...}) or plain strings into a displayable message
function extractErrorMessage(detail, fallback) {
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((e) => e?.msg || JSON.stringify(e)).join(' ');
  }
  return fallback;
}

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
  } catch (err) {
    console.error('❌ Erreur lors du décodage JWT:', err);
    return null;
  }
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Phone modal states
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);

  const handleGoogleLogin = () => { window.location.href = 'http://localhost:8000/api/auth/google'; };
  const handleAppleLogin  = () => { window.location.href = 'http://localhost:8000/api/auth/apple'; };

  const toggleShowPass = () => setShowPass(v => !v);

  const closePhoneModal = () => {
    setPhoneOpen(false);
    setCodeSent(false);
    setPhoneNumber('');
    setPhoneCode('');
  };

  const handleSendCode = async () => {
    if (!phoneNumber) return;
    setPhoneLoading(true);
    try {
      await fetch('http://localhost:8000/api/auth/phone/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber }),
      });
      setCodeSent(true);
    } catch { /* ignore */ } finally { setPhoneLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!phoneCode) return;
    setPhoneLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/auth/phone/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, code: phoneCode }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        localStorage.setItem('authToken', data.access_token);
        localStorage.setItem('authUser', JSON.stringify(data.user || {}));
        const role = data.user?.role;
        if (role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (role === 'merchant') {
          window.location.href = '/dashboard/merchant';
        } else {
          window.location.href = '/dashboard/customer';
        }
      }
    } catch { /* ignore */ } finally { setPhoneLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.log('⚠️ Champs vides');
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');
    console.log('📝 Tentative de connexion avec:', email);

    try {
      console.log('🔍 Appel API vers localhost:8000...');
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('📊 Réponse - Status:', response.status);
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        const errorMsg = extractErrorMessage(data?.detail, data?.message || 'Erreur de connexion');
        console.error('❌ Erreur API:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      if (!data.access_token) {
        const errorMsg = 'Token absent dans la réponse';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const decodedToken = decodeJWT(data.access_token);
      console.log('🔐 Payload du JWT décodé:', decodedToken);

      if (!decodedToken) {
        const errorMsg = 'Impossible de décoder le token';
        console.error('❌', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const user = {
        id: decodedToken.sub,
        email: decodedToken.email || email,
        role: decodedToken.role || 'buyer',
        first_name: decodedToken.first_name,
        last_name: decodedToken.last_name,
      };

      console.log('👤 Utilisateur construit:', user);

      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('authUser', JSON.stringify(user));

      console.log('✅ Authentification réussie!');
      console.log('✅ Token:', data.access_token.substring(0, 20) + '...');
      console.log('✅ Utilisateur:', user.email);
      console.log('✅ Rôle:', user.role);

      if (user.role === 'admin') {
        window.location.href = '/dashboard/admin';
      } else if (user.role === 'merchant') {
        window.location.href = '/dashboard/merchant';
      } else if (user.role === 'buyer') {
        window.location.href = '/dashboard/customer';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      console.error('❌ Erreur:', err.message);
      setError('Erreur de connexion. Vérifiez que le backend est accessible.');
      setLoading(false);
    }
  };

  return {
    // form
    email, setEmail,
    password, setPassword,
    loading, error,
    showPass, toggleShowPass,
    handleSubmit,
    handleGoogleLogin,
    handleAppleLogin,
    // phone modal
    phoneOpen, setPhoneOpen,
    phoneNumber, setPhoneNumber,
    phoneCode, setPhoneCode,
    codeSent,
    phoneLoading,
    handleSendCode,
    handleVerifyCode,
    closePhoneModal,
  };
}
