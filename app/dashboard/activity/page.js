/**
 * Activity Page
 * Recent activity feed
 */

'use client';

import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider
} from '@mui/material';
import { 
  Timeline as ActivityIcon,
  ShoppingCart,
  Inventory,
  PersonAdd,
  Store,
  LocalShipping
} from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { activityFeed } from '@/data/mockData';

export default function ActivityPage() {
  const getIcon = (iconName) => {
    const icons = {
      shopping_cart: ShoppingCart,
      inventory: Inventory,
      person_add: PersonAdd,
      store: Store,
      local_shipping: LocalShipping
    };
    const IconComponent = icons[iconName] || ActivityIcon;
    return <IconComponent sx={{ color: '#1976d2' }} />;
  };

  const getColor = (type) => {
    const colors = {
      order: '#1976d2',
      product: '#4caf50',
      customer: '#ff9800',
      seller: '#9c27b0',
    };
    return colors[type] || '#1976d2';
  };

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Activity Feed
        </Typography>
        
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ActivityIcon sx={{ mr: 1, color: '#1976d2' }} />
              <Typography variant="h6">Recent Activity</Typography>
            </Box>
            
            <List>
              {activityFeed.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <Avatar 
                        sx={{ 
                          bgcolor: `${getColor(activity.type)}20`,
                          width: 40,
                          height: 40
                        }}
                      >
                        {getIcon(activity.icon)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {activity.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < activityFeed.length - 1 && <Divider variant="inset" component="li" />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}
