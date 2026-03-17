"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as adminApi from "../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../utils/protectedRoute"

export default function AdminUsersPage() {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ role: "", search: "" })
  const [actionLoading, setActionLoading] = useState({})
  
  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = {}
      if (filters.role) params.role = filters.role
      if (filters.search) params.search = filters.search
      
      const data = await adminApi.listUsers(params)
      setUsers(data?.users || [])
    } catch (err) {
      setError(err?.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAdminUser) {
      fetchUsers()
    }
  }, [isAdminUser, filters])

  const handleSuspend = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "unsuspend" : "suspend"} this user?`)) return
    
    const reason = currentStatus ? null : prompt("Enter suspension reason:")
    if (!currentStatus && !reason) return
    
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    try {
      await adminApi.suspendUser(userId, !currentStatus, reason)
      await fetchUsers()
      alert(`User ${currentStatus ? "unsuspended" : "suspended"} successfully`)
    } catch (err) {
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleBan = async (userId, currentStatus) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? "unban" : "ban"} this user?`)) return
    
    const reason = currentStatus ? null : prompt("Enter ban reason:")
    if (!currentStatus && !reason) return
    
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    try {
      await adminApi.banUser(userId, !currentStatus, reason)
      await fetchUsers()
      alert(`User ${currentStatus ? "unbanned" : "banned"} successfully`)
    } catch (err) {
      alert(err?.message || "Action failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleResetPassword = async (userId) => {
    const newPassword = prompt("Enter new password for user:")
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters")
      return
    }
    
    setActionLoading(prev => ({ ...prev, [userId]: true }))
    try {
      await adminApi.resetUserPassword(userId, newPassword)
      alert("Password reset successfully")
    } catch (err) {
      alert(err?.message || "Password reset failed")
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: false }))
    }
  }

  const handleViewDetails = (userId) => {
    router.push(`/dashboard/admin/users/${userId}`)
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading users…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>

  return (
    <div style={{ padding: 20 }}>
      <h1>User Management</h1>
      <p>Manage all users on the platform</p>

      {/* Filters */}
      <div style={{ marginTop: 20, marginBottom: 20, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <select
          value={filters.role}
          onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db" }}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="merchant">Merchant</option>
          <option value="buyer">Buyer</option>
        </select>

        <input
          type="text"
          placeholder="Search by email..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          style={{ padding: "8px 12px", borderRadius: 4, border: "1px solid #d1d5db", minWidth: 250 }}
        />

        <button
          onClick={fetchUsers}
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

      {/* Users Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, backgroundColor: "white" }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Email</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Role</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Status</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ padding: 20, textAlign: "center", color: "#999" }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: 12 }}>
                  <div style={{ fontWeight: 500 }}>{user.email}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>ID: {user._id.substring(0, 8)}...</div>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 500,
                    backgroundColor: user.role === "admin" ? "#fef3c7" : user.role === "merchant" ? "#dbeafe" : "#dcfce7",
                    color: user.role === "admin" ? "#92400e" : user.role === "merchant" ? "#1e40af" : "#166534"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: 12 }}>
                  {user.is_banned && <span style={{ color: "#dc2626", fontSize: 12, marginRight: 8 }}>🚫 Banned</span>}
                  {user.is_suspended && <span style={{ color: "#f59e0b", fontSize: 12 }}>⏸ Suspended</span>}
                  {!user.is_banned && !user.is_suspended && <span style={{ color: "#10b981", fontSize: 12 }}>✓ Active</span>}
                </td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleViewDetails(user._id)}
                      disabled={actionLoading[user._id]}
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        backgroundColor: "#e5e7eb",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer"
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSuspend(user._id, user.is_suspended)}
                      disabled={actionLoading[user._id] || user.role === "admin"}
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        backgroundColor: user.is_suspended ? "#10b981" : "#f59e0b",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: user.role === "admin" ? "not-allowed" : "pointer",
                        opacity: user.role === "admin" ? 0.5 : 1
                      }}
                    >
                      {user.is_suspended ? "Unsuspend" : "Suspend"}
                    </button>
                    <button
                      onClick={() => handleBan(user._id, user.is_banned)}
                      disabled={actionLoading[user._id] || user.role === "admin"}
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        backgroundColor: user.is_banned ? "#10b981" : "#dc2626",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: user.role === "admin" ? "not-allowed" : "pointer",
                        opacity: user.role === "admin" ? 0.5 : 1
                      }}
                    >
                      {user.is_banned ? "Unban" : "Ban"}
                    </button>
                    <button
                      onClick={() => handleResetPassword(user._id)}
                      disabled={actionLoading[user._id]}
                      style={{
                        padding: "4px 8px",
                        fontSize: 11,
                        backgroundColor: "#6366f1",
                        color: "white",
                        border: "none",
                        borderRadius: 3,
                        cursor: "pointer"
                      }}
                    >
                      Reset PW
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
