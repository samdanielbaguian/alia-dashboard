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
  Search, Block, CheckCircle, Edit as EditIcon, Delete as DeleteIcon,
  Visibility, Badge as RoleIcon,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';
import { formatUserName } from '@/utils/nameFormatter';

const ROLE_OPTIONS = [
  { value: '', label: 'Tous les rôles' },
  { value: 'buyer', label: 'Acheteur' },
  { value: 'merchant', label: 'Marchand' },
  { value: 'admin', label: 'Admin' },
];

const PER_PAGE = 20;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [newRole, setNewRole] = useState('');

  const showSnack = (msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
    setTimeout(() => setSnack(s => ({ ...s, open: false })), 3000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: PER_PAGE,
        skip: (page - 1) * PER_PAGE,
        ...(roleFilter && { role_filter: roleFilter }),
        ...(search && { search }),
      });
      const data = await apiGet(`/admin/users?${params}`);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showSnack('Erreur lors du chargement des utilisateurs', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (userId) => {
    try {
      await apiPost(`/admin/users/${userId}/suspend`, { reason: 'Suspendu par admin' });
      showSnack('Utilisateur suspendu');
      fetchUsers();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la suspension', 'error');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await apiPost(`/admin/users/${userId}/activate`, {});
      showSnack('Utilisateur activé');
      fetchUsers();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de l\'activation', 'error');
    }
  };

  const handleChangeRole = async (userId) => {
    if (!newRole) return;
    try {
      await apiPatch(`/admin/users/${userId}/role?new_role=${newRole}`, {});
      showSnack('Rôle modifié');
      fetchUsers();
      setActionDialog({ open: false, type: null });
      setNewRole('');
    } catch (error) {
      showSnack('Erreur lors du changement de rôle', 'error');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await apiDelete(`/admin/users/${userId}`);
      showSnack('Utilisateur supprimé');
      fetchUsers();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la suppression', 'error');
    }
  };

  return (
    <AdminDashboardLayout title="Gestion des utilisateurs">
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b', mb: 0.5 }}>
          Utilisateurs ({total})
        </Typography>
        <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Gérez les comptes, les rôles et les permissions des utilisateurs.
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Rechercher par email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                size="small"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ fontSize: 18, color: '#7f8c8d' }} /></InputAdornment> }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                  label="Rôle"
                  sx={{ borderRadius: 2 }}
                >
                  {ROLE_OPTIONS.map(r => <MenuItem key={r.value} value={r.value}>{r.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => { setSearch(''); setRoleFilter(''); setPage(1); }}
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
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Nom</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Rôle</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Inscrit</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50', textAlign: 'right' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i}>
                  {[1, 2, 3, 4, 5, 6].map(j => <TableCell key={j}><Skeleton /></TableCell>)}
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id || user._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{formatUserName(user)}</TableCell>
                  <TableCell sx={{ fontWeight: 500, color: '#6b7280', fontSize: '0.9rem' }}>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      sx={{
                        bgcolor: user.role === 'admin' ? '#fec2e4' : user.role === 'merchant' ? '#c2d9ff' : '#d1fae5',
                        color: user.role === 'admin' ? '#be123c' : user.role === 'merchant' ? '#1e40af' : '#065f46',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.is_active ? 'Actif' : 'Inactif'}
                      size="small"
                      sx={{
                        bgcolor: user.is_active ? 'rgba(76,175,80,0.1)' : 'rgba(244,67,54,0.1)',
                        color: user.is_active ? '#2e7d32' : '#d32f2f',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title="Détails">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedUser(user); setActionDialog({ open: true, type: 'view' }); }}
                        sx={{ color: '#1976d2' }}
                      >
                        <Visibility sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.is_active ? 'Suspendre' : 'Activer'}>
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedUser(user); setActionDialog({ open: true, type: user.is_active ? 'suspend' : 'activate' }); }}
                        sx={{ color: user.is_active ? '#f59e0b' : '#4caf50' }}
                      >
                        {user.is_active ? <Block sx={{ fontSize: 18 }} /> : <CheckCircle sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedUser(user); setActionDialog({ open: true, type: 'delete' }); }}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4, color: '#b0b0b0' }}>
                  Aucun utilisateur trouvé
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
      {actionDialog.type === 'view' && selectedUser && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Détails de l'utilisateur</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Email</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Rôle</Typography>
                <Chip label={selectedUser.role} size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Statut</Typography>
                <Chip label={selectedUser.is_active ? 'Actif' : 'Inactif'} size="small" sx={{ fontWeight: 600 }} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Note de confiance</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedUser.good_rate || 50}%</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Inscrit</Typography>
                <Typography sx={{ fontWeight: 600 }}>{new Date(selectedUser.created_at).toLocaleDateString('fr-FR')}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'suspend' && selectedUser && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#f59e0b' }}>Suspendre l'utilisateur</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Êtes-vous sûr de vouloir suspendre cet utilisateur?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedUser.email}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleSuspend(selectedUser.id || selectedUser._id)} variant="contained" color="warning">
              Suspendre
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'activate' && selectedUser && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#4caf50' }}>Activer l'utilisateur</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Êtes-vous sûr de vouloir activer cet utilisateur?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedUser.email}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleActivate(selectedUser.id || selectedUser._id)} variant="contained" color="success">
              Activer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'delete' && selectedUser && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>Supprimer l'utilisateur</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Cette action est irréversible!</Alert>
            <Typography>Êtes-vous sûr de vouloir supprimer cet utilisateur?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedUser.email}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleDelete(selectedUser.id || selectedUser._id)} variant="contained" color="error">
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
}
