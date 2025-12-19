import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from './client';
import { CreateOrderPayload, Order } from './types';

export const createOrder = async (payload: CreateOrderPayload): Promise<Order> => {
  const { data } = await api.post<Order>('/orders', payload);
  return data;
};

export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

