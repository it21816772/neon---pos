import { useMutation } from '@tanstack/react-query';
import api from './client';
import { User } from './types';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

export const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginRequest,
  });

