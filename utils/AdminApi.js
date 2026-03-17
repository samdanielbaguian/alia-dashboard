// Small helper wrappers for admin endpoints.
// Uses `localStorage` token and `NEXT_PUBLIC_API_URL` env var.

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

function getAuthHeaders() {
  const token = (typeof window !== "undefined" && localStorage.getItem("access_token")) || null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function handleResponse(res) {
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch (e) {
    throw new Error("Invalid JSON response")
  }
  if (!res.ok) {
    const message = data?.detail || data?.message || JSON.stringify(data) || `HTTP ${res.status}`
    throw new Error(message)
  }
  return data
}

// ============================================
// ORDER MANAGEMENT
// ============================================

export async function listOrders() {
  const res = await fetch(`${API_BASE}/admin/orders`, { headers: { ...getAuthHeaders() } })
  return handleResponse(res)
}

export async function approvePayment(orderId) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/approve-payment`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  })
  return handleResponse(res)
}

export async function rejectPayment(orderId, reason) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/reject-payment`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  })
  return handleResponse(res)
}

export async function approveShipping(orderId) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/approve-shipping`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
  })
  return handleResponse(res)
}

export async function rejectShipping(orderId, reason) {
  const res = await fetch(`${API_BASE}/admin/orders/${orderId}/reject-shipping`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  })
  return handleResponse(res)
}

// ============================================
// USER MANAGEMENT
// ============================================

export async function listUsers(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/admin/users${query ? `?${query}` : ""}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function getUser(userId) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function updateUser(userId, data) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function suspendUser(userId, isSuspended, reason = null) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/suspend`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ is_suspended: isSuspended, reason }),
  })
  return handleResponse(res)
}

export async function banUser(userId, isBanned, reason = null) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/ban`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ is_banned: isBanned, reason }),
  })
  return handleResponse(res)
}

export async function resetUserPassword(userId, newPassword) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/reset-password`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ new_password: newPassword }),
  })
  return handleResponse(res)
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function getUserActivity(userId, limit = 50) {
  const res = await fetch(`${API_BASE}/admin/users/${userId}/activity?limit=${limit}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export async function listProducts(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/admin/products${query ? `?${query}` : ""}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function listPendingProducts(skip = 0, limit = 50) {
  const res = await fetch(`${API_BASE}/admin/products/pending?skip=${skip}&limit=${limit}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function getProduct(productId) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function approveProduct(productId, isApproved, reason = null) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}/approve`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ is_approved: isApproved, reason }),
  })
  return handleResponse(res)
}

export async function updateProduct(productId, data) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function deleteProduct(productId, reason = null) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}${reason ? `?reason=${encodeURIComponent(reason)}` : ""}`, {
    method: "DELETE",
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function bulkApproveProducts(productIds, isApproved, reason = null) {
  const res = await fetch(`${API_BASE}/admin/products/bulk/approve`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ product_ids: productIds, is_approved: isApproved, reason }),
  })
  return handleResponse(res)
}

export async function bulkDeleteProducts(productIds, reason = null) {
  const res = await fetch(`${API_BASE}/admin/products/bulk/delete`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(productIds),
    ...(reason && { body: JSON.stringify({ reason }) }),
  })
  return handleResponse(res)
}

export async function getProductsStats() {
  const res = await fetch(`${API_BASE}/admin/products/stats/overview`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

// ============================================
// MERCHANT MANAGEMENT
// ============================================

export async function listMerchants(params = {}) {
  const query = new URLSearchParams(params).toString()
  const res = await fetch(`${API_BASE}/admin/merchants${query ? `?${query}` : ""}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function listPendingMerchants(skip = 0, limit = 50) {
  const res = await fetch(`${API_BASE}/admin/merchants/pending?skip=${skip}&limit=${limit}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function getMerchant(merchantId) {
  const res = await fetch(`${API_BASE}/admin/merchants/${merchantId}`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}

export async function verifyMerchant(merchantId, isVerified, reason = null) {
  const res = await fetch(`${API_BASE}/admin/merchants/${merchantId}/verify`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ is_verified: isVerified, reason }),
  })
  return handleResponse(res)
}

export async function suspendMerchant(merchantId, isSuspended, reason = null) {
  const res = await fetch(`${API_BASE}/admin/merchants/${merchantId}/suspend`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ is_suspended: isSuspended, reason }),
  })
  return handleResponse(res)
}

export async function updateMerchant(merchantId, data) {
  const res = await fetch(`${API_BASE}/admin/merchants/${merchantId}`, {
    method: "PUT",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return handleResponse(res)
}

export async function setMerchantCommission(merchantId, commissionRate) {
  const res = await fetch(`${API_BASE}/admin/merchants/${merchantId}/commission`, {
    method: "POST",
    headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ commission_rate: commissionRate }),
  })
  return handleResponse(res)
}

export async function getMerchantsStats() {
  const res = await fetch(`${API_BASE}/admin/merchants/stats/overview`, {
    headers: { ...getAuthHeaders() },
  })
  return handleResponse(res)
}
