/**
 * DashboardLayout Component
 * Main layout wrapper for the dashboard with sidebar, header, and content area
 * Bagisto-inspired design
 */

'use client';

import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import { DRAWER_WIDTH } from './constants';

export default function DashboardLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8, // Account for header height
          ml: `${DRAWER_WIDTH}px`,
          backgroundColor: '#ffffff',
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
