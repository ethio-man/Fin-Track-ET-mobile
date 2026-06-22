export const mockSales = [
  {
    id: '#29345',
    date: '07 Jan, 2022',
    time: '10:30 AM',
    customer: 'Yosef Anteneh',
    customerPhone: '+251 911 234567',
    items: [
      { id: '1', product: 'Premium Coffee Beans', quantity: 2, unitPrice: 450, subtotal: 900 },
      { id: '2', product: 'Ceramic Mug Set', quantity: 1, unitPrice: 250, subtotal: 250 }
    ],
    subtotal: 1150,
    discount: 50,
    total: 1100,
    paymentMethod: 'cash',
    status: 'complete',
    amountPaid: 1100,
    balanceDue: 0
  },
  {
    id: '#23848',
    date: '07 Jan, 2022',
    time: '11:15 AM',
    customer: 'Natnael Mekbib',
    customerPhone: '+251 911 345678',
    items: [
      { id: '1', product: 'Office Chair Deluxe', quantity: 3, unitPrice: 1200, subtotal: 3600 }
    ],
    subtotal: 3600,
    discount: 0,
    total: 3600,
    paymentMethod: 'telebirr',
    status: 'complete',
    amountPaid: 3600,
    balanceDue: 0
  },
  {
    id: '#23466',
    date: '06 Jan, 2022',
    time: '2:45 PM',
    customer: 'Abeba Negesse',
    customerPhone: '+251 911 456789',
    items: [
      { id: '1', product: 'Laptop Stand', quantity: 1, unitPrice: 850, subtotal: 850 }
    ],
    subtotal: 850,
    discount: 100,
    total: 750,
    paymentMethod: 'bank',
    status: 'pending',
    amountPaid: 0,
    balanceDue: 750
  },
  {
    id: '#19394',
    date: '05 Jan, 2022',
    time: '9:20 AM',
    customer: 'Annet Getahun',
    customerPhone: '+251 911 567890',
    items: [
      { id: '1', product: 'Wireless Mouse', quantity: 2, unitPrice: 320, subtotal: 640 }
    ],
    subtotal: 640,
    discount: 0,
    total: 640,
    paymentMethod: 'credit',
    status: 'canceled',
    amountPaid: 0,
    balanceDue: 0
  },
  {
    id: '#19217',
    date: '05 Jan, 2022',
    time: '3:10 PM',
    customer: 'Fiker Alemayehu',
    customerPhone: '+251 911 678901',
    items: [
      { id: '1', product: 'Desk Organizer', quantity: 1, unitPrice: 450, subtotal: 450 }
    ],
    subtotal: 450,
    discount: 0,
    total: 450,
    paymentMethod: 'cash',
    status: 'complete',
    amountPaid: 450,
    balanceDue: 0
  }
];

export const mockProducts = [
  { id: '1', name: 'Premium Coffee Beans', price: 450, category: 'Beverages', stock: 150 },
  { id: '2', name: 'Ceramic Mug Set', price: 250, category: 'Kitchen', stock: 80 },
  { id: '3', name: 'Office Chair Deluxe', price: 1200, category: 'Furniture', stock: 25 },
  { id: '4', name: 'Laptop Stand', price: 850, category: 'Electronics', stock: 45 },
  { id: '5', name: 'Wireless Mouse', price: 320, category: 'Electronics', stock: 120 },
  { id: '6', name: 'Desk Organizer', price: 450, category: 'Office Supplies', stock: 60 },
  { id: '7', name: 'USB-C Cable', price: 180, category: 'Electronics', stock: 200 },
  { id: '8', name: 'Notebook A5', price: 120, category: 'Stationery', stock: 300 }
];

export const mockCustomers = [
  'Yosef Anteneh',
  'Natnael Mekbib',
  'Abeba Negesse',
  'Annet Getahun',
  'Fiker Alemayehu',
  'Habtamu Jemberie',
  'Birhanu Kebede',
  'Lelise Wondimagegn'
];

export const periodComparisonData = [
  { time: '00:00', revenue: 15200, transactions: 12100, refunds: 2800 },
  { time: '06:00', revenue: 18400, transactions: 14300, refunds: 3100 },
  { time: '12:00', revenue: 22100, transactions: 16800, refunds: 3400 },
  { time: '18:00', revenue: 24800, transactions: 18200, refunds: 3350 },
  { time: '20:00', revenue: 25680, transactions: 18420, refunds: 3260 }
];
