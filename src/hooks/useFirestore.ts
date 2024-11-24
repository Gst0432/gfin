import { useState, useEffect } from 'react';
import { Product, Transaction, Expense, SalesGoal, ApiResponse } from '../types';
import { apiRequest } from '../services/api';

export function useFirestore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [salesGoals, setSalesGoals] = useState<SalesGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          productsResponse,
          transactionsResponse,
          expensesResponse,
          salesGoalsResponse
        ] = await Promise.all([
          apiRequest<ApiResponse<Product[]>>('/products.php'),
          apiRequest<ApiResponse<Transaction[]>>('/transactions.php'),
          apiRequest<ApiResponse<Expense[]>>('/expenses.php'),
          apiRequest<ApiResponse<SalesGoal[]>>('/sales-goals.php')
        ]);

        setProducts(productsResponse.data || []);
        setTransactions(transactionsResponse.data || []);
        setExpenses(expensesResponse.data || []);
        setSalesGoals(salesGoalsResponse.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('Error fetching data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    products,
    transactions,
    expenses,
    salesGoals,
    loading,
    error
  };
}