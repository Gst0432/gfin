import { 
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
  DocumentData,
  enableNetwork,
  disableNetwork,
  doc,
  getDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { SaleTransaction } from '../../types';
import toast from 'react-hot-toast';

// Collection reference
const salesCollection = collection(db, 'sales');

// Helper function to convert Firestore data to SaleTransaction
const convertToSaleTransaction = (doc: DocumentData): SaleTransaction => ({
  id: doc.id,
  type: doc.data().type,
  amount: doc.data().amount,
  date: doc.data().date.toDate().toISOString(),
  description: doc.data().description,
  saleType: doc.data().saleType,
  buyerDetails: doc.data().buyerDetails,
  paymentMethod: doc.data().paymentMethod,
  itemId: doc.data().itemId,
  sellerId: doc.data().sellerId,
  status: doc.data().status
});

// Add new sale
export const addSale = async (saleData: Omit<SaleTransaction, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(salesCollection, {
      ...saleData,
      date: Timestamp.fromDate(new Date(saleData.date)),
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding sale:', error);
    if (error.code === 'unavailable') {
      await disableNetwork(db);
      toast.error('Mode hors ligne - Les modifications seront synchronisées plus tard');
    }
    throw new Error('Erreur lors de l\'ajout de la vente');
  }
};

// Get user sales
export const getUserSales = async (userId: string): Promise<SaleTransaction[]> => {
  try {
    const q = query(
      salesCollection,
      where('sellerId', '==', userId),
      orderBy('date', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertToSaleTransaction);
  } catch (error) {
    console.error('Error getting sales:', error);
    if (error.code === 'unavailable') {
      await disableNetwork(db);
      toast.error('Mode hors ligne - Données limitées disponibles');
    }
    throw new Error('Erreur lors de la récupération des ventes');
  }
};

// Get sale by ID
export const getSaleById = async (saleId: string): Promise<SaleTransaction | null> => {
  try {
    const saleDoc = await getDoc(doc(salesCollection, saleId));
    if (!saleDoc.exists()) return null;
    return convertToSaleTransaction(saleDoc);
  } catch (error) {
    console.error('Error getting sale:', error);
    throw new Error('Erreur lors de la récupération de la vente');
  }
};

// Update sale
export const updateSale = async (saleId: string, updates: Partial<SaleTransaction>): Promise<void> => {
  try {
    const saleRef = doc(salesCollection, saleId);
    await updateDoc(saleRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating sale:', error);
    throw new Error('Erreur lors de la mise à jour de la vente');
  }
};

// Delete sale
export const deleteSale = async (saleId: string): Promise<void> => {
  try {
    await deleteDoc(doc(salesCollection, saleId));
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw new Error('Erreur lors de la suppression de la vente');
  }
};