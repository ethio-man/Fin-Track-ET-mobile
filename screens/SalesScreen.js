import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import SaleCard from '../components/SaleCard';
import { mockSales, periodComparisonData } from '../data/mockSales';

const screenWidth = Dimensions.get('window').width;

export default function SalesScreen() {
  const [search, setSearch] = useState('');

  const filteredSales = mockSales.filter(sale => 
    sale.customer.toLowerCase().includes(search.toLowerCase()) || 
    sale.id.toLowerCase().includes(search.toLowerCase())
  );

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
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialCommunityIcons name="filter-variant" size={20} color={Colors.textCore} />
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
