import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { mockSales } from '../data/mockSales';
import { mockExpenses } from '../data/mockExpenses';
import { mockInventory } from '../data/mockInventory';
import { kpiData as mockKpiData, recentTransactions as mockRecentTransactions, expenseBreakdown as mockExpenseBreakdown } from '../data/mockDashboard';

const MOCK_INVOICES = [
  { id: 'INV-2024-001', client: 'Abebe Kebede', amount: '4,500', date: 'Oct 12, 2024', status: 'Paid' },
  { id: 'INV-2024-002', client: 'Sara Tech Solutions', amount: '12,000', date: 'Oct 15, 2024', status: 'Pending' },
  { id: 'INV-2024-003', client: 'XYZ Trading', amount: '8,750', date: 'Oct 05, 2024', status: 'Overdue' },
];

const MOCK_DEBTS = [
  { id: '1', name: 'Almaz Supply', amount: '3,200', dueDate: 'Oct 20, 2024', status: 'Pending', type: 'owe_me' },
  { id: '2', name: 'Yared Getachew', amount: '500', dueDate: 'Oct 18, 2024', status: 'Pending', type: 'owe_me' },
  { id: '3', name: 'Office Rent', amount: '8,000', dueDate: 'Oct 25, 2024', status: 'Pending', type: 'i_owe' },
];

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [debts, setDebts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedSales = await AsyncStorage.getItem('@sales');
        const storedExpenses = await AsyncStorage.getItem('@expenses');
        const storedInventory = await AsyncStorage.getItem('@inventory');
        const storedDebts = await AsyncStorage.getItem('@debts');
        const storedInvoices = await AsyncStorage.getItem('@invoices');

        setSales(storedSales ? JSON.parse(storedSales) : mockSales);
        setExpenses(storedExpenses ? JSON.parse(storedExpenses) : mockExpenses);
        setInventory(storedInventory ? JSON.parse(storedInventory) : mockInventory);
        setDebts(storedDebts ? JSON.parse(storedDebts) : MOCK_DEBTS);
        setInvoices(storedInvoices ? JSON.parse(storedInvoices) : MOCK_INVOICES);
      } catch (error) {
        console.error('Failed to load data from storage', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  const addSale = async (sale) => {
    const newData = [sale, ...sales];
    setSales(newData);
    await AsyncStorage.setItem('@sales', JSON.stringify(newData));
  };

  const addExpense = async (expense) => {
    const newData = [expense, ...expenses];
    setExpenses(newData);
    await AsyncStorage.setItem('@expenses', JSON.stringify(newData));
  };

  const addProduct = async (product) => {
    const newData = [product, ...inventory];
    setInventory(newData);
    await AsyncStorage.setItem('@inventory', JSON.stringify(newData));
  };

  const addDebt = async (debt) => {
    const newData = [debt, ...debts];
    setDebts(newData);
    await AsyncStorage.setItem('@debts', JSON.stringify(newData));
  };

  const addInvoice = async (invoice) => {
    const newData = [invoice, ...invoices];
    setInvoices(newData);
    await AsyncStorage.setItem('@invoices', JSON.stringify(newData));
  };

  // Dynamic Dashboard Calculation
  const dashboardData = useMemo(() => {
    if (!isLoaded) return { kpiData: mockKpiData, recentTransactions: mockRecentTransactions, expenseBreakdown: mockExpenseBreakdown };

    let totalSales = 0;
    sales.forEach(s => totalSales += (parseFloat(s.total) || 0));

    let totalExpenses = 0;
    expenses.forEach(e => totalExpenses += (parseFloat(e.amount) || 0));

    let totalProfit = totalSales - totalExpenses;
    
    // Starting cash balance offset (initial capital baseline)
    let cashBalance = 36335 + totalProfit; 

    const kpiData = {
      todaysSales: { value: totalSales || mockKpiData.todaysSales.value, change: 10, isPositive: true },
      profit: { value: totalProfit || mockKpiData.profit.value, change: 5, isPositive: totalProfit >= 0 },
      expenses: { value: totalExpenses || mockKpiData.expenses.value, change: 2, isPositive: false },
      cashBalance: { value: cashBalance || mockKpiData.cashBalance.value, change: 8, isPositive: true }
    };

    // Construct recent transactions dynamically from combined sales and expenses
    let allTx = [
      ...sales.map(s => ({ id: s.id, type: 'sale', description: `Sale - ${s.customer}`, amount: parseFloat(s.total), date: s.date })),
      ...expenses.map(e => ({ id: e.id, type: 'expense', description: e.description || e.category, amount: -parseFloat(e.amount), date: e.date }))
    ];

    allTx.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentTransactions = allTx.length > 0 ? allTx.slice(0, 5) : mockRecentTransactions;

    // Expense breakdown dynamically from expenses
    const categoryTotals = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      categoryTotals[cat] = (categoryTotals[cat] || 0) + (parseFloat(e.amount) || 0);
    });

    const colors = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6'];
    const expenseBreakdown = Object.keys(categoryTotals).length > 0 
      ? Object.keys(categoryTotals).map((key, i) => ({
          name: key,
          value: categoryTotals[key],
          color: colors[i % colors.length]
        }))
      : mockExpenseBreakdown;

    return { kpiData, recentTransactions, expenseBreakdown };
  }, [sales, expenses, isLoaded]);

  return (
    <DataContext.Provider value={{
      sales, addSale,
      expenses, addExpense,
      inventory, addProduct,
      debts, addDebt,
      invoices, addInvoice,
      dashboardData,
      isLoaded
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
