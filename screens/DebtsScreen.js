import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Alert, Platform, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';
import RecordFormModal from '../components/RecordFormModal';
import FilterModal from '../components/FilterModal';

const MOCK_DEBTS = [
  { id: '1', name: 'Almaz Supply', amount: '3,200', dueDate: 'Oct 20, 2024', status: 'Pending', type: 'owe_me' },
  { id: '2', name: 'Yared Getachew', amount: '500', dueDate: 'Oct 18, 2024', status: 'Pending', type: 'owe_me' },
  { id: '3', name: 'Office Rent', amount: '8,000', dueDate: 'Oct 25, 2024', status: 'Pending', type: 'i_owe' },
];

export default function DebtsScreen({ route }) {
  const { colors = Colors, formatCurrency } = useApp();
  const styles = createStyles(colors);
  const [tab, setTab] = useState('owe_me');
  const [search, setSearch] = useState('');
  const [debtsList, setDebtsList] = useState(MOCK_DEBTS);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    if (route?.params?.openAddModal) {
      setModalVisible(true);
    }
  }, [route?.params]);

  const debtsFields = [
    { name: 'type', label: 'Type', type: 'select', options: [{ label: 'To Receive', value: 'owe_me' }, { label: 'To Pay', value: 'i_owe' }], defaultValue: 'owe_me' },
    { name: 'contactName', label: 'Contact Name', type: 'text', placeholder: 'e.g. John Doe' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00' },
    { name: 'dueDate', label: 'Due Date', type: 'date', placeholder: 'YYYY-MM-DD' },
  ];

  const handleAddDebt = (formData) => {
    const newDebt = {
      id: `${Math.floor(100 + Math.random() * 900)}`,
      name: formData.contactName || 'New Contact',
      type: formData.type || 'owe_me',
      amount: formData.amount || '0',
      dueDate: formData.dueDate || new Date().toISOString().split('T')[0],
      status: 'Pending',
    };
    setDebtsList([newDebt, ...debtsList]);
  };

  const filterConfig = [
    { name: 'status', label: 'Status', options: ['Pending', 'Overdue'] },
    { name: 'sortAmount', label: 'Sort by Amount', options: ['Highest First', 'Lowest First'] }
  ];

  let filteredDebts = debtsList.filter(debt => debt.type === tab);

  if (search) {
    filteredDebts = filteredDebts.filter(debt => debt.name.toLowerCase().includes(search.toLowerCase()));
  }

  if (activeFilters.status) {
    filteredDebts = filteredDebts.filter(debt => debt.status === activeFilters.status);
  }

  if (activeFilters.sortAmount === 'Highest First') {
    filteredDebts.sort((a, b) => parseFloat(b.amount.replace(/,/g, '')) - parseFloat(a.amount.replace(/,/g, '')));
  } else if (activeFilters.sortAmount === 'Lowest First') {
    filteredDebts.sort((a, b) => parseFloat(a.amount.replace(/,/g, '')) - parseFloat(b.amount.replace(/,/g, '')));
  }

  const generateAgreement = async (debt) => {
    try {
      const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const isOweMe = debt.type === 'owe_me';
      const creditorName = isOweMe ? 'FinanceTrack Business' : debt.name;
      const debtorName = isOweMe ? debt.name : 'FinanceTrack Business';
      const formattedAmount = formatCurrency(debt.amount.replace(/,/g, ''));

      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Times New Roman', Times, serif;
                padding: 40px;
                color: #000;
                line-height: 1.6;
                background-color: #f2f5f6;
              }
              h1 {
                text-align: center;
                color: #003366;
                font-size: 20px;
                margin-bottom: 30px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                font-weight: bold;
              }
              p {
                font-size: 16px;
                margin-bottom: 20px;
                color: #111;
              }
              .parties {
                margin-bottom: 30px;
              }
              .party {
                font-size: 16px;
                margin-bottom: 12px;
                color: #000;
              }
              .party-role {
                color: #333;
              }
              .amount-section {
                margin-bottom: 30px;
              }
              .reference {
                margin-bottom: 60px;
                color: #003366;
              }
              .signatures {
                display: flex;
                justify-content: space-between;
                margin-top: 60px;
              }
              .signature-block {
                width: 40%;
              }
              .signature-line {
                border-bottom: 1px solid #777;
                margin-bottom: 8px;
                height: 30px;
              }
              .signature-label {
                color: #003366;
                font-size: 14px;
              }
              .bold-black {
                font-weight: bold;
                color: #000;
              }
              .bold-blue {
                font-weight: bold;
                color: #003366;
              }
            </style>
          </head>
          <body>
            <h1>PAYMENT AGREEMENT</h1>
            
            <p style="margin-bottom: 35px;">This agreement is entered into on <strong class="bold-black">${today}</strong> between:</p>
            
            <div class="parties" style="margin-bottom: 35px;">
              <div class="party"><strong class="bold-blue">${creditorName}</strong> <span class="party-role">(Creditor)</span></div>
              <div class="party"><strong class="bold-blue">${debtorName}</strong> — ${debt.phone || '+251 911 234 567'} <span class="party-role">(Debtor)</span></div>
            </div>
            
            <div class="amount-section" style="margin-bottom: 35px;">
              <p>The debtor agrees to repay the outstanding balance of <strong class="bold-black">${formattedAmount}</strong> by <strong class="bold-black">${debt.dueDate}</strong>.</p>
            </div>
            
            <div class="reference" style="margin-bottom: 60px;">
              <p style="color: #003366;">Reference: ${debt.reference || 'Outstanding payment for office supplies delivery — Invoice #1201'}</p>
            </div>
            
            <div class="signatures">
              <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">Creditor Signature</div>
              </div>
              <div class="signature-block">
                <div class="signature-line"></div>
                <div class="signature-label">Debtor Signature</div>
              </div>
            </div>
          </body>
        </html>
      `;

      if (Platform.OS === 'web') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(html);
          printWindow.document.close();
          printWindow.focus();
          
          // Small delay to ensure content is rendered before printing
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
          }, 250);
        } else {
          Alert.alert('Error', 'Please allow pop-ups to print the agreement.');
        }
      } else {
        await Print.printAsync({ html });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to generate the agreement document.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }, tab === 'owe_me' && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
          onPress={() => setTab('owe_me')}
        >
          <Text style={[styles.tabText, { color: colors.textSec }, tab === 'owe_me' && { color: colors.accentLight }]}>To Receive</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }, tab === 'i_owe' && { backgroundColor: colors.accentSoft, borderColor: colors.accent }]}
          onPress={() => setTab('i_owe')}
        >
          <Text style={[styles.tabText, { color: colors.textSec }, tab === 'i_owe' && { color: colors.accentLight }]}>To Pay</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={[styles.searchContainer, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textMute} style={styles.searchIcon} />
          <TextInput 
            style={[styles.searchInput, { color: colors.textCore }]}
            placeholder="Search debts..."
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

      <View style={styles.summaryContainer}>
        <Text style={[styles.summaryTitle, { color: colors.textSec }]}>
          Total {tab === 'owe_me' ? 'Receivables' : 'Payables'}
        </Text>
        <Text style={[styles.summaryAmount, { color: tab === 'owe_me' ? colors.success : colors.danger }]}>
          {formatCurrency(tab === 'owe_me' ? 3700 : 8000)}
        </Text>
      </View>

      <FlatList 
        data={filteredDebts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.debtCard, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
            <View style={styles.debtLeft}>
              <View style={[styles.avatar, { backgroundColor: tab === 'owe_me' ? colors.successBg : colors.dangerBg }]}>
                <Text style={[styles.avatarText, { color: tab === 'owe_me' ? colors.success : colors.danger }]}>
                  {item.name.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={[styles.debtName, { color: colors.textCore }]}>{item.name}</Text>
                <View style={styles.dateContainer}>
                  <MaterialCommunityIcons 
                    name={item.status === 'Overdue' ? 'alert-circle' : 'calendar-blank'} 
                    size={14} 
                    color={item.status === 'Overdue' ? colors.danger : colors.textMute} 
                  />
                  <Text style={[styles.debtDate, { color: colors.textMute }, item.status === 'Overdue' && { color: colors.danger }]}>
                    Due: {item.dueDate}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.debtRight}>
              <Text style={[styles.debtAmount, { color: colors.textCore }]}>{formatCurrency(item.amount.replace(/,/g, ''))}</Text>
              <View style={styles.actionsContainer}>
                <TouchableOpacity 
                  style={[styles.iconBtn, { backgroundColor: colors.bgPanelInner, borderColor: colors.borderSubtle }]} 
                  onPress={() => generateAgreement(item)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons name="file-document-outline" size={18} color={colors.textSec} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: colors.bgPanelInner, borderColor: colors.borderSubtle }]}>
                  <Text style={[styles.actionText, { color: colors.textCore }]}>{tab === 'owe_me' ? 'Remind' : 'Pay'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="check-circle-outline" size={48} color={colors.textMute} />
            <Text style={[styles.emptyText, { color: colors.textMute }]}>No {tab === 'owe_me' ? 'receivables' : 'debts'} found.</Text>
          </View>
        }
      />

      <TouchableOpacity style={[styles.fab, { backgroundColor: colors.accent, shadowColor: colors.accent }]} onPress={() => setModalVisible(true)}>
        <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
      </TouchableOpacity>

      <RecordFormModal 
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddDebt}
        title="Record Debt"
        fields={debtsFields}
      />

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={setActiveFilters}
        title="Filter Debts"
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
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  tabsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.bgPanel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.borderCore,
  },
  activeTab: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  tabText: {
    color: colors.textSec,
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.accentLight,
  },
  summaryContainer: {
    alignItems: 'center',
    paddingBottom: 24,
  },
  summaryTitle: {
    color: colors.textSec,
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
    backgroundColor: colors.bgPanel,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderCore,
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
    color: colors.textCore,
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
    color: colors.textMute,
    fontSize: 13,
  },
  debtRight: {
    alignItems: 'flex-end',
  },
  debtAmount: {
    color: colors.textCore,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    padding: 6,
    backgroundColor: colors.bgPanelInner,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: colors.bgPanelInner,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: colors.textCore,
    fontSize: 12,
    fontWeight: '600',
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
