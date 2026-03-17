"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import OrderRow from "./components/OrderRow"
import * as adminApi from "../../../../utils/AdminApi"
import { useAdminCheck } from "../../../../utils/protectedRoute"

export default function AdminOrdersPage() {
  const router = useRouter()
  const { isAdminUser, loading: authLoading } = useAdminCheck()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!authLoading && !isAdminUser) {
      router.push("/dashboard")
    }
  }, [isAdminUser, authLoading, router])

  useEffect(() => {
    if (!isAdminUser) return

    let mounted = true
    setLoading(true)
    adminApi
      .listOrders()
      .then((data) => {
        if (!mounted) return
        // Handle both { orders: [...] } and [...] responses
        const orderList = data?.orders || data || []
        setOrders(Array.isArray(orderList) ? orderList : [])
      })
      .catch((err) => {
        if (mounted) {
          setError(err?.message || "Failed to load orders")
        }
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [isAdminUser])

  const removeOrUpdate = (orderId, updated) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o))
    )
  }

  if (authLoading) return <div style={{ padding: 20 }}>Checking permissions...</div>
  if (!isAdminUser) return <div style={{ padding: 20, color: "red" }}>Access denied. Admin only.</div>
  if (loading) return <div style={{ padding: 20 }}>Loading orders…</div>
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>
  if (!orders || orders.length === 0) return <div style={{ padding: 20 }}>No pending orders.</div>

  return (
    <div>
      <h1>Pending Order Approvals</h1>
      <p>Review and approve/reject payment and shipping for pending orders.</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
        <thead>
          <tr style={{ backgroundColor: "#f3f4f6" }}>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Order ID</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Status</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Total</th>
            <th style={{ textAlign: "left", padding: 12, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow
              key={order._id}
              order={order}
              onUpdate={(u) => removeOrUpdate(order._id, u)}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
