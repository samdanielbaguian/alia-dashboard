'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  Tab,
  Tabs,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Stack,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Payment as PaymentIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  HelpOutline as HelpIcon,
  CheckCircle as CheckIcon,
  Storefront as StoreIcon,
  AttachMoney as MoneyIcon,
  LocalShipping as ShippingIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet, apiPut } from '@/utils/api';

// ─── Configuration des onglets ──────────────────────────────────────────────

const TABS = [
  { value: 'general', label: 'Général', icon: <SettingsIcon /> },
  { value: 'payments', label: 'Paiements', icon: <PaymentIcon /> },
  { value: 'security', label: 'Sécurité', icon: <SecurityIcon /> },
  { value: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
  { value: 'appearance', label: 'Apparence', icon: <PaletteIcon /> },
];

// ─── Composant principal ─────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  // ─── États ───────────────────────────────────────────────────────────────────

  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // ─── Données des paramètres ────────────────────────────────────────────────

  const [settings, setSettings] = useState({
    // Général
    siteName: 'Alia Marketplace',
    siteDescription: 'La meilleure marketplace en Afrique de l\'Ouest',
    contactEmail: 'support@alia.com',
    contactPhone: '+225 07 00 00 00',
    address: 'Abidjan, Côte d\'Ivoire',
    currency: 'XOF',
    timezone: 'Africa/Abidjan',
    // Paiements
    platformFeePercentage: 2.5,
    minOrderAmount: 1000,
    maxOrderAmount: 500000,
    freeShippingThreshold: 50000,
    paymentMethods: ['orange_money', 'mtn_momo', 'wave'],
    // Sécurité
    twoFactorAuth: true,
    requireStrongPassword: true,
    sessionTimeout: 60, // minutes
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    orderCreated: true,
    orderShipped: true,
    orderDelivered: true,
    merchantApproval: true,
    // Apparence
    primaryColor: '#1976d2',
    darkMode: false,
    logoUrl: '/logos/logos.png',
    faviconUrl: '/icons/icons.png',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar((s) => ({ ...s, open: false })), 4000);
  };

  // ─── Chargement des paramètres ────────────────────────────────────────────

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/settings');
        if (data) {
          setSettings((prev) => ({
            ...prev,
            ...data,
          }));
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // ─── Sauvegarde ─────────────────────────────────────────────────────────────

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiPut('/settings', settings);
      showSnackbar('Paramètres sauvegardés avec succès ✅', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      showSnackbar('Erreur lors de la sauvegarde ❌', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ─── Gestion des changements ──────────────────────────────────────────────

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Rendu des onglets ─────────────────────────────────────────────────────

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralTab settings={settings} onChange={handleChange} />;
      case 'payments':
        return <PaymentsTab settings={settings} onChange={handleChange} />;
      case 'security':
        return <SecurityTab settings={settings} onChange={handleChange} />;
      case 'notifications':
        return <NotificationsTab settings={settings} onChange={handleChange} />;
      case 'appearance':
        return <AppearanceTab settings={settings} onChange={handleChange} />;
      default:
        return null;
    }
  };

  // ─── Rendu principal ──────────────────────────────────────────────────────

  return (
    <AdminDashboardLayout title="Paramètres">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 3 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: 1 }}>
              <SettingsIcon sx={{ color: '#1976d2', fontSize: 32 }} />
              Paramètres
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez tous les paramètres de votre plateforme
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              disabled={loading}
            >
              Actualiser
            </Button>
            <Button
              variant="contained"
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
              onClick={handleSave}
              disabled={saving || loading}
              sx={{ borderRadius: 2, px: 4 }}
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </Box>
        </Box>

        {/* Onglets */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 48 },
              '& .Mui-selected': { color: '#1976d2' },
            }}
          >
            {TABS.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Contenu des onglets */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: 'background.default' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : (
            renderTabContent()
          )}
        </Paper>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 2 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminDashboardLayout>
  );
}

// ─── Sous-composants des onglets ────────────────────────────────────────────

