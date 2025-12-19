import { useQuery } from '@tanstack/react-query';
import api from './client';
import { Product } from './types';

// Demo products to use when the backend is not available (quick local testing)
export const demoProducts: Product[] = [
  {
    id: 'demo-1',
    name: 'Demo Coffee',
    description: 'A demo cup of coffee',
    priceCents: 299,
    imageUrl: '',
    category: null,
    inventory: { quantity: 25, minStock: 5 },
  },
  {
    id: 'demo-2',
    name: 'Demo Sandwich',
    description: 'A demo sandwich with fresh ingredients',
    priceCents: 599,
    imageUrl: '',
    category: null,
    inventory: { quantity: 10, minStock: 2 },
  },
  {
    id: 'demo-3',
    name: 'Demo Bottle',
    description: 'Demo bottled water',
    priceCents: 150,
    imageUrl: '',
    category: null,
    inventory: { quantity: 50, minStock: 5 },
  },
];

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await api.get<Product[]>('/products');
    return data;
  } catch (err) {
    // If backend is unavailable (dev), fall back to demo products so UI is usable
    // eslint-disable-next-line no-console
    console.warn('Products API not available, returning demo products', err);
    return demoProducts;
  }
};

export const useProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

