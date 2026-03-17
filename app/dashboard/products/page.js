"use client";

import { useEffect, useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack, IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import DataTable from '@/components/tables/DataTable';
import { apiGet, apiUploadFiles } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const router = useRouter();

  function openCreate() {
    setEditing(null);
    setOpenForm(true);
  }

  function openEdit(p) {
    setEditing(p);
    setOpenForm(true);
  }

  function closeForm() {
    setEditing(null);
    setOpenForm(false);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const me = await apiGet('/auth/me');
        const all = await apiGet('/products?limit=200');
        const mine = all.filter((p) => p.merchant_id === String(me.id));
        if (mounted) setProducts(mine);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const me = await apiGet('/auth/me');
      const all = await apiGet('/products?limit=200');
      const mine = all.filter((p) => p.merchant_id === String(me.id));
      setProducts(mine);
    } catch (err) {
      console.error('Failed to refresh products', err);
    } finally {
      setLoading(false);
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'title', headerName: 'Title' },
    { field: 'category', headerName: 'Category' },
    { field: 'price', headerName: 'Price', type: 'currency' },
    { field: 'stock', headerName: 'Stock', type: 'number' },
    { field: 'actions', headerName: 'Actions' }
  ];

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>Products</Typography>

        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h6">{loading ? 'Loading products...' : `Your Products (${products.length})`}</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={() => setQuickOpen((s) => !s)}>Quick Create</Button>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => router.push('/dashboard/products/create')}>Create Product</Button>
          </Stack>
        </Stack>

        {quickOpen && (
          <Box sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <QuickCreate onCreated={async (p) => { setProducts((prev) => [p, ...prev]); setQuickOpen(false); }} onCancel={() => setQuickOpen(false)} />
          </Box>
        )}

        <DataTable
          title={null}
          columns={columns}
          data={products}
          renderCell={(row, column) => {
            if (column.field === 'title') {
              return (
                <a href={`/dashboard/products/${row.id}`}>{row.title}</a>
              );
            }

            if (column.field === 'actions') {
              return (
                <Stack direction="row" spacing={1}>
                  <IconButton size="small" onClick={() => openEdit(row)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={async () => { if (confirm('Delete this product?')) { await handleDelete(row.id, setProducts); } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              );
            }
            return null;
          }}
        />

        <Dialog open={openForm} onClose={closeForm} fullWidth maxWidth="sm">
          <DialogTitle>{editing ? 'Edit Product' : 'Create Product'}</DialogTitle>
          <DialogContent>
            <ProductForm initial={editing} onSaved={async () => { await fetchProducts(); closeForm(); }} onCancel={closeForm} />
          </DialogContent>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
}


function QuickCreate({ onCreated, onCancel }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]); // File objects
  const [saving, setSaving] = useState(false);

  function validateFile(file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) return 'Only images allowed';
    if (file.size > maxSize) return 'Image must be < 2MB';
    return null;
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const err = validateFile(file);
      if (err) { alert(err); continue; }
      if (images.length + 1 > 3) { alert('Maximum 3 images for quick create'); break; }
      setImages((prev) => [...prev, file]);
    }
    e.target.value = '';
  }

  function autoSku() {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${slug || 'prod'}-${Date.now().toString().slice(-5)}`;
  }

  async function handleCreate() {
    if (!title || !price) { alert('Title and price required'); return; }
    setSaving(true);
    try {
      let urls = [];
      if (images.length > 0) {
        const res = await apiUploadFiles(images);
        urls = res.urls || [];
      }
      const payload = { title, description: '', price: Number(price), stock: Number(stock), category, sku: autoSku(), images: urls };
      const created = await apiPost('/products', payload);
      if (onCreated) onCreated(created);
    } catch (err) {
      console.error('Quick create failed', err);
      alert('Failed to create product');
    } finally { setSaving(false); }
  }

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <TextField placeholder="Product title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ minWidth: 240 }} />
        <TextField placeholder="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ width: 120 }} />
        <TextField placeholder="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} sx={{ width: 120 }} />
        <TextField placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ width: 200 }} />
        <input type="file" accept="image/*" multiple onChange={handleFileChange} />
        <Button variant="contained" onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create'}</Button>
        <Button onClick={onCancel}>Cancel</Button>
      </Stack>
      {images.length > 0 && (
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {images.map((file, i) => (
            <img key={i} src={URL.createObjectURL(file)} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
          ))}
        </Stack>
      )}
    </Box>
  );
}


function ProductForm({ initial, onSaved, onCancel }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [price, setPrice] = useState(initial?.price || 0);
  const [stock, setStock] = useState(initial?.stock || 0);
  const [category, setCategory] = useState(initial?.category || '');
  const [sku, setSku] = useState(initial?.sku || '');
  const [images, setImages] = useState(initial?.images || []); // can contain existing URL strings and new File objects
  const [saving, setSaving] = useState(false);

  function validateFile(file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) return 'Only image files are allowed';
    if (file.size > maxSize) return 'Each image must be less than 2MB';
    return null;
  }

  function handleRemoveImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const err = validateFile(file);
      if (err) { alert(err); continue; }
      // enforce 3 images total
      const currentCount = images.filter((i) => typeof i === 'string').length + images.filter((i) => typeof i !== 'string').length;
      if (currentCount + 1 > 3) { alert('Maximum 3 images allowed'); break; }
      setImages((prev) => [...prev, file]);
    }
    e.target.value = '';
  }

  async function handleSave() {
    setSaving(true);
    try {
      // Separate existing image URLs and newly added File objects
      const existing = images.filter((i) => typeof i === 'string');
      const newFiles = images.filter((i) => typeof i !== 'string');
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        const res = await apiUploadFiles(newFiles);
        uploadedUrls = res.urls || [];
      }
      const finalImages = [...existing, ...uploadedUrls];
      if (finalImages.length > 3) { alert('Maximum 3 images allowed'); setSaving(false); return; }

      const payload = { title, description, price: Number(price), stock: Number(stock), category, sku, images: finalImages };
      if (initial && initial.id) {
        await apiPut(`/products/${initial.id}`, payload);
      } else {
        await apiPost('/products', payload);
      }
      if (onSaved) await onSaved();
    } catch (err) {
      console.error('Save product failed', err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box component="form" sx={{ mt: 1 }}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
        <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
        <Stack direction="row" spacing={2}>
          <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
          <TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
        </Stack>
        <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
        <Box>
          <input type="file" accept="image/*" multiple onChange={handleFileChange} />
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            {images.map((img, idx) => (
              <Box key={idx} sx={{ position: 'relative' }}>
                <img src={img} alt={`img-${idx}`} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
                <IconButton size="small" onClick={() => handleRemoveImage(idx)} sx={{ position: 'absolute', top: 0, right: 0 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
      <DialogActions sx={{ px: 0, pt: 2 }}>
        <Button onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
      </DialogActions>
    </Box>
  );
}

async function apiPost(endpoint, data) {
  return await (await import('@/utils/api')).apiPost(endpoint, data);
}

async function apiPut(endpoint, data) {
  return await (await import('@/utils/api')).apiPut(endpoint, data);
}

async function apiDelete(endpoint) {
  return await (await import('@/utils/api')).apiDelete(endpoint);
}

async function handleDelete(id, setProducts) {
  try {
    await apiDelete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  } catch (err) {
    console.error('Delete failed', err);
    alert('Failed to delete product');
  }
}
