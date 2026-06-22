import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import SaleCard from '../components/SaleCard';
import RecordFormModal from '../components/RecordFormModal';
import FilterModal from '../components/FilterModal';
import { mockSales, periodComparisonData } from '../data/mockSales';

const screenWidth = Dimensions.get('window').width;

export default function SalesScreen({ route }) {
  const [search, setSearch] = useState('');
  const [salesList, setSalesList] = useState(mockSales);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (route?.params?.openAddModal) {
      setModalVisible(true);
    }
  }, [route?.params]);

  const salesFields = [
    { name: 'customer', label: 'Customer Name', type: 'text', placeholder: 'e.g. John Doe' },
    { name: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD' },
    { name: 'total', label: 'Total Amount', type: 'number', placeholder: '0.00' },
    { name: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Telebirr', 'Bank', 'Credit'], defaultValue: 'Cash' },
  ];

  const handleAddSale = (formData) => {
    const newSale = {
      id: `#${Math.floor(10000 + Math.random() * 90000)}`,
      customer: formData.customer || 'Unknown Customer',
      total: parseFloat(formData.total) || 0,
      date: formData.date || new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod.toLowerCase(),
      status: 'complete',
      items: [],
    };
    setSalesList([newSale, ...salesList]);
  };

  const filterConfig = [
    { name: 'paymentMethod', label: 'Payment Method', options: ['cash', 'telebirr', 'bank', 'credit'] },
    { name: 'sortAmount', label: 'Sort by Amount', options: ['Highest First', 'Lowest First'] }
  ];

  let filteredSales = salesList.filter(sale => 
    sale.customer.toLowerCase().includes(search.toLowerCase()) || 
    sale.id.toLowerCase().includes(search.toLowerCase())
  );

  if (activeFilters.paymentMethod) {
    filteredSales = filteredSales.filter(sale => sale.paymentMethod === activeFilters.paymentMethod);
  }

  if (activeFilters.sortAmount === 'Highest First') {
    filteredSales.sort((a, b) => b.total - a.total);
  } else if (activeFilters.sortAmount === 'Lowest First') {
    filteredSales.sort((a, b) => a.total - b.total);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search sales..."
            placeholderTextColor={Colors.textMute}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <MaterialCommunityIcons 
            name={Object.keys(activeFilters).length > 0 ? "filter-check" : "filter-variant"} 
            size={20} 
            color={Object.keys(activeFilters).length > 0 ? Colors.accentLight : Colors.textCore} 
          />
        </TouchableOpacity>
      </View>

      <FlatList 
        data={filteredSales}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <SaleCard sale={item} onPress={() => {}} />
        )}
        ListHeaderComponent={
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Sales Trend</Text>
            <LineChart
              data={{
                labels: periodComparisonData.map(d => d.time),
                datasets: [
                  {
                    data: periodComparisonData.map(d => d.revenue),
                    color: (opacity = 1) => `rgba(165, 180, 252, ${opacity})`,
                    strokeWidth: 2
                  }
                ]
              }}
              width={screenWidth - 32}
              height={220}
              yAxisLabel="ETB "
              chartConfig={{
                backgroundColor: Colors.bgPanel,
                backgroundGradientFrom: Colors.bgPanel,
                backgroundGradientTo: Colors.bgPanel,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(148, 163, 184, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
                alignSelf: 'center'
              }}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="inbox-outline" size={48} color={Colors.textMute} />
            <Text style={styles.emptyText}>No sales found</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <RecordFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddSale}
        title="Record New Sale"
        fields={salesFields}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilters}
        title="Filter Sales"
        filters={filterConfig}
        currentFilters={activeFilters}
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
  chartCard: {
    backgroundColor: Colors.bgPanel,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    alignItems: 'center',
  },
  chartTitle: {
    color: Colors.textCore,
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
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
