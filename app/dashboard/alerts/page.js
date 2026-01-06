/**
 * Alerts Page
 * System alerts and notifications
 */

'use client';

import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Alert, 
  Stack,
  Chip,
  IconButton 
} from '@mui/material';
import { 
  Notifications as AlertsIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { alerts } from '@/data/mockData';

export default function AlertsPage() {
  const getSeverity = (type) => {
    const severityMap = {
      error: 'error',
      warning: 'warning',
      info: 'info',
      success: 'success'
    };
    return severityMap[type] || 'info';
  };

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Alerts & Notifications
          </Typography>
          <Chip 
            label={`${alerts.filter(a => !a.read).length} Unread`} 
            color="primary" 
            size="small" 
          />
        </Box>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <AlertsIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">System Alerts</Typography>
            </Box>
            
            <Stack spacing={2}>
              {alerts.map((alert) => (
                <Alert 
                  key={alert.id}
                  severity={getSeverity(alert.type)}
                  action={
                    <IconButton
                      aria-label="close"
                      color="inherit"
                      size="small"
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  }
                  sx={{ 
                    opacity: alert.read ? 0.6 : 1,
                    '&:hover': { opacity: 1 }
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                      {alert.time}
                    </Typography>
                  </Box>
                </Alert>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
