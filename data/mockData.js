/**
 * Mock Data for Alia Merchant Dashboard
 * Realistic data for all widgets, tables, and charts
 */

// KPI Data
export const kpiData = {
  revenue: {
    value: 125840.50,
    change: 12.5,
    period: 'vs last month'
  },
  orders: {
    value: 1543,
    change: 8.3,
    period: 'vs last month'
  },
  customers: {
    value: 2847,
    change: 15.2,
    period: 'vs last month'
  },
  sellers: {
    value: 48,
    change: 4.5,
    period: 'vs last month'
  },
  products: {
    value: 892,
    change: 2.1,
    period: 'total active'
  },
  lowStock: {
    value: 23,
    change: -3.2,
    period: 'products'
  }
};

// Recent Orders
export const recentOrders = [
  {
    id: 'ORD-2024-001',
    sku: 'SKU-LAPTOP-001',
    customer: 'Jean Dupont',
    product: 'Laptop Dell XPS 15',
    amount: 1299.99,
    status: 'completed',
    date: '2024-01-05'
  },
  {
    id: 'ORD-2024-002',
    sku: 'SKU-PHONE-045',
    customer: 'Marie Martin',
    product: 'iPhone 15 Pro',
    amount: 1199.00,
    status: 'processing',
    date: '2024-01-05'
  },
  {
    id: 'ORD-2024-003',
    sku: 'SKU-TABLET-023',
    customer: 'Pierre Bernard',
    product: 'iPad Air M2',
    amount: 699.99,
    status: 'shipped',
    date: '2024-01-04'
  },
  {
    id: 'ORD-2024-004',
    sku: 'SKU-WATCH-012',
    customer: 'Sophie Laurent',
    product: 'Apple Watch Series 9',
    amount: 449.00,
    status: 'completed',
    date: '2024-01-04'
  },
  {
    id: 'ORD-2024-005',
    sku: 'SKU-HEADPHONE-089',
    customer: 'Luc Dubois',
    product: 'AirPods Pro 2',
    amount: 279.99,
    status: 'pending',
    date: '2024-01-03'
  },
  {
    id: 'ORD-2024-006',
    sku: 'SKU-MONITOR-034',
    customer: 'Claire Petit',
    product: 'Samsung 32" 4K Monitor',
    amount: 549.00,
    status: 'completed',
    date: '2024-01-03'
  },
  {
    id: 'ORD-2024-007',
    sku: 'SKU-KEYBOARD-056',
    customer: 'Marc Robert',
    product: 'Logitech MX Keys',
    amount: 119.99,
    status: 'shipped',
    date: '2024-01-02'
  },
  {
    id: 'ORD-2024-008',
    sku: 'SKU-MOUSE-078',
    customer: 'Anne Moreau',
    product: 'Logitech MX Master 3',
    amount: 99.99,
    status: 'completed',
    date: '2024-01-02'
  }
];

// Best Sellers
export const bestSellers = [
  {
    rank: 1,
    sku: 'SKU-PHONE-045',
    name: 'iPhone 15 Pro',
    category: 'Smartphones',
    sales: 342,
    revenue: 409858.00,
    image: '/placeholder-product.png'
  },
  {
    rank: 2,
    sku: 'SKU-LAPTOP-001',
    name: 'Laptop Dell XPS 15',
    category: 'Computers',
    sales: 198,
    revenue: 257398.02,
    image: '/placeholder-product.png'
  },
  {
    rank: 3,
    sku: 'SKU-TABLET-023',
    name: 'iPad Air M2',
    category: 'Tablets',
    sales: 287,
    revenue: 200896.13,
    image: '/placeholder-product.png'
  },
  {
    rank: 4,
    sku: 'SKU-WATCH-012',
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    sales: 423,
    revenue: 189927.00,
    image: '/placeholder-product.png'
  },
  {
    rank: 5,
    sku: 'SKU-HEADPHONE-089',
    name: 'AirPods Pro 2',
    category: 'Audio',
    sales: 589,
    revenue: 164834.11,
    image: '/placeholder-product.png'
  },
  {
    rank: 6,
    sku: 'SKU-MONITOR-034',
    name: 'Samsung 32" 4K Monitor',
    category: 'Monitors',
    sales: 156,
    revenue: 85644.00,
    image: '/placeholder-product.png'
  },
  {
    rank: 7,
    sku: 'SKU-KEYBOARD-056',
    name: 'Logitech MX Keys',
    category: 'Accessories',
    sales: 467,
    revenue: 56032.33,
    image: '/placeholder-product.png'
  },
  {
    rank: 8,
    sku: 'SKU-MOUSE-078',
    name: 'Logitech MX Master 3',
    category: 'Accessories',
    sales: 512,
    revenue: 51194.88,
    image: '/placeholder-product.png'
  }
];

