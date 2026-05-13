/**
 * Settings Page
 * Dashboard settings and configuration
 */

'use client';

import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Snackbar,
  Alert 
} from '@mui/material';
import { Settings as SettingsIcon, Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '@/utils/api';

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    shop_name: '',
    email: '',
    phone: '',
    description: '',
    logo_url: ''
  });
  
  const [formData, setFormData] = useState({
    shop_name: '',
    email: '',
    phone: '',
    description: '',
    logo_url: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await apiGet('/merchants/me');
        const merchant = data.merchant || data;
        
        setProfile(merchant);
        setFormData(merchant);
        setError(null);
      } catch (err) {
        console.error('Failed to load profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await apiPut('/merchants/me', formData);
      setProfile(formData);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFormData(profile);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error && !profile.shop_name) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
          <Typography>Error: {error}</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Shop Settings
        </Typography>

        <Snackbar 
          open={!!successMessage} 
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="success">{successMessage}</Alert>
        </Snackbar>

        <Snackbar 
          open={!!error} 
          autoHideDuration={5000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6">Shop Profile</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TextField
                  fullWidth
                  label="Shop Name"
                  name="shop_name"
                  value={formData.shop_name || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Logo URL"
                  name="logo_url"
                  value={formData.logo_url || ''}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    sx={{ textTransform: 'none' }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleReset}
                    disabled={saving}
                    sx={{ textTransform: 'none' }}
                  >
                    Reset
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Profile Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Current Profile
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Shop Name</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profile.shop_name || 'Not set'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Email</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profile.email || 'Not set'}
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {profile.phone || 'Not set'}
                  </Typography>
                </Box>

                {profile.logo_url && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Logo</Typography>
                    <Box
                      component="img"
                      src={profile.logo_url}
                      alt="Shop Logo"
                      sx={{ maxWidth: '100px', maxHeight: '100px', mt: 1, borderRadius: 1 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Notification Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Email notifications for new orders"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Low stock alerts"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="Daily sales reports"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Customer reviews"
                  sx={{ mb: 2, display: 'block' }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Display Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Display Settings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show dashboard widgets"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show charts and graphs"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="Compact table view"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Show SKU in all tables"
                  sx={{ mb: 2, display: 'block' }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
