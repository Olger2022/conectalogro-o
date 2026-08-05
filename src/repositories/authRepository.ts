import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { Usuario } from '../types';

export interface AuthResponse {
  success: boolean;
  user?: FirebaseUser | null;
  profile?: Usuario | null;
  message?: string;
}

export class AuthRepository {
  /**
   * Log in user using email and password
   */
  static async login(email: string, pass: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;

      // Try fetching profile from Firestore
      let profile: Usuario | null = null;
      try {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          profile = docSnap.data() as Usuario;
        }
      } catch (err) {
        console.warn('Could not fetch user profile from Firestore:', err);
      }

      return {
        success: true,
        user,
        profile,
      };
    } catch (error: any) {
      console.error('AuthRepository login error:', error);
      let message = 'Error al iniciar sesión. Compruebe sus credenciales.';
      if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/user-not-found' || error?.code === 'auth/wrong-password') {
        message = 'Correo electrónico o contraseña incorrectos.';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Demasiados intentos fallidos. Intente más tarde.';
      }
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Register a new user with Firebase Auth and store profile in Firestore
   */
  static async register(
    email: string,
    pass: string,
    userData: Partial<Usuario>
  ): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      const fullName = `${userData.nombres || ''} ${userData.apellidos || ''}`.trim();
      if (fullName) {
        await updateProfile(firebaseUser, { displayName: fullName });
      }

      const newProfile: Usuario = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        cedula: userData.cedula || '1400000000',
        nombres: userData.nombres || 'Nuevo',
        apellidos: userData.apellidos || 'Usuario',
        email: email,
        telefono: userData.telefono || '',
        direccion: userData.direccion || '',
        parroquia: userData.parroquia || 'Logroño (Centro)',
        role: userData.role || 'ciudadano',
        createdAt: new Date().toISOString(),
        isVerified: firebaseUser.emailVerified,
      };

      // Store user profile document in Firestore
      try {
        await setDoc(doc(db, 'usuarios', firebaseUser.uid), newProfile);
      } catch (err) {
        console.warn('Could not store user profile in Firestore:', err);
      }

      return {
        success: true,
        user: firebaseUser,
        profile: newProfile,
      };
    } catch (error: any) {
      console.error('AuthRepository register error:', error);
      let message = 'Error al registrar usuario.';
      if (error?.code === 'auth/email-already-in-use') {
        message = 'El correo electrónico ya está registrado.';
      } else if (error?.code === 'auth/weak-password') {
        message = 'La contraseña debe tener al menos 6 caracteres.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'Formato de correo electrónico inválido.';
      }
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Login with Google Provider
   */
  static async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      let profile: Usuario | null = null;
      try {
        const docRef = doc(db, 'usuarios', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          profile = docSnap.data() as Usuario;
        } else {
          // Create initial profile for Google user
          const nameParts = (user.displayName || 'Ciudadano Logroño').split(' ');
          profile = {
            id: user.uid,
            uid: user.uid,
            cedula: '1400000000',
            nombres: nameParts[0] || 'Ciudadano',
            apellidos: nameParts.slice(1).join(' ') || 'Google',
            email: user.email || '',
            telefono: user.phoneNumber || '',
            direccion: 'Logroño',
            parroquia: 'Logroño (Centro)',
            role: 'ciudadano',
            createdAt: new Date().toISOString(),
            isVerified: true,
          };
          await setDoc(docRef, profile);
        }
      } catch (err) {
        console.warn('Google profile fetch/creation error:', err);
      }

      return {
        success: true,
        user,
        profile,
      };
    } catch (error: any) {
      console.error('AuthRepository Google login error:', error);
      return {
        success: false,
        message: 'No se pudo iniciar sesión con Google.',
      };
    }
  }

  /**
   * Send password recovery / reset email using Firebase Auth
   */
  static async sendPasswordReset(email: string): Promise<{ success: boolean; message?: string }> {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Se ha enviado un enlace de recuperación a su correo electrónico registrado. Por favor revise su bandeja de entrada o spam.',
      };
    } catch (error: any) {
      console.error('AuthRepository sendPasswordReset error:', error);
      let message = 'Error al enviar el correo de recuperación.';
      if (error?.code === 'auth/user-not-found') {
        message = 'No se encontró ninguna cuenta registrada con este correo electrónico.';
      } else if (error?.code === 'auth/invalid-email') {
        message = 'El formato de correo electrónico ingresado no es válido.';
      } else if (error?.code === 'auth/too-many-requests') {
        message = 'Demasiadas solicitudes recibidas. Por favor espere unos minutos antes de reintentar.';
      }
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Log out the current user
   */
  static async logout(): Promise<{ success: boolean; message?: string }> {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error: any) {
      console.error('AuthRepository logout error:', error);
      return {
        success: false,
        message: 'Error al cerrar sesión.',
      };
    }
  }

  /**
   * Subscribe to Firebase Auth state changes
   */
  static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
}

export default AuthRepository;
