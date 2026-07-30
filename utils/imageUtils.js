const rawBackend = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = rawBackend.replace(/\/+$|\/api$/, '');

export const normalizeImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const value = url.trim();
  if (!value) return '';

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('//')) {
    if (typeof window !== 'undefined') {
      return `${window.location.protocol}${value}`;
    }
    return `https:${value}`;
  }

  if (value.startsWith('/api/uploads')) {
    return `${API_BASE_URL}${value.replace(/^\/api/, '')}`;
  }

  if (value.startsWith('/uploads')) {
    return `${API_BASE_URL}${value}`;
  }

  if (value.startsWith('uploads/')) {
    return `${API_BASE_URL}/${value}`;
  }

  return `${API_BASE_URL}/${value}`;
};

export const getProductImageUrl = (product, placeholder = '/placeholder.svg') => {
  if (!product || typeof product !== 'object') return placeholder;

  const candidate = product.images?.[0] || product.image_url || product.image || product.logo || product.thumbnail || '';
  const url = normalizeImageUrl(candidate);
  return url || placeholder;
};
