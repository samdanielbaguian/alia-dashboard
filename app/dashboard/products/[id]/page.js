"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, TextField, Stack, IconButton } from '@mui/material';
import { ArrowBack as BackIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { apiGet, apiPut, apiDelete } from '@/utils/api';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const p = await apiGet(`/products/${id}`);
        if (mounted) {
          setProduct(p);
          setTitle(p.title || '');
          setDescription(p.description || '');
          setPrice(p.price || 0);
          setStock(p.stock || 0);
          setImages(p.images || []);
        }
      } catch (err) {
        console.error('Failed to load product', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}><Typography>Loading...</Typography></Box>
    </DashboardLayout>
  );

  if (!product) return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}><Typography>Product not found</Typography></Box>
    </DashboardLayout>
  );

  async function handleSave() {
    setSaving(true);
    try {
      const payload = { title, description, price: Number(price), stock: Number(stock), images };
      const updated = await apiPut(`/products/${id}`, payload);
      setProduct(updated);
      setEditing(false);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save product');
    } finally {
      setSaving(false);
    }
  }

  function validateFile(file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) return 'Only image files are allowed';
    if (file.size > maxSize) return 'Each image must be less than 2MB';
    return null;
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const err = validateFile(file);
      if (err) { alert(err); continue; }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (result) setImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }

  function handleRemoveImage(idx) {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleDeleteProduct() {
    if (!confirm('Delete this product?')) return;
    try {
      await apiDelete(`/products/${id}`);
      router.push('/dashboard/products');
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button startIcon={<BackIcon />} onClick={() => router.push('/dashboard/products')}>Back to products</Button>
          {!editing && (
            <Button startIcon={<EditIcon />} onClick={() => setEditing(true)} variant="outlined">Edit</Button>
          )}
          {editing && (
            <>
              <Button color="error" startIcon={<DeleteIcon />} onClick={handleDeleteProduct}>Delete</Button>
              <Button variant="contained" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
              <Button onClick={() => { setEditing(false); /* revert fields */ setTitle(product.title); setDescription(product.description); setPrice(product.price); setStock(product.stock); setImages(product.images || []); }}>Cancel</Button>
            </>
          )}
        </Stack>

        <Typography variant="h4" sx={{ mt: 2, mb: 2 }}>{editing ? 'Edit Product' : product.title}</Typography>

        <Stack direction="row" spacing={2}>
          <Box sx={{ width: 320 }}>
            {images && images.map((img, i) => (
              <Box key={i} sx={{ position: 'relative', mb: 1 }}>
                <img src={img} alt={`img-${i}`} style={{ width: '100%', borderRadius: 6 }} />
                {editing && (
                  <IconButton size="small" onClick={() => handleRemoveImage(i)} sx={{ position: 'absolute', top: 6, right: 6 }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ))}
            {editing && (
              <Box sx={{ mt: 1 }}>
                <input type="file" accept="image/*" multiple onChange={handleFileChange} />
              </Box>
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {editing ? (
              <Stack spacing={2}>
                <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={6} />
              </Stack>
            ) : (
              <>
                <Typography variant="subtitle1">Price: {product.price}</Typography>
                <Typography variant="subtitle1">Stock: {product.stock}</Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>{product.description}</Typography>
              </>
            )}
          </Box>
        </Stack>
      </Box>
    </DashboardLayout>
  );
}
