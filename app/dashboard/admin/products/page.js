"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as adminApi from "../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../utils/protectedRoute"

export default function AdminProductsPage() {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: "pending", search: "" })
  const [actionLoading, setActionLoading] = useState({})
  const [selectedProducts, setSelectedProducts] = useState(new Set())
  
  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  useEffect(() => {
    if (isAdminUser) {
      fetchProducts()
      fetchStats()
    }
  }, [isAdminUser, filters])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.status === "pending") {
        const data = await adminApi.listPendingProducts()
        setProducts(data?.products || [])
      } else {
        if (filters.status && filters.status !== "all") {
          params.is_approved = filters.status === "approved"
        }
        if (filters.search) params.search = filters.search
        const data = await adminApi.listProducts(params)
        setProducts(data?.products || [])
      }
    } catch (err) {
      setError(err?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await adminApi.getProductsStats()
      setStats(data)
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }

  const handleApprove = async (productId, isApproved) => {
    const reason = !isApproved ? prompt("Enter rejection reason:") : null
    if (!isApproved && !reason) return
    
    setActionLoading(prev => ({ ...prev, [productId]: true }))
    try {
      await adminApi.approveProduct(productId, isApproved, reason)
      await fetchProducts()
      await fetchStats()
      alert(`Product ${isApproved ? "approved" : "rejected"} successfully`)
    } catch (err) {
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return
    
    setActionLoading(prev => ({ ...prev, [productId]: true }))
    try {
      await adminApi.deleteProduct(productId)
      await fetchProducts()
      await fetchStats()
      alert("Product deleted successfully")
    } catch (err) {
      alert(err?.message || "Delete failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleBulkApprove = async () => {
    if (selectedProducts.size === 0) {
      alert("No products selected")
      return
    }
    
    if (!confirm(`Approve ${selectedProducts.size} selected products?`)) return
    
    try {
      await adminApi.bulkApproveProducts(Array.from(selectedProducts))
      await fetchProducts()
      await fetchStats()
      setSelectedProducts(new Set())
      alert("Products approved successfully")
    } catch (err) {
      alert(err?.message || "Bulk approve failed")
    }
  }

  const handleBulkDelete = async () => {
    if (selectedProducts.size === 0) {
      alert("No products selected")
      return
    }
    
    if (!confirm(`Delete ${selectedProducts.size} selected products?`)) return
    
    try {
      await adminApi.bulkDeleteProducts(Array.from(selectedProducts))
      await fetchProducts()
      await fetchStats()
      setSelectedProducts(new Set())
      alert("Products deleted successfully")
    } catch (err) {
      alert(err?.message || "Bulk delete failed")
    }
  }

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) {
      setSelectedProducts(new Set())
    } else {
      setSelectedProducts(new Set(products.map(p => p._id)))
    }
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading products…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Product Management</h1>
      <p>Moderate products submitted by merchants</p>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 20, marginBottom: 20 }}>
          <div style={{ padding: 16, backgroundColor: "#fef3c7", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#92400e" }}>Pending</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.pending_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#dcfce7", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#166534" }}>Approved</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.approved_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#fee2e2", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#991b1b" }}>Rejected</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.rejected_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#e0e7ff", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#3730a3" }}>Total</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.total_count || 0}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="all">All Products</option>
          <option value="pending">Pending Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or merchant..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db", minWidth: 250 }}
        />

        <button
          onClick={fetchProducts}
          style={{
            padding: "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Refresh
        </button>

        {selectedProducts.size > 0 && (
          <>
            <button
              onClick={handleBulkApprove}
              style={{
                padding: "8px 16px",
                backgroundColor: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Approve Selected ({selectedProducts.size})
            </button>
            <button
              onClick={handleBulkDelete}
              style={{
                padding: "8px 16px",
                backgroundColor: "#dc2626",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: "pointer"
              }}
            >
              Delete Selected ({selectedProducts.size})
            </button>
          </>
        )}
      </div>

      {/* Products Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>
              <input
                type="checkbox"
                checked={products.length > 0 && selectedProducts.size === products.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Product</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Merchant</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Price</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Status</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No products found
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.has(product._id)}
                    onChange={() => toggleProductSelection(product._id)}
                  />
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 500 }}>{product.name}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {product._id.substring(0, 8)}...</div>
                  {product.description && (
                    <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.description}
                    </div>
                  )}
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontSize: 13 }}>{product.merchant_name || "Unknown"}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{product.merchant_email}</div>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 500 }}>${product.price?.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>Stock: {product.stock}</div>
                </td>
                <td style={{ padding: 12 }}>
                  {product.is_approved === null || product.is_approved === undefined ? (
                    <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#fef3c7", color: "#92400e" }}>
                      ⏳ Pending
                    </span>
                  ) : product.is_approved ? (
                    <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#dcfce7", color: "#166534" }}>
                      ✓ Approved
                    </span>
                  ) : (
                    <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#fee2e2", color: "#991b1b" }}>
                      ✗ Rejected
                    </span>
                  )}
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {(product.is_approved === null || product.is_approved === undefined || product.is_approved === false) && (
                      <button
                        onClick={() => handleApprove(product._id, true)}
                        disabled={actionLoading[product._id]}
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          backgroundColor: "#10b981",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer"
                        }}
                      >
                        Approve
                      </button>
                    )}
                    {(product.is_approved === null || product.is_approved === undefined || product.is_approved === true) && (
                      <button
                        onClick={() => handleApprove(product._id, false)}
                        disabled={actionLoading[product._id]}
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          backgroundColor: "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer"
                        }}
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={actionLoading[product._id]}
                      style={{
                        padding: "4px 10px",
                        fontSize: 11,
                        backgroundColor: "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer"
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  {product.rejection_reason && (
                    <div style={{ fontSize: 11, color: "#dc2626", marginTop: 6, fontStyle: "italic" }}>
                      Reason: {product.rejection_reason}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
