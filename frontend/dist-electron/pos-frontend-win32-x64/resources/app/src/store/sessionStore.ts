import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../api/types';

interface SessionState {
  token?: string;
  user?: User;
  selectedPrinterId?: string;
  setSession: (payload: { token: string; user: User }) => void;
  clearSession: () => void;
  setPrinter: (printerId: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: undefined,
      user: undefined,
      selectedPrinterId: undefined,
      setSession: ({ token, user }) => set({ token, user }),
      clearSession: () => set({ token: undefined, user: undefined, selectedPrinterId: undefined }),
      setPrinter: (printerId) => set({ selectedPrinterId: printerId }),
    }),
    {
      name: 'neon-pos-session',
    },
  ),
);

