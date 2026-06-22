// Mock Data for Reports (Ported from Web App)

export const profitLossData = {
  revenue: 145680,
  expenses: 78420,
  netProfit: 67260,
  profitMargin: 46.2,
  previousRevenue: 132400,
  previousExpenses: 71200,
  previousProfit: 61200
};

export const monthlyProfitLoss = [
  { month: 'Jan', revenue: 125000, expenses: 68000, profit: 57000 },
  { month: 'Feb', revenue: 138000, expenses: 72000, profit: 66000 },
  { month: 'Mar', revenue: 142000, expenses: 75000, profit: 67000 },
  { month: 'Apr', revenue: 135000, expenses: 71000, profit: 64000 },
  { month: 'May', revenue: 148000, expenses: 77000, profit: 71000 },
  { month: 'Jun', revenue: 145680, expenses: 78420, profit: 67260 }
];

export const debtAgingData = [
  { category: 'Current', amount: 45800, count: 12 },
  { category: '1-30 Days', amount: 28500, count: 8 },
  { category: '31-60 Days', amount: 15200, count: 5 },
  { category: '61-90 Days', amount: 8900, count: 3 },
  { category: '90+ Days', amount: 12400, count: 4 }
];

export const debtCollectionSummary = {
  totalReceivables: 110800,
  totalPayables: 45600,
  netPosition: 65200,
  collectionRate: 78.5,
  averageDaysToCollect: 28
};

export const taxSummary = {
  totalSales: 145680,
  taxableAmount: 132400,
  vatCollected: 19860,
  totCollected: 7284,
  totalTaxLiability: 27144,
  previousMonthTax: 24800
};

export const taxBreakdown = [
  { category: 'VAT (15%)', amount: 19860, percentage: 73.2 },
  { category: 'TOT (5%)', amount: 7284, percentage: 26.8 }
];

export const expensesByCategory = [
  { name: 'Rent & Utilities', amount: 18500, percentage: 23.6, color: '#3b82f6' },
  { name: 'Salaries & Wages', amount: 32400, percentage: 41.3, color: '#10b981' },
  { name: 'Marketing', amount: 8200, percentage: 10.5, color: '#f59e0b' },
  { name: 'Office Supplies', amount: 6800, percentage: 8.7, color: '#ef4444' },
  { name: 'Transportation', amount: 7320, percentage: 9.3, color: '#8b5cf6' },
  { name: 'Miscellaneous', amount: 5200, percentage: 6.6, color: '#ec4899' }
];

export const cashFlowData = [
  { day: 'Mon', cashIn: 12400, cashOut: 8200, net: 4200 },
  { day: 'Tue', cashIn: 15600, cashOut: 9800, net: 5800 },
  { day: 'Wed', cashIn: 18200, cashOut: 11400, net: 6800 },
  { day: 'Thu', cashIn: 16800, cashOut: 10200, net: 6600 },
  { day: 'Fri', cashIn: 22400, cashOut: 12800, net: 9600 },
  { day: 'Sat', cashIn: 25800, cashOut: 14200, net: 11600 },
  { day: 'Sun', cashIn: 19200, cashOut: 11800, net: 7400 }
];

export const cashFlowSummary = {
  totalCashIn: 130400,
  totalCashOut: 78400,
  netCashFlow: 52000,
  openingBalance: 45280,
  closingBalance: 97280,
  cashFlowGrowth: 14.8
};

export const topDebtors = [
  { name: 'ABC Corporation', amount: 18400, daysOverdue: 45, phone: '+251 911 234567' },
  { name: 'XYZ Limited', amount: 15200, daysOverdue: 32, phone: '+251 911 345678' },
  { name: 'Global Tech Inc', amount: 12800, daysOverdue: 18, phone: '+251 911 456789' },
  { name: 'Smith & Associates', amount: 9600, daysOverdue: 8, phone: '+251 911 567890' }
];

export const topExpenseVendors = [
  { name: 'Office Depot', category: 'Supplies', amount: 6800, transactions: 12 },
  { name: 'Electric Company', category: 'Utilities', amount: 5400, transactions: 1 },
  { name: 'Internet Provider', category: 'Utilities', amount: 3800, transactions: 1 },
  { name: 'Fuel Station', category: 'Transport', amount: 7320, transactions: 24 }
];
