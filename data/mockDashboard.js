// Mock Dashboard Data — ported from FinTrack ET web app

export const kpiData = {
  todaysSales:  { value: 12426, change: 36,  isPositive: true  },
  profit:       { value: 8945,  change: 24,  isPositive: true  },
  expenses:     { value: 3481,  change: 14,  isPositive: false },
  cashBalance:  { value: 45280, change: 12,  isPositive: true  },
};

export const weeklyProfitData = [
  { day: 'Mon', profit: 3200, revenue: 5400 },
  { day: 'Tue', profit: 2800, revenue: 4900 },
  { day: 'Wed', profit: 4100, revenue: 6200 },
  { day: 'Thu', profit: 3600, revenue: 5800 },
  { day: 'Fri', profit: 4800, revenue: 7100 },
  { day: 'Sat', profit: 5200, revenue: 7800 },
  { day: 'Sun', profit: 3900, revenue: 6400 },
];

export const recentTransactions = [
  { id: 1, type: 'sale',    description: 'Invoice #1234 – ABC Corp',       amount:  450.00, date: 'May 31' },
  { id: 2, type: 'expense', description: 'Office Supplies',                 amount: -125.50, date: 'May 31' },
  { id: 3, type: 'sale',    description: 'Service Payment – INV #1235',    amount:  890.00, date: 'May 30' },
  { id: 4, type: 'expense', description: 'Utility Bills',                   amount: -340.00, date: 'May 30' },
  { id: 5, type: 'sale',    description: 'Invoice #1236 – Tech Solutions',  amount:  620.00, date: 'May 29' },
];

export const topDebtors = [
  { id: 1, name: 'Jenny Wilson',  email: 'j.wilson@example.com',    amount: 11234, overdueDays: 15 },
  { id: 2, name: 'Devon Lane',    email: 'dst.roberts@example.com', amount: 11159, overdueDays: 8  },
  { id: 3, name: 'Jane Cooper',   email: 'jgraham@example.com',     amount: 10483, overdueDays: 22 },
  { id: 4, name: 'Robert Fox',    email: 'robert.f@example.com',    amount: 9875,  overdueDays: 5  },
];

export const lowStockAlerts = [
  { id: 1, product: 'Premium Coffee Beans', currentStock: 12, reorderLevel: 50, category: 'Beverages'     },
  { id: 2, product: 'Printer Paper A4',     currentStock: 8,  reorderLevel: 30, category: 'Office Supplies'},
  { id: 3, product: 'Hand Sanitizer 500ml', currentStock: 5,  reorderLevel: 25, category: 'Health & Safety'},
  { id: 4, product: 'USB Flash Drives 32GB',currentStock: 15, reorderLevel: 40, category: 'Electronics'   },
];

export const remindersToday = [
  { id: 1, customer: 'ABC Corporation',   amount: 2500, time: '10:00 AM', type: 'Payment Due',   priority: 'high'   },
  { id: 2, customer: 'Smith & Associates',amount: 1800, time: '2:00 PM',  type: 'Follow-up Call',priority: 'medium' },
  { id: 3, customer: 'Global Tech Inc',   amount: 3200, time: '4:30 PM',  type: 'Payment Due',   priority: 'high'   },
];

export const expenseBreakdown = [
  { name: 'Operations', value: 50, color: '#3B82F6' },
  { name: 'Marketing',  value: 30, color: '#22C55E' },
  { name: 'Admin',      value: 20, color: '#F59E0B' },
];
