import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Service } from '../../types';

const servicesCollection = collection(db, 'services');

export const getServices = async (userId: string) => {
  try {
    const q = query(servicesCollection, where('sellerId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting services:', error);
    throw new Error('Failed to get services');
  }
};