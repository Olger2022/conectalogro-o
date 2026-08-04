import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const metaEnv = (import.meta as any).env || {};

// Firebase configuration using environment variables from .env.example with defaults
export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSyDOhuAeVN9pNx93WReeNgSgFYLJsOSaifk",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "proyectoveterinario2026.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "proyectoveterinario2026",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "proyectoveterinario2026.firebasestorage.app",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "270801458086",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:270801458086:web:dcf5d0136484e5c9877567",
};

// Initialize Firebase app
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();

export default app;
