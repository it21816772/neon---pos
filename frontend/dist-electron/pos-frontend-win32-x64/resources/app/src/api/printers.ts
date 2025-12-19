import { useQuery } from '@tanstack/react-query';
import api from './client';
import { Printer } from './types';

export const fetchPrinters = async (): Promise<Printer[]> => {
  const { data } = await api.get<Printer[]>('/printers');
  return data;
};

export const usePrintersQuery = () =>
  useQuery({
    queryKey: ['printers'],
    queryFn: fetchPrinters,
  });

