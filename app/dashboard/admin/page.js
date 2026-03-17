"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAdminCheck } from "../../../utils/protectedRoute"
import * as adminApi from "../../../utils/AdminApi"
import Link from "next/link"

export default function AdminOverview() {
  const router = useRouter()
  const { isAdminUser, loading } = useAdminCheck()
  const [stats, setStats] = useState({
    orders: { pending: 0, total: 0 },
    users: { total: 0, suspended: 0, banned: 0 },
    products: { pending: 0, approved: 0, rejected: 0, total: 0 },
    merchants: { pending: 0, verified: 0, suspended: 0, totalRevenue: 0 }
  })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    if (!loading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, loading, router])

  useEffect(() => {
    if (isAdminUser) {
      fetchAllStats()
    }
  }, [isAdminUser])

  const fetchAllStats = async () => {
    setLoadingStats(true)
    try {
      // Fetch all stats in parallel
      const [productsStats, merchantsStats] = await Promise.all([
        adminApi.getProductsStats().catch(() => ({ pending_count: 0, approved_count: 0, rejected_count: 0, total_count: 0 })),
        adminApi.getMerchantsStats().catch(() => ({ pending_count: 0, verified_count: 0, suspended_count: 0, total_revenue: 0 }))
      ])

      setStats({
        orders: { pending: 0, total: 0 }, // We can enhance this later with order stats endpoint
        users: { total: 0, suspended: 0, banned: 0 }, // We can enhance this later with user stats endpoint
        products: {
          pending: productsStats.pending_count || 0,
          approved: productsStats.approved_count || 0,
          rejected: productsStats.rejected_count || 0,
          total: productsStats.total_count || 0
        },
        merchants: {
          pending: merchantsStats.pending_count || 0,
          verified: merchantsStats.verified_count || 0,
          suspended: merchantsStats.suspended_count || 0,
          totalRevenue: merchantsStats.total_revenue || 0
        }
      })
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoadingStats(false)
    }
  }

  if (loading) {
    return <div style={{ padding: 20 }}>Checking permissions...</div>
  }

  if (!isAdminUser) {
    return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginBottom: 30 }}>Welcome to the admin control panel. Manage all aspects of the platform.</p>
      
      {loadingStats ? (
        <div>Loading statistics...</div>
      ) : (
        <>
          {/* Platform Statistics */}
          <div style={{ marginBottom: 40 }}>
            <h2>Platform Overview</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginTop: 20 }}>
              {/* Products Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Products</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1976d2" }}>{stats.products.total}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "#f59e0b" }}>⏳ {stats.products.pending} pending</span>
                  <span style={{ color: "#10b981" }}>✓ {stats.products.approved}</span>
                </div>
              </div>

              {/* Merchants Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Merchants</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#1976d2" }}>{stats.merchants.verified}</div>
                <div style={{ marginTop: 12, display: "flex", gap: 12, fontSize: 13 }}>
                  <span style={{ color: "#f59e0b" }}>⏳ {stats.merchants.pending} pending</span>
                  <span style={{ color: "#dc2626" }}>⏸ {stats.merchants.suspended}</span>
                </div>
              </div>

              {/* Revenue Stats */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Total Revenue</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#10b981" }}>
                  ${stats.merchants.totalRevenue.toFixed(2)}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                  From all merchant sales
                </div>
              </div>

              {/* Pending Reviews */}
              <div style={{ padding: 20, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, color: "#6b7280", marginBottom: 8 }}>Needs Review</div>
                <div style={{ fontSize: 32, fontWeight: 600, color: "#f59e0b" }}>
                  {stats.products.pending + stats.merchants.pending}
                </div>
                <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>
                  Products & Merchants
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2>Quick Actions</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 20 }}>
              <Link href="/dashboard/admin/orders" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>📦 Order Approvals</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Review and approve payment & shipping for orders</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/users" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>👥 User Management</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>Manage users, suspend accounts, reset passwords</div>
                </div>
              </Link>

              <Link href="/dashboard/admin/products" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>📦 Product Approval</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Review and approve products • <span style={{ color: "#f59e0b", fontWeight: 600 }}>{stats.products.pending} pending</span>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/admin/merchants" style={{ textDecoration: "none" }}>
                <div style={{ padding: 24, backgroundColor: "white", borderRadius: 8, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "2px solid transparent", transition: "all 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "#1976d2"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "transparent"}
                >
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#111827", marginBottom: 8 }}>🏪 Merchant Verification</div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>
                    Verify merchants & set commissions • <span style={{ color: "#f59e0b", fontWeight: 600 }}>{stats.merchants.pending} pending</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

