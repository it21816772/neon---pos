# POS System - API Documentation

Complete API reference for the POS System backend.

## Base URL

```
http://localhost:3000 (development)
https://your-domain.com/api (production)
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints

### Authentication

#### `POST /auth/login`

Login and receive JWT token.

**Request Body:**
```json
{
  "email": "cashier@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "cashier@example.com",
    "role": "CASHIER",
    "name": "John Doe"
  }
}
```

#### `GET /auth/me`

Get current user information (requires auth).

**Response:**
```json
{
  "id": "uuid",
  "email": "cashier@example.com",
  "role": "CASHIER",
  "name": "John Doe"
}
```

---

### Products

#### `GET /products`

Get all products.

**Query Parameters:**
- `categoryId` (optional): Filter by category
- `search` (optional): Search by name/barcode

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Product Name",
    "description": "Description",
    "priceCents": 1999,
    "categoryId": "uuid",
    "barcode": "123456789",
    "imageUrl": "https://...",
    "category": {
      "id": "uuid",
      "name": "Category Name"
    },
    "inventory": {
      "quantity": 100,
      "minStock": 10
    }
  }
]
```

#### `GET /products/:id`

Get a single product.

**Response:**
```json
{
  "id": "uuid",
  "name": "Product Name",
  "description": "Description",
  "priceCents": 1999,
  "categoryId": "uuid",
  "barcode": "123456789",
  "imageUrl": "https://...",
  "category": {
    "id": "uuid",
    "name": "Category Name"
  },
  "inventory": {
    "quantity": 100,
    "minStock": 10
  }
}
```

#### `POST /products`

Create a new product (Manager only).

**Request Body:**
```json
{
  "name": "Product Name",
  "description": "Description",
  "priceCents": 1999,
  "categoryId": "uuid",
  "barcode": "123456789",
  "imageUrl": "https://...",
  "initialStock": 100,
  "minStock": 10
}
```

#### `PUT /products/:id`

Update a product (Manager only).

**Request Body:**
```json
{
  "name": "Updated Name",
  "priceCents": 2499,
  "description": "Updated description"
}
```

#### `DELETE /products/:id`

Delete a product (Manager only).

---

### Orders

#### `POST /orders`

Create a new order (requires auth).

**Request Body:**
```json
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "customerEmail": "customer@example.com",
  "paymentMethod": "CARD"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "subtotalCents": 3998,
  "taxCents": 300,
  "discountCents": 0,
  "totalCents": 4298,
  "paymentMethod": "CARD",
  "status": "COMPLETED",
  "customerEmail": "customer@example.com",
  "createdAt": "2024-01-01T12:00:00Z",
  "items": [
    {
      "id": "uuid",
      "productId": "uuid",
      "quantity": 2,
      "priceCents": 1999,
      "subtotalCents": 3998,
      "product": {
        "id": "uuid",
        "name": "Product Name",
        "priceCents": 1999
      }
    }
  ],
  "user": {
    "id": "uuid",
    "email": "cashier@example.com",
    "name": "John Doe"
  }
}
```

**Notes:**
- Automatically validates inventory
- Uses database transaction for consistency
- Updates inventory atomically
- Returns complete order with all relations

#### `GET /orders`

Get all orders (requires auth).

**Query Parameters:**
- `status` (optional): Filter by status (PENDING, COMPLETED, CANCELLED)
- `limit` (optional): Limit results
- `offset` (optional): Offset for pagination

**Response:**
```json
[
  {
    "id": "uuid",
    "totalCents": 4298,
    "status": "COMPLETED",
    "createdAt": "2024-01-01T12:00:00Z",
    "items": [...],
    "user": {...}
  }
]
```

#### `GET /orders/:id`

Get a single order (requires auth).

**Response:**
```json
{
  "id": "uuid",
  "subtotalCents": 3998,
  "taxCents": 300,
  "totalCents": 4298,
  "status": "COMPLETED",
  "items": [...],
  "user": {...},
  "receipts": [...]
}
```

---

### Inventory

#### `GET /inventory`

Get all inventory records (requires auth).

**Response:**
```json
[
  {
    "id": "uuid",
    "productId": "uuid",
    "quantity": 100,
    "minStock": 10,
    "product": {
      "id": "uuid",
      "name": "Product Name",
      "category": {...}
    }
  }
]
```

#### `GET /inventory/:productId`

Get inventory for a specific product (requires auth).

**Response:**
```json
{
  "id": "uuid",
  "productId": "uuid",
  "quantity": 100,
  "minStock": 10,
  "product": {
    "id": "uuid",
    "name": "Product Name"
  }
}
```

#### `PUT /inventory/:productId`

Update inventory (Manager only).

**Request Body:**
```json
{
  "quantity": 150,
  "minStock": 20
}
```

---

### Receipts

#### `POST /receipts/generate/:orderId`

Generate PDF receipt for an order (requires auth).

**Response:**
```json
{
  "message": "Receipt generated",
  "filePath": "/receipts/receipt-uuid-1234567890.pdf"
}
```

**Notes:**
- Creates PDF in `uploads/receipts/` directory
- Returns file path for download
- Creates receipt record in database

#### `POST /receipts/send-email/:orderId`

Send receipt email to customer (requires auth).

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

**Notes:**
- Requires customer email on order
- Automatically generates PDF if not exists
- Sends email with PDF attachment
- Updates receipt record with `emailSent: true`

---

### Printers

#### `GET /printers`

Get all active printers (requires auth).

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Thermal Printer 1",
    "type": "thermal",
    "config": "{}",
    "isActive": true,
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

#### `POST /printers/print/:orderId`

Generate ESC/POS print data for an order (requires auth).

**Response:**
```json
{
  "escpos": "1B40...",
  "message": "Print data generated"
}
```

**Notes:**
- Returns ESC/POS commands as hex string
- Can be used with QZ Tray or WebUSB
- Includes formatted receipt with items and totals

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden (role-based)
- `404` - Not Found
- `500` - Internal Server Error

### Example Error Response

```json
{
  "statusCode": 404,
  "message": "Product with ID abc123 not found",
  "error": "Not Found"
}
```

---

## Data Types

### Payment Methods

- `CASH`
- `CARD`
- `MOBILE`

### Order Status

- `PENDING`
- `COMPLETED`
- `CANCELLED`

### User Roles

- `CASHIER`
- `MANAGER`

### Price Format

All prices are stored in **cents** as integers:
- `$19.99` = `1999` cents
- `$0.99` = `99` cents
- `$100.00` = `10000` cents

---

## Rate Limiting

Currently no rate limiting implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## Webhooks (Future)

Planned webhook events:
- `order.created`
- `order.completed`
- `inventory.low_stock`
- `receipt.sent`

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Create order
const order = await api.post('/orders', {
  items: [{ productId: 'uuid', quantity: 2 }],
  customerEmail: 'customer@example.com',
  paymentMethod: 'CARD'
});
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"cashier@example.com","password":"password123"}'

# Create order
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"productId": "uuid", "quantity": 2}],
    "customerEmail": "customer@example.com",
    "paymentMethod": "CARD"
  }'
```

---

## Testing

Use tools like:
- **Postman** - Import collection
- **Insomnia** - REST client
- **curl** - Command line
- **Thunder Client** - VS Code extension

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Full CRUD for products, orders, inventory
- Receipt generation and email
- Thermal printer support

---

**Last Updated:** 2024

