import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { User } from '../../types';

export const usersCollection = collection(db, 'users');

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<void> => {
  await updateDoc(doc(db, 'users', userId), updates);
};

export const getAdminUsers = async (): Promise<User[]> => {
  const q = query(usersCollection, where('role', '==', 'admin'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
};

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return false;
  return userDoc.data().role === 'admin';
};