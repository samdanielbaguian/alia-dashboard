<<<<<<< HEAD
'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Pagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar,
  Skeleton,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search, Edit as EditIcon, Delete as DeleteIcon, Visibility,
  LocalShipping, CheckCircle, Cancel, Schedule, TrendingUp,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'cancelled', label: 'Annulée' },
];

const STATUS_COLORS = {
  pending: { bg: '#fef3c7', color: '#92400e', icon: Schedule },
  confirmed: { bg: '#dbeafe', color: '#1e40af', icon: CheckCircle },
  shipped: { bg: '#bfdbfe', color: '#1e3a8a', icon: LocalShipping },
  delivered: { bg: '#d1fae5', color: '#065f46', icon: CheckCircle },
  cancelled: { bg: '#fee2e2', color: '#991b1b', icon: Cancel },
};

const PER_PAGE = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [newStatus, setNewStatus] = useState('');

  const showSnack = (msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
    setTimeout(() => setSnack(s => ({ ...s, open: false })), 3000);
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        ...(statusFilter && { status: statusFilter }),
        ...(search && { search }),
      });
      const data = await apiGet(`/admin/orders?${params}`);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      showSnack('Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, search]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, newOrderStatus) => {
    try {
      await apiPatch(`/admin/orders/${orderId}/status?new_status=${newOrderStatus}`, {});
      showSnack('Statut de la commande mis à jour');
      fetchOrders();
      setActionDialog({ open: false, type: null });
      setNewStatus('');
    } catch (error) {
      showSnack('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleDelete = async (orderId) => {
    try {
      await apiDelete(`/admin/orders/${orderId}`);
      showSnack('Commande supprimée');
      fetchOrders();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la suppression', 'error');
    }
  };

  const getStatusIcon = (status) => {
    const StatusIcon = STATUS_COLORS[status]?.icon || Schedule;
    return <StatusIcon sx={{ fontSize: 16 }} />;
  };

  return (
    <AdminDashboardLayout title="Gestion des commandes">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b', mb: 0.5 }}>
          Commandes ({total})
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Gérez, modifiez le statut et supervisez toutes les commandes.
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Rechercher par ID, acheteur ou marchand..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                  label="Statut"
                  sx={{ borderRadius: 2 }}
                >
                  {STATUS_OPTIONS.map(s => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { setSearch(''); setStatusFilter(''); setPage(1); }}
                sx={{ borderRadius: 2, color: '#7f8c8d', borderColor: 'rgba(0,0,0,0.2)' }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table */}
      <TableContainer component={Card} sx={{ borderRadius: 3, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f7fa' }}>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>ID Commande</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Montant</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Articles</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6, 7].map(j => <TableCell key={j}><Skeleton /></TableCell>)}
                </TableRow>
              ))
            ) : orders.length > 0 ? (
              orders.map((o) => {
                const statusColor = STATUS_COLORS[o.status] || STATUS_COLORS.pending;
                return (
                  <TableRow key={o.id || o._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                    <TableCell sx={{ fontWeight: 600, color: '#1976d2' }}>#{o.order_number || (o.id || o._id).substring(0, 8)}</TableCell>
                    <TableCell sx={{ color: '#7f8c8d', fontSize: '0.9rem' }}>{o.buyer_email || 'N/A'}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{o.total_amount.toLocaleString('fr-FR')} XOF</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{o.items_count || o.items?.length || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                        size="small"
                        icon={getStatusIcon(o.status)}
                        sx={{
                          bgcolor: statusColor.bg,
                          color: statusColor.color,
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      <Tooltip title="Détails">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedOrder(o); setActionDialog({ open: true, type: 'view' }); }}
                          sx={{ color: '#1976d2' }}
                        >
                          <Visibility sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Changer le statut">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedOrder(o); setNewStatus(o.status); setActionDialog({ open: true, type: 'status' }); }}
                          sx={{ color: '#f59e0b' }}
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedOrder(o); setActionDialog({ open: true, type: 'delete' }); }}
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4, color: '#b0b0b0' }}>
                  Aucune commande trouvée
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(total / PER_PAGE)}
          page={page}
          onChange={(e, p) => setPage(p)}
          color="primary"
        />
      </Box>

      {/* Action Dialogs */}
      {actionDialog.type === 'view' && selectedOrder && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Détails de la commande</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Numéro</Typography>
                <Typography sx={{ fontWeight: 600 }}>#{selectedOrder.order_number || (selectedOrder.id || selectedOrder._id).substring(0, 8)}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Client</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedOrder.buyer_email}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Montant total</Typography>
                <Typography sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1976d2' }}>
                  {selectedOrder.total_amount.toLocaleString('fr-FR')} XOF
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Articles</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedOrder.items_count || selectedOrder.items?.length || 0}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Statut</Typography>
                <Chip label={selectedOrder.status} size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Date</Typography>
                <Typography sx={{ fontWeight: 600 }}>{new Date(selectedOrder.created_at).toLocaleDateString('fr-FR')}</Typography>
              </Box>
              {selectedOrder.delivery_address && (
                <Box>
                  <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Adresse de livraison</Typography>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.9rem' }}>{selectedOrder.delivery_address}</Typography>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'status' && selectedOrder && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Changer le statut de la commande</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography sx={{ mb: 2, fontSize: '0.9rem', color: '#7f8c8d' }}>
              Commande #{selectedOrder.order_number}
            </Typography>
            <FormControl fullWidth>
              <InputLabel>Nouveau statut</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Nouveau statut"
              >
                {STATUS_OPTIONS.filter(s => s.value).map(s => (
                  <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button
              onClick={() => handleStatusChange(selectedOrder.id || selectedOrder._id, newStatus)}
              variant="contained"
              color="primary"
            >
              Mettre à jour
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'delete' && selectedOrder && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>Supprimer la commande</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Cette action est irréversible!</Alert>
            <Typography>Êtes-vous sûr de vouloir supprimer cette commande?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>
              #{selectedOrder.order_number}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button
              onClick={() => handleDelete(selectedOrder.id || selectedOrder._id)}
              variant="contained"
              color="error"
            >
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </AdminDashboardLayout>
  );
=======
"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrderRow from "./components/OrderRow"
import * as adminApi from "../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../utils/protectedRoute"

export default function AdminOrdersPage() {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  useEffect(() => {
    if (!isAdminUser) return

    let mounted = true
    setLoading(true)
    adminApi
      .listOrders()
      .then((data) => {
        if (!mounted) return
        // Handle both { orders: [...] } and [...] responses
        const orderList = data?.orders || data || []
        setOrders(Array.isArray(orderList) ? orderList : [])
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || "Failed to load orders")
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [isAdminUser])

  const removeOrUpdate = (orderId, updated) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o))
    )
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading orders…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>
  if (!orders || orders.length === 0) return <div style={{ padding: 20 }}>No pending orders.</div>

  return (
    <div>
      <h1>Pending Order Approvals</h1>
      <p>Review and approve/reject payment and shipping for pending orders.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Order ID</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Status</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Total</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onUpdate={(u) => removeOrUpdate(order._id, u)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
>>>>>>> f986b201f2e5007a8fb787a31ce149833f898f68
}
