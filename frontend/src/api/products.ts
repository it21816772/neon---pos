import { useQuery } from '@tanstack/react-query';
import api from './client';
import { Product } from './types';

export const fetchProducts = async (): Promise<Product[]> => {
  const { data } = await api.get<Product[]>('/products');
  return data;
};

export const useProductsQuery = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

