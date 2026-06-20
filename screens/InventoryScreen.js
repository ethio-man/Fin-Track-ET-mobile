import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import ProductCard from '../components/ProductCard';
import { mockInventory } from '../data/mockInventory';

export default function InventoryScreen() {
  const [search, setSearch] = useState('');

  const filteredInventory = mockInventory.filter(product => 
    product.name.toLowerCase().includes(search.toLowerCase()) || 
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search products..."
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
        data={filteredInventory}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => {}} />
        )}
        ListHeaderComponent={
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert" size={20} color={Colors.warning} />
              <Text style={styles.alertTitle}>Low Stock Alerts</Text>
            </View>
            <Text style={styles.alertText}>1 item requires your attention</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="package-variant" size={48} color={Colors.textMute} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
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
  alertCard: {
    backgroundColor: Colors.bgPanel,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.warning,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  alertTitle: {
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertText: {
    color: Colors.textSec,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textMute,
    marginTop: 16,
    fontSize: 16,
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
