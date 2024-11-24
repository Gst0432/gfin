export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  isPremium: boolean;
  premiumExpiryDate?: string;
  autoRenew?: boolean;
  createdAt: string;
  isActive: boolean;
  phone?: string;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    logo?: string;
  };
}

export interface Transaction {
  id: string;
  type: 'premium' | 'sale';
  amount: number;
  date: string;
  description?: string;
  saleType?: 'product' | 'service';
  buyerDetails?: {
    name: string;
    email: string;
    phone?: string;
  };
  paymentMethod?: 'cash' | 'mobile' | 'card' | 'transfer' | 'money_transfer';
  status?: string;
  itemId?: string;
  sellerId?: string;
  buyerId?: string;
}

export interface Product {
  id: string;
  name: string;
  purchasePrice: number;
  sellingPrice: number;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  expiryDate: string;
  sellerId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesGoal {
  id: string;
  sellerId: string;
  target: number;
  current: number;
  startDate: string;
  endDate: string;
  type: 'monthly' | 'yearly';
}

export interface Expense {
  id: string;
  sellerId: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SaleTransaction extends Transaction {
  saleType: 'product' | 'service';
}