const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

export const getAuthUser = () => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('authUser');
  return user ? JSON.parse(user) : null;
};

export const setAuthUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authUser', JSON.stringify(user));
};

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized - redirecting to login');
    }
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
}

export async function apiGet(endpoint) {
  return apiRequest(endpoint, { method: 'GET' });
}

export async function apiPost(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiPut(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiPatch(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function apiDelete(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' });
}
