import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../theme/colors';

const CATEGORY_META = {
  Rent:      { color: Colors.category.Rent,      icon: 'home',               bg: 'rgba(124, 58, 237, 0.12)' },
  Salary:    { color: Colors.category.Salary,    icon: 'account-group',      bg: 'rgba(249, 115, 22, 0.12)' },
  Transport: { color: Colors.category.Transport, icon: 'car',                bg: 'rgba(20, 184, 166, 0.12)' },
  Utilities: { color: Colors.category.Utilities, icon: 'lightning-bolt',     bg: 'rgba(59, 130, 246, 0.12)' },
  Other:     { color: Colors.category.Other,     icon: 'dots-horizontal',    bg: 'rgba(236, 72, 153, 0.12)' },
};

export default function ExpenseItem({ expense }) {
  const meta = CATEGORY_META[expense.category] || CATEGORY_META.Other;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.iconContainer, { backgroundColor: meta.bg }]}>
          <MaterialCommunityIcons name={meta.icon} size={20} color={meta.color} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.description} numberOfLines={1}>{expense.description}</Text>
          <View style={styles.subTextContainer}>
            <Text style={styles.category}>{expense.category}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.date}>{expense.date}</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>- ETB {expense.amount.toLocaleString()}</Text>
        <Text style={styles.id}>{expense.id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  description: {
    color: Colors.textCore,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  subTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    color: Colors.textSec,
    fontSize: 13,
  },
  dot: {
    color: Colors.textMute,
    marginHorizontal: 6,
    fontSize: 12,
  },
  date: {
    color: Colors.textSec,
    fontSize: 13,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  id: {
    color: Colors.textMute,
    fontSize: 12,
  },
});
