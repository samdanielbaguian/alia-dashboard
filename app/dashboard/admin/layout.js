"use client"
import Link from 'next/link'

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 240, padding: 20, borderRight: '1px solid #eee' }}>
        <h3>Admin</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '12px' }}><Link href="/dashboard/admin">Overview</Link></li>
            <li style={{ marginBottom: '12px' }}><Link href="/dashboard/admin/orders">Orders</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  )
}
