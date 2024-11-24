import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { User } from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const googleProvider = new GoogleAuthProvider();

const mapFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    const userData = {
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: firebaseUser.email === '227makemoney@gmail.com' ? 'admin' : 'user',
      isPremium: firebaseUser.email === '227makemoney@gmail.com',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    await setDoc(userRef, userData);
    return {
      id: firebaseUser.uid,
      ...userData
    };
  }

  const userData = userDoc.data();
  return {
    id: firebaseUser.uid,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    isPremium: userData.isPremium,
    premiumExpiryDate: userData.premiumExpiryDate,
    createdAt: userData.createdAt,
    isActive: userData.isActive,
    companyInfo: userData.companyInfo
  };
};

export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    const user = await mapFirebaseUser(userCredential.user);
    toast.success('Compte créé avec succès');
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de l\'inscription';
    toast.error(message);
    throw error;
  }
};

export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await mapFirebaseUser(userCredential.user);
    toast.success('Connexion réussie');
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Email ou mot de passe incorrect';
    toast.error(message);
    throw error;
  }
};

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = await mapFirebaseUser(result.user);
    toast.success('Connexion avec Google réussie');
    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la connexion avec Google';
    toast.error(message);
    throw error;
  }
};

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
    toast.success('Déconnexion réussie');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur lors de la déconnexion';
    toast.error(message);
    throw error;
  }
};