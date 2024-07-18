import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useGameStore = create(persist(
    (set) => ({
      game: null,
      setGame: (game) => set({ game }),
      exit: () => set({ game: null })
    }),
    {
      name: 'game-storage', // 存储的名称，用于 localStorage 的键名
      getStorage: () => localStorage, // 使用 localStorage
    }
))

export default useGameStore;