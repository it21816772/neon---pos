export type UserRole = 'CASHIER' | 'MANAGER';

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

export interface Category {
  id: string;
  name: string;
  color?: string | null;
}

export interface Inventory {
  quantity: number;
  minStock: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  category?: Category | null;
  inventory?: Inventory | null;
}

export interface Printer {
  id: string;
  name: string;
  type: 'thermal' | 'pdf' | 'native';
  location?: string | null;
  isDefault?: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceCents: number;
  subtotalCents: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  paymentMethod?: string;
  subtotalCents?: number;
  taxCents?: number;
  discountCents?: number;
  totalCents: number;
  customerEmail?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  customerEmail?: string;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE';
}

