/**
 * Helper Utility Functions
 * Common utility functions for the application
 */

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: EUR)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Format date
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR').format(d);
}

/**
 * Format date and time
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date and time string
 */
export function formatDateTime(date) {
  const d = new Date(date);
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(d);
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Generate unique ID
 * @returns {string} - Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
