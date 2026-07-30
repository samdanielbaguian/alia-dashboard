'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Tooltip, Pagination,
  Dialog, DialogTitle, DialogContent, DialogActions, Alert, Snackbar,
  Skeleton, Rating, Input, FormHelperText,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Search, CheckCircle, Block, Edit as EditIcon, Delete as DeleteIcon,
  Visibility, Star as StarIcon, VerifiedUser, ErrorOutline, Add as AddIcon,
} from '@mui/icons-material';
import AdminDashboardLayout from '@/layout/AdminDashboardLayout';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/utils/api';
import { formatMerchantName, formatOwnerName } from '@/utils/nameFormatter';
import { COUNTRIES } from '@/utils/countries';
import { CloudUpload as UploadIcon } from '@mui/icons-material';

const STATUS_OPTIONS = [
  { value: '', label: 'Tous les statuts' },
  { value: 'verified', label: 'Vérifiés' },
  { value: 'unverified', label: 'Non vérifiés' },
  { value: 'pending', label: 'En attente' },
];

const PER_PAGE = 20;

const INITIAL_FORM_DATA = {
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  shop_name: '',
  description: '',
  age: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  logo: '',
  location: null, 
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 8;

export default function AdminMerchantsPage() {
  const [merchants, setMerchants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [actionDialog, setActionDialog] = useState({ open: false, type: null });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createFormData, setCreateFormData] = useState(INITIAL_FORM_DATA);
  const [createLoading, setCreateLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef(null);

  const showSnack = (msg, severity = 'success') => {
    setSnack({ open: true, msg, severity });
    setTimeout(() => setSnack(s => ({ ...s, open: false })), 3000);
  };

const fetchMerchants = useCallback(async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      limit: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
      ...(statusFilter && { verified_filter: statusFilter }),
      ...(search && { search }),
    });
    const data = await apiGet(`/admin/merchants?${params}`);
    const merchantsList = data.merchants || [];
    
    // Récupérer les notes pour chaque marchand
    const merchantsWithRatings = await Promise.all(
      merchantsList.map(async (m) => {
        try {
          const reviews = await apiGet(`/reviews/merchant/${m.id}`);
          const avgRating = reviews.reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.count || 1);
          return { ...m, avgRating: avgRating || 0 };
        } catch {
          return { ...m, avgRating: 0 };
        }
      })
    );
    
    setMerchants(merchantsWithRatings);
    setTotal(data.total || 0);
  } catch (error) {
    console.error('Failed to fetch merchants:', error);
    showSnack('Erreur lors du chargement des marchands', 'error');
  } finally {
    setLoading(false);
  }
}, [page, statusFilter, search]);

  useEffect(() => { fetchMerchants(); }, [fetchMerchants]);

  const handleVerify = async (merchantId) => {
    try {
      await apiPost(`/admin/merchants/${merchantId}/verify`, {});
      showSnack('Marchand vérifié');
      fetchMerchants();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la vérification', 'error');
    }
  };

  const handleDisable = async (merchantId) => {
    try {
      await apiPost(`/admin/merchants/${merchantId}/disable`, { reason: 'Désactivé par admin' });
      showSnack('Marchand désactivé');
      fetchMerchants();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la désactivation', 'error');
    }
  };

  const handleReject = async (merchantId) => {
    try {
      await apiPost(`/admin/merchants/${merchantId}/reject-verification`, { reason: 'Rejeté par admin' });
      showSnack('Marchand rejeté');
      fetchMerchants();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors du rejet', 'error');
    }
  };

  const handleDelete = async (merchantId) => {
    try {
      await apiDelete(`/admin/merchants/${merchantId}`);
      showSnack('Marchand supprimé');
      fetchMerchants();
      setActionDialog({ open: false, type: null });
    } catch (error) {
      showSnack('Erreur lors de la suppression', 'error');
    }
  };

  const validateCreateForm = () => {
    const errors = {};
    if (!createFormData.email) errors.email = 'Email requis';
    else if (!validateEmail(createFormData.email)) errors.email = 'Email invalide';
    if (!createFormData.password) errors.password = 'Mot de passe requis';
    else if (!validatePassword(createFormData.password)) errors.password = 'Au moins 8 caractères';
    if (!createFormData.first_name) errors.first_name = 'Prénom requis';
    if (!createFormData.shop_name) errors.shop_name = 'Nom de la boutique requis';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogoUpload = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiUpload('/uploads', formData);
    const logoUrl = response.url || response.data?.url || '';
    setCreateFormData(prev => ({ ...prev, logo: logoUrl }));
    setLogoPreview(logoUrl);
    showSnack('Logo uploadé avec succès', 'success');
  } catch (error) {
    showSnack('Erreur lors de l’upload du logo', 'error');
  }
};

  const handleCreateMerchant = async () => {
    if (!validateCreateForm()) return;
    
    setCreateLoading(true);
    try {
      const payload = {
        email: createFormData.email,
        password: createFormData.password,
        first_name: createFormData.first_name,
        last_name: createFormData.last_name,
        shop_name: createFormData.shop_name,
        description: createFormData.description || undefined,
        phone: createFormData.phone || undefined,
        address: createFormData.address || undefined,
        city: createFormData.city || undefined,
        country: createFormData.country || undefined,
        logo: createFormData.logo || undefined,
        location: createFormData.location || undefined,
      };
      
      const response = await apiPost('/admin/merchants', payload);
      showSnack(`Marchand "${payload.shop_name}" créé avec succès`);
      setOpenCreateDialog(false);
      setCreateFormData(INITIAL_FORM_DATA);
      setFormErrors({});
      fetchMerchants();
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Erreur lors de la création';
      showSnack(errorMsg, 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <AdminDashboardLayout title="Gestion des marchands">
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontWeight: 800, fontSize: '1.4rem', color: '#1e1b4b', mb: 0.5 }}>
            Marchands ({total})
          </Typography>
          <Typography sx={{ color: '#6b7280', fontSize: '0.9rem' }}>
            Vérifiez, gérez et modérez les marchands de la plateforme.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setOpenCreateDialog(true);
            setCreateFormData(INITIAL_FORM_DATA);
            setFormErrors({});
          }}
          sx={{
            bgcolor: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
            color: 'white',
            fontWeight: 700,
            textTransform: 'none',
            fontSize: '0.95rem',
            borderRadius: 2,
            px: 3,
            py: 1.2,
            '&:hover': { opacity: 0.95 }
          }}
        >
          Créer un marchand
        </Button>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 4 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Rechercher par nom ou email..."
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
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Nom du magasin</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Propriétaire</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Note</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#2c3e50' }}>Produits</TableCell>
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
            ) : merchants.length > 0 ? (
              merchants.map((m) => (
                <TableRow key={m.id || m._id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
                  <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{formatMerchantName(m)}</TableCell>
                  <TableCell sx={{ color: '#7f8c8d' }}>{formatOwnerName(m)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Rating value={m.rating || 0} readOnly size="small" />
                      <Typography sx={{ fontSize: '0.8rem', color: '#7f8c8d' }}>({m.rating || 0})</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={m.verified ? 'Vérifié' : m.is_active ? 'Actif' : 'Inactif'}
                      size="small"
                      icon={m.verified ? <VerifiedUser /> : undefined}
                      sx={{
                        bgcolor: m.verified ? '#d1fae5' : m.is_active ? '#dbeafe' : '#fee2e2',
                        color: m.verified ? '#065f46' : m.is_active ? '#1e40af' : '#991b1b',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#2c3e50' }}>{m.products_count || 0}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title="Détails">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedMerchant(m); setActionDialog({ open: true, type: 'view' }); }}
                        sx={{ color: '#1976d2' }}
                      >
                        <Visibility sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                    {!m.verified && (
                      <Tooltip title="Vérifier">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedMerchant(m); setActionDialog({ open: true, type: 'verify' }); }}
                          sx={{ color: '#4caf50' }}
                        >
                          <CheckCircle sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    {m.is_active && (
                      <Tooltip title="Désactiver">
                        <IconButton
                          size="small"
                          onClick={() => { setSelectedMerchant(m); setActionDialog({ open: true, type: 'disable' }); }}
                          sx={{ color: '#f59e0b' }}
                        >
                          <Block sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Supprimer">
                      <IconButton
                        size="small"
                        onClick={() => { setSelectedMerchant(m); setActionDialog({ open: true, type: 'delete' }); }}
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
                  Aucun marchand trouvé
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
      {actionDialog.type === 'view' && selectedMerchant && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800 }}>Détails du marchand</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Magasin</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedMerchant.store_name}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Propriétaire</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedMerchant.owner_name || 'N/A'}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Email</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedMerchant.email}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Note</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Rating value={selectedMerchant.rating || 0} readOnly />
                  <Typography sx={{ fontWeight: 600 }}>({selectedMerchant.rating_count || 0} avis)</Typography>
                </Box>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Produits</Typography>
                <Typography sx={{ fontWeight: 600 }}>{selectedMerchant.product_count || 0}</Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mb: 0.3 }}>Statut</Typography>
                <Chip
                  label={selectedMerchant.is_verified ? 'Vérifié' : 'Non vérifié'}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Fermer</Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'verify' && selectedMerchant && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#4caf50' }}>Vérifier le marchand</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Êtes-vous sûr de vouloir vérifier ce marchand?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedMerchant.store_name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleVerify(selectedMerchant.id || selectedMerchant._id)} variant="contained" color="success">
              Vérifier
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'disable' && selectedMerchant && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#f59e0b' }}>Désactiver le marchand</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Typography>Êtes-vous sûr de vouloir désactiver ce marchand?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedMerchant.store_name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleDisable(selectedMerchant.id || selectedMerchant._id)} variant="contained" color="warning">
              Désactiver
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {actionDialog.type === 'delete' && selectedMerchant && (
        <Dialog open={actionDialog.open} onClose={() => setActionDialog({ open: false, type: null })} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 800, color: '#ef4444' }}>Supprimer le marchand</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Alert severity="error" sx={{ mb: 2 }}>Cette action est irréversible!</Alert>
            <Typography>Êtes-vous sûr de vouloir supprimer ce marchand?</Typography>
            <Typography sx={{ fontSize: '0.9rem', color: '#7f8c8d', mt: 1 }}>{selectedMerchant.store_name}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialog({ open: false, type: null })}>Annuler</Button>
            <Button onClick={() => handleDelete(selectedMerchant.id || selectedMerchant._id)} variant="contained" color="error">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Create Merchant Dialog */}
      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, bgcolor: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)', color: 'white' }}>
          Créer un nouveau marchand
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={createFormData.email}
                onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                error={!!formErrors.email}
                helperText={formErrors.email}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={createFormData.password}
                onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                error={!!formErrors.password}
                helperText={formErrors.password || 'Au moins 8 caractères'}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Prénom"
                value={createFormData.first_name}
                onChange={(e) => setCreateFormData({ ...createFormData, first_name: e.target.value })}
                error={!!formErrors.first_name}
                helperText={formErrors.first_name}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Nom"
                value={createFormData.last_name}
                onChange={(e) => setCreateFormData({ ...createFormData, last_name: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nom de la boutique"
                value={createFormData.shop_name}
                onChange={(e) => setCreateFormData({ ...createFormData, shop_name: e.target.value })}
                error={!!formErrors.shop_name}
                helperText={formErrors.shop_name}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Description (optionnel)"
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                multiline
                rows={3}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Téléphone"
                value={createFormData.phone}
                onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                helperText="Format recommandé : +225XXXXXXXXXX"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Adresse (rue)"
                value={createFormData.address}
                onChange={(e) => setCreateFormData({ ...createFormData, address: e.target.value })}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Ville"
                value={createFormData.city}
                onChange={(e) => setCreateFormData({ ...createFormData, city: e.target.value })}
                size="small"
              />
            </Grid>
            <FormControl fullWidth size="small">
              <InputLabel id="pays-label">Pays</InputLabel>
              <Select
                labelId="pays-label"
                value={createFormData.country || ''}
                onChange={(e) => setCreateFormData({ ...createFormData, country: e.target.value })}
                label="Pays"
              >
                <MenuItem value="">Sélectionner un pays</MenuItem>
                {COUNTRIES.map((pays) => (
                  <MenuItem key={pays} value={pays}>{pays}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid size={{ xs: 12 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choisir un logo
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLogoFile(file);
                      handleLogoUpload(file);
                    }
                    e.target.value = '';
                  }}
                />
                {logoPreview && (
                  <Box sx={{ width: 60, height: 60, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                    <img src={logoPreview} alt="Logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Box>
                )}
                {createFormData.logo && !logoPreview && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ✓ Logo enregistré
                  </Typography>
                )}
              </Box>
              <FormHelperText sx={{ mt: 0.5, color: 'text.secondary' }}>
                Formats autorisés : JPG, PNG, WEBP (max 5 Mo)
              </FormHelperText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCreateDialog(false)}>Annuler</Button>
          <Button
            onClick={handleCreateMerchant}
            variant="contained"
            disabled={createLoading}
            sx={{
              bgcolor: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
              color: 'white'
            }}
          >
            {createLoading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </AdminDashboardLayout>
  );
}
