import { useMutation } from '@tanstack/react-query';
import api from './client';
import { User } from './types';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export const loginRequest = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', payload);
  return data;
};

export const registerRequest = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/signup', payload);
  return data;
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: loginRequest,
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: registerRequest,
  });

export const meRequest = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/me');
  return data;
};

export const useMeQuery = () =>
  useMutation({
    mutationFn: meRequest,
  });

