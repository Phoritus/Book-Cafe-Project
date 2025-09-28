import { create } from 'zustand';

// Read persisted user once (avoid JSON.parse in each subscribe)
let persistedUser = null;
try {
  const raw = localStorage.getItem('user');
  if (raw) persistedUser = JSON.parse(raw);
} catch (_) {}

export const useAuthStore = create((set) => ({
  user: persistedUser,
  role: persistedUser?.role || null,
  isAuthenticated: !!persistedUser,
  login: (user) => {
    try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
    set({ user, role: user.role, isAuthenticated: true });
  },
  logout: () => {
    try { localStorage.removeItem('user'); localStorage.removeItem('accessToken'); } catch {}
    set({ user: null, role: null, isAuthenticated: false });
  },
}));