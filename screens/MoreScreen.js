import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';
import { useApp } from '../context/AppContext';

const MENU_ITEMS = [
  { id: 'Debts', icon: 'account-cash', title: 'Debts & Receivables', desc: 'Manage who owes you money' },
  { id: 'Invoices', icon: 'file-document', title: 'Invoices', desc: 'Create and track invoices' },
  { id: 'Reports', icon: 'chart-bar', title: 'Financial Reports', desc: 'Detailed analytics and export' },
  { id: 'Settings', icon: 'cog', title: 'Settings', desc: 'Business profile and preferences' },
];

export default function MoreScreen({ navigation }) {
  const { colors = Colors } = useApp();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgCore }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textCore }]}>More Options</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.bgPanel, borderColor: colors.borderCore }]}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                index === MENU_ITEMS.length - 1 && styles.lastMenuItem
              ]}
              onPress={() => navigation.navigate(item.id)}
            >
              <View style={styles.menuLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.bgPanelInner }]}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={colors.accentLight} />
                </View>
                <View>
                  <Text style={[styles.menuTitle, { color: colors.textCore }]}>{item.title}</Text>
                  <Text style={[styles.menuDesc, { color: colors.textSec }]}>{item.desc}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textMute} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.bgPanel, borderColor: colors.dangerBg }]} onPress={() => navigation.navigate('Auth')}>
          <MaterialCommunityIcons name="logout" size={20} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgCore,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: colors.textCore,
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.bgPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderCore,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.bgPanelInner,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    color: colors.textCore,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDesc: {
    color: colors.textSec,
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.bgPanel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dangerBg,
    gap: 8,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
