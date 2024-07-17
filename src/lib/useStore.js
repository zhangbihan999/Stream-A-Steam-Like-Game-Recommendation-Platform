import create from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(persist(
  (set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null })
  }),
  {
    name: 'user-storage', // 存储的名称，用于 localStorage 的键名
    getStorage: () => localStorage, // 使用 localStorage
  }
));

export default useUserStore;