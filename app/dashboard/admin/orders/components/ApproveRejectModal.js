"use client"
import React, { useState } from "react"

export default function ApproveRejectModal({ title = "Reject", onCancel, onConfirm }) {
  const [reason, setReason] = useState("")
  const [error, setError] = useState("")

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Reason is required")
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
      onClick={onCancel}
    >
      <div 
        style={{ 
          background: "#fff", 
          padding: 24, 
          width: "90%",
          maxWidth: 480, 
          borderRadius: 8,
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          cursor: "auto"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "600" }}>{title}</h3>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8, fontSize: "14px", fontWeight: "500" }}>
            Reason (required)
          </label>
          <textarea 
            value={reason} 
            onChange={(e) => {
              setReason(e.target.value)
              setError("")
            }}
            placeholder="Enter the reason for rejection..."
            style={{ 
              width: "100%", 
              minHeight: 80,
              padding: "10px",
              borderRadius: "4px",
              border: error ? "2px solid #ef4444" : "1px solid #d1d5db",
              fontFamily: "inherit",
              fontSize: "14px",
              boxSizing: "border-box",
              resize: "vertical",
              outline: "none",
              transition: "border-color 0.2s"
            }}
          />
          {error && <p style={{ color: "#ef4444", fontSize: "12px", margin: "4px 0 0 0" }}>{error}</p>}
        </div>
        <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button 
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#f3f4f6",
              color: "#1f2937",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#e5e7eb"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#f3f4f6"}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  )
}