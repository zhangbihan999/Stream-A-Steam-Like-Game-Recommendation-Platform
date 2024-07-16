import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,  // 初始用户状态为空
  setUser: (user) => set({ user }),  // 更新用户信息
  logout: () => set({ user: null }),  // 用户登出，清空用户信息
}));

export default useUserStore;
