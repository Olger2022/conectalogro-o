import { create } from 'zustand';
import { Usuario, UserRole } from '../types';
import { USUARIOS_SEED } from '../constants';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<Usuario>) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  updateUser: (updatedData: Partial<Usuario>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: USUARIOS_SEED[0], // Default logged in as Citizen María Belén Espinoza
  isAuthenticated: true,

  login: async (email, pass) => {
    const found = USUARIOS_SEED.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      set({ user: found, isAuthenticated: true });
      return { success: true };
    }
    // Allow custom login
    const customUser: Usuario = {
      id: `usr-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      cedula: '1400887766',
      nombres: 'Ciudadano',
      apellidos: 'Logroño',
      email: email,
      telefono: '0990001122',
      direccion: 'Logroño Centro',
      parroquia: 'Logroño (Centro)',
      role: 'ciudadano',
      createdAt: new Date().toISOString(),
      isVerified: true,
    };
    set({ user: customUser, isAuthenticated: true });
    return { success: true };
  },

  register: async (userData) => {
    const newUser: Usuario = {
      id: `usr-${Date.now()}`,
      uid: `uid-${Date.now()}`,
      cedula: userData.cedula || '1400000000',
      nombres: userData.nombres || 'Nuevo',
      apellidos: userData.apellidos || 'Usuario',
      email: userData.email || 'usuario@logrono.gob.ec',
      telefono: userData.telefono || '0900000000',
      direccion: userData.direccion || 'Logroño',
      parroquia: userData.parroquia || 'Logroño (Centro)',
      role: userData.role || 'ciudadano',
      createdAt: new Date().toISOString(),
      isVerified: true,
    };
    set({ user: newUser, isAuthenticated: true });
    return { success: true };
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  switchUserRole: (role: UserRole) => {
    const matched = USUARIOS_SEED.find((u) => u.role === role);
    if (matched) {
      set({ user: matched, isAuthenticated: true });
    } else {
      const currentUser = get().user;
      if (currentUser) {
        set({ user: { ...currentUser, role } });
      }
    }
  },

  updateUser: (updatedData) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...updatedData } });
    }
  },
}));
