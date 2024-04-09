import { create } from 'zustand';

type IdStoreState = {
  userId: string;
  setuserId: (id: string) => void;
};

export const userIdStore = create<IdStoreState>((set) => ({
  userId: '',
  setuserId: (id: string) => set({ userId: id }),
}));
