import api from './client';

export const fetchEscPosPayload = async (orderId: string): Promise<string> => {
  const { data } = await api.post<{ escpos: string }>('/printers/print/' + orderId);
  return data.escpos;
};

