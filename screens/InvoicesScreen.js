import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const MOCK_INVOICES = [
  { id: 'INV-001', client: 'Abebe Bekele', date: 'Oct 12, 2023', amount: '4,500', status: 'Paid' },
  { id: 'INV-002', client: 'XYZ Corp', date: 'Oct 15, 2023', amount: '12,000', status: 'Pending' },
  { id: 'INV-003', client: 'Sara Alemu', date: 'Oct 18, 2023', amount: '3,200', status: 'Overdue' },
  { id: 'INV-004', client: 'Beka Trading', date: 'Oct 20, 2023', amount: '8,500', status: 'Pending' },
];

export default function InvoicesScreen() {
  const [search, setSearch] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return Colors.success;
      case 'Pending': return Colors.warning;
      case 'Overdue': return Colors.danger;
      default: return Colors.textMute;
    }
  };

  const filteredInvoices = MOCK_INVOICES.filter(inv => 
    inv.client.toLowerCase().includes(search.toLowerCase()) || 
    inv.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search invoices..."
            placeholderTextColor={Colors.textMute}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons name="filter-variant" size={20} color={Colors.textCore} />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={filteredInvoices}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.invoiceCard}>
            <View style={styles.invoiceHeader}>
              <Text style={styles.invoiceId}>{item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.invoiceBody}>
              <View>
                <Text style={styles.clientName}>{item.client}</Text>
                <Text style={styles.invoiceDate}>{item.date}</Text>
              </View>
              <Text style={styles.invoiceAmount}>ETB {item.amount}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
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
    backgroundColor: Colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  searchIcon: {
    paddingLeft: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    color: Colors.textCore,
  },
  filterBtn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  invoiceCard: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  invoiceId: {
    color: Colors.textSec,
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
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  invoiceDate: {
    color: Colors.textMute,
    fontSize: 13,
  },
  invoiceAmount: {
    color: Colors.textCore,
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
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
