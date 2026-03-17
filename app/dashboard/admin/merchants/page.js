"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as adminApi from "../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../utils/protectedRoute"

export default function AdminMerchantsPage() {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [merchants, setMerchants] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: "pending", search: "" })
  const [actionLoading, setActionLoading] = useState({})
  
  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  useEffect(() => {
    if (isAdminUser) {
      fetchMerchants()
      fetchStats()
    }
  }, [isAdminUser, filters])

  const fetchMerchants = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.status === "pending") {
        const data = await adminApi.listPendingMerchants()
        setMerchants(data?.merchants || [])
      } else {
        if (filters.status && filters.status !== "all") {
          if (filters.status === "verified") params.is_verified = true
          if (filters.status === "suspended") params.is_suspended = true
        }
        if (filters.search) params.search = filters.search
        const data = await adminApi.listMerchants(params)
        setMerchants(data?.merchants || [])
      }
    } catch (err) {
      setError(err?.message || "Failed to load merchants")
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const data = await adminApi.getMerchantsStats()
      setStats(data)
    } catch (err) {
      console.error("Failed to load stats:", err)
    }
  }

  const handleVerify = async (merchantId, isVerified) => {
    const reason = !isVerified ? prompt("Enter rejection reason:") : null
    if (!isVerified && !reason) return
    
    setActionLoading(prev => ({ ...prev, [merchantId]: true }))
    try {
      await adminApi.verifyMerchant(merchantId, isVerified, reason)
      await fetchMerchants()
      await fetchStats()
      alert(`Merchant ${isVerified ? "verified" : "rejected"} successfully`)
    } catch (err) {
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [merchantId]: false }))
    }
  }

  const handleSuspend = async (merchantId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "unsuspend" : "suspend"} this merchant?`)) return
    
    const reason = currentStatus ? null : prompt("Enter suspension reason:")
    if (!currentStatus && !reason) return
    
    setActionLoading(prev => ({ ...prev, [merchantId]: true }))
    try {
      await adminApi.suspendMerchant(merchantId, !currentStatus, reason)
      await fetchMerchants()
      await fetchStats()
      alert(`Merchant ${currentStatus ? "unsuspended" : "suspended"} successfully`)
    } catch (err) {
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [merchantId]: false }))
    }
  }

  const handleSetCommission = async (merchantId, currentRate) => {
    const newRate = prompt(`Enter new commission rate (current: ${currentRate}%):`)
    if (!newRate) return
    
    const rate = parseFloat(newRate)
    if (isNaN(rate) || rate < 0 || rate > 100) {
      alert("Invalid commission rate. Must be between 0 and 100.")
      return
    }
    
    setActionLoading(prev => ({ ...prev, [merchantId]: true }))
    try {
      await adminApi.setMerchantCommission(merchantId, rate)
      await fetchMerchants()
      alert("Commission rate updated successfully")
    } catch (err) {
      alert(err?.message || "Update failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [merchantId]: false }))
    }
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading merchants…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>Merchant Management</h1>
      <p>Verify and manage merchant accounts</p>

      {/* Stats */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginTop: 20, marginBottom: 20 }}>
          <div style={{ padding: 16, backgroundColor: "#fef3c7", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#92400e" }}>Pending</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.pending_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#dcfce7", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#166534" }}>Verified</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.verified_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#fee2e2", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#991b1b" }}>Suspended</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{stats.suspended_count || 0}</div>
          </div>
          <div style={{ padding: 16, backgroundColor: "#e0e7ff", borderRadius: 6 }}>
            <div style={{ fontSize: 12, color: "#3730a3" }}>Total Revenue</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>${(stats.total_revenue || 0).toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="all">All Merchants</option>
          <option value="pending">Pending Verification</option>
          <option value="verified">Verified</option>
          <option value="suspended">Suspended</option>
        </select>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db", minWidth: 250 }}
        />

        <button
          onClick={fetchMerchants}
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
      </div>

      {/* Merchants Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Merchant</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Commission</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Stats</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Status</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {merchants.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No merchants found
              </td>
            </tr>
          ) : (
            merchants.map((merchant) => (
              <tr key={merchant._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 500 }}>{merchant.store_name || merchant.name || "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{merchant.email}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>ID: {merchant._id.substring(0, 8)}...</div>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{merchant.commission_rate || 0}%</div>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ fontSize: 12 }}>Products: {merchant.total_products || 0}</div>
                  <div style={{ fontSize: 12 }}>Sales: ${(merchant.total_sales || 0).toFixed(2)}</div>
                  <div style={{ fontSize: 12 }}>Orders: {merchant.total_orders || 0}</div>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {merchant.is_verified ? (
                      <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#dcfce7", color: "#166534" }}>
                        ✓ Verified
                      </span>
                    ) : (
                      <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#fef3c7", color: "#92400e" }}>
                        ⏳ Pending
                      </span>
                    )}
                    {merchant.is_suspended && (
                      <span style={{ padding: "4px 8px", borderRadius: 4, fontSize: 12, backgroundColor: "#fee2e2", color: "#991b1b" }}>
                        ⏸ Suspended
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {!merchant.is_verified && (
                      <>
                        <button
                          onClick={() => handleVerify(merchant._id, true)}
                          disabled={actionLoading[merchant._id]}
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
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerify(merchant._id, false)}
                          disabled={actionLoading[merchant._id]}
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
                          Reject
                        </button>
                      </>
                    )}
                    {merchant.is_verified && (
                      <button
                        onClick={() => handleSuspend(merchant._id, merchant.is_suspended)}
                        disabled={actionLoading[merchant._id]}
                        style={{
                          padding: "4px 10px",
                          fontSize: 11,
                          backgroundColor: merchant.is_suspended ? "#10b981" : "#f59e0b",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer"
                        }}
                      >
                        {merchant.is_suspended ? "Unsuspend" : "Suspend"}
                      </button>
                    )}
                    <button
                      onClick={() => handleSetCommission(merchant._id, merchant.commission_rate || 0)}
                      disabled={actionLoading[merchant._id]}
                      style={{
                        padding: "4px 10px",
                        fontSize: 11,
                        backgroundColor: "#6366f1",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer"
                      }}
                    >
                      Set Rate
                    </button>
                  </div>
                  {merchant.suspension_reason && (
                    <div style={{ fontSize: 11, color: "#dc2626", marginTop: 6, fontStyle: "italic" }}>
                      Reason: {merchant.suspension_reason}
                    </div>
                  )}
                  {merchant.rejection_reason && (
                    <div style={{ fontSize: 11, color: "#dc2626", marginTop: 6, fontStyle: "italic" }}>
                      Rejection: {merchant.rejection_reason}
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
