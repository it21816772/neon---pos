import { create } from 'zustand';

type Density = 'compact' | 'spacious';

interface UIState {
  isPaymentOpen: boolean;
  density: Density;
  setPaymentOpen: (value: boolean) => void;
  toggleDensity: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isPaymentOpen: false,
  density: 'compact',
  setPaymentOpen: (value) => set({ isPaymentOpen: value }),
  toggleDensity: () =>
    set((state) => ({
      density: state.density === 'compact' ? 'spacious' : 'compact',
    })),
}));

