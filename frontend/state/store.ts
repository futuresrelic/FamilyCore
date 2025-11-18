/**
 * Zustand Global State Store
 */
import { create } from 'zustand';
import * as SecureStore from '../utils/secureStorage';

// Types
interface User {
  id: number;
  email: string;
  full_name: string | null;
  subscription_status: string;
  trial_ends_at: string | null;
  created_at: string;
}

interface Kid {
  id: number;
  parent_id: number;
  name: string;
  age: number | null;
  birthday: string | null;
  avatar_id: string;
  points: number;
  streak: number;
  last_activity: string | null;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  loadAuth: () => Promise<void>;
}

interface AppState {
  mode: 'parent' | 'kid';
  selectedKid: Kid | null;
  setMode: (mode: 'parent' | 'kid') => void;
  setSelectedKid: (kid: Kid | null) => void;
}

interface KidsState {
  kids: Kid[];
  setKids: (kids: Kid[]) => void;
  addKid: (kid: Kid) => void;
  updateKid: (kidId: number, updates: Partial<Kid>) => void;
  removeKid: (kidId: number) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: async (user: User, token: string) => {
    await SecureStore.setItemAsync('authToken', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: async () => {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userStr = await SecureStore.getItemAsync('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
    }
  },
}));

// App State Store
export const useAppStore = create<AppState>((set) => ({
  mode: 'parent',
  selectedKid: null,

  setMode: (mode) => set({ mode }),
  setSelectedKid: (kid) => set({ selectedKid: kid }),
}));

// Kids Store
export const useKidsStore = create<KidsState>((set) => ({
  kids: [],

  setKids: (kids) => set({ kids }),

  addKid: (kid) => set((state) => ({ kids: [...state.kids, kid] })),

  updateKid: (kidId, updates) =>
    set((state) => ({
      kids: state.kids.map((kid) =>
        kid.id === kidId ? { ...kid, ...updates } : kid
      ),
    })),

  removeKid: (kidId) =>
    set((state) => ({
      kids: state.kids.filter((kid) => kid.id !== kidId),
    })),
}));

// Export all stores
export default {
  useAuthStore,
  useAppStore,
  useKidsStore,
};
