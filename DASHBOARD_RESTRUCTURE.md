# Dashboard Restructure - Role-Based Architecture

## Overview
The Alia dashboard has been restructured to support two distinct user roles: **Merchant** and **Customer**, each with their own navigation, pages, and functionality.

## Directory Structure

```
alia-dashboard/
├── app/
│   ├── dashboard/
│   │   ├── page.js                 # 🔄 Main router - redirects based on role
│   │   ├── merchant/
│   │   │   ├── page.js            # Dashboard with KPIs
│   │   │   ├── orders/
│   │   │   │   └── page.js        # Order management
│   │   │   ├── customers/
│   │   │   │   └── page.js        # Customer list
│   │   │   ├── sellers/
│   │   │   │   └── page.js        # Vendors management
│   │   │   ├── reports/
│   │   │   │   └── page.js        # Analytics & reporting
│   │   │   └── settings/
│   │   │       └── page.js        # Profile settings
│   │   │
│   │   └── customer/
│   │       ├── page.js            # Dashboard
│   │       ├── orders/
│   │       │   └── page.js        # Order history
│   │       ├── profile/
│   │       │   └── page.js        # Profile editor
│   │       └── wishlist/
│   │           └── page.js        # Wishlist management
│   │
│   └── middleware.js              # 🔐 Route protection
│
└── layout/
    ├── Sidebar.js                 # 📋 Role-based navigation
    ├── Header.js                  # 📍 Dynamic title
    ├── DashboardLayout.js         # Main layout wrapper
    └── ...
```

## Role Detection & Routing

### Authentication Flow
1. User logs in → JWT token stored in `localStorage.authToken`
2. User object stored in `localStorage.authUser` (contains `role` field)
3. Upon visiting `/dashboard` → `page.js` detects role and redirects:
   - `role === 'merchant'` → `/dashboard/merchant`
   - `role === 'customer'` → `/dashboard/customer`
   - No token → `/login`

### Code Reference
```javascript
// app/dashboard/page.js
const user = getAuthUser();
const role = user.role || user.type;

if (role === 'merchant') {
  router.push('/dashboard/merchant');
} else if (role === 'customer') {
  router.push('/dashboard/customer');
}
```

## Merchant Dashboard

### Pages & Features

#### 1. **Dashboard** (`/dashboard/merchant`)
- 📊 KPI Cards: Total Orders, Revenue, Products, Low Stock
- 📈 Sales Trend Chart (LineChart by date)
- 🎯 Category Distribution (DonutChart)
- 📋 Recent Orders Table
- 📦 Products Table

**API Calls:**
```
GET /merchants/me/orders
GET /merchants/me/dashboard-overview
GET /merchants/me/products
```

#### 2. **Orders** (`/dashboard/merchant/orders`)
- 📊 Stats Cards: Total, Completed, Processing, Pending
- 📋 Orders Table with columns: ID, User, Amount, Status, Date
- 📥 Export to CSV button

**API Calls:**
```
GET /merchants/me/orders
```

#### 3. **Customers** (`/dashboard/merchant/customers`)
- 👥 Stats Cards: Total Customers, VIP, New This Month, Active
- 📋 Customer Table with: ID, Name, Email, Orders Count, Total Spent, Last Order, VIP Status
- VIP Logic: `orders >= 5 OR spent >= €500`

**Data Extraction:**
- Fetches orders from `/merchants/me/orders`
- Extracts unique customers from order data
- Calculates spending and order counts per customer

#### 4. **Sellers** (`/dashboard/merchant/sellers`)
- 🏪 Stats Cards: Total Sellers, Active, New This Month, Pending
- 📋 Sellers Table with: ID, Name, Email, Products Count, Total Sales, Rating, Status, Joined Date

**Data Extraction:**
- Fetches all products from `/products`
- Groups by `merchant_id` to create seller map
- Optionally fetches individual merchant details from `/merchants/{id}`
- Calculates product counts and revenue totals

#### 5. **Reports** (`/dashboard/merchant/reports`)
- 📊 KPI Metrics: Monthly Revenue, Avg Order Value, Conversion Rate, Customer LTV
- 📈 Sales Trend Chart
- 🎯 Top 5 Products by Revenue
- 🗺️ Sales Heatmap (by day and hour)
- 📥 Export to JSON button

**Data Processing:**
- Aggregates order data to calculate metrics
- Groups orders by day/hour for heatmap
- Ranks products by revenue

#### 6. **Settings** (`/dashboard/merchant/settings`)
- ✏️ Editable Fields: shop_name, email, phone, description, logo_url
- 💾 Save Changes button
- 🔄 Reset button
- ℹ️ Current Profile Display Panel

**API Calls:**
```
GET /merchants/me
PUT /merchants/me
```

---

## Customer Dashboard

### Pages & Features

#### 1. **Dashboard** (`/dashboard/customer`)
- 📊 Stats Cards: Total Orders, Total Spent, Active Orders, In Transit
- 📋 Recent Orders Table (last 5 orders)
- 🔗 Quick Links: View Profile, View Wishlist

**API Calls:**
```
GET /customers/me/orders (with fallback)
```

#### 2. **Orders** (`/dashboard/customer/orders`)
- 📊 Stats Cards: Total, Completed, Pending, Cancelled
- 📋 Orders Table with columns: ID, Amount, Status, Date

