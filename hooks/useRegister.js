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

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const handleGoogleLogin = () => { window.location.href = 'http://localhost:8000/api/auth/google'; };
  const handleAppleLogin  = () => { window.location.href = 'http://localhost:8000/api/auth/apple'; };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const toggleShowPass = () => setShowPass(v => !v);
  const toggleShowConfirmPass = () => setShowConfirmPass(v => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🎯 Formulaire d\'inscription soumis!');

    if (!formData.email || !formData.password || !formData.firstName) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.age && formData.age !== '') {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        setError("L'âge doit être compris entre 18 et 120 ans");
        return;
      }
    }

    setLoading(true);
    setError('');
    console.log('📝 Tentative d\'inscription...');

    try {
      console.log('🔍 Appel API vers localhost:8000...');
      const body = {
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'buyer',
      };
      if (formData.age && formData.age !== '') body.age = parseInt(formData.age);
      if (formData.phone && formData.phone !== '') body.phone = formData.phone;
      if (formData.address && formData.address !== '') body.address = formData.address;
      if (formData.city && formData.city !== '') body.city = formData.city;
      if (formData.country && formData.country !== '') body.country = formData.country;

      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('📊 Réponse - Status:', response.status);
      const data = await response.json();
      console.log('📦 Données reçues:', data);

      if (!response.ok) {
        const errorMsg = extractErrorMessage(data?.detail, data?.message || "Erreur d'inscription");
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
        email: decodedToken.email || formData.email,
        role: decodedToken.role || 'buyer',
        first_name: formData.firstName,
        last_name: formData.lastName,
      };

      console.log('👤 Utilisateur construit:', user);

      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('authUser', JSON.stringify(user));

      console.log('✅ Inscription réussie!');
      console.log('✅ Token:', data.access_token.substring(0, 20) + '...');
      console.log('✅ Utilisateur:', user.email, '| Rôle:', user.role);

      if (user.role === 'merchant') {
        window.location.href = '/dashboard/merchant';
      } else {
        window.location.href = '/dashboard/customer';
      }
    } catch (err) {
      console.error('❌ Erreur:', err.message);
      setError('Erreur d\'inscription. Vérifiez que le backend est accessible.');
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    showPass,
    showConfirmPass,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
    handleAppleLogin,
    toggleShowPass,
    toggleShowConfirmPass,
  };
}
