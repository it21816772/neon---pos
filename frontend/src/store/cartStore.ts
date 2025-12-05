import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../api/types';

const TAX_RATE = 0.075;

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  customerEmail?: string;
  paymentMethod: 'CASH' | 'CARD' | 'MOBILE';
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCustomerEmail: (value: string) => void;
  setPaymentMethod: (method: 'CASH' | 'CARD' | 'MOBILE') => void;
  getTotals: () => { subtotal: number; tax: number; total: number };
}

const computeTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      paymentMethod: 'CASH',
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.product.id !== productId) };
          }
          return {
            items: state.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            ),
          };
        }),
      clearCart: () => set({ items: [], customerEmail: undefined, paymentMethod: 'CASH' }),
      setCustomerEmail: (value) => set({ customerEmail: value }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      getTotals: () => computeTotals(get().items),
    }),
    {
      name: 'neon-pos-cart',
      partialize: (state) => ({
        items: state.items,
        customerEmail: state.customerEmail,
        paymentMethod: state.paymentMethod,
      }),
    },
  ),
);

