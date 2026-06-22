import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import { useData } from '../context/DataContext';
import ExpenseItem from '../components/ExpenseItem';
import RecordFormModal from '../components/RecordFormModal';
import FilterModal from '../components/FilterModal';
import { expenseBreakdown } from '../data/mockDashboard';

const screenWidth = Dimensions.get('window').width;

export default function ExpensesScreen({ route }) {
  const { colors = Colors, formatCurrency } = useApp();
  const { expenses, addExpense } = useData();
  const styles = createStyles(colors);
  const [search, setSearch] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (route?.params?.openAddModal) {
      setModalVisible(true);
    }
  }, [route?.params]);

  const expensesFields = [
    { name: 'category', label: 'Category', type: 'select', options: ['Rent', 'Salary', 'Transport', 'Utilities', 'Other'], defaultValue: 'Other' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
    { name: 'date', label: 'Date', type: 'date', placeholder: 'YYYY-MM-DD' },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'What was this expense for?' },
  ];

  const handleAddExpense = (formData) => {
    const newExpense = {
      id: `EXP-0${Math.floor(100 + Math.random() * 900)}`,
      date: formData.date || new Date().toISOString().split('T')[0],
      category: formData.category || 'Other',
      description: formData.description || 'New Expense',
      amount: parseFloat(formData.amount) || 0,
    };
    addExpense(newExpense);
  };

  const filterConfig = [
    { name: 'category', label: 'Category', options: ['Rent', 'Salary', 'Transport', 'Utilities', 'Other'] },
    { name: 'sortAmount', label: 'Sort by Amount', options: ['Highest First', 'Lowest First'] }
  ];

  let filteredExpenses = expenses.filter(expense => 
    expense.description.toLowerCase().includes(search.toLowerCase()) || 
    expense.category.toLowerCase().includes(search.toLowerCase())
  );

  if (activeFilters.category) {
    filteredExpenses = filteredExpenses.filter(expense => expense.category === activeFilters.category);
  }

  if (activeFilters.sortAmount === 'Highest First') {
    filteredExpenses.sort((a, b) => b.amount - a.amount);
  } else if (activeFilters.sortAmount === 'Lowest First') {
    filteredExpenses.sort((a, b) => a.amount - b.amount);
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, { color: colors.textCore }]}
            placeholder="Search expenses..."
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
        data={filteredExpenses}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExpenseItem expense={item} />
        )}
        ListHeaderComponent={
          <View style={[styles.summaryCard, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
            <Text style={[styles.summaryTitle, { color: colors.textSec }]}>Total Expenses This Month</Text>
            <Text style={[styles.summaryAmount, { color: colors.textCore }]}>{formatCurrency(71450)}</Text>
            <PieChart
              data={expenseBreakdown.map(item => ({
                name: item.name,
                population: item.value,
                color: item.color,
                legendFontColor: colors.textSec,
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
            <MaterialCommunityIcons name="inbox-outline" size={48} color={colors.textMute} />
            <Text style={[styles.emptyText, { color: colors.textMute }]}>No expenses found</Text>
          </View>
        }
      />
      
      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent, shadowColor: colors.accent }]} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <RecordFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddExpense}
        title="Record Expense"
        fields={expensesFields}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilters}
        title="Filter Expenses"
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
  summaryCard: {
    backgroundColor: colors.bgPanel,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  summaryTitle: {
    color: colors.textSec,
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    color: colors.textCore,
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
    color: colors.textMute,
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
