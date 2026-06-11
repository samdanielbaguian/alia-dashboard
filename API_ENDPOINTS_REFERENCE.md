# API Endpoints Reference
<!-- markdownlint-disable MD040 MD060 MD034 MD032 MD022 MD031 MD024 -->

This document lists all API endpoints used by the restructured dashboard.

## Authentication Endpoints

### Login
```
POST /login
Body: { email: string, password: string }
Response: {
  access_token: string,
  token_type: string,
  user: { id, email, role, ... }
}
```

### Register
```
POST /register
Body: { email: string, password: string, ... }
Response: { user: { id, email, role } }
```

---

## Merchant Endpoints

### Get Merchant Profile
```
GET /merchants/me
Headers: Authorization: Bearer {token}
Response: {
  merchant: {
    id: string,
    shop_name: string,
    email: string,
    phone: string,
    description: string,
    logo_url: string,
    status: string,
    created_at: datetime,
    ...
  }
}
```

### Update Merchant Profile
```
PUT /merchants/me
Headers: Authorization: Bearer {token}
Body: {
  shop_name?: string,
  email?: string,
  phone?: string,
  description?: string,
  logo_url?: string,
  ...
}
Response: { merchant: { ... } }
```

### Get Merchant Orders
```
GET /merchants/me/orders
Headers: Authorization: Bearer {token}
Query Params: ?skip=0&limit=100 (optional)
Response: {
  orders: [
    {
      id: string,
      user_id: string,
      total_amount: number,
      status: string,
      created_at: datetime,
      products: [
        { id, title, price, quantity, ... }
      ],
      ...
    }
  ]
}
```

### Get Merchant Products
```
GET /merchants/me/products
Headers: Authorization: Bearer {token}
Query Params: ?skip=0&limit=100 (optional)
Response: {
  products: [
    {
      id: string,
      title: string,
      description: string,
      price: number,
      stock: number,
      category: string,
      image_url: string,
      created_at: datetime,
      ...
    }
  ]
}
```

### Get Merchant Dashboard Overview
```
GET /merchants/me/dashboard-overview
Headers: Authorization: Bearer {token}
Response: {
  dashboard: {
    total_orders: number,
    total_revenue: number,
    total_products: number,
    low_stock_items: number,
    pending_orders: number,
    ...
  }
}
```

### Get Specific Merchant Details
```
GET /merchants/{merchant_id}
Response: {
  merchant: {
    id: string,
    shop_name: string,
    email: string,
    phone: string,
    status: string,
    ...
  }
}
```

---

## Customer Endpoints

### Get Customer Profile
```
GET /customers/me
Headers: Authorization: Bearer {token}
Response: {
  customer: {
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    phone: string,
    address: string,
    city: string,
    postal_code: string,
    country: string,
    preferences: object,
    ...
  }
}
```

### Update Customer Profile
```
PUT /customers/me
Headers: Authorization: Bearer {token}
Body: {
  first_name?: string,
  last_name?: string,
  phone?: string,
  address?: string,
  city?: string,
  postal_code?: string,
  country?: string,
  preferences?: object,
  ...
}
Response: { customer: { ... } }
```

### Get Customer Orders
```
GET /customers/me/orders
Headers: Authorization: Bearer {token}
Query Params: ?skip=0&limit=100 (optional)
Response: {
  orders: [
    {
      id: string,
      total_amount: number,
      status: string,
      created_at: datetime,
      products: [
        { id, title, price, quantity, ... }
      ],
      ...
    }
  ]
}
```

### Get Customer Wishlist
```
GET /customers/me/wishlist
Headers: Authorization: Bearer {token}
Response: {
  wishlist: [
    {
      id: string,
      title: string,
      description: string,
      price: number,
      image_url: string,
      merchant_id: string,
      ...
    }
  ]
}
```

### Update Wishlist Item
```
PUT /customers/me/wishlist/{product_id}
Headers: Authorization: Bearer {token}
Body: { action: "add" | "remove" }
Response: { success: boolean }
```

