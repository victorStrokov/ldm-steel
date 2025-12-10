import { create } from 'zustand';

type SortOrder = 'asc' | 'desc';

interface SortState {
  order: SortOrder;
  setOrder: (order: SortOrder) => void;
}

export const useSortStore = create<SortState>((set) => ({
  order: 'asc',
  setOrder: (order) => set({ order }),
}));
