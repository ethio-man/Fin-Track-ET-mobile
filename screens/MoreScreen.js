import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const MENU_ITEMS = [
  { id: 'Debts', icon: 'account-cash', title: 'Debts & Receivables', desc: 'Manage who owes you money' },
  { id: 'Invoices', icon: 'file-document', title: 'Invoices', desc: 'Create and track invoices' },
  { id: 'Reports', icon: 'chart-bar', title: 'Financial Reports', desc: 'Detailed analytics and export' },
  { id: 'Settings', icon: 'cog', title: 'Settings', desc: 'Business profile and preferences' },
];

export default function MoreScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>More Options</Text>
        </View>

        <View style={styles.card}>
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
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons name={item.icon} size={24} color={Colors.accentLight} />
                </View>
                <View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDesc}>{item.desc}</Text>
                </View>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMute} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Auth')}>
          <MaterialCommunityIcons name="logout" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgCore,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: Colors.textCore,
    fontSize: 28,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: Colors.bgPanel,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderCore,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
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
    backgroundColor: Colors.bgPanelInner,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTitle: {
    color: Colors.textCore,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDesc: {
    color: Colors.textSec,
    fontSize: 13,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: Colors.bgPanel,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dangerBg,
    gap: 8,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: '600',
  },
});
