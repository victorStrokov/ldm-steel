import { create } from 'zustand';

interface State {
  activeKey: string | undefined;
  setActiveKey: (activeKey: string | undefined) => void;
}

export const useCategoryStore = create<State>()((set) => ({
  activeKey: undefined,
  setActiveKey: (activeKey) => set({ activeKey }),
}));
