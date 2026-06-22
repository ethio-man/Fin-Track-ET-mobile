import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import ProductCard from '../components/ProductCard';
import RecordFormModal from '../components/RecordFormModal';
import { mockInventory } from '../data/mockInventory';

const screenWidth = Dimensions.get('window').width;

export default function InventoryScreen({ route }) {
  const [search, setSearch] = useState('');
  const [inventoryList, setInventoryList] = useState(mockInventory);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (route?.params?.openAddModal) {
      setModalVisible(true);
    }
  }, [route?.params]);

  const inventoryFields = [
    { name: 'name', label: 'Product Name', type: 'text', placeholder: 'e.g. Premium Coffee Beans' },
    { name: 'sku', label: 'SKU', type: 'text', placeholder: 'e.g. BEV-CB-001' },
    { name: 'category', label: 'Category', type: 'select', options: ['Beverages', 'Electronics', 'Furniture', 'Office Supplies', 'Stationery', 'Health & Safety', 'Kitchen'], defaultValue: 'Electronics' },
    { name: 'sellingPrice', label: 'Selling Price', type: 'number', placeholder: '0.00' },
    { name: 'stock', label: 'Initial Stock', type: 'number', placeholder: '0' },
  ];

  const handleAddProduct = (formData) => {
    const newProduct = {
      id: `PRD-0${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name || 'New Product',
      sku: formData.sku || 'N/A',
      category: formData.category || 'Electronics',
      stock: parseInt(formData.stock, 10) || 0,
      price: parseFloat(formData.sellingPrice) || 0,
      cost: 0,
      status: 'In Stock'
    };
    setInventoryList([newProduct, ...inventoryList]);
  };

  const filteredInventory = inventoryList.filter(product => 
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
          <>
            <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <MaterialCommunityIcons name="alert" size={20} color={Colors.warning} />
              <Text style={styles.alertTitle}>Low Stock Alerts</Text>
            </View>
              <Text style={styles.alertText}>1 item requires your attention</Text>
            </View>
            <View style={[styles.alertCard, { borderColor: Colors.borderCore, padding: 0, paddingVertical: 16, alignItems: 'center' }]}>
              <Text style={[styles.alertTitle, { marginBottom: 16 }]}>Stock Levels</Text>
              <BarChart
                data={{
                  labels: inventoryList.slice(0, 4).map(p => p.name.split(' ')[0]), // Short names
                  datasets: [
                    {
                      data: inventoryList.slice(0, 4).map(p => p.stock)
                    }
                  ]
                }}
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                chartConfig={{
                  backgroundColor: Colors.bgPanel,
                  backgroundGradientFrom: Colors.bgPanel,
                  backgroundGradientTo: Colors.bgPanel,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
              />
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="package-variant" size={48} color={Colors.textMute} />
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <RecordFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddProduct}
        title="Add Product"
        fields={inventoryFields}
      />
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