**API Calls:**
```
GET /customers/me/orders
```

#### 3. **Profile** (`/dashboard/customer/profile`)
- ✏️ Editable Fields:
  - Personal: first_name, last_name, email, phone
  - Address: street address, city, postal_code, country
- 💾 Save Changes & Reset buttons
- ℹ️ Account Info Panel

**API Calls:**
```
GET /customers/me
PUT /customers/me
```

#### 4. **Wishlist** (`/dashboard/customer/wishlist`)
- 🎁 Product Grid Display
- 🛒 Add to Cart button for each product
- 🗑️ Remove from Wishlist button
- 💰 Price Display
- 📝 Product Description & Image

**API Calls:**
```
GET /customers/me/wishlist
PUT /customers/me/wishlist/{product_id}
POST /cart/add
```

---

## Navigation Components

### Sidebar.js (Role-Based)
Displays different menu items based on `user.role`:

**Merchant Menu:**
- Dashboard
- Orders
- Customers
- Sellers
- Reports
- Settings

**Customer Menu:**
- Dashboard
- Orders
- Profile
- Wishlist

### Header.js (Dynamic Title)
- Displays "Merchant Dashboard" or "Customer Dashboard" based on role
- Shows user role and avatar
- Logout functionality

---

## Access Control

### Middleware (`app/middleware.js`)
- Protects all `/dashboard/*` routes
- Requires valid JWT token in cookies
- Redirects to `/login` if unauthenticated

### Component-Level Protection
- Pages check `localStorage.authToken` before rendering
- Automatic redirect to `/login` on 401 Unauthorized responses
- Role mismatches handled by main router (`/dashboard/page.js`)

---

## API Integration

### Authentication
All API calls include JWT token:
```javascript
Authorization: Bearer {token}
```

### Utility Functions
```javascript
// From utils/api.js
getAuthToken()          // Returns JWT from localStorage
getAuthUser()           // Returns user object from localStorage
apiGet(endpoint)        // GET request with auth header
apiPut(endpoint, data)  // PUT request with auth header
apiPost(endpoint, data) // POST request with auth header
```

### Error Handling
- 401 responses trigger automatic logout and redirect to `/login`
- Try-catch blocks wrap all API calls
- Error messages displayed in UI with snackbars or alerts

---

## Styling & UI

### Material-UI Components
- **Cards**: KPI cards, stat cards
- **DataTable**: Dynamic table component with columns
- **Charts**: LineChart, DonutChart for visualizations
- **Forms**: TextField components for editing
- **Notifications**: Snackbar alerts for success/error messages
- **Icons**: Material-UI icons throughout

### Color Scheme
- Primary: `#1976d2` (Blue)
- Success: `#4caf50` (Green)
- Warning: `#ff9800` (Orange)
- Error: `#f44336` (Red)
- Background: `#ffffff` (White)

### Responsive Design
- Mobile-first approach
- Grid system: `xs={12} sm={6} md={3}` for flexible layouts
- Breakpoints: xs, sm, md, lg

---

## Testing Checklist

- [ ] Login as merchant → redirected to `/dashboard/merchant`
- [ ] Login as customer → redirected to `/dashboard/customer`
- [ ] Merchant dashboard loads KPIs and charts
- [ ] Merchant can view orders, customers, sellers, reports
- [ ] Merchant can edit profile and save changes
- [ ] Customer dashboard shows order stats
- [ ] Customer can view order history
- [ ] Customer can edit profile
- [ ] Customer can view and manage wishlist
- [ ] Logout redirects to `/login`
- [ ] Navigation items are role-appropriate
- [ ] CSV/JSON exports work correctly

---

## Known Limitations

1. **API Endpoints**: Some endpoints (e.g., `/customers/me/wishlist`) may not exist in backend yet
2. **Fallback Handling**: Customer orders endpoint may not be implemented - fallback to empty array
3. **Seller Details**: Optional merchant detail fetching - works without it
4. **Heatmap Data**: Depends on complete order data with timestamps

---

## Future Enhancements

1. **Middleware Role Validation**: Decode JWT and validate role on server
2. **Caching**: Implement React Query or SWR for better data fetching
3. **Real-time Updates**: WebSocket integration for live order updates
4. **Advanced Filtering**: Add filters to order/customer tables
5. **Notifications**: Toast/snackbar system for user actions
6. **Mobile Optimization**: Improved mobile experience for sidebar/header
7. **Permissions Matrix**: Fine-grained role-based access control (RBAC)

---

## File Modifications Summary

| File | Status | Changes |
|------|--------|---------|
| `app/dashboard/page.js` | ✅ Existing | Added role detection and redirect logic |
| `layout/Sidebar.js` | ✅ Modified | Added role-based menu items |
| `layout/Header.js` | ✅ Modified | Added dynamic title based on role |
| `app/dashboard/merchant/*` | ✅ Created | 6 new page files |
| `app/dashboard/customer/*` | ✅ Created | 4 new page files |
| `app/middleware.js` | ✅ Created | Route protection middleware |

---

## Getting Started

1. **Start the backend**: `python app/main.py` (FastAPI)
2. **Start the frontend**: `npm run dev` (Next.js)
3. **Login**: Use registered merchant/customer credentials
4. **Navigate**: Sidebar updates based on role automatically

---

**Last Updated:** 2024 | **Status:** Complete