### Remove from Wishlist
```
DELETE /customers/me/wishlist/{product_id}
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

---

## Product Endpoints

### Get All Products
```
GET /products
Query Params: ?skip=0&limit=100 (optional)
Response: {
  products: [
    {
      id: string,
      title: string,
      description: string,
      price: number,
      stock: number,
      category: string,
      merchant_id: string,
      merchant_name: string,
      merchant_email: string,
      image_url: string,
      created_at: datetime,
      ...
    }
  ]
}
```

### Get Product Details
```
GET /products/{product_id}
Response: {
  product: {
    id: string,
    title: string,
    description: string,
    price: number,
    stock: number,
    merchant_id: string,
    ...
  }
}
```

---

## Cart Endpoints

### Add to Cart
```
POST /cart/add
Headers: Authorization: Bearer {token}
Body: {
  product_id: string,
  quantity: number
}
Response: { success: boolean, cart: { ... } }
```

### Get Cart
```
GET /cart
Headers: Authorization: Bearer {token}
Response: {
  cart: [
    {
      product_id: string,
      title: string,
      price: number,
      quantity: number,
      ...
    }
  ]
}
```

### Remove from Cart
```
DELETE /cart/{product_id}
Headers: Authorization: Bearer {token}
Response: { success: boolean }
```

---

## Error Responses

### All Endpoints May Return

#### 401 Unauthorized
```json
{
  "detail": "Not authenticated" | "Invalid token"
}
```

#### 403 Forbidden
```json
{
  "detail": "Access denied"
}
```

#### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

#### 400 Bad Request
```json
{
  "detail": "Invalid request" | "Validation error"
}
```

#### 500 Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Authentication

All endpoints (except login/register) require authentication via:
- Header: `Authorization: Bearer {jwt_token}`
- Token obtained from login endpoint
- Token stored in `localStorage.authToken`

### Token Format
- Type: JWT (JSON Web Token)
- Payload contains: `user_id`, `role`, `email`, `exp` (expiration)
- Mechanism: Include in `Authorization` header as Bearer token

---

## Rate Limiting

No rate limiting implemented in reference API.

---

## CORS

API should be configured for CORS:
- Allow Origin: `http://localhost:3000`
- Allow Methods: GET, POST, PUT, DELETE, OPTIONS
- Allow Headers: Authorization, Content-Type

---

## Pagination

Endpoints supporting pagination use:
- Query Params: `?skip={number}&limit={number}`
- Default: `skip=0, limit=100`
- Response includes array of items

---

## Data Types

### Common Fields

```javascript
// DateTime (ISO 8601)
"created_at": "2024-01-15T10:30:00Z"

// Status Values
"status": "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

// Role Values
"role": "merchant" | "customer" | "admin"

// Currency
"price": 99.99 (EUR)
"total_amount": 299.97 (EUR)
```

---

## Fallback Handling in Dashboard

The dashboard gracefully handles missing endpoints:

| Endpoint | Status | Fallback |
|----------|--------|----------|
| `/merchants/me` | ✅ Used | Required |
| `/merchants/me/orders` | ✅ Used | Required |
| `/merchants/me/products` | ✅ Used | Required |
| `/merchants/me/dashboard-overview` | ✅ Used | Required |
| `/merchants/{id}` | ✅ Used | Skip if not available |
| `/customers/me` | ✅ Used | Required |
| `/customers/me/orders` | ✅ Used | Fallback: [] (empty) |
| `/customers/me/wishlist` | ✅ Used | Fallback: [] (empty) |
| `/products` | ✅ Used | Required for sellers list |
| `/cart/add` | ✅ Used | Error: Show message |

---

## Testing with cURL

### Example: Get Merchant Orders
```bash
curl -H "Authorization: Bearer {token}" \
     http://localhost:8000/merchants/me/orders
```

### Example: Update Customer Profile
```bash
curl -X PUT \
     -H "Authorization: Bearer {token}" \
     -H "Content-Type: application/json" \
     -d '{"first_name":"John"}' \
     http://localhost:8000/customers/me
```

---

## API Documentation

For full API documentation, refer to:
- FastAPI Docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

**Last Updated:** 2024
