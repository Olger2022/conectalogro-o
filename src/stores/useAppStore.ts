import { create } from 'zustand';
import { AccessibilitySettings } from '../types';

export type ActiveModule =
  | 'dashboard'
  | 'incidencias'
  | 'tramites'
  | 'mapa'
  | 'admin'
  | 'transparencia'
  | 'asistente';

interface AppState {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;

  isOnline: boolean;
  setIsOnline: (status: boolean) => void;
  pendingSyncCount: number;
  setPendingSyncCount: (count: number) => void;

  accessibility: AccessibilitySettings;
  toggleDarkMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  setFontSizeMultiplier: (multiplier: number) => void;

  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeModule: 'dashboard',
  setActiveModule: (module) => set({ activeModule: module }),

  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  setIsOnline: (status) => set({ isOnline: status }),
  pendingSyncCount: 0,
  setPendingSyncCount: (count) => set({ pendingSyncCount: count }),

  accessibility: {
    highContrast: false,
    fontSizeMultiplier: 1,
    screenReaderOptimized: false,
    darkMode: false,
    reducedMotion: false,
  },

  toggleDarkMode: () =>
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        darkMode: !state.accessibility.darkMode,
      },
    })),

  toggleHighContrast: () =>
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        highContrast: !state.accessibility.highContrast,
      },
    })),

  toggleReducedMotion: () =>
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        reducedMotion: !state.accessibility.reducedMotion,
      },
    })),

  setFontSizeMultiplier: (multiplier) =>
    set((state) => ({
      accessibility: {
        ...state.accessibility,
        fontSizeMultiplier: multiplier,
      },
    })),

  isNotificationsOpen: false,
  setIsNotificationsOpen: (open) => set({ isNotificationsOpen: open }),
  isAuthModalOpen: false,
  setIsAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
}));
