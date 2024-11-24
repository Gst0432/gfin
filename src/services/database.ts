import { supabase } from '../config/supabase';
import { User, Product, Transaction, Service, SalesGoal, Expense } from '../types';

// Users
export async function getUser(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUser(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
}

// Products
export async function getProducts(userId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('seller_id', userId);

  if (error) throw error;
  return data;
}

export async function addProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();

  if (error) throw error;
  return data[0];
}

// Transactions
export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('seller_id', userId);

  if (error) throw error;
  return data;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select();

  if (error) throw error;
  return data[0];
}

// Services
export async function getServices(userId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('seller_id', userId);

  if (error) throw error;
  return data;
}

export async function addService(service: Omit<Service, 'id'>) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select();

  if (error) throw error;
  return data[0];
}

// Sales Goals
export async function getSalesGoals(userId: string) {
  const { data, error } = await supabase
    .from('sales_goals')
    .select('*')
    .eq('seller_id', userId);

  if (error) throw error;
  return data;
}

export async function addSalesGoal(goal: Omit<SalesGoal, 'id'>) {
  const { data, error } = await supabase
    .from('sales_goals')
    .insert([goal])
    .select();

  if (error) throw error;
  return data[0];
}

// Expenses
export async function getExpenses(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('seller_id', userId);

  if (error) throw error;
  return data;
}

export async function addExpense(expense: Omit<Expense, 'id'>) {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expense])
    .select();

  if (error) throw error;
  return data[0];
}