/**
 * Export Page
 * Data export functionality with CSV export
 */

'use client';

import { Box, Typography, Card, CardContent, Button, Stack, Grid, Divider } from '@mui/material';
import { GetApp as ExportIcon, Description, TableChart, Assessment } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { orders, products, customers, sellers } from '@/data/mockData';

export default function ExportPage() {
  const exportToCSV = (data, filename, headers) => {
    // Proper CSV escaping: handle quotes, commas, and newlines
    const escapeCSVValue = (value) => {
      if (value == null) return '';
      const stringValue = String(value);
      // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = data.map(row => 
      headers.map(header => escapeCSVValue(row[header.field])).join(',')
    ).join('\n');
    
    const headerRow = headers.map(h => escapeCSVValue(h.headerName)).join(',') + '\n';
    const blob = new Blob([headerRow + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportOrders = () => {
    const headers = [
      { field: 'id', headerName: 'Order ID' },
      { field: 'sku', headerName: 'SKU' },
      { field: 'customer', headerName: 'Customer' },
      { field: 'product', headerName: 'Product' },
      { field: 'amount', headerName: 'Amount' },
      { field: 'status', headerName: 'Status' },
      { field: 'date', headerName: 'Date' },
    ];
    exportToCSV(orders, 'orders-export.csv', headers);
  };

  const handleExportProducts = () => {
    const headers = [
      { field: 'sku', headerName: 'SKU' },
      { field: 'name', headerName: 'Product Name' },
      { field: 'category', headerName: 'Category' },
      { field: 'size', headerName: 'Size' },
      { field: 'color', headerName: 'Color' },
      { field: 'weight', headerName: 'Weight' },
      { field: 'dimensions', headerName: 'Dimensions' },
      { field: 'material', headerName: 'Material' },
      { field: 'price', headerName: 'Price' },
      { field: 'stock', headerName: 'Stock' },
      { field: 'status', headerName: 'Status' },
      { field: 'seller', headerName: 'Seller' },
    ];
    exportToCSV(products, 'products-export.csv', headers);
  };

  const handleExportCustomers = () => {
    const headers = [
      { field: 'id', headerName: 'Customer ID' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'orders', headerName: 'Orders' },
      { field: 'totalSpent', headerName: 'Total Spent' },
      { field: 'lastOrder', headerName: 'Last Order' },
      { field: 'status', headerName: 'Status' },
    ];
    exportToCSV(customers, 'customers-export.csv', headers);
  };

  const handleExportSellers = () => {
    const headers = [
      { field: 'id', headerName: 'Seller ID' },
      { field: 'name', headerName: 'Name' },
      { field: 'email', headerName: 'Email' },
      { field: 'products', headerName: 'Products' },
      { field: 'sales', headerName: 'Sales' },
      { field: 'rating', headerName: 'Rating' },
      { field: 'status', headerName: 'Status' },
      { field: 'joined', headerName: 'Joined' },
    ];
    exportToCSV(sellers, 'sellers-export.csv', headers);
  };

  const exportOptions = [
    {
      title: 'Orders Export',
      description: 'Export all orders with SKU information',
      icon: TableChart,
      color: '#1976d2',
      action: handleExportOrders,
      count: orders.length
    },
    {
      title: 'Products Export',
      description: 'Export complete product catalog with SKU',
      icon: Description,
      color: '#4caf50',
      action: handleExportProducts,
      count: products.length
    },
    {
      title: 'Customers Export',
      description: 'Export customer database',
      icon: Assessment,
      color: '#ff9800',
      action: handleExportCustomers,
      count: customers.length
    },
    {
      title: 'Sellers Export',
      description: 'Export seller/vendor information',
      icon: ExportIcon,
      color: '#9c27b0',
      action: handleExportSellers,
      count: sellers.length
    },
  ];

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Data Export
        </Typography>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Export your dashboard data to CSV format for further analysis and reporting.
              All exports include SKU information where applicable.
            </Typography>
          </CardContent>
        </Card>
        
        <Grid container spacing={3}>
          {exportOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <Grid item xs={12} md={6} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <IconComponent sx={{ mr: 1, color: option.color, fontSize: 32 }} />
                      <Box>
                        <Typography variant="h6">{option.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.count} records
                        </Typography>
                      </Box>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Button 
                      variant="contained" 
                      startIcon={<ExportIcon />}
                      fullWidth
                      onClick={option.action}
                      sx={{ 
                        backgroundColor: option.color,
                        '&:hover': { backgroundColor: option.color, opacity: 0.9 }
                      }}
                    >
                      Export CSV
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </DashboardLayout>
  );
}
