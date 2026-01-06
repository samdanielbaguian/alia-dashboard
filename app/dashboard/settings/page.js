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
  Divider 
} from '@mui/material';
import { Settings as SettingsIcon, Save as SaveIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Settings
        </Typography>

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SettingsIcon sx={{ mr: 1, color: '#1976d2' }} />
                  <Typography variant="h6">General Settings</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                
                <TextField
                  fullWidth
                  label="Store Name"
                  defaultValue="Alia Marketplace"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Store Email"
                  defaultValue="contact@alia-marketplace.com"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Currency"
                  defaultValue="EUR (€)"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Timezone"
                  defaultValue="Europe/Paris"
                  sx={{ mb: 2 }}
                />

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Save Changes
                </Button>
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
                  label="New seller registrations"
                  sx={{ mb: 2, display: 'block' }}
                />
                
                <FormControlLabel
                  control={<Switch />}
                  label="Customer reviews"
                  sx={{ mb: 2, display: 'block' }}
                />

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Save Preferences
                </Button>
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

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Apply Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* API Settings */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  API Configuration
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <TextField
                  fullWidth
                  label="API Key"
                  defaultValue="alia_key_xxxxxxxxxxxx"
                  type="password"
                  sx={{ mb: 2 }}
                />
                
                <TextField
                  fullWidth
                  label="Webhook URL"
                  defaultValue="https://api.alia.com/webhook"
                  sx={{ mb: 2 }}
                />
                
                <FormControlLabel
                  control={<Switch defaultChecked />}
                  label="Enable API access"
                  sx={{ mb: 2, display: 'block' }}
                />

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ mt: 2 }}
                >
                  Update API
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
