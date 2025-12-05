# POS System Architecture

## Project Structure

```
pos-system/
├── frontend/                 # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Route pages
│   │   ├── store/          # Zustand stores
│   │   ├── hooks/          # React Query hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utilities
│   ├── public/
│   └── package.json
├── backend/                 # NestJS
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order processing
│   │   ├── inventory/      # Inventory management
│   │   ├── receipts/       # Receipt generation
│   │   ├── printers/       # Printer integration
│   │   └── common/         # Shared utilities
│   ├── prisma/             # Database schema & migrations
│   └── package.json
├── docker-compose.yml       # PostgreSQL + services
├── .env.example
└── README.md
```

## Database Schema

### Users
- id, email, password_hash, role (cashier/manager), created_at, updated_at

### Categories
- id, name, description, created_at, updated_at

### Products
- id, name, description, price_cents, category_id, barcode, image_url, created_at, updated_at

### Inventory
- id, product_id, quantity, min_stock, created_at, updated_at

### Orders
- id, user_id, total_cents, status, customer_email, created_at, updated_at

### OrderItems
- id, order_id, product_id, quantity, price_cents, subtotal_cents, created_at

### Receipts
- id, order_id, pdf_url, email_sent, created_at

### Printers
- id, name, type (thermal/pdf), config (JSON), is_active, created_at

## API Routes

### Auth
- POST /auth/login
- POST /auth/logout
- GET /auth/me

### Products
- GET /products
- GET /products/:id
- POST /products (manager only)
- PUT /products/:id (manager only)
- DELETE /products/:id (manager only)

### Orders
- POST /orders (create order with transaction)
- GET /orders
- GET /orders/:id
- GET /orders/:id/receipt

### Inventory
- GET /inventory
- PUT /inventory/:id (update stock)

### Receipts
- POST /receipts/generate/:orderId
- POST /receipts/send-email/:orderId

### Printers
- GET /printers
- POST /printers/print/:orderId

## Services

### OrderService
- Create order with transaction
- Update inventory atomically
- Generate receipt

### ReceiptService
- Generate PDF receipt
- Send email with PDF attachment

### PrinterService
- ESC/POS formatting
- QZ Tray integration
- WebUSB printing

## Frontend State Management

### Zustand Stores
- cartStore: Cart items, totals
- authStore: User session
- uiStore: UI state (modals, themes)

### React Query
- Products query
- Orders mutation
- Inventory queries

