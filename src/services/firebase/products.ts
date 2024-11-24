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
import { Product } from '../../types';

const productsCollection = collection(db, 'products');

export const getProducts = async (userId: string) => {
  try {
    const q = query(productsCollection, where('sellerId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw new Error('Failed to get products');
  }
};