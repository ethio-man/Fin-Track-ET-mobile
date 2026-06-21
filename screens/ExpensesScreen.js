import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import ExpenseItem from '../components/ExpenseItem';
import { mockExpenses } from '../data/mockExpenses';
import { expenseBreakdown } from '../data/mockDashboard';

const screenWidth = Dimensions.get('window').width;

export default function ExpensesScreen() {
  const [search, setSearch] = useState('');

  const filteredExpenses = mockExpenses.filter(expense => 
    expense.description.toLowerCase().includes(search.toLowerCase()) || 
    expense.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search expenses..."
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
        data={filteredExpenses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExpenseItem expense={item} />
        )}
        ListHeaderComponent={
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Expenses This Month</Text>
            <Text style={styles.summaryAmount}>ETB 71,450</Text>
            <PieChart
              data={expenseBreakdown.map(item => ({
                name: item.name,
                population: item.value,
                color: item.color,
                legendFontColor: Colors.textSec,
                legendFontSize: 12
              }))}
              width={screenWidth - 72}
              height={180}
              chartConfig={{
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              center={[10, 0]}
              absolute
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="inbox-outline" size={48} color={Colors.textMute} />
            <Text style={styles.emptyText}>No expenses found</Text>
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
  summaryCard: {
    backgroundColor: Colors.bgPanel,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  summaryTitle: {
    color: Colors.textSec,
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    color: Colors.textCore,
    fontSize: 28,
    fontWeight: 'bold',
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
