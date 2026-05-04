import { create } from 'zustand';

interface State {
  activeId: number | undefined;
  setActiveId: (activeId: number | undefined) => void;
}

export const useCategoryStore = create<State>()((set) => ({
  activeId: undefined,
  setActiveId: (activeId) => set({ activeId }),
}));
