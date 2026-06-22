import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import InvoiceDetailModal from '../components/InvoiceDetailModal';
import RecordFormModal from '../components/RecordFormModal';
import FilterModal from '../components/FilterModal';

const MOCK_INVOICES = [
  { id: 'INV-2024-001', client: 'Abebe Kebede', amount: '4,500', date: 'Oct 12, 2024', status: 'Paid' },
  { id: 'INV-2024-002', client: 'Sara Tech Solutions', amount: '12,000', date: 'Oct 15, 2024', status: 'Pending' },
  { id: 'INV-2024-003', client: 'XYZ Trading', amount: '8,750', date: 'Oct 05, 2024', status: 'Overdue' },
];

export default function InvoicesScreen({ route }) {
  const { colors = Colors, formatCurrency } = useApp();
  const styles = createStyles(colors);
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [invoicesList, setInvoicesList] = useState(MOCK_INVOICES);
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (route?.params?.openAddModal) {
      setAddModalVisible(true);
    }
  }, [route?.params]);

  const invoiceFields = [
    { name: 'client', label: 'Client Name', type: 'text', placeholder: 'e.g. John Doe' },
    { name: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD' },
    { name: 'dueDate', label: 'Due Date', type: 'date', placeholder: 'YYYY-MM-DD' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
    { name: 'status', label: 'Status', type: 'select', options: ['Draft', 'Pending', 'Paid', 'Overdue'], defaultValue: 'Draft' },
  ];

  const handleAddInvoice = (formData) => {
    const newInvoice = {
      id: `INV-00${Math.floor(10 + Math.random() * 90)}`,
      client: formData.client || 'New Client',
      date: formData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: formData.amount ? parseFloat(formData.amount).toLocaleString() : '0',
      status: formData.status || 'Draft',
    };
    setInvoicesList([newInvoice, ...invoicesList]);
  };

  const handleInvoicePress = (invoice) => {
    setSelectedInvoice(invoice);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return colors.success;
      case 'Pending': return colors.warning;
      case 'Overdue': return colors.danger;
      default: return colors.textMute;
    }
  };

  const filterConfig = [
    { name: 'status', label: 'Status', options: ['Draft', 'Pending', 'Paid', 'Overdue'] },
    { name: 'sortAmount', label: 'Sort by Amount', options: ['Highest First', 'Lowest First'] }
  ];

  let filteredInvoices = invoicesList.filter(inv => 
    inv.client.toLowerCase().includes(search.toLowerCase()) || 
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  if (activeFilters.status) {
    filteredInvoices = filteredInvoices.filter(inv => inv.status === activeFilters.status);
  }

  if (activeFilters.sortAmount === 'Highest First') {
    filteredInvoices.sort((a, b) => parseFloat(b.amount.replace(/,/g, '')) - parseFloat(a.amount.replace(/,/g, '')));
  } else if (activeFilters.sortAmount === 'Lowest First') {
    filteredInvoices.sort((a, b) => parseFloat(a.amount.replace(/,/g, '')) - parseFloat(b.amount.replace(/,/g, '')));
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, { color: colors.textCore }]}
            placeholder="Search invoices..."
            placeholderTextColor={colors.textMute}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]} onPress={() => setFilterVisible(true)}>
          <MaterialCommunityIcons 
            name={Object.keys(activeFilters).length > 0 ? "filter-check" : "filter-variant"} 
            size={20} 
            color={Object.keys(activeFilters).length > 0 ? colors.accentLight : colors.textCore} 
          />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={filteredInvoices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.invoiceCard, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]} onPress={() => handleInvoicePress(item)}>
            <View style={styles.invoiceHeader}>
              <Text style={[styles.invoiceId, { color: colors.textSec }]}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.invoiceBody}>
              <View>
                <Text style={[styles.clientName, { color: colors.textCore }]}>{item.client}</Text>
                <Text style={[styles.invoiceDate, { color: colors.textMute }]}>{item.date}</Text>
              </View>
              <Text style={[styles.invoiceAmount, { color: colors.textCore }]}>{formatCurrency(item.amount.replace(/,/g, ''))}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent, shadowColor: colors.accent }]} onPress={() => setAddModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <InvoiceDetailModal 
        visible={modalVisible} 
        invoice={selectedInvoice} 
        onClose={() => setModalVisible(false)} 
      />

      <RecordFormModal 
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={handleAddInvoice}
        title="Create Invoice"
        fields={invoiceFields}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilters}
        title="Filter Invoices"
        filters={filterConfig}
        currentFilters={activeFilters}
      />
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCore,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  searchIcon: {
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    color: colors.textCore,
  },
  filterBtn: {
    width: 40,
    height: 40,
    backgroundColor: colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCore,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  invoiceCard: {
    backgroundColor: colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceId: {
    color: colors.textSec,
    fontSize: 14,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  invoiceBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  clientName: {
    color: colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceDate: {
    color: colors.textMute,
    fontSize: 13,
  },
  invoiceAmount: {
    color: colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