// Top Customers
export const topCustomers = [
  {
    id: 'CUST-001',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    orders: 42,
    totalSpent: 15420.50,
    lastOrder: '2024-01-05',
    status: 'vip'
  },
  {
    id: 'CUST-002',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    orders: 38,
    totalSpent: 12890.00,
    lastOrder: '2024-01-05',
    status: 'vip'
  },
  {
    id: 'CUST-003',
    name: 'Pierre Bernard',
    email: 'pierre.bernard@email.com',
    orders: 35,
    totalSpent: 11234.75,
    lastOrder: '2024-01-04',
    status: 'regular'
  },
  {
    id: 'CUST-004',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    orders: 31,
    totalSpent: 9875.30,
    lastOrder: '2024-01-04',
    status: 'regular'
  },
  {
    id: 'CUST-005',
    name: 'Luc Dubois',
    email: 'luc.dubois@email.com',
    orders: 28,
    totalSpent: 8650.00,
    lastOrder: '2024-01-03',
    status: 'regular'
  }
];

// Sales Chart Data (Last 12 months)
export const salesChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue (€)',
      data: [85000, 92000, 78000, 95000, 110000, 105000, 118000, 125000, 112000, 130000, 122000, 125840],
      borderColor: '#1976d2',
      backgroundColor: 'rgba(25, 118, 210, 0.1)',
    }
  ]
};

// Category Distribution (Donut Chart)
export const categoryDistribution = {
  labels: ['Smartphones', 'Computers', 'Tablets', 'Wearables', 'Audio', 'Accessories'],
  datasets: [
    {
      data: [32, 24, 18, 12, 10, 4],
      backgroundColor: [
        '#1976d2',
        '#42a5f5',
        '#1565c0',
        '#64b5f6',
        '#0d47a1',
        '#90caf9'
      ]
    }
  ]
};

// Sales Heatmap Data (Days x Hours)
export const heatmapData = [
  { day: 'Mon', hour: '00:00', value: 12 },
  { day: 'Mon', hour: '04:00', value: 8 },
  { day: 'Mon', hour: '08:00', value: 45 },
  { day: 'Mon', hour: '12:00', value: 89 },
  { day: 'Mon', hour: '16:00', value: 67 },
  { day: 'Mon', hour: '20:00', value: 34 },
  { day: 'Tue', hour: '00:00', value: 15 },
  { day: 'Tue', hour: '04:00', value: 10 },
  { day: 'Tue', hour: '08:00', value: 52 },
  { day: 'Tue', hour: '12:00', value: 95 },
  { day: 'Tue', hour: '16:00', value: 72 },
  { day: 'Tue', hour: '20:00', value: 38 },
  { day: 'Wed', hour: '00:00', value: 18 },
  { day: 'Wed', hour: '04:00', value: 12 },
  { day: 'Wed', hour: '08:00', value: 58 },
  { day: 'Wed', hour: '12:00', value: 102 },
  { day: 'Wed', hour: '16:00', value: 78 },
  { day: 'Wed', hour: '20:00', value: 42 },
  { day: 'Thu', hour: '00:00', value: 20 },
  { day: 'Thu', hour: '04:00', value: 14 },
  { day: 'Thu', hour: '08:00', value: 62 },
  { day: 'Thu', hour: '12:00', value: 98 },
  { day: 'Thu', hour: '16:00', value: 85 },
  { day: 'Thu', hour: '20:00', value: 48 },
  { day: 'Fri', hour: '00:00', value: 25 },
  { day: 'Fri', hour: '04:00', value: 18 },
  { day: 'Fri', hour: '08:00', value: 68 },
  { day: 'Fri', hour: '12:00', value: 110 },
  { day: 'Fri', hour: '16:00', value: 92 },
  { day: 'Fri', hour: '20:00', value: 55 },
  { day: 'Sat', hour: '00:00', value: 32 },
  { day: 'Sat', hour: '04:00', value: 22 },
  { day: 'Sat', hour: '08:00', value: 48 },
  { day: 'Sat', hour: '12:00', value: 88 },
  { day: 'Sat', hour: '16:00', value: 98 },
  { day: 'Sat', hour: '20:00', value: 72 },
  { day: 'Sun', hour: '00:00', value: 28 },
  { day: 'Sun', hour: '04:00', value: 20 },
  { day: 'Sun', hour: '08:00', value: 38 },
  { day: 'Sun', hour: '12:00', value: 75 },
  { day: 'Sun', hour: '16:00', value: 82 },
  { day: 'Sun', hour: '20:00', value: 58 },
];

