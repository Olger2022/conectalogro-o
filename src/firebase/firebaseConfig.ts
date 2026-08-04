import { doc, getDocFromServer } from 'firebase/firestore';
import { app, auth, db, storage, googleProvider, firebaseConfig } from './config';

export { app, auth, db, storage, googleProvider, firebaseConfig };

export const isFirebaseConfigured = (): boolean => {
  return true;
};

// Validate Connection to Firestore on startup
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test', 'status'));
    console.log("Firebase Firestore proyectoveterinario2026 connected successfully!");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firebase client is currently offline.");
    } else {
      console.log("Firebase connection initialized:", error);
    }
    return false;
  }
}

export default app;
