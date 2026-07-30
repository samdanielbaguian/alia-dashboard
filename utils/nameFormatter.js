/**
 * Utility functions for consistent name formatting across the application
 */

/**
 * Format user display name with proper fallback chain
 * @param {object} user - User object with first_name, last_name, email
 * @returns {string} Formatted name or fallback
 */
export function formatUserName(user) {
  if (!user) return 'Non renseigné';
  
  const firstName = user.first_name?.trim() || '';
  const lastName = user.last_name?.trim() || '';
  
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  }
  
  return user.email || 'Non renseigné';
}

/**
 * Format merchant display name (shop_name)
 * @param {object} merchant - Merchant object with shop_name
 * @returns {string} Shop name or fallback
 */
export function formatMerchantName(merchant) {
  if (!merchant) return 'Non renseigné';
  return merchant.shop_name?.trim() || merchant.owner_name?.trim() || 'Non renseigné';
}

/**
 * Format merchant owner name with proper fallback
 * @param {object} merchant - Merchant object with first_name, last_name or owner_name
 * @returns {string} Owner name or fallback
 */
export function formatOwnerName(merchant) {
  if (!merchant) return 'Non renseigné';
  
  // If owner_name is already computed, use it
  if (merchant.owner_name?.trim()) {
    return merchant.owner_name.trim();
  }
  
  // Build from first/last name
  const firstName = merchant.first_name?.trim() || '';
  const lastName = merchant.last_name?.trim() || '';
  
  if (firstName || lastName) {
    return [firstName, lastName].filter(Boolean).join(' ').trim();
  }
  
  return merchant.email || 'Non renseigné';
}

/**
 * Get user initials for avatar
 * @param {object} user - User object with first_name, last_name, email
 * @returns {string} Two-character initials
 */
export function getUserInitials(user) {
  if (!user) return 'U';
  
  const firstName = user.first_name?.trim() || '';
  const lastName = user.last_name?.trim() || '';
  const email = user.email || '';
  
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  
  if (lastName) {
    return lastName[0].toUpperCase();
  }
  
  return email[0]?.toUpperCase() || 'U';
}

/**
 * Get merchant initials for avatar
 * @param {object} merchant - Merchant object with shop_name, first_name, last_name, email
 * @returns {string} Two-character initials
 */
export function getMerchantInitials(merchant) {
  if (!merchant) return 'M';
  
  const shopName = merchant.shop_name?.trim() || '';
  const firstName = merchant.first_name?.trim() || '';
  const lastName = merchant.last_name?.trim() || '';
  const email = merchant.email || '';
  
  if (shopName) {
    return shopName[0].toUpperCase();
  }
  
  if (firstName && lastName) {
    return (firstName[0] + lastName[0]).toUpperCase();
  }
  
  if (firstName) {
    return firstName[0].toUpperCase();
  }
  
  return email[0]?.toUpperCase() || 'M';
}
