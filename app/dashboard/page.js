'use client';

import { Box, Container, Typography, Stack } from '@mui/material';
import Header from '@/layout/Header';
import Sidebar from '@/layout/Sidebar';
import Overview from '@/components/widgets/Overview';
import Heatmap from '@/components/widgets/Heatmap';
import BestSellers from '@/components/widgets/BestSellers';
import Alerts from '@/components/widgets/Alerts';
import Activity from '@/components/widgets/Activity';
import Export from '@/components/widgets/Export';

/**
 * Dashboard Page
 * Main dashboard layout with widgets
 */
export default function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Sidebar />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: '240px',
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 3 }}>
            Dashboard Overview
          </Typography>
          
          <Stack spacing={3}>
            {/* First Row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Overview />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <BestSellers />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Alerts />
              </Box>
            </Box>
            
            {/* Second Row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '2 1 500px', minWidth: 0 }}>
                <Heatmap />
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Activity />
              </Box>
            </Box>
            
            {/* Third Row */}
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <Export />
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