function GeneralTab({ settings, onChange }) {
  return (
    <Grid container spacing={3}>
      {/* Identité de la plateforme */}
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Identité de la plateforme
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nom du site"
                  value={settings.siteName || ''}
                  onChange={(e) => onChange('siteName', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Description du site"
                  value={settings.siteDescription || ''}
                  onChange={(e) => onChange('siteDescription', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Email de contact"
                  value={settings.contactEmail || ''}
                  onChange={(e) => onChange('contactEmail', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Téléphone de contact"
                  value={settings.contactPhone || ''}
                  onChange={(e) => onChange('contactPhone', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  label="Adresse"
                  value={settings.address || ''}
                  onChange={(e) => onChange('address', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function PaymentsTab({ settings, onChange }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Frais et commissions
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Frais de plateforme (%)
                </Typography>
                <TextField
                  type="number"
                  value={settings.platformFeePercentage || 0}
                  onChange={(e) => onChange('platformFeePercentage', parseFloat(e.target.value))}
                  inputProps={{ step: 0.1, min: 0, max: 20 }}
                  size="small"
                  sx={{ width: 150 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Appliqué à chaque commande
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Montant minimum de commande
                </Typography>
                <TextField
                  type="number"
                  value={settings.minOrderAmount || 0}
                  onChange={(e) => onChange('minOrderAmount', parseInt(e.target.value))}
                  inputProps={{ min: 0 }}
                  size="small"
                  sx={{ width: 180 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">XOF</InputAdornment> }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Montant maximum de commande
                </Typography>
                <TextField
                  type="number"
                  value={settings.maxOrderAmount || 0}
                  onChange={(e) => onChange('maxOrderAmount', parseInt(e.target.value))}
                  inputProps={{ min: 0 }}
                  size="small"
                  sx={{ width: 180 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">XOF</InputAdornment> }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Livraison
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Seuil de livraison gratuite
                </Typography>
                <TextField
                  type="number"
                  value={settings.freeShippingThreshold || 0}
                  onChange={(e) => onChange('freeShippingThreshold', parseInt(e.target.value))}
                  inputProps={{ min: 0 }}
                  size="small"
                  sx={{ width: 200 }}
                  InputProps={{ endAdornment: <InputAdornment position="end">XOF</InputAdornment> }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  Au‑dessus de ce montant, la livraison est gratuite
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function SecurityTab({ settings, onChange }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Sécurité
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => onChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Authentification à deux facteurs</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exiger une vérification supplémentaire lors de la connexion
                    </Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.requireStrongPassword}
                    onChange={(e) => onChange('requireStrongPassword', e.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 600 }}>Mots de passe forts</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Exiger un mot de passe complexe (8+ caractères, majuscules, chiffres)
                    </Typography>
                  </Box>
                }
              />
              <Divider />
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Durée de session (minutes)
                </Typography>
                <TextField
                  type="number"
                  value={settings.sessionTimeout || 60}
                  onChange={(e) => onChange('sessionTimeout', parseInt(e.target.value))}
                  inputProps={{ min: 5, max: 1440 }}
                  size="small"
                  sx={{ width: 150 }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function NotificationsTab({ settings, onChange }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Canaux de notification
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => onChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Notifications par email"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.smsNotifications}
                    onChange={(e) => onChange('smsNotifications', e.target.checked)}
                  />
                }
                label="Notifications par SMS"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => onChange('pushNotifications', e.target.checked)}
                  />
                }
                label="Notifications push"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Événements déclencheurs
            </Typography>
            <Stack spacing={2}>
              <FormControlLabel
                control={<Switch checked={settings.orderCreated} onChange={(e) => onChange('orderCreated', e.target.checked)} />}
                label="Nouvelle commande"
              />
              <FormControlLabel
                control={<Switch checked={settings.orderShipped} onChange={(e) => onChange('orderShipped', e.target.checked)} />}
                label="Commande expédiée"
              />
              <FormControlLabel
                control={<Switch checked={settings.orderDelivered} onChange={(e) => onChange('orderDelivered', e.target.checked)} />}
                label="Commande livrée"
              />
              <FormControlLabel
                control={<Switch checked={settings.merchantApproval} onChange={(e) => onChange('merchantApproval', e.target.checked)} />}
                label="Approbation de nouveau marchand"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

function AppearanceTab({ settings, onChange }) {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Thème et couleurs
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Couleur principale
                </Typography>
                <TextField
                  type="color"
                  value={settings.primaryColor || '#1976d2'}
                  onChange={(e) => onChange('primaryColor', e.target.value)}
                  sx={{ width: 60, height: 40 }}
                />
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.darkMode}
                    onChange={(e) => onChange('darkMode', e.target.checked)}
                  />
                }
                label="Mode sombre"
              />
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Logo et favicon
            </Typography>
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  URL du logo
                </Typography>
                <TextField
                  fullWidth
                  value={settings.logoUrl || ''}
                  onChange={(e) => onChange('logoUrl', e.target.value)}
                  variant="outlined"
                  size="small"
                />
                <Box sx={{ mt: 1 }}>
                  <img src={settings.logoUrl} alt="Logo" style={{ height: 50 }} />
                </Box>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  URL du favicon
                </Typography>
                <TextField
                  fullWidth
                  value={settings.faviconUrl || ''}
                  onChange={(e) => onChange('faviconUrl', e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}