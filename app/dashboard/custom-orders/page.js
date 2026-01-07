/**
 * Custom Orders Page
 * Displays and manages orders with product customization/personalization
 */

'use client';

import { Box, Typography, Button, Grid, Card, CardContent, Chip, Paper, Divider } from '@mui/material';
import { GetApp as ExportIcon, ShoppingCart as OrderIcon, Palette as CustomIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { customOrders } from '@/data/mockData';
import { formatCurrency } from '@/utils/helpers';

export default function CustomOrdersPage() {
  // Enhanced columns with customization details
  const columns = [
    { field: 'id', headerName: 'Custom Order ID' },
    { field: 'orderId', headerName: 'Order ID' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'customer', headerName: 'Customer' },
    { field: 'product', headerName: 'Product' },
    { field: 'amount', headerName: 'Amount', type: 'currency' },
    { field: 'status', headerName: 'Status', type: 'status' },
    { field: 'date', headerName: 'Date' },
  ];

  const stats = [
    { label: 'Total Custom Orders', value: customOrders.length.toString(), color: '#1976d2' },
    { label: 'En cours', value: customOrders.filter(o => o.status === 'processing').length.toString(), color: '#ff9800' },
    { label: 'Expédiées', value: customOrders.filter(o => o.status === 'shipped').length.toString(), color: '#2196f3' },
    { label: 'Complétées', value: customOrders.filter(o => o.status === 'completed').length.toString(), color: '#4caf50' },
  ];

  const handleExport = () => {
    const escapeCSVValue = (value) => {
      if (value == null) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvContent = customOrders.map(order => {
      const customizationStr = JSON.stringify(order.customization).replace(/"/g, '""');
      return [
        order.id,
        order.orderId,
        order.sku,
        order.customer,
        order.product,
        order.amount,
        order.status,
        order.date,
        `"${customizationStr}"`
      ].map(escapeCSVValue).join(',');
    }).join('\n');
    
    const header = 'Custom Order ID,Order ID,SKU,Customer,Product,Amount,Status,Date,Customization\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-orders-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <CustomIcon sx={{ mr: 1, color: '#1976d2' }} />
              Commandes Personnalisées
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Gestion des commandes avec personnalisation produit
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<ExportIcon />}
            sx={{ textTransform: 'none' }}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <OrderIcon sx={{ mr: 1, color: stat.color }} />
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Orders Table */}
        <DataTable
          title="Toutes les Commandes Personnalisées"
          columns={columns}
          data={customOrders}
        />

        {/* Customization Details Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            Détails des Personnalisations
          </Typography>
          <Grid container spacing={2}>
            {customOrders.slice(0, 4).map((order) => (
              <Grid item xs={12} md={6} key={order.id}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1976d2' }}>
                        {order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.product}
                      </Typography>
                    </Box>
                    <Chip 
                      label={order.status} 
                      size="small"
                      color={
                        order.status === 'completed' ? 'success' : 
                        order.status === 'processing' ? 'warning' :
                        order.status === 'shipped' ? 'info' : 'default'
                      }
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Client
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.customer}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                      Date de commande
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {order.date}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
                    OPTIONS DE PERSONNALISATION
                  </Typography>
                  
                  {Object.entries(order.customization).map(([key, value]) => (
                    value && (
                      <Box key={key} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120 }}>
                          {key === 'playerName' ? 'Nom Joueur' :
                           key === 'playerNumber' ? 'Numéro' :
                           key === 'badgeColor' ? 'Couleur Badge' :
                           key === 'customText' ? 'Texte Perso' :
                           key === 'textColor' ? 'Couleur Texte' :
                           key === 'fontSize' ? 'Taille Police' :
                           key === 'customImage' ? 'Image' :
                           key}:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                          {value}
                        </Typography>
                      </Box>
                    )
                  ))}

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Montant
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                      {formatCurrency(order.amount)}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Information Panel */}
        <Paper sx={{ mt: 4, p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            💡 Guide du Vendeur - Commandes Personnalisées
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  1. Vérifier les détails
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Vérifiez attentivement toutes les options de personnalisation choisies par le client (nom, numéro, couleur, texte).
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  2. Préparer la commande
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Transmettez les informations de personnalisation à l'atelier de production pour fabrication.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  3. Expédier et suivre
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Une fois la personnalisation terminée, expédiez la commande et mettez à jour le statut.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
