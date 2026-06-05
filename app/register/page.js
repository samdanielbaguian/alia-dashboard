'use client';

import { Box } from '@mui/material';
import BrandingSide from '@/components/auth/BrandingSide';
import RegisterForm from '@/components/auth/RegisterForm';
import { useRegister } from '@/hooks/useRegister';

export default function RegisterPage() {
  const {
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
  } = useRegister();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <BrandingSide
        backgroundImage="/images/logos_register.png"
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
      />
      <RegisterForm
        formData={formData}
        loading={loading}
        error={error}
        showPass={showPass}
        showConfirmPass={showConfirmPass}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onToggleShowPass={toggleShowPass}
        onToggleShowConfirmPass={toggleShowConfirmPass}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
      />
    </Box>
  );
}
