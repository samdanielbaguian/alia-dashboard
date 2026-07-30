"use client";

import { useState } from 'react';
import { Box, Typography, TextField, Stack, Button, IconButton, Paper } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import DashboardLayout from '@/layout/DashboardLayout';
import { apiUploadFiles, apiPost } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('');
  const [productImages, setProductImages] = useState([]); // File objects
  const [variants, setVariants] = useState([]); // { name, sku, images: File[] }
  const [saving, setSaving] = useState(false);

  function validateFile(file) {
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (!file.type.startsWith('image/')) return 'Only images are allowed';
    if (file.size > maxSize) return 'Image must be < 2MB';
    return null;
  }

  function handleProductFiles(e) {
    const files = Array.from(e.target.files || []);
    for (const f of files) {
      const err = validateFile(f);
      if (err) { alert(err); continue; }
      if (productImages.length + 1 > 3 && variants.length === 0) { alert('Maximum 3 images for a product without color variants'); break; }
      setProductImages((p) => [...p, f]);
    }
    e.target.value = '';
  }

  function addVariant() {
    setVariants((v) => [...v, { name: '', sku: '', images: [] }]);
  }

  function removeVariant(idx) {
    setVariants((v) => v.filter((_, i) => i !== idx));
  }

  function handleVariantFileChange(idx, e) {
    const files = Array.from(e.target.files || []);
    setVariants((prev) => {
      const copy = [...prev];
      for (const f of files) {
        const err = validateFile(f);
        if (err) { alert(err); continue; }
        if ((copy[idx].images?.length || 0) + 1 > 3) { alert('Max 3 images per color variant'); break; }
        copy[idx].images = [...(copy[idx].images || []), f];
      }
      return copy;
    });
    e.target.value = '';
  }

  function removeProductImage(i) { setProductImages((p) => p.filter((_, idx) => idx !== i)); }
  function removeVariantImage(vi, i) { setVariants((v) => { const c = [...v]; c[vi].images = c[vi].images.filter((_, idx) => idx !== i); return c; }); }

  function autoSkuFromTitle() {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return `${slug || 'prod'}-${Date.now().toString().slice(-5)}`;
  }

  async function handleSubmit() {
    if (!title || !price) { alert('Title and price are required'); return; }
    setSaving(true);
    try {
      // If there are variants, create one product per variant
      if (variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const v = variants[i];
          const vsku = v.sku || `${sku || autoSkuFromTitle()}-${v.name.replace(/\s+/g, '-').toLowerCase()}`;
          let urls = [];
          if (v.images && v.images.length > 0) {
            const res = await apiUploadFiles(v.images);
            urls = res.urls || [];
          }
          const payload = {
            title: `${title} - ${v.name}`,
            description,
            price: Number(price),
            images: urls,
            stock: Number(stock),
            category,
            sku: vsku,
            color: v.name
          };
          await apiPost('/products', payload);
        }
      } else {
        // Single product (no variants)
        if (productImages.length > 3) { alert('Maximum 3 images allowed'); setSaving(false); return; }
        let urls = [];
        if (productImages.length > 0) {
          const res = await apiUploadFiles(productImages);
          urls = res.urls || [];
        }
        const payload = {
          title,
          description,
          price: Number(price),
          images: urls,
          stock: Number(stock),
          category,
          sku: sku || autoSkuFromTitle()
        };
        await apiPost('/products', payload);
      }
      router.push('/dashboard/products');
    } catch (err) {
      console.error('Create failed', err);
      alert('Failed to create product');
    } finally { setSaving(false); }
  }

  return (
    <DashboardLayout>
      <Box sx={{ maxWidth: 960, mx: 'auto', p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Create Product</Typography>
        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField label="SKU" value={sku} onChange={(e) => setSku(e.target.value)} sx={{ width: 300 }} />
              <Button onClick={() => setSku(autoSkuFromTitle())}>Auto SKU</Button>
              <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} sx={{ flex: 1 }} />
            </Stack>
            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} fullWidth />
            <Stack direction="row" spacing={2}>
              <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} sx={{ width: 160 }} />
              <TextField label="Stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} sx={{ width: 160 }} />
            </Stack>

            <Box>
              <Typography variant="subtitle1">Product Images (max 3 if no color variants)</Typography>
              <input type="file" accept="image/*" multiple onChange={handleProductFiles} />
              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                {productImages.map((f, i) => (
                  <Box key={i} sx={{ position: 'relative' }}>
                    <img src={URL.createObjectURL(f)} alt={`p-${i}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                    <IconButton size="small" onClick={() => removeProductImage(i)} sx={{ position: 'absolute', top: 4, right: 4 }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Color Variants (optional) — each color can have up to 3 images</Typography>
                <Button startIcon={<AddIcon />} onClick={addVariant}>Add Color Variant</Button>
              </Stack>

              <Stack spacing={2} sx={{ mt: 1 }}>
                {variants.map((v, idx) => (
                  <Paper key={idx} sx={{ p: 2 }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField label="Color name" value={v.name} onChange={(e) => setVariants((prev) => { const c = [...prev]; c[idx].name = e.target.value; return c; })} />
                        <TextField label="Variant SKU" value={v.sku} onChange={(e) => setVariants((prev) => { const c = [...prev]; c[idx].sku = e.target.value; return c; })} />
                        <Button color="error" startIcon={<DeleteIcon />} onClick={() => removeVariant(idx)}>Remove</Button>
                      </Stack>
                      <Box>
                        <input type="file" accept="image/*" multiple onChange={(e) => handleVariantFileChange(idx, e)} />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                          {(v.images || []).map((f, i) => (
                            <Box key={i} sx={{ position: 'relative' }}>
                              <img src={URL.createObjectURL(f)} alt={`v-${i}`} style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 6 }} />
                              <IconButton size="small" onClick={() => removeVariantImage(idx, i)} sx={{ position: 'absolute', top: 4, right: 4 }}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={() => router.push('/dashboard/products')}>Cancel</Button>
              <Button variant="contained" onClick={handleSubmit} disabled={saving}>{saving ? 'Creating...' : 'Create Product'}</Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
