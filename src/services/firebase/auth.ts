import { 
  signInWithEmailAndPassword, 
  signOut,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getAuth,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, setDoc, getDoc, enableNetwork, disableNetwork } from 'firebase/firestore';
import { User } from '../../types';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider();

// Function to handle offline mode
const handleOfflineMode = async () => {
  try {
    await disableNetwork(db);
    toast.error('Mode hors ligne activé - Connexion Internet limitée');
  } catch (error) {
    console.error('Error handling offline mode:', error);
  }
};

// Function to handle online mode
const handleOnlineMode = async () => {
  try {
    await enableNetwork(db);
    toast.success('Connexion rétablie');
  } catch (error) {
    console.error('Error handling online mode:', error);
  }
};

// Monitor online/offline status
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => handleOnlineMode());
  window.addEventListener('offline', () => handleOfflineMode());
}

// Map Firebase user to our User type
const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userData = {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: firebaseUser.email === '227makemoney@gmail.com' ? 'admin' : 'user',
      isPremium: false,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: new Date().toISOString()
    };

    await setDoc(userRef, userData);
    return { id: firebaseUser.uid, ...userData };
  }

  const userData = userDoc.data();
  await setDoc(userRef, { lastLogin: new Date().toISOString() }, { merge: true });
  return { id: firebaseUser.uid, ...userData } as User;
};

export const initializeAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    try {
      const user = await mapFirebaseUser(firebaseUser);
      callback(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.code === 'unavailable') {
        handleOfflineMode();
        // Try to get cached user data
        const userRef = doc(db, 'users', firebaseUser.uid);
        const cachedDoc = await getDoc(userRef);
        if (cachedDoc.exists()) {
          callback({ id: firebaseUser.uid, ...cachedDoc.data() } as User);
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    }
  });
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await mapFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Sign in error:', error);
    throw new Error('Email ou mot de passe incorrect');
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return await mapFirebaseUser(result.user);
  } catch (error) {
    console.error('Google sign in error:', error);
    throw new Error('Erreur lors de la connexion avec Google');
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Erreur lors de la déconnexion');
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return await mapFirebaseUser(userCredential.user);
  } catch (error) {
    console.error('Sign up error:', error);
    throw new Error('Erreur lors de l\'inscription');
  }
};