// Alerts/Notifications
export const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Low Stock Alert',
    message: '23 products are running low on stock',
    time: '5 minutes ago',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'New Order',
    message: 'Order #ORD-2024-001 has been placed',
    time: '15 minutes ago',
    read: false
  },
  {
    id: 3,
    type: 'success',
    title: 'Seller Approved',
    message: 'New seller "TechStore" has been approved',
    time: '1 hour ago',
    read: false
  },
  {
    id: 4,
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for Order #ORD-2024-002 failed',
    time: '2 hours ago',
    read: true
  },
  {
    id: 5,
    type: 'info',
    title: 'Product Review',
    message: 'New review for "iPhone 15 Pro"',
    time: '3 hours ago',
    read: true
  }
];

// Products List
export const products = [
  {
    id: 1,
    sku: 'SKU-PHONE-045',
    name: 'iPhone 15 Pro',
    category: 'Smartphones',
    price: 1199.00,
    stock: 145,
    status: 'active',
    seller: 'Apple Store',
    image: '/placeholder-product.png'
  },
  {
    id: 2,
    sku: 'SKU-LAPTOP-001',
    name: 'Laptop Dell XPS 15',
    category: 'Computers',
    price: 1299.99,
    stock: 67,
    status: 'active',
    seller: 'Dell Official',
    image: '/placeholder-product.png'
  },
  {
    id: 3,
    sku: 'SKU-TABLET-023',
    name: 'iPad Air M2',
    category: 'Tablets',
    price: 699.99,
    stock: 89,
    status: 'active',
    seller: 'Apple Store',
    image: '/placeholder-product.png'
  },
  {
    id: 4,
    sku: 'SKU-WATCH-012',
    name: 'Apple Watch Series 9',
    category: 'Wearables',
    price: 449.00,
    stock: 12,
    status: 'low_stock',
    seller: 'Apple Store',
    image: '/placeholder-product.png'
  },
  {
    id: 5,
    sku: 'SKU-HEADPHONE-089',
    name: 'AirPods Pro 2',
    category: 'Audio',
    price: 279.99,
    stock: 234,
    status: 'active',
    seller: 'Apple Store',
    image: '/placeholder-product.png'
  }
];

// Sellers List
export const sellers = [
  {
    id: 1,
    name: 'Apple Store',
    email: 'contact@applestore.com',
    products: 45,
    sales: 15420.50,
    rating: 4.8,
    status: 'active',
    joined: '2023-01-15'
  },
  {
    id: 2,
    name: 'Dell Official',
    email: 'sales@dell.com',
    products: 32,
    sales: 12890.00,
    rating: 4.6,
    status: 'active',
    joined: '2023-02-20'
  },
  {
    id: 3,
    name: 'TechStore',
    email: 'info@techstore.com',
    products: 78,
    sales: 23450.75,
    rating: 4.7,
    status: 'active',
    joined: '2023-03-10'
  },
  {
    id: 4,
    name: 'ElectroMart',
    email: 'contact@electromart.com',
    products: 56,
    sales: 18765.30,
    rating: 4.5,
    status: 'active',
    joined: '2023-04-05'
  }
];

// Orders List
export const orders = [
  ...recentOrders,
  {
    id: 'ORD-2024-009',
    sku: 'SKU-CAMERA-045',
    customer: 'Thomas Simon',
    product: 'Canon EOS R6',
    amount: 2499.00,
    status: 'completed',
    date: '2024-01-01'
  },
  {
    id: 'ORD-2024-010',
    sku: 'SKU-SPEAKER-067',
    customer: 'Julie Michel',
    product: 'Sonos One SL',
    amount: 199.00,
    status: 'shipped',
    date: '2024-01-01'
  }
];

// Customers List
export const customers = [
  ...topCustomers,
  {
    id: 'CUST-006',
    name: 'Claire Petit',
    email: 'claire.petit@email.com',
    orders: 25,
    totalSpent: 7840.50,
    lastOrder: '2024-01-03',
    status: 'regular'
  },
  {
    id: 'CUST-007',
    name: 'Marc Robert',
    email: 'marc.robert@email.com',
    orders: 22,
    totalSpent: 6950.00,
    lastOrder: '2024-01-02',
    status: 'regular'
  }
];

// Activity Feed
export const activityFeed = [
  {
    id: 1,
    type: 'order',
    message: 'New order #ORD-2024-001 from Jean Dupont',
    time: '5 minutes ago',
    icon: 'shopping_cart'
  },
  {
    id: 2,
    type: 'product',
    message: 'Product "iPhone 15 Pro" stock updated',
    time: '15 minutes ago',
    icon: 'inventory'
  },
  {
    id: 3,
    type: 'customer',
    message: 'New customer registration: Marie Martin',
    time: '30 minutes ago',
    icon: 'person_add'
  },
  {
    id: 4,
    type: 'seller',
    message: 'Seller "TechStore" uploaded 5 new products',
    time: '1 hour ago',
    icon: 'store'
  },
  {
    id: 5,
    type: 'order',
    message: 'Order #ORD-2024-002 shipped',
    time: '2 hours ago',
    icon: 'local_shipping'
  }
];
