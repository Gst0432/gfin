import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User, Transaction, Product, Service, SalesGoal, Expense } from '../types';

interface Store {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserPremium: (userId: string, duration?: number) => void;
  toggleUserStatus: (userId: string) => void;

  // Transactions state
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;

  // Products state
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Services state
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;

  // Sales goals state
  salesGoals: SalesGoal[];
  addSalesGoal: (goal: Omit<SalesGoal, 'id'>) => void;

  // Expenses state
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Digital Product Tables state
  digitalProductTables: any[];
  addDigitalProductTable: (table: Omit<any, 'id'>) => void;
  updateDigitalProductTable: (id: string, updates: Partial<any>) => void;
  deleteDigitalProductTable: (id: string) => void;
  addDigitalProduct: (tableId: string, product: Omit<any, 'id'>) => void;
  updateDigitalProduct: (tableId: string, productId: string, updates: Partial<any>) => void;
  deleteDigitalProduct: (tableId: string, productId: string) => void;

  // Subscription Sales state
  subscriptionSales: any[];
  addSubscriptionSale: (sale: Omit<any, 'id'>) => void;
  updateSubscriptionSale: (id: string, updates: Partial<any>) => void;
  deleteSubscriptionSale: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      users: [],
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(user => user.id === id ? { ...user, ...updates } : user),
        user: state.user?.id === id ? { ...state.user, ...updates } : state.user
      })),
      deleteUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      toggleUserPremium: (userId, duration = 1) => set((state) => {
        const user = state.users.find(u => u.id === userId);
        if (!user) return state;

        const now = new Date();
        const expiryDate = user.isPremium ? undefined : new Date(now.setMonth(now.getMonth() + duration));

        return {
          users: state.users.map(u => 
            u.id === userId ? {
              ...u,
              isPremium: !u.isPremium,
              premiumExpiryDate: expiryDate?.toISOString()
            } : u
          )
        };
      }),
      toggleUserStatus: (userId) => set((state) => ({
        users: state.users.map(u => 
          u.id === userId ? { ...u, isActive: !u.isActive } : u
        )
      })),

      // Transactions state
      transactions: [],
      addTransaction: (transaction) => set((state) => ({
        transactions: [...state.transactions, { ...transaction, id: uuidv4() }]
      })),
      updateTransaction: (id, updates) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      // Products state
      products: [],
      addProduct: (product) => set((state) => ({ 
        products: [...state.products, { ...product, id: uuidv4() }] 
      })),
      updateProduct: (id, updates) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),

      // Services state
      services: [],
      addService: (service) => set((state) => ({ 
        services: [...state.services, { ...service, id: uuidv4() }] 
      })),
      updateService: (id, updates) => set((state) => ({
        services: state.services.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteService: (id) => set((state) => ({
        services: state.services.filter(s => s.id !== id)
      })),

      // Sales goals state
      salesGoals: [],
      addSalesGoal: (goal) => set((state) => ({
        salesGoals: [...state.salesGoals, { ...goal, id: uuidv4() }]
      })),

      // Expenses state
      expenses: [],
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: uuidv4() }]
      })),
      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map(e => e.id === id ? { ...e, ...updates } : e)
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter(e => e.id !== id)
      })),

      // Digital Product Tables state
      digitalProductTables: [],
      addDigitalProductTable: (table) => set((state) => ({
        digitalProductTables: [...state.digitalProductTables, { ...table, id: uuidv4(), products: [] }]
      })),
      updateDigitalProductTable: (id, updates) => set((state) => ({
        digitalProductTables: state.digitalProductTables.map(t => 
          t.id === id ? { ...t, ...updates } : t
        )
      })),
      deleteDigitalProductTable: (id) => set((state) => ({
        digitalProductTables: state.digitalProductTables.filter(t => t.id !== id)
      })),
      addDigitalProduct: (tableId, product) => set((state) => ({
        digitalProductTables: state.digitalProductTables.map(t => 
          t.id === tableId ? {
            ...t,
            products: [...t.products, { ...product, id: uuidv4() }]
          } : t
        )
      })),
      updateDigitalProduct: (tableId, productId, updates) => set((state) => ({
        digitalProductTables: state.digitalProductTables.map(t => 
          t.id === tableId ? {
            ...t,
            products: t.products.map(p => 
              p.id === productId ? { ...p, ...updates } : p
            )
          } : t
        )
      })),
      deleteDigitalProduct: (tableId, productId) => set((state) => ({
        digitalProductTables: state.digitalProductTables.map(t => 
          t.id === tableId ? {
            ...t,
            products: t.products.filter(p => p.id !== productId)
          } : t
        )
      })),

      // Subscription Sales state
      subscriptionSales: [],
      addSubscriptionSale: (sale) => set((state) => ({
        subscriptionSales: [...state.subscriptionSales, { ...sale, id: uuidv4() }]
      })),
      updateSubscriptionSale: (id, updates) => set((state) => ({
        subscriptionSales: state.subscriptionSales.map(s => 
          s.id === id ? { ...s, ...updates } : s
        )
      })),
      deleteSubscriptionSale: (id) => set((state) => ({
        subscriptionSales: state.subscriptionSales.filter(s => s.id !== id)
      }))
    }),
    {
      name: 'g-finance-store',
      partialize: (state) => ({
        user: state.user,
        users: state.users,
        transactions: state.transactions,
        products: state.products,
        services: state.services,
        salesGoals: state.salesGoals,
        expenses: state.expenses,
        digitalProductTables: state.digitalProductTables,
        subscriptionSales: state.subscriptionSales
      })
    }
  )
);