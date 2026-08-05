import { create } from 'zustand';
import { Usuario, UserRole } from '../types';
import { USUARIOS_SEED } from '../constants';
import { AuthRepository } from '../repositories/authRepository';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: Partial<Usuario> & { password?: string }) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  switchUserRole: (role: UserRole) => void;
  updateUser: (updatedData: Partial<Usuario>) => Promise<void>;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: USUARIOS_SEED[0], // Default logged in as Citizen María Belén Espinoza for initial preview
  isAuthenticated: true,
  isLoading: false,

  login: async (email, pass) => {
    set({ isLoading: true });

    // First try real Firebase Auth login
    const res = await AuthRepository.login(email, pass);
    if (res.success && res.user) {
      const userProfile = res.profile || {
        id: res.user.uid,
        uid: res.user.uid,
        cedula: '1400892341',
        nombres: res.user.displayName?.split(' ')[0] || 'Ciudadano',
        apellidos: res.user.displayName?.split(' ').slice(1).join(' ') || 'Registrado',
        email: res.user.email || email,
        telefono: '0987654321',
        direccion: 'Logroño Centro',
        parroquia: 'Logroño (Centro)',
        role: 'ciudadano',
        createdAt: new Date().toISOString(),
        isVerified: true,
      };

      set({ user: userProfile, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    // Check seed fallback for local demo accounts
    const foundSeed = USUARIOS_SEED.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (foundSeed) {
      set({ user: foundSeed, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    set({ isLoading: false });
    return {
      success: false,
      message: res.message || 'No se pudo iniciar sesión. Verifique su correo y contraseña.',
    };
  },

  register: async (userData) => {
    set({ isLoading: true });
    const email = userData.email || '';
    const password = userData.password || '123456';

    const res = await AuthRepository.register(email, password, userData);
    if (res.success && res.profile) {
      set({ user: res.profile, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    // Fallback registration for offline/local state if Firebase network is blocked
    if (!res.success && userData.email) {
      const customUser: Usuario = {
        id: `usr-${Date.now()}`,
        uid: `uid-${Date.now()}`,
        cedula: userData.cedula || '1400892341',
        nombres: userData.nombres || 'Ciudadano',
        apellidos: userData.apellidos || 'Registrado',
        email: userData.email,
        telefono: userData.telefono || '',
        direccion: userData.direccion || 'Logroño',
        parroquia: userData.parroquia || 'Logroño (Centro)',
        role: userData.role || 'ciudadano',
        createdAt: new Date().toISOString(),
        isVerified: true,
      };
      set({ user: customUser, isAuthenticated: true, isLoading: false });
      return { success: true };
    }

    set({ isLoading: false });
    return {
      success: false,
      message: res.message || 'Error al completar el registro.',
    };
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    const res = await AuthRepository.loginWithGoogle();
    if (res.success && res.user) {
      const profile = res.profile || {
        id: res.user.uid,
        uid: res.user.uid,
        cedula: '1400892341',
        nombres: res.user.displayName?.split(' ')[0] || 'Usuario',
        apellidos: res.user.displayName?.split(' ').slice(1).join(' ') || 'Google',
        email: res.user.email || '',
        telefono: '',
        direccion: 'Logroño',
        parroquia: 'Logroño (Centro)',
        role: 'ciudadano',
        createdAt: new Date().toISOString(),
        isVerified: true,
      };
      set({ user: profile, isAuthenticated: true, isLoading: false });
      return { success: true };
    }
    set({ isLoading: false });
    return {
      success: false,
      message: res.message || 'Error al conectar con la cuenta de Google.',
    };
  },

  sendPasswordReset: async (email: string) => {
    set({ isLoading: true });
    const res = await AuthRepository.sendPasswordReset(email);
    set({ isLoading: false });
    return res;
  },

  logout: async () => {
    await AuthRepository.logout();
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

  updateUser: async (updatedData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updatedData };
      set({ user: updatedUser });
      try {
        if (currentUser.uid) {
          await setDoc(doc(db, 'usuarios', currentUser.uid), updatedUser, { merge: true });
        }
      } catch (err) {
        console.warn('Could not update user document in Firestore:', err);
      }
    }
  },

  initAuthListener: () => {
    const unsubscribe = AuthRepository.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'usuarios', firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            set({ user: docSnap.data() as Usuario, isAuthenticated: true });
          } else {
            // Document does not exist yet, build profile
            const nameParts = (firebaseUser.displayName || 'Ciudadano').split(' ');
            const newProf: Usuario = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              cedula: '1400892341',
              nombres: nameParts[0] || 'Ciudadano',
              apellidos: nameParts.slice(1).join(' ') || 'Logroño',
              email: firebaseUser.email || '',
              telefono: firebaseUser.phoneNumber || '',
              direccion: 'Logroño',
              parroquia: 'Logroño (Centro)',
              role: 'ciudadano',
              createdAt: new Date().toISOString(),
              isVerified: true,
            };
            await setDoc(docRef, newProf);
            set({ user: newProf, isAuthenticated: true });
          }
        } catch (err) {
          console.warn('Error fetching Firestore user on auth change:', err);
        }
      }
    });
    return unsubscribe;
  },
}));

