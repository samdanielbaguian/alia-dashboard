/**
 * Orders Page
 * Displays and manages all orders
 */

"use client";

import React, { useEffect, useState } from "react";
import OrderRow from "./components/OrderRow";
import * as adminApi from "../../../../utils/adminApi";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    adminApi
      .listOrders()
      .then((data) => {
        if (!mounted) return;
        setOrders(data || []);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load orders");
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const removeOrUpdate = (orderId, updated) => {
    setOrders((prev) => prev?.map((o) => (o._id === orderId ? { ...o, ...updated } : o)));
  };

  if (loading) return <div>Loading orders…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!orders || orders.length === 0) return <div>No orders found.</div>;

  return (
    <div>
      <h1>Orders</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: 8 }}>Order</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ textAlign: "left", padding: 8 }}>Total</th>
            <th style={{ textAlign: "left", padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <OrderRow key={order._id} order={order} onUpdate={(u) => removeOrUpdate(order._id, u)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
