/**
 * Authentication Utilities
 * Helpers for authentication and role checks
 */

/**
 * Get the current user from localStorage
 * @returns {object|null} - User object or null if not logged in
 */
export function getCurrentUser() {
  try {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
    return null;
  }
}

/**
 * Check if current user is an admin
 * @returns {boolean}
 */
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Check if current user has a specific role
 * @param {string} role - Role to check for
 * @returns {boolean}
 */
export function hasRole(role) {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Get auth token from localStorage
 * @returns {string|null}
 */
export function getAuthToken() {
  try {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  } catch (e) {
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return Boolean(getAuthToken());
}
