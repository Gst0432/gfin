import { 
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  updateDoc,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Product, Service, Transaction, SalesGoal, Expense } from '../types';

// Collection Users
export const usersCollection = collection(db, 'users');
export const userDoc = (id: string) => doc(db, 'users', id);

// Collection Products
export const productsCollection = collection(db, 'products');
export const productDoc = (id: string) => doc(db, 'products', id);

// Collection Services
export const servicesCollection = collection(db, 'services');
export const serviceDoc = (id: string) => doc(db, 'services', id);

// Collection Transactions
export const transactionsCollection = collection(db, 'transactions');
export const transactionDoc = (id: string) => doc(db, 'transactions', id);

// Collection Sales Goals
export const salesGoalsCollection = collection(db, 'salesGoals');
export const salesGoalDoc = (id: string) => doc(db, 'salesGoals', id);

// Collection Expenses
export const expensesCollection = collection(db, 'expenses');
export const expenseDoc = (id: string) => doc(db, 'expenses', id);

// Collection Subscription Sales
export const subscriptionSalesCollection = collection(db, 'subscriptionSales');
export const subscriptionSaleDoc = (id: string) => doc(db, 'subscriptionSales', id);

// Collection Digital Product Tables
export const digitalProductTablesCollection = collection(db, 'digitalProductTables');
export const digitalProductTableDoc = (id: string) => doc(db, 'digitalProductTables', id);

// Collection Notifications
export const notificationsCollection = collection(db, 'notifications');
export const notificationDoc = (id: string) => doc(db, 'notifications', id);

// Exemple de structure des documents:

/*
users/{userId} = {
  id: string,
  name: string,
  email: string,
  role: 'admin' | 'user',
  isPremium: boolean,
  premiumExpiryDate?: Timestamp,
  autoRenew?: boolean,
  phone?: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  isActive: boolean,
  lastLogin?: Timestamp,
  companyInfo?: {
    name: string,
    address: string,
    phone: string,
    email: string,
    logo?: string
  }
}

products/{productId} = {
  id: string,
  sellerId: string,
  name: string,
  purchasePrice: number,
  sellingPrice: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

services/{serviceId} = {
  id: string,
  sellerId: string,
  title: string,
  description: string,
  price: number,
  expiryDate: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

transactions/{transactionId} = {
  id: string,
  type: 'premium' | 'sale',
  amount: number,
  date: Timestamp,
  description?: string,
  saleType?: 'product' | 'service',
  buyerDetails?: {
    name: string,
    email: string,
    phone?: string
  },
  paymentMethod?: string,
  status: 'pending' | 'completed' | 'failed',
  itemId?: string,
  sellerId: string,
  buyerId?: string,
  createdAt: Timestamp
}

salesGoals/{goalId} = {
  id: string,
  sellerId: string,
  target: number,
  current: number,
  startDate: Timestamp,
  endDate: Timestamp,
  type: 'monthly' | 'yearly',
  createdAt: Timestamp,
  updatedAt: Timestamp
}

expenses/{expenseId} = {
  id: string,
  sellerId: string,
  amount: number,
  description: string,
  category: string,
  date: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

subscriptionSales/{saleId} = {
  id: string,
  serviceName: string,
  duration: number,
  amount: number,
  customerName: string,
  customerEmail: string,
  customerPhone?: string,
  purchaseDate: Timestamp,
  expiryDate: Timestamp,
  status: 'active' | 'expired',
  sellerId: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

digitalProductTables/{tableId} = {
  id: string,
  name: string,
  sellerId: string,
  products: Array<{
    id: string,
    name: string,
    description: string,
    link: string,
    createdAt: Timestamp,
    updatedAt: Timestamp
  }>,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

notifications/{notificationId} = {
  id: string,
  userId: string,
  title: string,
  message: string,
  type?: string,
  isRead: boolean,
  createdAt: Timestamp
}
*/

// Règles de sécurité Firestore recommandées:
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fonction pour vérifier si l'utilisateur est connecté
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Fonction pour vérifier si l'utilisateur est admin
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Fonction pour vérifier si l'utilisateur est le propriétaire
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Users Collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin() || isOwner(userId);
    }

    // Products Collection
    match /products/{productId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Services Collection
    match /services/{serviceId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Transactions Collection
    match /transactions/{transactionId} {
      allow read: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || 
         resource.data.buyerId == request.auth.uid || 
         isAdmin());
      allow write: if isAuthenticated();
    }

    // Sales Goals Collection
    match /salesGoals/{goalId} {
      allow read: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Expenses Collection
    match /expenses/{expenseId} {
      allow read: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Subscription Sales Collection
    match /subscriptionSales/{saleId} {
      allow read: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Digital Product Tables Collection
    match /digitalProductTables/{tableId} {
      allow read: if isAuthenticated() && 
        (resource.data.sellerId == request.auth.uid || isAdmin());
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.sellerId == request.auth.uid || isAdmin());
    }

    // Notifications Collection
    match /notifications/{notificationId} {
      allow read: if isAuthenticated() && 
        resource.data.userId == request.auth.uid;
      allow write: if isAuthenticated() && 
        (resource == null || resource.data.userId == request.auth.uid || isAdmin());
    }
  }
}
*/