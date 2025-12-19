import api from './client';

export const generateReceiptPDF = async (orderId: string): Promise<{ message: string; filePath: string }> => {
  const { data } = await api.post<{ message: string; filePath: string }>(`/receipts/generate/${orderId}`);
  return data;
};

export const sendReceiptEmail = async (orderId: string): Promise<{ message: string }> => {
  const { data } = await api.post<{ message: string }>(`/receipts/send-email/${orderId}`);
  return data;
};

