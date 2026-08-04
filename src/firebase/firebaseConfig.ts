import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Default Firebase Client Configuration (Fallback)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyLogronoKey123456789",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "logrono-conecta.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "logrono-conecta",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "logrono-conecta.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:abcdef123456",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export const isFirebaseConfigured = (): boolean => {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
};

export default app;
