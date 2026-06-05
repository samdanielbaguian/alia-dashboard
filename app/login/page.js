'use client';

import {
  ShoppingBagOutlined,
  Public,
  MailOutline,
  LockOutlined,
  PersonOutline,
} from '@mui/icons-material';
import { Box } from '@mui/material';
import {
  ShoppingBagOutlined as ShoppingIcon,
  LocalOfferOutlined, StorefrontOutlined,
} from '@mui/icons-material';
import BrandingSide from '@/components/auth/BrandingSide';
import LoginForm from '@/components/auth/LoginForm';
import { useLogin } from '@/hooks/useLogin';

/* Illustration composée d'icônes — spécifique à la page login */
const LoginIllustration = (
  <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto', mb: 5 }}>
    <Box sx={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ShoppingIcon sx={{ fontSize: 88, color: 'rgba(255,255,255,0.85)' }} />
    </Box>
    <Box sx={{ position: 'absolute', top: 8, right: -8, bgcolor: 'rgba(201,160,61,0.9)', borderRadius: '50%', p: 0.8 }}>
      <LocalOfferOutlined sx={{ fontSize: 20, color: '#fff' }} />
    </Box>
    <Box sx={{ position: 'absolute', bottom: 12, left: -10, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', p: 0.8 }}>
      <StorefrontOutlined sx={{ fontSize: 20, color: '#fff' }} />
    </Box>
  </Box>
);

const LOGIN_STATS = [['10K+', 'Acheteurs'], ['2K+', 'Marchands'], ['50K+', 'Produits']];

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    loading, error,
    showPass, toggleShowPass,
    handleSubmit,
    handleGoogleLogin,
    handleAppleLogin,
    phoneOpen, setPhoneOpen,
    phoneNumber, setPhoneNumber,
    phoneCode, setPhoneCode,
    codeSent, phoneLoading,
    handleSendCode, handleVerifyCode, closePhoneModal,
  } = useLogin();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      <BrandingSide
        backgroundImage="/images/logos_login.png"
        tagline='"Votre marketplace de confiance — achetez, vendez, payez en un clic."'
        subtitle={
                  <>
                    <ShoppingBagOutlined
                      sx={{
                        fontSize: 18,
                        color: '#c9a03d',
                        mr: 1,
                        verticalAlign: 'middle',
                      }}
                    />
                    Achetez, vendez et développez votre activité

                    <br />

                    <Public
                      sx={{
                        fontSize: 18,
                        color: '#c9a03d',
                        mr: 1,
                        verticalAlign: 'middle',
                      }}
                    />
                    sur une marketplace conçue pour l'Afrique.
                  </>
                }
        features={null}
        illustration={LoginIllustration}
        stats={LOGIN_STATS}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        onPhoneLogin={() => setPhoneOpen(true)}
      />
      <LoginForm
        email={email}
        password={password}
        loading={loading}
        error={error}
        showPass={showPass}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onToggleShowPass={toggleShowPass}
        onGoogleLogin={handleGoogleLogin}
        onAppleLogin={handleAppleLogin}
        onPhoneLogin={() => setPhoneOpen(true)}
        phoneOpen={phoneOpen}
        phoneNumber={phoneNumber}
        phoneCode={phoneCode}
        codeSent={codeSent}
        phoneLoading={phoneLoading}
        onPhoneNumberChange={setPhoneNumber}
        onPhoneCodeChange={setPhoneCode}
        onSendCode={handleSendCode}
        onVerifyCode={handleVerifyCode}
        onClosePhoneModal={closePhoneModal}
      />
    </Box>
  );
}
