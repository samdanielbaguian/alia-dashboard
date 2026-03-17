"use client"
import React, { useState } from "react"
import ApproveRejectModal from "./ApproveRejectModal"
import * as adminApi from "../../../../utils/AdminApi"

export default function OrderRow({ order, onUpdate }) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState(null) // 'payment-reject' | 'shipping-reject'
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text: '' }

  const clearMessage = () => {
    setMessage(null)
  }

  const approvePayment = async () => {
    setLoading(true)
    clearMessage()
    try {
      await adminApi.approvePayment(order._id)
      onUpdate({ payment_approved: true, status: "confirmed" })
      setMessage({ type: "success", text: "Payment approved successfully" })
      setTimeout(clearMessage, 3000)
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Approve payment failed" })
    } finally {
      setLoading(false)
    }
  }

  const approveShipping = async () => {
    setLoading(true)
    clearMessage()
    try {
      await adminApi.approveShipping(order._id)
      onUpdate({ shipping_approved: true, status: "shipped" })
      setMessage({ type: "success", text: "Shipping approved successfully" })
      setTimeout(clearMessage, 3000)
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Approve shipping failed" })
    } finally {
      setLoading(false)
    }
  }

  const openReject = (type) => {
    setModalType(type)
    setShowModal(true)
  }

  const handleReject = async (reason) => {
    setShowModal(false)
    setLoading(true)
    clearMessage()
    try {
      if (modalType === "payment") {
        await adminApi.rejectPayment(order._id, reason)
        onUpdate({ payment_approved: false, payment_rejection_reason: reason, status: "payment_rejected" })
        setMessage({ type: "success", text: "Payment rejected successfully" })
      } else {
        await adminApi.rejectShipping(order._id, reason)
        onUpdate({ shipping_approved: false, shipping_rejection_reason: reason, status: "shipping_rejected" })
        setMessage({ type: "success", text: "Shipping rejected successfully" })
      }
      setTimeout(clearMessage, 3000)
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Reject failed" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <tr style={{ borderTop: "1px solid #eee" }}>
        <td style={{ padding: 12, fontSize: "14px", fontWeight: "500" }}>{order._id.substring(0, 8)}...</td>
        <td style={{ padding: 12, fontSize: "14px" }}>
          <span style={{
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor: order.status === "payment_rejected" || order.status === "shipping_rejected" ? "#fee2e2" : 
                             order.status === "confirmed" || order.status === "shipped" ? "#dcfce7" : "#fef3c7",
            color: order.status === "payment_rejected" || order.status === "shipping_rejected" ? "#991b1b" : 
                   order.status === "confirmed" || order.status === "shipped" ? "#166534" : "#92400e",
            fontSize: "12px",
            fontWeight: "500"
          }}>
            {order.status}
          </span>
        </td>
        <td style={{ padding: 12, fontSize: "14px" }}>
          ${order.total ? order.total.toFixed(2) : "0.00"}
        </td>
        <td style={{ padding: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button 
                onClick={approvePayment} 
                disabled={loading || order.payment_approved}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: order.payment_approved ? "#e5e7eb" : "#10b981",
                  color: order.payment_approved ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: order.payment_approved || loading ? "not-allowed" : "pointer",
                  opacity: order.payment_approved ? 0.6 : 1,
                  transition: "all 0.2s"
                }}
              >
                {order.payment_approved ? "✓ Approved" : "Approve Payment"}
              </button>
              <button 
                onClick={() => openReject("payment")} 
                disabled={loading || order.payment_approved}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading || order.payment_approved ? "not-allowed" : "pointer",
                  opacity: loading || order.payment_approved ? 0.5 : 1,
                  transition: "all 0.2s"
                }}
              >
                Reject Payment
              </button>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button 
                onClick={approveShipping} 
                disabled={loading || order.shipping_approved}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: order.shipping_approved ? "#e5e7eb" : "#10b981",
                  color: order.shipping_approved ? "#9ca3af" : "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: order.shipping_approved || loading ? "not-allowed" : "pointer",
                  opacity: order.shipping_approved ? 0.6 : 1,
                  transition: "all 0.2s"
                }}
              >
                {order.shipping_approved ? "✓ Approved" : "Approve Shipping"}
              </button>
              <button 
                onClick={() => openReject("shipping")} 
                disabled={loading || order.shipping_approved}
                style={{
                  padding: "6px 12px",
                  fontSize: "12px",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading || order.shipping_approved ? "not-allowed" : "pointer",
                  opacity: loading || order.shipping_approved ? 0.5 : 1,
                  transition: "all 0.2s"
                }}
              >
                Reject Shipping
              </button>
            </div>
            {message && (
              <div style={{
                marginTop: 8,
                padding: "8px",
                borderRadius: "4px",
                fontSize: "13px",
                backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
                color: message.type === "success" ? "#166534" : "#991b1b",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span>{message.text}</span>
                <button 
                  onClick={clearMessage}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "inherit",
                    padding: "0 4px"
                  }}
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      {showModal && (
        <ApproveRejectModal
          title={modalType === "payment" ? "Reject Payment" : "Reject Shipping"}
          onCancel={() => setShowModal(false)}
          onConfirm={handleReject}
        />
      )}
    </>
  )
}