"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import * as adminApi from "../../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../../utils/protectedRoute"

export default function UserDetailsPage({ params }) {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [user, setUser] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const userId = params.id

  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  useEffect(() => {
    if (isAdminUser && userId) {
      fetchUserDetails()
      fetchUserActivity()
    }
  }, [isAdminUser, userId])

  const fetchUserDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await adminApi.getUser(userId)
      setUser(data)
    } catch (err) {
      setError(err?.message || "Failed to load user details")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserActivity = async () => {
    try {
      const data = await adminApi.getUserActivity(userId)
      setActivity(data?.activities || [])
    } catch (err) {
      console.error("Failed to load activity:", err)
    }
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading user details…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>
  if (!user) return <div style={{ padding: 20 }}>User not found</div>

  return (
    <div style={{ padding: 20, maxWidth: 1200 }}>
      <button
        onClick={() => router.back()}
        style={{
          padding: "8px 16px",
          backgroundColor: "#e5e7eb",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          marginBottom: 20
        }}
      >
        ← Back
      </button>

      <h1>User Details</h1>

      {/* User Info Card */}
      <div style={{ backgroundColor: "white", padding: 24, borderRadius: 8, marginTop: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0 }}>Profile Information</h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: 12, marginTop: 16 }}>
          <div style={{ fontWeight: 600 }}>User ID:</div>
          <div style={{ fontFamily: "monospace", fontSize: 14 }}>{user._id}</div>

          <div style={{ fontWeight: 600 }}>Email:</div>
          <div>{user.email}</div>

          <div style={{ fontWeight: 600 }}>Phone:</div>
          <div>{user.phone_number || "N/A"}</div>

          <div style={{ fontWeight: 600 }}>Role:</div>
          <div>
            <span style={{
              padding: "4px 12px",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 500,
              backgroundColor: user.role === "admin" ? "#fef3c7" : user.role === "merchant" ? "#dbeafe" : "#dcfce7",
              color: user.role === "admin" ? "#92400e" : user.role === "merchant" ? "#1e40af" : "#166534"
            }}>
              {user.role}
            </span>
          </div>

          <div style={{ fontWeight: 600 }}>Status:</div>
          <div>
            {user.is_banned ? (
              <span style={{ color: "#dc2626", fontWeight: 500 }}>🚫 Banned</span>
            ) : user.is_suspended ? (
              <span style={{ color: "#f59e0b", fontWeight: 500 }}>⏸ Suspended</span>
            ) : (
              <span style={{ color: "#10b981", fontWeight: 500 }}>✓ Active</span>
            )}
          </div>

          <div style={{ fontWeight: 600 }}>Verified:</div>
          <div>{user.is_verified ? "✓ Yes" : "✗ No"}</div>

          <div style={{ fontWeight: 600 }}>Registered:</div>
          <div>{new Date(user.created_at).toLocaleString()}</div>

          <div style={{ fontWeight: 600 }}>Last Updated:</div>
          <div>{new Date(user.updated_at).toLocaleString()}</div>
        </div>

        {user.suspension_reason && (
          <div style={{ marginTop: 20, padding: 12, backgroundColor: "#fef3c7", borderRadius: 4 }}>
            <strong>Suspension Reason:</strong> {user.suspension_reason}
          </div>
        )}

        {user.ban_reason && (
          <div style={{ marginTop: 12, padding: 12, backgroundColor: "#fee2e2", borderRadius: 4 }}>
            <strong>Ban Reason:</strong> {user.ban_reason}
          </div>
        )}
      </div>

      {/* Statistics */}
      {user.stats && (
        <div style={{ backgroundColor: "white", padding: 24, borderRadius: 8, marginTop: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginTop: 0 }}>Statistics</h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginTop: 16 }}>
            <div style={{ padding: 16, backgroundColor: "#f3f4f6", borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Total Orders</div>
              <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>{user.stats.total_orders || 0}</div>
            </div>
            <div style={{ padding: 16, backgroundColor: "#f3f4f6", borderRadius: 6 }}>
              <div style={{ fontSize: 13, color: "#6b7280" }}>Total Spent</div>
              <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>${(user.stats.total_spent || 0).toFixed(2)}</div>
            </div>
            {user.role === "merchant" && (
              <>
                <div style={{ padding: 16, backgroundColor: "#f3f4f6", borderRadius: 6 }}>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Total Products</div>
                  <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>{user.stats.total_products || 0}</div>
                </div>
                <div style={{ padding: 16, backgroundColor: "#f3f4f6", borderRadius: 6 }}>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Total Sales</div>
                  <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>${(user.stats.total_sales || 0).toFixed(2)}</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Activity Log */}
      <div style={{ backgroundColor: "white", padding: 24, borderRadius: 8, marginTop: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginTop: 0 }}>Activity Log</h2>
        
        {activity.length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#999" }}>No activity recorded</div>
        ) : (
          <div style={{ marginTop: 16 }}>
            {activity.map((log, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  borderLeft: "3px solid #1976d2",
                  backgroundColor: "#f9fafb",
                  marginBottom: 12,
                  borderRadius: 4
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 500 }}>{log.action}</div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                  {new Date(log.timestamp).toLocaleString()}
                  {log.admin_id && ` • By Admin: ${log.admin_id.substring(0, 8)}...`}
                </div>
                {log.reason && (
                  <div style={{ fontSize: 12, color: "#374151", marginTop: 6, fontStyle: "italic" }}>
                    Reason: {log.reason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
