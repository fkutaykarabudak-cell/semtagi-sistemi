import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  token: string | null;
  setAuth: (user: AdminUser, token: string) => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'semtagi-admin-storage',
    }
  )
);
