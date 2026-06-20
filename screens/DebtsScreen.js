import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const MOCK_DEBTS = [
  { id: '1', name: 'Dawit Tadesse', type: 'owe_me', amount: '2,500', dueDate: 'Oct 25', status: 'Pending' },
  { id: '2', name: 'Office Supplier', type: 'i_owe', amount: '8,000', dueDate: 'Oct 30', status: 'Pending' },
  { id: '3', name: 'Helen Kebede', type: 'owe_me', amount: '1,200', dueDate: 'Oct 15', status: 'Overdue' },
];

export default function DebtsScreen() {
  const [tab, setTab] = useState('owe_me');

  const filteredDebts = MOCK_DEBTS.filter(debt => debt.type === tab);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, tab === 'owe_me' && styles.activeTab]}
          onPress={() => setTab('owe_me')}
        >
          <Text style={[styles.tabText, tab === 'owe_me' && styles.activeTabText]}>To Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, tab === 'i_owe' && styles.activeTab]}
          onPress={() => setTab('i_owe')}
        >
          <Text style={[styles.tabText, tab === 'i_owe' && styles.activeTabText]}>To Pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          Total {tab === 'owe_me' ? 'Receivables' : 'Payables'}
        </Text>
        <Text style={[styles.summaryAmount, { color: tab === 'owe_me' ? Colors.success : Colors.danger }]}>
          ETB {tab === 'owe_me' ? '3,700' : '8,000'}
        </Text>
      </View>

      <FlatList 
        data={filteredDebts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.debtCard}>
            <View style={styles.debtLeft}>
              <View style={[styles.avatar, { backgroundColor: tab === 'owe_me' ? Colors.successBg : Colors.dangerBg }]}>
                <Text style={[styles.avatarText, { color: tab === 'owe_me' ? Colors.success : Colors.danger }]}>
                  {item.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={styles.debtName}>{item.name}</Text>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons 
                    name={item.status === 'Overdue' ? 'alert-circle' : 'calendar-blank'} 
                    size={14} 
                    color={item.status === 'Overdue' ? Colors.danger : Colors.textMute} 
                  />
                  <Text style={[styles.debtDate, item.status === 'Overdue' && { color: Colors.danger }]}>
                    Due: {item.dueDate}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.debtRight}>
              <Text style={styles.debtAmount}>ETB {item.amount}</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionText}>{tab === 'owe_me' ? 'Remind' : 'Pay'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="check-circle-outline" size={48} color={Colors.textMute} />
            <Text style={styles.emptyText}>No {tab === 'owe_me' ? 'receivables' : 'debts'} found.</Text>
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
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  activeTab: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent,
  },
  tabText: {
    color: Colors.textSec,
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: Colors.accentLight,
  },
  summaryContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  summaryTitle: {
    color: Colors.textSec,
    fontSize: 14,
    marginBottom: 8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  debtCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderCore,
  },
  debtLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  debtName: {
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  debtDate: {
    color: Colors.textMute,
    fontSize: 13,
  },
  debtRight: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionBtn: {
    backgroundColor: Colors.bgPanelInner,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  actionText: {
    color: Colors.textCore,
    fontSize: 12,
    fontWeight: '600',
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
