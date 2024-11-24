import { collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Collection references
export const salesCollection = collection(db, 'sales');
export const usersCollection = collection(db, 'users');
export const productsCollection = collection(db, 'products');
export const servicesCollection = collection(db, 'services');
export const expensesCollection = collection(db, 'expenses');
export const salesGoalsCollection = collection(db, 'salesGoals');
export const digitalProductTablesCollection = collection(db, 'digitalProductTables');