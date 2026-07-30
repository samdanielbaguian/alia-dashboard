const rawApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = rawApiBase
  ? rawApiBase.replace(/\/+$|\/api$/, '') + '/api'
  : '/api';

function buildApiUrl(endpoint) {
  const normalizedEndpoint = endpoint.startsWith('/api')
    ? endpoint.slice(4)
    : endpoint;

  const path = normalizedEndpoint.startsWith('/')
    ? normalizedEndpoint
    : `/${normalizedEndpoint}`;

  return `${API_BASE_URL}${path}`;
}

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
  const url = buildApiUrl(endpoint);
  const token = getAuthToken();
  
  const headers = {
    ...options.headers,
  };

  if (options.body != null && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const defaultOptions = {
    ...options,
    headers,
  };

  try {
    // Diagnostic log: URL and options to help debug "Failed to fetch" errors
        try {
      if (typeof window !== 'undefined') {
        // Log minimal info to browser console
        console.debug('[apiRequest] Request ->', {
          method: defaultOptions.method || 'GET',
          url,
          headers: headers,
        });
      }
    } catch (logErr) {
      // ignore logging errors
    }

    const response = await fetch(url, defaultOptions);

    // Debug response status
    try {
      if (typeof window !== 'undefined') console.debug('[apiRequest] Response status', response.status, url);
    } catch {}

    if (response.status === 401) {
      removeAuthToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized - redirecting to login');
    }

    if (!response.ok) {
      // Try to extract error body
      let errBody = null;
      try { errBody = await response.json(); } catch (e) { try { errBody = await response.text(); } catch {} }
      throw new Error(`API Error: ${response.status} ${errBody ? JSON.stringify(errBody) : ''}`);
    }

    // Try to parse JSON, fallback to text or null
    try {
      const data = await response.json();
      return data;
    } catch (jsonErr) {
      try {
        const text = await response.text();
        return text;
      } catch (tErr) {
        return null;
      }
    }
  } catch (error) {
    // Verbose diagnostic logging (friendly for browser console)
        try {
      if (typeof window !== 'undefined') {
        console.error(
          `[apiRequest] API Request failed: ${error?.message || String(error)} | url=${url}`,
          {
            error,
            url,
            method: defaultOptions?.method || 'GET',
            headers,
            bodyPreview:
              typeof defaultOptions?.body === 'string'
                ? defaultOptions.body.slice(0, 200)
                : defaultOptions?.body instanceof FormData
                ? 'FormData'
                : String(defaultOptions?.body),
            online: typeof window !== 'undefined' ? window.navigator.onLine : null,
          }
        );
      } else {
        // server-side logging
        console.error('[apiRequest] API Request failed (server):', error, url);
      }
    } catch (logErr) {
      // ignore logging errors
    }

    // If offline, give a specific message
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      throw new Error(`Network error: offline when requesting ${url}`);
    }

    throw new Error(`API Request failed for ${url}: ${error?.message || String(error)}`);
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

export async function apiUpload(endpoint, formData) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: formData,
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
