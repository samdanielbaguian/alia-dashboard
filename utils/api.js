/**
 * API Utility Functions
 * Handles API calls to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

function getAuthHeaders() {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  } catch (e) {
    // noop
  }
  return {};
}

/**
 * Generic API fetch wrapper
 * @param {string} endpoint - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise} - API response
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}

/**
 * Upload files (multipart/form-data) to the uploads endpoint.
 * Expects server route POST /uploads that returns { urls: [..] }
 */
export async function apiUploadFiles(files = []) {
  const url = `${API_BASE_URL}/uploads`;
  try {
    const form = new FormData();
    files.forEach((f) => form.append('files', f));

    const headers = {
      ...getAuthHeaders(),
      // Do not set Content-Type so browser sets the multipart boundary
    };

    const res = await fetch(url, { method: 'POST', headers, body: form });
    if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('File upload failed', err);
    throw err;
  }
}
